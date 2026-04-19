import e from "express";
import { body, query } from "express-validator";

export const signupValidator = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 3 })
    .withMessage("Name must be at least 3 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),

  // optional fields
  body("defaultCategory")
    .optional()
    .isIn(["coding", "deen", "admin", "life", "career"])
    .withMessage("Invalid category"),

  body("aiTone")
    .optional()
    .isIn(["concise", "detailed"])
    .withMessage("Invalid AI tone"),
];

export const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail(),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

export const tokenValidator = [
  query("token")
    .notEmpty()
    .withMessage("Verification token is required")
];

export const emailValidator = [
  body("email")
    .notEmpty()
    .withMessage("Verification email is required")
];