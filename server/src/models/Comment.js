import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    issueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Issue', required: true, index: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    body: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

CommentSchema.index({ issueId: 1, createdAt: -1 });

export const Comment = mongoose.model('Comment', CommentSchema);
