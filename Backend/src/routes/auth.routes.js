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

router.post(
  "/signup",
  signupValidator,
  validateMiddleware,
  signupController
);

router.post(
  "/login",
  loginValidator,
  validateMiddleware,
  loginController
);

router.get(
  "/verify-email",
  verifyEmailValidator,
  validateMiddleware,
  verifyEmailController
);
  

export default router;