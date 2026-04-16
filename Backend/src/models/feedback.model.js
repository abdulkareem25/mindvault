import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    helpful: {
      type: Boolean,
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 5,
    },

    notes: {
      type: String,
    },

    improvedSolution: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Feedback", feedbackSchema);