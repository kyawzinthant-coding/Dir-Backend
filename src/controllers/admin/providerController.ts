import { NextFunction, Request, Response } from "express";
import {
  createProviderValidation,
  updateProviderValidation,
} from "../../middlewares/validation";
import { body, validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { checkModelIfExist, checkUploadFile } from "../../utils/check";
import { Provider } from "@prisma/client";
import path from "path";
import {
  optimizeImage,
  removeFiles,
  UPLOADS_DIR,
} from "../../utils/optimizeImage";
import {
  createOneProvider,
  deleteOneProvider,
  getProviderById,
  ProviderArgs,
  updateOneProvider,
} from "../../services/ProviderService";
import { errorCode } from "../../../config/errorCode";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

export const createProvider = [
  ...createProviderValidation,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name, description } = req.body;

    const image = req.file;

    checkUploadFile(image);

    const fileName =
      Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
    const optmizedImage = path.join(UPLOADS_DIR, fileName);

    try {
      await optimizeImage(image!.buffer, optmizedImage, 900, 500, 100);
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
    }

    const data: ProviderArgs = {
      name,
      image: fileName,
      description,
    };

    await createOneProvider(data);

    res.status(201).json({ message: "Provider created successfully" });
  },
];

export const updateProvider = [
  ...updateProviderValidation,

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name, providerId, description } = req.body;

    const provider = await getProviderById(providerId);
    if (provider == null) {
      return next(
        createError("This data model does not exist.", 401, errorCode.invalid)
      );
    }

    let data: ProviderArgs = {
      name,
      image: req.file?.filename!,
      description,
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
      }

      data.image = fileName;
      await removeFiles(provider.image);
    }

    await updateOneProvider(provider.id, data);

    res.status(201).json({
      message: "Provider updated successfully",
      provideId: providerId,
    });
  },
];

export const deleteProvider = [
  body("providerId", "Provider id is required"),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { providerId } = req.body;

    const provider = await getProviderById(providerId);
    checkModelIfExist(provider);

    await deleteOneProvider(provider?.id!);
    await removeFiles(provider?.image!);

    res.status(200).json({
      message: "Successfully deleted the provider.",
      postId: provider?.id,
    });
  },
];
