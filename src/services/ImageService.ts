import { prisma } from "./prismaClient";

export const removeImage = async (id: string) => {
  const series = await prisma.series.findFirst({
    where: { imageId: id },
  });

  if (series) {
    // 2️⃣ Remove the reference in Series
    await prisma.series.update({
      where: { id: series.id },
      data: { imageId: null },
    });
  }

  // 3️⃣ Now delete the image
  return prisma.image.delete({
    where: { id },
  });
};
