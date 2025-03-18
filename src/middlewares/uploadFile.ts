import { Request, Response, NextFunction } from "express";
import multer, { FileFilterCallback } from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.IMAGE_API_KEY,
  api_secret: process.env.IMAGE_SERVER_KEY,
});

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const type = file.mimetype.split("/")[0];
    if (type === "image") {
      cb(null, "uploads/images");
    } else {
      cb(null, "uploads/files");
    }
  },

  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB
});

export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 1024 * 1024 * 10 },
});

export default upload;

export const uploadToCloudinary = async (
  fileBuffer: Buffer,
  fileName: string
) => {
  return new Promise((resolve, reject) => {
    console.log("Uploading file to Cloudinary with filename:", fileName);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        public_id: fileName,
        folder: "uploads",
        transformation: [{ quality: "auto:good", fetch_format: "webp" }],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          return reject(error);
        }
        console.log("Cloudinary upload success:", result);
        resolve(result);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

export const removeCloudinaryFile = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Cloudinary file deletion failed:", error);
  }
};
