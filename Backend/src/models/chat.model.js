import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["coding", "deen", "admin", "life", "global"],
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    messages: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message",
      },
    ],

    status: {
      type: String,
      enum: ["active", "archived"],
      default: "active",
      index: true,
    },

    lastMessageAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    injectedMemoryIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memory' }],
    extractionStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed', 'skipped'],
      default: 'pending'
    },
    extractionAttempts: { type: Number, default: 0 },
    extractionCompletedAt: { type: Date, default: null },
    messageCount: { type: Number, default: 0 },
    extractionPromptVersion: { type: Number, default: 1 },
    userMessageCount: { type: Number, default: 0 }
  },
  {
    timestamps: true,
  }
);

// Useful indexes
chatSchema.index({ userId: 1, lastMessageAt: -1 });
chatSchema.index({ userId: 1, category: 1 });
chatSchema.index({ userId: 1, status: 1 });
chatSchema.index({ userId: 1, createdAt: -1 });
chatSchema.index({ extractionStatus: 1, createdAt: -1 });

export default mongoose.model("Chat", chatSchema);