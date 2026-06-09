import { body, param } from "express-validator";
import Joi from 'joi';

// Original validators (express-validator) - Kept to avoid breaking existing routes
export const createChatValidator = [
  body("category")
    .isString()
    .withMessage("Category must be a string")
    .isIn(["development", "career", "life", "admin", "deen"])
    .withMessage("Invalid category")
    .notEmpty()
    .withMessage("Category is required"), 

  body("initialMessage")
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message is required"),
];

export const idValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .notEmpty()
    .withMessage("ID is required"),
];

export const sendMessageValidator = [
  param("id")
    .isMongoId()
    .withMessage("Invalid chat ID format")
    .notEmpty()
    .withMessage("Chat ID is required"),

  body("message")
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message is required"),
];

// New Joi Schemas for MindVault v2 (to be integrated in subsequent tickets)
export const createChatSchema = Joi.object({
  category: Joi.string().valid('coding', 'deen', 'admin', 'life').required(),
  title: Joi.string().max(100).optional(),
  initialMessage: Joi.string().required(),
});

export const sendMessageSchema = Joi.object({
  content: Joi.string().min(1).max(10000).required(),
});

export const updateChatSchema = Joi.object({
  title: Joi.string().max(100).required(),
});

export const idSchema = Joi.object({
  id: Joi.string().hex().length(24).required().messages({
    'string.length': 'Invalid ID format',
    'string.hex': 'Invalid ID format',
  }),
});