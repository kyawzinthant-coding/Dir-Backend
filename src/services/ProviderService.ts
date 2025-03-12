import { PrismaClient, Provider, Series } from "@prisma/client";

const prisma = new PrismaClient();

export type ProviderArgs = {
  name: string;
  image: string;
  series?: Series[];
};

export const createOneProvider = async (providerData: ProviderArgs) => {
  let data = {
    name: providerData.name,
    image: providerData.image,
  };

  return await prisma.provider.create({
    data,
  });
};
