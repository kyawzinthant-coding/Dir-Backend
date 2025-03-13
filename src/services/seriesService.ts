import { prisma } from "./prismaClient";

interface SeriesArgs {
  name: string;
  image: string;
  providerId: string;
  category: string;
}

export const createSeries = async (seriesData: SeriesArgs) => {
  const data = {
    name: seriesData.name,
    image: seriesData.image,
    provider: {
      connect: { id: seriesData.providerId },
    },
    category: {
      connectOrCreate: {
        where: { name: seriesData.category }, // Check if category exists by name
        create: { name: seriesData.category }, // Create if not exists
      },
    },
  };

  return prisma.series.create({ data });
};
