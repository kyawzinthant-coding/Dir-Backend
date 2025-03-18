import { prisma } from "./prismaClient";

export interface SeriesArgs {
  name: string;
  imageId: string;
  providerId: string;
  category: string;
  description: string;
}

export const createSeries = async (seriesData: SeriesArgs) => {
  const category = await prisma.category.upsert({
    where: { name: seriesData.category },
    update: {},
    create: { name: seriesData.category },
  });

  const data = {
    name: seriesData.name,
    imageId: seriesData.imageId,
    description: seriesData.description,
    providerId: seriesData.providerId,
    categoryId: category.id,
  };

  return prisma.series.create({ data });
};

export const getOneSerie = async (id: string) => {
  return prisma.series.findUnique({
    where: { id },
    include: {
      image: true, // Includes the related image
      _count: {
        select: { courses: true },
      },
    },
  });
};

export const getOneSeriesWithRelationShip = async (id: string) => {
  return prisma.series.findUnique({
    where: { id },
    select: {
      name: true,
      image: true,
      description: true,
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
    description: seriesData.description,
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
  if (seriesData.imageId) {
    data.image = {
      connect: { id: seriesData.imageId },
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

export const getSeriesByProviderService = async (id: string) => {
  return prisma.series.findMany({
    where: {
      providerId: id,
    },
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
      category: {
        select: {
          name: true,
        },
      },
      _count: {
        select: { courses: true },
      },
    },
  });
};
