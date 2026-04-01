import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    toUserId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message:    { type: String, required: true, trim: true },
    read:       { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Index for fast conversation lookup
messageSchema.index({ fromUserId: 1, toUserId: 1 });
messageSchema.index({ createdAt: -1 });

export const Message = mongoose.model('Message', messageSchema);