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
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),
];

export const updateProviderValidation = [
  body("providerId", "Provider Id is required.").isString(),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
];

export const createSeriesValidation = [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

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
  body("seriesId", "Series Id is required.").isString(),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

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

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "FREEZE"])
    .withMessage("Invalid status value"),

  body("duration")
    .notEmpty()
    .withMessage("Duration is required")
    .isString()
    .withMessage("Duration must be a string"),

  body("requirements")
    .isArray()
    .withMessage("Requirements must be an array of strings"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isInt({ min: 0 })
    .withMessage("Price must be a positive integer"),

  body("format")
    .notEmpty()
    .withMessage("Format is required")
    .isIn(["PAPERBACK", "DIGITAL"])
    .withMessage("Invalid format"),

  body("edition")
    .notEmpty()
    .withMessage("Edition is required")
    .isString()
    .withMessage("Edition must be a string"),

  body("authors").isArray().withMessage("Authors must be an array of strings"),

  body("previewImage")
    .notEmpty()
    .withMessage("Preview image is required")
    .isString()
    .withMessage("Preview image must be a string"),

  body("video_preview")
    .notEmpty()
    .withMessage("Video preview is required")
    .isString()
    .withMessage("Video preview must be a string"),

  body("seriesId")
    .notEmpty()
    .withMessage("Series ID is required")
    .isString()
    .withMessage("Series ID must be a string"),
];

export const updateCourseValidation = [
  body("courseId", "Course Id is required.").isString(),
  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),

  body("status")
    .optional()
    .isIn(["ACTIVE", "INACTIVE", "FREEZE"])
    .withMessage("Invalid status value"),

  body("duration")
    .optional()
    .isString()
    .withMessage("Duration must be a string"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array of strings"),

  body("price")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Price must be a positive integer"),

  body("format")
    .optional()
    .isIn(["PAPERBACK", "DIGITAL"])
    .withMessage("Invalid format"),

  body("edition").optional().isString().withMessage("Edition must be a string"),

  body("authors")
    .optional()
    .isArray()
    .withMessage("Authors must be an array of strings"),

  body("previewImage")
    .optional()
    .isString()
    .withMessage("Preview image must be a string"),

  body("video_preview")
    .optional()
    .isString()
    .withMessage("Video preview must be a string"),

  body("seriesId")
    .optional()
    .isString()
    .withMessage("Series ID must be a string"),
];
