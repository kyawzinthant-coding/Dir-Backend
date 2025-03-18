import { unlink } from "fs/promises";
import path from "path";
import sharp from "sharp";

export const optimizeImage = async (
  imageBuffer: Buffer,
  outputPath: string,
  quality: number
): Promise<void> => {
  try {
    await sharp(imageBuffer).webp({ quality }).toFile(outputPath);
  } catch (error) {
    console.error(`Image optimization failed: ${error}`);
    throw new Error("Image optimization failed");
  }
};

export const UPLOADS_DIR = path.join(__dirname, "/../../", "/uploads/images");

export const removeFiles = async (originalFile: string) => {
  try {
    const originalFilePath = path.join(UPLOADS_DIR, originalFile);

    await unlink(originalFilePath);
  } catch (error) {
    console.log(error);
  }
};

export const removeManyFiles = async (originalFiles: string[]) => {
  try {
    for (const originalFile of originalFiles) {
      const originalFilePath = path.join(UPLOADS_DIR, originalFile);
      await unlink(originalFilePath);
    }
  } catch (error) {
    console.log(error);
  }
};
