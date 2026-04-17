import express from "express";
import {
  signupValidator,
  loginValidator,
  verifyEmailValidator,
} from "../validators/auth.validator.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  signupController,
  loginController,
  verifyEmailController,
} from "../controllers/auth.controller.js";

const router = express.Router();

/**
 * @route POST /api/auth/signup
 * @desc Register a new user
 * @access Public
 * @body { name, email, password, confirmPassword, defaultCategory?, aiTone? }
 */

router.post(
  "/signup",
  signupValidator,
  validateMiddleware,
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
  loginValidator,
  validateMiddleware,
  loginController
);

/**
 * @route GET /api/auth/verify-email
 * @desc Verify user's email address
 * @access Public
 * @query { token }
 */

router.get(
  "/verify-email",
  verifyEmailValidator,
  validateMiddleware,
  verifyEmailController
);
  

export default router;