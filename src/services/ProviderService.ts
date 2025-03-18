import { Provider, Series } from "@prisma/client";
import { prisma } from "./prismaClient";

export interface ProviderArgs {
  name: string;
  imageId: string;
  description: string;
  series?: Series[];
}

export const createOneProvider = async (providerData: ProviderArgs) => {
  let data = {
    name: providerData.name,
    imageId: providerData.imageId,
    description: providerData.description,
  };

  return await prisma.provider.create({
    data,
  });
};

export const getProviderById = async (providerId: string) => {
  return prisma.provider.findUnique({
    where: {
      id: providerId,
    },
    select: {
      id: true,
      name: true,
      image: true,
      description: true,
    },
  });
};

export const updateOneProvider = async (
  providerId: string,
  providerData: ProviderArgs
) => {
  let data: any = {
    name: providerData.name,
    description: providerData.description,
  };
  if (providerData.imageId) {
    data.imageId = providerData.imageId;
  }
  return await prisma.provider.update({
    where: { id: providerId },
    data: data,
  });
};

export const deleteOneProvider = async (id: string) => {
  return prisma.provider.delete({
    where: { id },
  });
};

export const getProviderList = async (options: any) => {
  return prisma.provider.findMany(options);
};
