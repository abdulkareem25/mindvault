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
      enum: ["development", "deen", "admin", "life", "career"],
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
  },
  {
    timestamps: true,
  }
);

// Useful indexes
chatSchema.index({ userId: 1, lastMessageAt: -1 });
chatSchema.index({ userId: 1, category: 1 });
chatSchema.index({ userId: 1, status: 1 });

export default mongoose.model("Chat", chatSchema);