import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const getUserbyUsername = async (username: string) => {
  return await prisma.user.findUnique({
    where: { username },
  });
};

export const createuser = async (userdata: any) => {
  return await prisma.user.create({
    data: userdata,
  });
};

export const UpdateUser = async (id: string, userdata: any) => {
  return await prisma.user.update({
    where: { id },
    data: userdata,
  });
};

export const getUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};
