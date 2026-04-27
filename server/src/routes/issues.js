import express from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';

import { requireAuth, requireRole } from '../middleware/auth.js';
import { Issue } from '../models/Issue.js';
import { Comment } from '../models/Comment.js';
import { Vote } from '../models/Vote.js';
import { Notification } from '../models/Notification.js';
import { ActivityEvent } from '../models/ActivityEvent.js';
import { awardPoints } from '../services/points.js';

export const issuesRouter = express.Router();

function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

const createIssueSchema = z.object({
  title: z.string().min(4).max(120),
  description: z.string().max(2000).optional().default(''),
  category: z.enum(['road', 'water', 'light', 'waste', 'park', 'other']),
  severity: z.enum(['low', 'medium', 'high', 'critical']).optional().default('low'),
  addressLabel: z.string().max(200).optional().default(''),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  photoUrls: z.array(z.string().url()).max(4).optional().default([]),
});

issuesRouter.post('/', requireAuth, async (req, res, next) => {
  try {
    const parsed = createIssueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { message: 'Invalid input', details: parsed.error.flatten() } });
    }

    const data = parsed.data;
    const issue = await Issue.create({
      reporterId: req.user._id,
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      addressLabel: data.addressLabel,
      location: { type: 'Point', coordinates: [data.lng, data.lat] },
      photoUrls: data.photoUrls,
      status: 'pending',
    });

    await ActivityEvent.create({
      type: 'reported',
      userId: req.user._id,
      targetIssueId: issue._id,
      title: `Reported “${issue.title}”`,
      locationLabel: issue.addressLabel,
    });

    await awardPoints({
      userId: req.user._id,
      type: 'issue_reported',
      points: 50,
      issueId: issue._id,
      idempotencyKey: `issue_reported:${issue._id}`,
      createNotification: true,
      createActivity: true,
    });

    res.status(201).json({ issue });
  } catch (err) {
    next(err);
  }
});

issuesRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const q = String(req.query.q || '').trim();
    const status = req.query.status ? String(req.query.status) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;
    const severity = req.query.severity ? String(req.query.severity) : undefined;
    const sort = String(req.query.sort || 'newest');

    const page = Math.max(1, Number(req.query.page || 1));
    const pageSize = Math.min(50, Math.max(1, Number(req.query.pageSize || 12)));

    const filter = {};
    if (q) {
      filter.$or = [
        { title: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { addressLabel: { $regex: q, $options: 'i' } },
      ];
    }

    const allowedStatus = new Set(['pending', 'inprogress', 'resolved', 'rejected']);
    if (status && allowedStatus.has(status)) filter.status = status;

    const allowedCategory = new Set(['road', 'water', 'light', 'waste', 'park', 'other']);
    if (category && allowedCategory.has(category)) filter.category = category;

    const allowedSeverity = new Set(['low', 'medium', 'high', 'critical']);
    if (severity && allowedSeverity.has(severity)) filter.severity = severity;

    let sortSpec = { createdAt: -1 };
    if (sort === 'upvoted') sortSpec = { upvoteCount: -1, createdAt: -1 };
    if (sort === 'commented') sortSpec = { commentCount: -1, createdAt: -1 };

    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .sort(sortSpec)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean();

    res.json({
      page,
      pageSize,
      total,
      issues,
    });
  } catch (err) {
    next(err);
  }
});

issuesRouter.get('/counts', requireAuth, async (req, res, next) => {
  try {
    const [total, pending, inprogress, resolved, rejected] = await Promise.all([
      Issue.countDocuments({}),
      Issue.countDocuments({ status: 'pending' }),
      Issue.countDocuments({ status: 'inprogress' }),
      Issue.countDocuments({ status: 'resolved' }),
      Issue.countDocuments({ status: 'rejected' }),
    ]);

    res.json({ total, pending, inprogress, resolved, rejected });
  } catch (err) {
    next(err);
  }
});

issuesRouter.get('/map', requireAuth, async (req, res, next) => {
  try {
    const bbox = req.query.bbox ? String(req.query.bbox) : '';

    const filter = {};
    const status = req.query.status ? String(req.query.status) : undefined;
    const category = req.query.category ? String(req.query.category) : undefined;

    const allowedStatus = new Set(['pending', 'inprogress', 'resolved', 'rejected']);
    if (status && allowedStatus.has(status)) filter.status = status;

    const allowedCategory = new Set(['road', 'water', 'light', 'waste', 'park', 'other']);
    if (category && allowedCategory.has(category)) filter.category = category;

    if (bbox) {
      const parts = bbox.split(',').map((p) => Number(p));
      if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) {
        let [west, south, east, north] = parts;

        // Normalize bbox ordering.
        if (west > east) [west, east] = [east, west];
        if (south > north) [south, north] = [north, south];

        // Clamp to valid lng/lat ranges.
        west = Math.max(-180, Math.min(180, west));
        east = Math.max(-180, Math.min(180, east));
        south = Math.max(-90, Math.min(90, south));
        north = Math.max(-90, Math.min(90, north));

        // For 2dsphere (GeoJSON), use $geoWithin with a Polygon.
        const polygon = {
          type: 'Polygon',
          coordinates: [
            [
              [west, south],
              [east, south],
              [east, north],
              [west, north],
              [west, south],
            ],
          ],
        };

        filter.location = {
          $geoWithin: {
            $geometry: polygon,
          },
        };
      }
    }

    const issues = await Issue.find(filter)
      .select('title status category upvoteCount location addressLabel createdAt')
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    const markers = issues
      .filter((i) => i.location && Array.isArray(i.location.coordinates) && i.location.coordinates.length === 2)
      .map((i) => ({
        id: String(i._id),
        title: i.title,
        status: i.status,
        category: i.category,
        upvotes: i.upvoteCount,
        addressLabel: i.addressLabel,
        lat: i.location.coordinates[1],
        lng: i.location.coordinates[0],
        createdAt: i.createdAt,
      }));

    res.json({ markers });
  } catch (err) {
    next(err);
  }
});

