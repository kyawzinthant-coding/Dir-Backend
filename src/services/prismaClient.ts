import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  result: {
    provider: {
      updatedAt: {
        needs: { updatedAt: true },
        compute(post) {
          return post?.updatedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
    },
    series: {
      updatedAt: {
        needs: { updatedAt: true },
        compute(post) {
          return post?.updatedAt.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        },
      },
    },
  },
});
