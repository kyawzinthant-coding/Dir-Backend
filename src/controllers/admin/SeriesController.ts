import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { NextFunction, Request, Response } from "express";
import { checkModelIfExist, checkUploadFile } from "../../utils/check";
import path from "path";
import {
  optimizeImage,
  removeFiles,
  UPLOADS_DIR,
} from "../../utils/optimizeImage";
import {
  createSeries,
  deleteOneSeries,
  getOneSerie,
  SeriesArgs,
  updateOneSeries,
} from "../../services/seriesService";
import {
  createSeriesValidation,
  updateSeriesValidation,
} from "../../middlewares/validation";
import {
  removeCloudinaryFile,
  uploadToCloudinary,
} from "../../middlewares/uploadFile";
import { prisma } from "../../services/prismaClient";
import { removeImage } from "../../services/ImageService";

export const createSerie = [
  ...createSeriesValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name, providerId, category, description } = req.body;
    const image = req.file;

    if (!image) {
      return next(createError("Image file is required", 400, "invalid"));
    }

    checkUploadFile(image);

    const fileName =
      Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;

    let cloudinaryFile: any;
    try {
      cloudinaryFile = await uploadToCloudinary(image.buffer, fileName);
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
      return next(
        createError("Image optimization failed", 500, "server_error")
      );
    }

    const NewImage = await prisma.image.create({
      data: {
        url: cloudinaryFile.secure_url,
        publicId: cloudinaryFile.public_id,
      },
    });

    const data = {
      name,
      imageId: NewImage.id,
      category,
      providerId,
      description,
    };

    let series;
    try {
      series = await createSeries(data);
    } catch (error) {
      console.error(error);
      removeCloudinaryFile(cloudinaryFile.public_id);
      removeImage(NewImage.id);
      return next(createError("Failed to create series", 500, "server_error"));
    }

    res.status(201).json({
      message: "Series created successfully",
      series,
    });
  },
];

export const updateSeries = [
  ...updateSeriesValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));
    const { name, providerId, category, seriesId, description } = req.body;

    const series = await getOneSerie(seriesId);
    checkModelIfExist(series);

    let data: any = {
      name,
      category,
      providerId,
      description,
    };

    if (req.file) {
      const fileName =
        Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;

      let cloudinaryFile: any;
      try {
        cloudinaryFile = await uploadToCloudinary(req.file.buffer, fileName);
        console.log("Image optimized successfully!");
      } catch (error) {
        console.error("Failed to optimize image:", error);
        return next(
          createError("Image optimization failed", 500, "server_error")
        );
      }

      const NewImage = await prisma.image.create({
        data: {
          url: cloudinaryFile.secure_url,
          publicId: cloudinaryFile.public_id,
        },
      });

      data.imageId = NewImage.id;
      if (series?.image?.publicId) {
        await removeCloudinaryFile(series!.image.publicId);
        await removeImage(series!.image.id);
      }
    }

    const updatedSeries = await updateOneSeries(series!.id, data);
    res.status(200).json({
      message: "Series updated successfully",
      series: updatedSeries,
    });
  },
];

export const deleteSeries = [
  body("seriesId", "Series id is required").isString(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { seriesId } = req.body;
    const series = await getOneSerie(seriesId);
    checkModelIfExist(series);

    await deleteOneSeries(seriesId);
    if (series?.image?.publicId) {
      await removeCloudinaryFile(series!.image.publicId);
      await removeImage(series!.image.id);
    }
    res.status(200).json({
      message: "Series deleted successfully",
      seriesId,
    });
  },
];
