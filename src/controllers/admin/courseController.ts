import { createCourseValidation } from "../../middlewares/validation";
import { validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

export const createCourse = [
  ...createCourseValidation,
  async (req: Request, res: Response, next: NextFunction) => {
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
      previewImage,
      video_preview,
      seriesId,
    } = req.body;
  },
];
