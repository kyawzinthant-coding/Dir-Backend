import { checkModelIfExist, checkUploadFile } from "./../../utils/check";
import {
  createCourseValidation,
  updateCourseValidation,
} from "../../middlewares/validation";
import { body, validationResult } from "express-validator";
import { NextFunction, Request, Response } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";

import path from "path";
import {
  optimizeImage,
  removeFiles,
  UPLOADS_DIR,
} from "../../utils/optimizeImage";
import {
  createCourseService,
  getCourseByIdService,
  updateOneCourse,
} from "../../services/courseService";

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
  ...updateCourseValidation,
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
      courseId,
    } = req.body;

    const course = await getCourseByIdService(courseId);
    checkModelIfExist(course);

    const courseData: any = {
      name,
      description,
      requirements,
      price,
      format,
      edition,
      authors,
      video_preview,
      seriesId,
      previewImage: course?.previewImage,
      courseImages: [] as any,
    };

    const preview = req.files?.["previewImage"]?.[0] || null;

    // Extract multiple images
    const images = req.files?.["images"] || [];

    if (req.files?.["previewImage"]?.[0]) {
      checkUploadFile(preview);

      const previewFileName =
        Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
      const optmizedImage = path.join(UPLOADS_DIR, previewFileName);

      try {
        await optimizeImage(preview!.buffer, optmizedImage, 835, 577, 100);
        console.log("Image optimized successfully!");
        courseData.previewImage = previewFileName;
      } catch (error) {
        console.error("Failed to optimize image:", error);
        return next(
          createError("Image optimization failed", 500, "server_error")
        );
      }
    }

    if (images.length > 0) {
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
      courseData.courseImages = optimizedImageNames;
      course?.CourseImage.map(async (image) => {
        if (!optimizedImageNames.includes(image.image)) {
          await removeFiles(image.image);
        }
      });
    }

    try {
      const updatedCourse = await updateOneCourse(courseId, courseData);
      res.status(200).json({
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error updating course:", error);
      return next(createError("Failed to update course", 500, "server_error"));
    }
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
