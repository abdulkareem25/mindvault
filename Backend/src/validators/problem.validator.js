import { body } from "express-validator";

export const createProblemValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 3, max: 120 })
    .withMessage("Title must be between 3 and 120 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Description must be between 10 and 5000 characters"),

  body("category")
    .notEmpty()
    .withMessage("Category is required")
    .isIn(["coding", "deen", "admin", "life", "career"])
    .withMessage("Invalid category"),

  body("tags")
    .optional()
    .isArray({ max: 10 })
    .withMessage("Tags must be an array with max 10 items"),

  body("tags.*")
    .optional()
    .isString()
    .withMessage("Each tag must be a string")
    .isLength({ min: 1, max: 30 })
    .withMessage("Each tag must be between 1 and 30 characters"),

  body("priority")
    .optional()
    .isIn(["low", "medium", "high"])
    .withMessage("Invalid priority"),

  body("status")
    .optional()
    .isIn(["open", "resolved", "stuck"])
    .withMessage("Invalid status"),
];