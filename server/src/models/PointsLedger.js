import mongoose from 'mongoose';

const PointsLedgerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: { type: String, required: true },
    points: { type: Number, required: true },
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue' },
    commentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
    idempotencyKey: { type: String, required: true },
  },
  { timestamps: true }
);

PointsLedgerSchema.index({ idempotencyKey: 1 }, { unique: true });
PointsLedgerSchema.index({ userId: 1, createdAt: -1 });

export const PointsLedger = mongoose.model('PointsLedger', PointsLedgerSchema);
