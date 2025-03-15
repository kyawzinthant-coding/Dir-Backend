import { checkUploadFile } from "./../../utils/check";
import { createCourseValidation } from "../../middlewares/validation";
import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

import path from "path";
import { optimizeImage, UPLOADS_DIR } from "../../utils/optimizeImage";
import { createCourseService } from "../../services/courseService";

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

    checkUploadFile(previewImage);
    checkUploadFile(images);
    // await createCourseService(data, images);

    const previewFileName =
      Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
    const optmizedImage = path.join(UPLOADS_DIR, previewFileName);

    try {
      await optimizeImage(previewImage!.buffer, optmizedImage, 835, 577, 100);
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
      return next(
        createError("Image optimization failed", 500, "server_error")
      );
    }

    // Process course images
    const optimizedImageNames: string[] = [];
    for (const image of images) {
      const imageFileName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.webp`;
      const optimizedImagePath = path.join(UPLOADS_DIR, imageFileName);

      try {
        await optimizeImage(image.buffer, optimizedImagePath, 835, 577, 100);
        console.log(`Image ${image.originalname} optimized successfully!`);
        optimizedImageNames.push(imageFileName);
      } catch (error) {
        console.error(`Failed to optimize ${image.originalname}:`, error);
        return next(
          createError("Image optimization failed", 500, "server_error")
        );
      }
    }

    const courseData = {
      name,
      description,
      requirements,
      price,
      format,
      edition,
      authors,
      previewImage: previewFileName, // Optimized preview image
      video_preview,
      courseImages: optimizedImageNames, // Optimized images
      seriesId,
    };

    try {
      const createdCourse = await createCourseService(courseData);
      res.status(201).json({
        message: "Course created successfully",
        course: createdCourse,
      });
    } catch (error) {
      return next(createError("Failed to create course", 500, "server_error"));
    }
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
