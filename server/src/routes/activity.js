import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { ActivityEvent } from '../models/ActivityEvent.js';

export const activityRouter = express.Router();

activityRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const events = await ActivityEvent.find({})
      .sort({ createdAt: -1 })
      .limit(30)
      .populate('userId', 'name avatarUrl')
      .lean();

    res.json({ events });
  } catch (err) {
    next(err);
  }
});
