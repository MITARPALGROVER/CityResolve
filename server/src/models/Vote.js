import mongoose from 'mongoose';

const VoteSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

VoteSchema.index({ issueId: 1, userId: 1 }, { unique: true });
VoteSchema.index({ issueId: 1 });

export const Vote = mongoose.model('Vote', VoteSchema);
