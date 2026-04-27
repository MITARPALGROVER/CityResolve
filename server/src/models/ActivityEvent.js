import mongoose from 'mongoose';

const ActivityEventSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['resolved', 'reported', 'assigned', 'upvoted', 'commented', 'escalated', 'badge'],
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    targetIssueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    title: { type: String, required: true },
    locationLabel: { type: String, default: '' },
  },
  { timestamps: true }
);

ActivityEventSchema.index({ createdAt: -1 });

export const ActivityEvent = mongoose.model('ActivityEvent', ActivityEventSchema);
