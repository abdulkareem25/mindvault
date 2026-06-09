import express from "express";
import {
  signupSchema,
  loginSchema,
  resetPasswordSchema,
  emailSchema,
  verifyEmailSchema,
} from "../validators/auth.validator.js";
import validate from "../middlewares/validate.middleware.js";
import {
  signupController,
  loginController,
  verifyEmailController,
  getUserController,
  resendEmailVerificationController,
  logoutController,
  refreshController,
  forgotPasswordController,
  resetPasswordController
} from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 * @body { name, email, password, confirmPassword }
 */

router.post(
  "/signup",
  validate(signupSchema),
  signupController
);

/**
 * @route POST /api/auth/login
 * @desc Login user and return JWT token
 * @access Public
 * @body { email, password }
 */

router.post(
  "/login",
  validate(loginSchema),
  loginController
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token using HttpOnly refresh token cookie
 * @access Public
 */

router.post(
  "/refresh",
  refreshController
);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */

router.get(
  "/verify-email",
  validate(verifyEmailSchema),
  verifyEmailController
);

/**
 * @route POST /api/auth/resend-verification
 * @desc Resend email verification link
 * @access Public
 * @body { email }
 */

router.post(
  "/resend-verification",
  validate(emailSchema),
  resendEmailVerificationController
);

/**
 * @route POST /api/auth/forgot-password
 * @desc Request password reset link
 * @access Public
 * @body { email }
 */

router.post(
  "/forgot-password",
  validate(emailSchema),
  forgotPasswordController
);

/**
 * @route POST /api/auth/reset-password
 * @desc Reset password using token
 * @access Public
 * @body { password, token }
 */

router.post(
  "/reset-password",
  validate(resetPasswordSchema),
  resetPasswordController
);

/**
 * @route GET /api/auth/me
 * @desc Get current logged in user
 * @access Private
 * @cookies { token }
 */

router.get(
  "/me",
  authMiddleware,
  getUserController
);

/**
 * @route POST /api/auth/logout
 * @desc Logout user (handled on client side by deleting token)
 * @access Private
 * @cookies { token }
 */

router.post(
  "/logout",
  authMiddleware,
  logoutController
);

export default router;