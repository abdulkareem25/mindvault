import mongoose from "mongoose";

const memorySchema = new mongoose.Schema(
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
      maxlength: 500,
      trim: true,
    },
    category: {
      type: String,
      enum: ["coding", "deen", "admin", "life"],
      required: true,
    },
    type: {
      type: String,
      enum: ["decision", "preference", "learning", "goal", "fact"],
      required: true,
    },
    confidence: {
      type: String,
      enum: ["high", "medium", "low"],
      default: "medium",
    },
    sourceChatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      default: null,
    },
    tags: {
      type: [String],
      default: [],
    },
    embedding: {
      type: [Number],
      default: null,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    reinforcementCount: {
      type: Number,
      default: 1,
    },
    source: {
      type: String,
      enum: ["extraction", "quick_capture", "manual"],
      default: "extraction",
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
memorySchema.index({ userId: 1, isArchived: 1, createdAt: -1 }); // Default vault browse
memorySchema.index({ userId: 1, category: 1, isArchived: 1 });   // Category filter
memorySchema.index({ userId: 1, type: 1, isArchived: 1 });        // Type filter
memorySchema.index({ sourceChatId: 1 });                           // Source chat link

export default mongoose.model("Memory", memorySchema);
