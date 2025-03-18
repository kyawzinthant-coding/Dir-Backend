import { getUserById } from "./../../services/authService";
import { NextFunction, Request, Response } from "express";
import { checkUserifNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import { UpdateUser } from "../../services/authService";
import { unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { optimizeImage, UPLOADS_DIR } from "../../utils/optimizeImage";

interface CustomRequest extends Request {
  userId?: string;
  user?: any;
  file?: any;
}

export const uploadProfile = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserifNotExist(user);
  const image = req.file;
  checkUploadFile(image);

  const fileName = Date.now() + "-" + `${Math.round(Math.random() * 1e9)}.webp`;
  const optmizedImage = path.join(UPLOADS_DIR, fileName);

  try {
    await optimizeImage(image.buffer, optmizedImage, 50);
    console.log("Image optimized successfully!");
  } catch (error) {
    console.error("Failed to optimize image:", error);
  }

  //   const filePath = image!.path;
  //   const filePath2 = image!.path.replace("\\", "/"); for window

  // Delete the old image if it exists
  if (user!.image) {
    const oldImagePath = path.join(UPLOADS_DIR, user!.image);
    try {
      await unlink(oldImagePath);
    } catch (error) {
      console.error(`Failed to delete old image: ${error}`);
    }
  }

  const userData = {
    image: fileName,
  };

  await UpdateUser(user!.id, userData);

  res.status(200).json({
    message: "Profile uploaded successfully",
    data: req.file,
  });
};
