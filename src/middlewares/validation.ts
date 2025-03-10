import { body } from "express-validator";

export const registerValidation = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters."),
  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

export const loginValidation = [
  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters."),
];

export const emailCheck = [
  body("email").isEmail().withMessage("Please provide a valid email."),
];

export const usernameCheck = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters."),
];
