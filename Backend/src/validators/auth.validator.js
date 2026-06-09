import { body, query } from "express-validator";
import Joi from 'joi';
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load 1000 most common passwords
let commonPasswords = new Set();
try {
  const filePath = path.join(__dirname, "top-1000-passwords.txt");
  const fileContent = fs.readFileSync(filePath, "utf8");
  commonPasswords = new Set(
    fileContent
      .split(/\r?\n/)
      .map((line) => line.trim().toLowerCase())
      .filter((line) => line.length > 0)
  );
} catch (err) {
  console.error("Failed to load common passwords list:", err);
}

const checkCommonPassword = (value) => {
  if (commonPasswords.has(value.trim().toLowerCase())) {
    throw new Error("Password is too common and easily guessable");
  }
  return true;
};

// Original validators (express-validator) - Kept to avoid breaking existing routes
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
    .withMessage("Password must be at least 8 characters")
    .custom((value) => {
      checkCommonPassword(value);
      return true;
    }),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    })
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

export const resetPasswordValidator = [
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .custom((value) => {
      checkCommonPassword(value);
      return true;
    })
];

// New Joi Schemas for MindVault v2
const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .required()
  .custom((value, helpers) => {
    try {
      checkCommonPassword(value);
      return value;
    } catch (err) {
      return helpers.message({ custom: err.message });
    }
  }, "Common Password Check");

export const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: passwordSchema,
  confirmPassword: Joi.string().required().valid(Joi.ref('password')).messages({
    'any.only': 'Passwords do not match'
  })
});

export const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const resetPasswordSchema = Joi.object({
  password: passwordSchema,
  token: Joi.string().optional(),
});

export const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

export const verifyEmailSchema = Joi.object({
  token: Joi.string().required(),
});