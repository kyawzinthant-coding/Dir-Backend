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

export const createSerie = [
  ...createSeriesValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name, providerId, category } = req.body;
    const image = req.file;

    if (!image) {
      return next(createError("Image file is required", 400, "invalid"));
    }

    checkUploadFile(image);

    const fileName =
      Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
    const optmizedImage = path.join(UPLOADS_DIR, fileName);

    try {
      await optimizeImage(image.buffer, optmizedImage, 900, 500, 90);
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
      return next(
        createError("Image optimization failed", 500, "server_error")
      );
    }

    const data = {
      name,
      image: fileName,
      category,
      providerId,
    };

    console.log(data);

    let series;
    try {
      series = await createSeries(data);
    } catch (error) {
      console.error(error);
      removeFiles(data.image);
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
    const { name, providerId, category, seriesId } = req.body;

    console.log(seriesId);
    const series = await getOneSerie(seriesId);
    checkModelIfExist(series);

    let data: SeriesArgs = {
      name,
      category,
      providerId,
      image: req.file?.filename!,
    };

    if (req.file) {
      const fileName =
        Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
      const optmizedImage = path.join(UPLOADS_DIR, fileName);

      try {
        await optimizeImage(req.file!.buffer, optmizedImage, 900, 500, 90);
        console.log("Image optimized successfully!");
      } catch (error) {
        console.error("Failed to optimize image:", error);
        return next(
          createError("Image optimization failed", 500, "server_error")
        );
      }

      data.image = fileName;
      await removeFiles(series!.image);
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
    await removeFiles(series!.image);
    res.status(200).json({
      message: "Series deleted successfully",
      seriesId,
    });
  },
];
