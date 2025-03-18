import { param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import {
  getCourseByIdService,
  getCoursesBySeriesService,
} from "../../services/courseService";
import { getOneSerie } from "../../services/seriesService";
import { checkModelIfExist } from "../../utils/check";

export const getCoursesBySeries = [
  param("seriesId", "Series id is required").notEmpty(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const seriesId = req.params.seriesId;

    const courses = await getCoursesBySeriesService(seriesId);
    const series = await getOneSerie(seriesId);

    res.status(200).json({
      message: "Courses inside a series",
      series,
      courses,
    });
  },
];

export const getCourseById = [
  param("courseId", "Course id is required").notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const courseId = req.params.courseId;
    const course = await getCourseByIdService(courseId);
    checkModelIfExist(course);

    res.status(200).json({
      message: "Course details",
      course,
    });
  },
];
