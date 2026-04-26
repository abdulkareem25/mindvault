import { body, params } from "express-validator";

export const createChatValidator = [
  body("category")
    .isString()
    .withMessage("Category must be a string")
    .isIn(["development", "deen", "admin", "life", "career"])
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
  params("id")
    .isMongoId()
    .withMessage("Invalid ID format")
    .notEmpty()
    .withMessage("ID is required"),
];

export const sendMessageValidator = [
  params("id")
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