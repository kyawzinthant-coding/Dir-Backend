import { NextFunction, Request, Response } from "express";
import {
  createProviderValidation,
  updateProviderValidation,
} from "../../middlewares/validation";
import { validationResult } from "express-validator";
import { createError } from "../../utils/error";
import { checkUploadFile } from "../../utils/check";
import { Provider } from "@prisma/client";
import path from "path";
import { optimizeImage, UPLOADS_DIR } from "../../utils/optimizeImage";
import {
  createOneProvider,
  getProviderById,
  ProviderArgs,
  updateOneProvider,
} from "../../services/ProviderService";
import { errorCode } from "../../../config/errorCode";
import { unlink } from "fs/promises";

interface CustomRequest extends Request {
  userId?: number;
  user?: any;
}

const removeFiles = async (originalFile: string) => {
  try {
    const originalFilePath = path.join(UPLOADS_DIR, originalFile);

    await unlink(originalFilePath);
  } catch (error) {
    console.log(error);
  }
};

export const createProvider = [
  ...createProviderValidation,
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name } = req.body;

    const image = req.file;

    checkUploadFile(image);

    const fileName =
      Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
    const optmizedImage = path.join(UPLOADS_DIR, fileName);

    try {
      await optimizeImage(image!.buffer, optmizedImage, 900, 500, 90);
      console.log("Image optimized successfully!");
    } catch (error) {
      console.error("Failed to optimize image:", error);
    }

    const data: ProviderArgs = {
      name,
      image: fileName,
    };

    await createOneProvider(data);

    res.status(201).json({ message: "Provider created successfully" });
  },
];

export const deleteProvider = [
  async (req: Request, res: Response, next: NextFunction) => {},
];

export const updateProvider = [
  ...updateProviderValidation,

  async (req: CustomRequest, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { name, providerId } = req.body;

    const provider = await getProviderById(providerId);
    if (provider == null) {
      return next(
        createError("This data model does not exist.", 401, errorCode.invalid)
      );
    }

    let data: ProviderArgs = {
      name,
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
