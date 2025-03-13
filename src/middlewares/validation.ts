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

export const createProviderValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
];

export const updateProviderValidation = [
  body("providerId", "Provider Id is required.").isString(),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
];

export const createSeriesValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("providerId")
    .notEmpty()
    .withMessage("Provider ID is required")
    .isString()
    .withMessage("Provider ID must be a string"),

  body("category")
    .notEmpty()
    .withMessage("Category  is required")
    .isString()
    .withMessage("Category must be a string"),
];

export const updateSeriesValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("providerId")
    .optional()
    .isString()
    .withMessage("Provider ID must be a string"),

  body("category")
    .optional()
    .isString()
    .withMessage("Category Name must be a string"),
];

export const createCourseValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isString()
    .withMessage("Duration must be a string"),

  body("image")
    .notEmpty()
    .withMessage("Image is required")
    .isString()
    .withMessage("Image must be a string"),

  body("seriesId")
    .notEmpty()
    .withMessage("Series ID is required")
    .isString()
    .withMessage("Series ID must be a string"),
];

export const updateCourseValidation = [
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("duration")
    .optional()
    .isString()
    .withMessage("Duration must be a string"),

  body("image").optional().isString().withMessage("Image must be a string"),

  body("seriesId")
    .optional()
    .isString()
    .withMessage("Series ID must be a string"),
];
