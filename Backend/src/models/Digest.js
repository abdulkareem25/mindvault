import mongoose from "mongoose";

const DigestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
    },
    weekStartDate: {
      type: Date,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isDismissed: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  }
);

// Index for sorting by createdAt descending for a user
DigestSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model("Digest", DigestSchema);
