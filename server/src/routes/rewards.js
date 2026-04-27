import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { User } from '../models/User.js';
import { Issue } from '../models/Issue.js';

export const rewardsRouter = express.Router();

rewardsRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('name avatarUrl points level badges').lean();
    res.json({ user });
  } catch (err) {
    next(err);
  }
});

rewardsRouter.get('/leaderboard', requireAuth, async (req, res, next) => {
  try {
    // period currently informational; can be extended later.
    const period = String(req.query.period || 'alltime');

    const users = await User.find({})
      .select('name avatarUrl points level')
      .sort({ points: -1, createdAt: 1 })
      .limit(20)
      .lean();

    const userIds = users.map((u) => u._id);
    const resolvedCounts = await Issue.aggregate([
      { $match: { status: 'resolved', reporterId: { $in: userIds } } },
      { $group: { _id: '$reporterId', count: { $sum: 1 } } },
    ]);
    const resolvedMap = new Map(resolvedCounts.map((r) => [String(r._id), r.count]));

    res.json({
      period,
      leaderboard: users.map((u) => ({
        id: String(u._id),
        name: u.name,
        avatarUrl: u.avatarUrl,
        points: u.points,
        level: u.level,
        resolvedReports: resolvedMap.get(String(u._id)) || 0,
      })),
    });
  } catch (err) {
    next(err);
  }
});
