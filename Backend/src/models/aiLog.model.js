import mongoose from "mongoose";

const aiLogSchema = new mongoose.Schema(
  {
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
      index: true,
    },

    prompt: {
      type: String,
      required: true,
    },

    response: {
      type: Object,
      required: true,
    },

    model: {
      type: String,
      default: "unknown",
    },

    responseTime: {
      type: Number, // in ms
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AiLog", aiLogSchema);