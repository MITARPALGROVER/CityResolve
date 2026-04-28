import mongoose from 'mongoose';

const IssueSchema = new mongoose.Schema(
  {
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    category: { type: String, enum: ['road', 'water', 'light', 'waste', 'park', 'other'], required: true },
    severity: { type: String, enum: ['low', 'medium', 'high', 'critical'], default: 'low' },
    status: { type: String, enum: ['pending', 'inprogress', 'resolved', 'rejected'], default: 'pending' },

    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },
    addressLabel: { type: String, default: '' },

    photoUrls: [{ type: String }],

    upvoteCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },

    assignedDepartment: { type: String, default: '' },
    progressPercent: { type: Number, default: 15, min: 0, max: 100 },
  },
  { timestamps: true }
);

IssueSchema.index({ location: '2dsphere' });
IssueSchema.index({ status: 1, category: 1, createdAt: -1 });
IssueSchema.index({ upvoteCount: -1 });

export const Issue = mongoose.model('Issue', IssueSchema);
