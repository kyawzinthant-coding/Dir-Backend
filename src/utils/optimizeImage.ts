import path from "path";
import sharp from "sharp";

export const optimizeImage = async (
  imageBuffer: Buffer,
  outputPath: string,
  width: number,
  height: number,
  quality: number
): Promise<void> => {
  try {
    await sharp(imageBuffer)
      .resize(width, height)
      .webp({ quality })
      .toFile(outputPath);
  } catch (error) {
    console.error(`Image optimization failed: ${error}`);
    throw new Error("Image optimization failed");
  }
};

export const UPLOADS_DIR = path.join(__dirname, "/../../", "/uploads/images");
