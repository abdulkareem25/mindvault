import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendEmail } from "./mail.service.js";

export const signup = async ({
  name,
  email,
  password
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    const error = new Error("User already exists");
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password
  });

  const emailVerificationToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  await sendEmail(
    email,
    "Welcome to MindVault - Please Verify Your Email",
    `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for signing up for MindVault. Please verify your email by clicking the link below:</p>
      <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    `
  ).catch((err) => {
    console.error("Error sending welcome email:", err.message);
  });
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 400;
    throw error;
  }

  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      preferences: user.preferences,
    }
  };
};

export const verifyEmail = async (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const user = await User.findById(userId);

  if (!user) {
    const error = new Error("Invalid verification token");
    error.statusCode = 400;
    throw error;
  }

  if (user.isVerified) {
    return {
      success: true,
      isAlreadyVerified: true,
      message: "Email is already verified"
    };
  }

  user.isVerified = true;
  await user.save();

  return {
    success: true,
    isAlreadyVerified: false,
    message: "Email verified successfully"
  };
};

export const resendEmailVerification = async (email) => {
  const user = await User.findOne({ email });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  if (user.isVerified) {
    const error = new Error("Email is already verified");
    error.statusCode = 400;
    throw error;
  }

  const emailVerificationToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET
  );

  await sendEmail(
    email,
    "MindVault - Email Verification Link",
    `
      <h1>Hello, ${user.name}!</h1>
      <p>It looks like you requested a new email verification link. Please click the link below to verify your email:</p>
      <a href="http://localhost:${process.env.PORT}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    `
  ).catch((err) => {
    console.error("Error sending verification email:", err.message);
  });
};

export const getUser = async (userId) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return user;
};