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
  ProviderArgs,
} from "../../services/ProviderService";

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

    console.log(data);

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

    const { name, image } = req.body;

    res.status(201).json({ message: "Provider updated successfully" });
  },
];
