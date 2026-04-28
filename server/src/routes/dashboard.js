import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Issue } from '../models/Issue.js';
import { ActivityEvent } from '../models/ActivityEvent.js';

export const dashboardRouter = express.Router();

const CATEGORY_LABELS = {
  road: 'Roads & Traffic',
  water: 'Water & Plumbing',
  light: 'Streetlights',
  waste: 'Waste Management',
  park: 'Parks & Trees',
  other: 'Other',
};

dashboardRouter.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [
      totalIssues,
      pending,
      inprogress,
      resolvedThisMonth,
      recentIssues,
      trendRows,
      categoryRows,
      inProgressIssues,
      events,
    ] = await Promise.all([
      Issue.countDocuments({}),
      Issue.countDocuments({ status: 'pending' }),
      Issue.countDocuments({ status: 'inprogress' }),
      Issue.countDocuments({
        status: 'resolved',
        updatedAt: { $gte: startOfMonth },
      }),
      Issue.find({}).sort({ createdAt: -1 }).limit(6).lean(),
      Issue.aggregate([
        { $match: { createdAt: { $gte: sixMonthsAgo } } },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
            },
            reported: { $sum: 1 },
            resolved: {
              $sum: {
                $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0],
              },
            },
            pending: {
              $sum: {
                $cond: [{ $in: ['$status', ['pending', 'inprogress']] }, 1, 0],
              },
            },
          },
        },
      ]),
      Issue.aggregate([
        {
          $group: {
            _id: '$category',
            count: { $sum: 1 },
          },
        },
      ]),
      Issue.find({ status: { $in: ['pending', 'inprogress', 'resolved'] } })
        .sort({ upvoteCount: -1, commentCount: -1, createdAt: -1 })
        .limit(4)
        .lean(),
      ActivityEvent.find({})
        .sort({ createdAt: -1 })
        .limit(8)
        .populate('userId', 'name avatarUrl')
        .lean(),
    ]);

    const trendMap = new Map(
      trendRows.map((row) => [`${row._id.year}-${row._id.month}`, row])
    );

    const monthlyTrend = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(sixMonthsAgo.getFullYear(), sixMonthsAgo.getMonth() + index, 1);
      const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const row = trendMap.get(key);
      return {
        month: date.toLocaleString('en-US', { month: 'short' }),
        reported: row?.reported || 0,
        resolved: row?.resolved || 0,
        pending: row?.pending || 0,
      };
    });

    const categoryBreakdown = Object.keys(CATEGORY_LABELS).map((key) => {
      const row = categoryRows.find((entry) => entry._id === key);
      return {
        key,
        name: CATEGORY_LABELS[key],
        value: row?.count || 0,
      };
    });

    const healthScoreBase = totalIssues === 0
      ? 72
      : Math.round(((resolvedThisMonth * 1.2 + inprogress * 0.6 + Math.max(totalIssues - pending, 0) * 0.35) / totalIssues) * 55 + 35);
    const healthScore = Math.max(42, Math.min(94, healthScoreBase));

    const activeProjects = inProgressIssues.map((issue, index) => {
      const progress = issue.status === 'resolved'
        ? 100
        : typeof issue.progressPercent === 'number'
          ? issue.progressPercent
          : Math.min(92, 28 + issue.commentCount * 8 + issue.upvoteCount * 5 + index * 6);
      const status = progress >= 75 ? 'Near Completion' : progress >= 45 ? 'Ongoing' : 'Scheduled';
      return {
        id: String(issue._id),
        name: issue.title,
        progress,
        status,
        category: issue.category,
      };
    });

    res.json({
      kpis: {
        totalIssues,
        pending,
        inprogress,
        resolvedThisMonth,
      },
      healthScore,
      recentIssues,
      monthlyTrend,
      categoryBreakdown,
      activeProjects,
      events,
    });
  } catch (err) {
    next(err);
  }
});
