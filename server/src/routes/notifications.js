import express from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';
import { Notification } from '../models/Notification.js';

export const notificationsRouter = express.Router();

function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return new mongoose.Types.ObjectId(id);
}

notificationsRouter.get('/', requireAuth, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

notificationsRouter.patch('/:id/read', requireAuth, async (req, res, next) => {
  try {
    const id = toObjectId(req.params.id);
    if (!id) return res.status(400).json({ error: { message: 'Invalid id' } });

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      { $set: { read: true } },
      { new: true }
    );

    if (!notification) return res.status(404).json({ error: { message: 'Not found' } });
    res.json({ notification });
  } catch (err) {
    next(err);
  }
});
