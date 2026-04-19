import mongoose from "mongoose";

const aiAnalysisSchema = new mongoose.Schema(
  {
    summary: String,

    rootCauses: [String],

    solutions: [String],

    prevention: [String],

    followUpQuestions: [String],
  },
  { _id: false }
);

const problemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["coding", "deen", "admin", "life", "career"],
      required: true,
      index: true,
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true
      },
    ],

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },

    status: {
      type: String,
      enum: ["open", "resolved", "stuck"],
      default: "open",
      index: true,
    },

    aiAnalysis: aiAnalysisSchema,

    finalSolution: {
      type: String,
    },

    relatedProblems: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Problem",
      },
    ],

    viewCount: {
      type: Number,
      default: 0,
    },

    lastViewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for fast filtering
problemSchema.index({ userId: 1, category: 1 });
problemSchema.index({ tags: 1 });
problemSchema.index({ createdAt: -1 });

export default mongoose.model("Problem", problemSchema);