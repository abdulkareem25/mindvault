import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import validateMiddleware from "../middlewares/validate.middleware.js";
import { createProblemValidator } from "../validators/problem.validator.js";
import { createProblemController } from "../controllers/problem.controller.js";
import { getProblemsController } from "../controllers/problem.controller.js";

const router = express.Router();

/**
 * @route POST /api/problems
 * @desc Create a new problem
 * @access Private
 * @body { title, description, category, tags, priority, status }
 * @returns { problem }
 */

router.post(
  "/",
  authMiddleware,
  createProblemValidator,
  validateMiddleware,
  createProblemController
);

/**
 * @route GET /api/problems
 * @desc Get all problems for the authenticated user
 * @access Private
 * @returns { problems[] }
 */

router.get(
  "/",
  authMiddleware,
  getProblemsController
);

export default router;