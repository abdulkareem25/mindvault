import express from "express";
import {
  signupValidator,
  loginValidator,
} from "../validators/auth.validator.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import {
  signupController,
  loginController,
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

export default router;