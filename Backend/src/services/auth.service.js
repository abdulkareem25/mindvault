import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { sendEmail } from "./mail.service.js";

export const signup = async ({
  name,
  email,
  password,
  defaultCategory,
  aiTone,
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
    password,
    preferences: {
      defaultCategory,
      aiTone,
    }
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

  const isVerified = user.isVerified;

  if (!isVerified) {
    const error = new Error("Email not verified. Please check your inbox.");
    error.statusCode = 403;
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
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Already Verified - MindVault</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 100%;
            animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {  
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        h1 {  
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Email Already Verified</h1>
        <p>Your email has already been verified. You can proceed to login and start using MindVault.</p>
        <a href="/login" class="btn">Go to Login</a>
        <div class="footer">
            Welcome to MindVault - Your AI-Powered Mind Mapping Companion
        </div>
    </div>
</body>
</html>
    `;
    return html;
  }

  user.isVerified = true;
  await user.save();

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verified - MindVault</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            padding: 40px;
            text-align: center;
            max-width: 500px;
            width: 100%;
            animation: slideUp 0.6s ease-out;
        }
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        .checkmark {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            background: #4CAF50;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            animation: checkmark 0.8s ease-in-out;
        }
        @keyframes checkmark {
            0% {
                transform: scale(0);
            }
            50% {
                transform: scale(1.2);
            }
            100% {
                transform: scale(1);
            }
        }
        .checkmark::after {
            content: '✓';
            font-size: 40px;
            color: white;
            font-weight: bold;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 30px;
            border-radius: 25px;
            font-size: 16px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            transition: transform 0.2s ease;
        }
        .btn:hover {
            transform: translateY(-2px);
        }
        .footer {
            margin-top: 30px;
            font-size: 14px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="checkmark"></div>
        <h1>Email Verified Successfully!</h1>
        <p>Congratulations! Your email has been verified. You can now access all features of MindVault and start organizing your thoughts with AI-powered assistance.</p>
        <a href="/login" class="btn">Go to Login</a>
        <div class="footer">
            Welcome to MindVault - Your AI-Powered Mind Mapping Companion
        </div>
    </div>
</body>
</html>
  `;

  return html;
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