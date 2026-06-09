import jwt from "jsonwebtoken";
import crypto from "crypto";
import User from "../models/user.model.js";
import { sendEmail } from "./mail.service.js";

export const signup = async ({
  name,
  email,
  password
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    if (existingUser.isVerified) {
      // EC-AUTH-01: Duplicate email signup sends notification email and returns silently (ambiguous success)
      await sendEmail(
        email,
        "MindVault - Account Information Alert",
        `
          <h1>Hello, ${existingUser.name}!</h1>
          <p>We received a registration request for MindVault using your email address.</p>
          <p>You already have an active verified account associated with this email. If you forgot your password, please reset it from the login screen.</p>
        `
      ).catch((err) => {
        console.error("Error sending duplicate signup email:", err.message);
      });
      return;
    } else {
      // EC-AUTH-02: Overwrite unverified account, send new verification email
      existingUser.name = name;
      existingUser.password = password; // pre-save hook hashes it
      await existingUser.save();

      const emailVerificationToken = jwt.sign(
        { id: existingUser._id },
        process.env.JWT_SECRET
      );

      await sendEmail(
        email,
        "Welcome to MindVault - Please Verify Your Email",
        `
          <h1>Welcome, ${name}!</h1>
          <p>Thank you for signing up for MindVault. Please verify your email by clicking the link below:</p>
          <a href="${process.env.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
        `
      ).catch((err) => {
        console.error("Error sending welcome email:", err.message);
      });
      return;
    }
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
      <a href="${process.env.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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

  const accessToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );

  user.refreshTokens.push(refreshToken);
  await user.save();

  return {
    accessToken,
    refreshToken,
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
      <a href="${process.env.CLIENT_URL}/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
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

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email });

  // EC-AUTH-05: Non-existent email reset returns same response as valid email
  if (!user) {
    return;
  }

  // EC-AUTH-04: New forgot-password request invalidates previous reset token
  const resetToken = crypto.randomBytes(20).toString("hex");
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;

  await sendEmail(
    email,
    "MindVault - Password Reset Request",
    `
      <h1>Hello, ${user.name}!</h1>
      <p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
      <p>Please click on the following link, or paste this into your browser to complete the process:</p>
      <a href="${resetUrl}">${resetUrl}</a>
      <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
    `
  ).catch((err) => {
    console.error("Error sending reset password email:", err.message);
  });
};

export const resetPassword = async (token, newPassword) => {
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    const error = new Error("Password reset token is invalid or has expired");
    error.statusCode = 400;
    throw error;
  }

  user.password = newPassword;
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  await user.save();
};
