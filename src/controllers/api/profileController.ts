import { getUserById } from "./../../services/authService";
import { NextFunction, Request, Response } from "express";
import { checkUserifNotExist } from "../../utils/auth";
import { checkUploadFile } from "../../utils/check";
import { UpdateUser } from "../../services/authService";
import { unlink } from "node:fs/promises";
import path from "node:path";

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

  const fileName = image!.filename;
  //   const filePath = image!.path;
  //   const filePath2 = image!.path.replace("\\", "/"); for window

  if (user?.image) {
    const filePath = path.join(
      __dirname,
      "../../../",
      "/uploads/images",
      user!.image!
    );

    try {
      await unlink(filePath);
    } catch (error) {
      console.log(error);
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
