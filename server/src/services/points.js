import { PointsLedger } from '../models/PointsLedger.js';
import { User } from '../models/User.js';
import { Notification } from '../models/Notification.js';
import { ActivityEvent } from '../models/ActivityEvent.js';

function computeLevel(points) {
  // Simple leveling: every 100 points increases level.
  return Math.max(1, Math.floor(points / 100) + 1);
}

function maybeAwardBadges({ currentPoints, existingBadges }) {
  const badges = new Set(existingBadges || []);

  if (currentPoints >= 50) badges.add('first_report');
  if (currentPoints >= 200) badges.add('community_builder');
  if (currentPoints >= 500) badges.add('city_champion');

  return Array.from(badges);
}

export async function awardPoints({
  userId,
  type,
  points,
  idempotencyKey,
  issueId,
  commentId,
  createNotification,
  createActivity,
}) {
  const existing = await PointsLedger.findOne({ idempotencyKey });
  if (existing) return { awarded: false };

  await PointsLedger.create({ userId, type, points, idempotencyKey, issueId, commentId });

  const user = await User.findByIdAndUpdate(
    userId,
    { $inc: { points } },
    { new: true }
  );

  const nextLevel = computeLevel(user.points);
  const levelChanged = nextLevel !== user.level;

  let newBadges = user.badges;
  const computedBadges = maybeAwardBadges({ currentPoints: user.points, existingBadges: user.badges });
  const badgesChanged = computedBadges.length !== user.badges.length;

  if (levelChanged || badgesChanged) {
    user.level = nextLevel;
    user.badges = computedBadges;
    await user.save();
    newBadges = user.badges;

    if (badgesChanged) {
      if (createNotification) {
        await Notification.create({
          userId,
          type: 'badge',
          title: 'New Badge Earned',
          description: 'You unlocked a new badge from your civic contributions.',
        });
      }

      if (createActivity) {
        await ActivityEvent.create({
          type: 'badge',
          userId,
          targetIssueId: issueId,
          title: 'Earned a new badge',
        });
      }
    }
  }

  return { awarded: true, user: { points: user.points, level: user.level, badges: newBadges } };
}
