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
import {
  removeCloudinaryFile,
  uploadToCloudinary,
} from "../../middlewares/uploadFile";
import { prisma } from "../../services/prismaClient";
import { removeImage } from "../../services/ImageService";

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

    const data: ProviderArgs = {
      name,
      imageId: NewImage.id,
      description,
    };

    let providers;
    try {
      providers = await createOneProvider(data);
    } catch (error) {
      console.error(error);
      removeCloudinaryFile(cloudinaryFile.public_id);
      removeImage(NewImage.id);
      return next(
        createError("Failed to create provider", 500, "server_error")
      );
    }

    res
      .status(201)
      .json({ message: "Provider created successfully", provider: providers });
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

    let data: any = {
      name,
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
      if (provider?.image?.publicId) {
        await removeCloudinaryFile(provider!.image.publicId);
        await removeImage(provider!.image.id);
      }
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
    if (provider?.image?.publicId) {
      await removeCloudinaryFile(provider!.image.publicId);
      await removeImage(provider!.image.id);
    }

    res.status(200).json({
      message: "Successfully deleted the provider.",
      postId: provider?.id,
    });
  },
];
