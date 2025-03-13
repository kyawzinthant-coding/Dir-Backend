import { PrismaClient, Provider, Series } from "@prisma/client";

const prisma = new PrismaClient();

export interface ProviderArgs {
  name: string;
  image: string;
  series?: Series[];
}

export const createOneProvider = async (providerData: ProviderArgs) => {
  let data = {
    name: providerData.name,
    image: providerData.image,
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
  });
};

export const updateOneProvider = async (
  providerId: string,
  providerData: ProviderArgs
) => {
  let data: any = {
    name: providerData.name,
  };
  if (providerData.image) {
    data.image = providerData.image;
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
