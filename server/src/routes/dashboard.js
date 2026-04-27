import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { Issue } from '../models/Issue.js';

export const dashboardRouter = express.Router();

dashboardRouter.get('/summary', requireAuth, async (req, res, next) => {
  try {
    const [totalIssues, pending, inprogress, resolvedThisMonth] = await Promise.all([
      Issue.countDocuments({}),
      Issue.countDocuments({ status: 'pending' }),
      Issue.countDocuments({ status: 'inprogress' }),
      Issue.countDocuments({
        status: 'resolved',
        createdAt: {
          $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      }),
    ]);

    const recentIssues = await Issue.find({})
      .sort({ createdAt: -1 })
      .limit(6)
      .lean();

    res.json({
      kpis: {
        totalIssues,
        pending,
        inprogress,
        resolvedThisMonth,
      },
      recentIssues,
    });
  } catch (err) {
    next(err);
  }
});
