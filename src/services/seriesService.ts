import { prisma } from "./prismaClient";

export interface SeriesArgs {
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

export const getOneSerie = async (id: string) => {
  return prisma.series.findUnique({
    where: { id },
  });
};

export const getOneSeriesWithRelationShip = async (id: string) => {
  return prisma.series.findUnique({
    where: { id },
    select: {
      name: true,
      image: true,
      provider: {
        select: {
          name: true,
        },
      },
      category: {
        select: {
          name: true,
        },
      },
    },
  });
};

export const updateOneSeries = async (id: string, seriesData: SeriesArgs) => {
  let data: any = {
    name: seriesData.name,
    image: seriesData.image,
  };
  if (seriesData.providerId) {
    data.provider = {
      connect: { id: seriesData.providerId },
    };
  }
  if (seriesData.category) {
    data.category = {
      connectOrCreate: {
        where: { name: seriesData.category },
        create: { name: seriesData.category },
      },
    };
  }
  return await prisma.series.update({
    where: { id },
    data: data,
  });
};

export const deleteOneSeries = async (id: string) => {
  return prisma.series.delete({
    where: { id },
  });
};