issuesRouter.get('/:id', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const issue = await Issue.findById(id).lean();
    if (!issue) return res.status(404).json({ error: { message: 'Issue not found' } });

    res.json({ issue });
  } catch (err) {
    next(err);
  }
});

const patchIssueSchema = z.object({
  status: z.enum(['pending', 'inprogress', 'resolved', 'rejected']).optional(),
  assignedDepartment: z.string().max(120).optional(),
});

issuesRouter.patch('/:id', requireAuth, requireRole('admin'), async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const parsed = patchIssueSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { message: 'Invalid input', details: parsed.error.flatten() } });
    }

    const prev = await Issue.findById(id);
    if (!prev) return res.status(404).json({ error: { message: 'Issue not found' } });

    if (typeof parsed.data.status !== 'undefined') prev.status = parsed.data.status;
    if (typeof parsed.data.assignedDepartment !== 'undefined') prev.assignedDepartment = parsed.data.assignedDepartment;

    await prev.save();

    if (parsed.data.status === 'resolved') {
      await Notification.create({
        userId: prev.reporterId,
        type: 'resolved',
        title: 'Issue Resolved',
        description: `Your report “${prev.title}” has been marked resolved.`,
      });

      await ActivityEvent.create({
        type: 'resolved',
        userId: req.user._id,
        targetIssueId: prev._id,
        title: `Resolved “${prev.title}”`,
        locationLabel: prev.addressLabel,
      });

      await awardPoints({
        userId: prev.reporterId,
        type: 'issue_resolved',
        points: 100,
        issueId: prev._id,
        idempotencyKey: `issue_resolved:${prev._id}`,
        createNotification: true,
        createActivity: false,
      });
    }

    res.json({ issue: prev });
  } catch (err) {
    next(err);
  }
});

issuesRouter.get('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const comments = await Comment.find({ issueId: id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('authorId', 'name avatarUrl')
      .lean();

    res.json({ comments });
  } catch (err) {
    next(err);
  }
});

const createCommentSchema = z.object({
  body: z.string().min(1).max(1000),
});

issuesRouter.post('/:id/comments', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const parsed = createCommentSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { message: 'Invalid input', details: parsed.error.flatten() } });
    }

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ error: { message: 'Issue not found' } });

    const comment = await Comment.create({ issueId: issue._id, authorId: req.user._id, body: parsed.data.body });
    issue.commentCount += 1;
    await issue.save();

    await ActivityEvent.create({
      type: 'commented',
      userId: req.user._id,
      targetIssueId: issue._id,
      title: `Commented on “${issue.title}”`,
      locationLabel: issue.addressLabel,
    });

    await awardPoints({
      userId: req.user._id,
      type: 'comment_created',
      points: 10,
      issueId: issue._id,
      commentId: comment._id,
      idempotencyKey: `comment_created:${comment._id}`,
      createNotification: true,
      createActivity: true,
    });

    res.status(201).json({ comment });
  } catch (err) {
    next(err);
  }
});

issuesRouter.post('/:id/upvote', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ error: { message: 'Issue not found' } });

    const existing = await Vote.findOne({ issueId: issue._id, userId: req.user._id });

    if (existing) {
      await existing.deleteOne();
      issue.upvoteCount = Math.max(0, issue.upvoteCount - 1);
      await issue.save();
      return res.json({ upvoted: false, upvoteCount: issue.upvoteCount });
    }

    await Vote.create({ issueId: issue._id, userId: req.user._id });
    issue.upvoteCount += 1;
    await issue.save();

    await ActivityEvent.create({
      type: 'upvoted',
      userId: req.user._id,
      targetIssueId: issue._id,
      title: `Upvoted “${issue.title}”`,
      locationLabel: issue.addressLabel,
    });

    await awardPoints({
      userId: req.user._id,
      type: 'upvote_created',
      points: 2,
      issueId: issue._id,
      idempotencyKey: `upvote_created:${issue._id}:${req.user._id}`,
      createNotification: false,
      createActivity: false,
    });

    res.json({ upvoted: true, upvoteCount: issue.upvoteCount });
  } catch (err) {
    next(err);
  }
});
