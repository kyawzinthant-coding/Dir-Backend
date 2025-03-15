import { createCourseValidation } from "../../middlewares/validation";
import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
  files?: any;
}

export const createCourse = [
  ...createCourseValidation,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const {
      name,
      description,
      duration,
      requirements,
      price,
      format,
      edition,
      authors,
      video_preview,
      seriesId,
    } = req.body;

    const previewImage = req.files?.["previewImage"]?.[0] || null;

    // Extract multiple images
    const images = req.files?.["images"] || [];

    const data = {
      name,
      description,
      duration,
      requirements,
      price,
      format,
      edition,
      authors,
      previewImage,
      video_preview,
      seriesId,
    };

    // await createCourseService(data, images);
  },
];

export const updateCourse = [
  ...createCourseValidation,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const {
      name,
      description,
      duration,
      requirements,
      price,
      format,
      edition,
      authors,
      video_preview,
      seriesId,
      courseId,
    } = req.body;

    const previewImage = req.files?.["previewImage"]?.[0] || null;

    // Extract multiple images
    const images = req.files?.["images"] || [];
  },
];

export const deleteCourse = [
  body("courseId", "Course id is required").isString(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { courseId } = req.body;
  },
];
