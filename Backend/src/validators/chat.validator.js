import { body } from "express-validator";

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