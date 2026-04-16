import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
    },

    role: {
      type: String,
      enum: ["user"],
      default: "user",
    },

    preferences: {
      defaultCategory: {
        type: String,
        enum: ["coding", "deen", "admin", "life", "career"],
        default: "coding",
      },
      aiTone: {
        type: String,
        enum: ["concise", "detailed"],
        default: "detailed",
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);