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
  deleteOneCourse,
  getCourseByIdService,
  updateOneCourse,
} from "../../services/courseService";
import { getOneSerie } from "../../services/seriesService";
import {
  removeCloudinaryFile,
  uploadToCloudinary,
} from "../../middlewares/uploadFile";
import { prisma } from "../../services/prismaClient";
import { removeImage } from "../../services/ImageService";

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

    let cloudinaryFile: any;
    try {
      cloudinaryFile = await uploadToCloudinary(
        previewImage.buffer,
        previewFileName
      );
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
      return next(
        createError("Image optimization failed", 500, "server_error")
      );
    }

    console.log(cloudinaryFile.secure_url);

    const NewImage = await prisma.image.create({
      data: {
        url: cloudinaryFile.secure_url,
        publicId: cloudinaryFile.public_id,
      },
    });
    console.log(NewImage);

    // Process course images
    const optimizedImageNames: string[] = [];
    for (const image of images) {
      const imageFileName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.webp`;
      const optimizedImagePath = path.join(UPLOADS_DIR, imageFileName);

      try {
        await optimizeImage(image.buffer, optimizedImagePath, 100);
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
      imageId: NewImage.id, // Optimized preview image
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
      removeCloudinaryFile(cloudinaryFile.public_id);
      await removeImage(NewImage.id);
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

    if (seriesId) {
      const seriesOne = await getOneSerie(seriesId);
      checkModelIfExist(seriesOne);
    }

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
      courseImages: [],
    };

    const preview = req.files?.["previewImage"]?.[0] || null;
    const images = req.files?.["images"] || [];

    // Handle preview image update
    if (preview) {
      checkUploadFile(preview);

      const previewFileName = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.webp`;

      try {
        const cloudinaryFile: any = await uploadToCloudinary(
          preview.buffer,
          previewFileName
        );
        console.log("Preview image uploaded successfully!");

        // Create a new image entry in the database
        const newImage = await prisma.image.create({
          data: {
            url: cloudinaryFile.secure_url,
            publicId: cloudinaryFile.public_id,
          },
        });

        courseData.previewImage = newImage.id;

        // Remove old preview image if exists
        if (course?.previewImage?.publicId) {
          await removeCloudinaryFile(course!.previewImage.publicId);
          await removeImage(course!.previewImage.id);
        }
      } catch (error) {
        console.error("Preview image upload failed:", error);
        return next(createError("Image upload failed", 500, "server_error"));
      }
    }

    // Handle course images update
    if (images.length > 0) {
      try {
        const optimizedImageNames: string[] = [];

        for (const image of images) {
          checkUploadFile(image);

          const imageFileName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
          )}.webp`;

          const cloudinaryFile: any = await uploadToCloudinary(
            image.buffer,
            imageFileName
          );

          optimizedImageNames.push(cloudinaryFile.secure_url);
        }

        courseData.courseImages = optimizedImageNames;

        // Remove old images not in the new list
        for (const image of course?.CourseImage || []) {
          if (!optimizedImageNames.includes(image.image)) {
            await removeFiles(image.image);
          }
        }
      } catch (error) {
        console.error("Course images update failed:", error);
        return next(createError("Image update failed", 500, "server_error"));
      }
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

    const course = await getCourseByIdService(courseId);
    checkModelIfExist(course);

    const deletedCourse = await deleteOneCourse(courseId);
    if (course?.previewImage?.id) {
      await removeFiles(course!.previewImage?.id);
    }

    if (course?.CourseImage) {
      course?.CourseImage.map(async (image) => {
        await removeFiles(image.image);
      });
    }
    res.status(200).json({
      message: "Course deleted successfully",
      deletedCourse,
    });
  },
];
