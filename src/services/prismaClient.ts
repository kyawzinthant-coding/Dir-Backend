import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient().$extends({
  result: {
    user: {
      image: {
        needs: { image: true },
        compute(user) {
          if (user.image) {
            return "/images/" + user.image.split(".")[0] + ".webp";
          }
          return user.image;
        },
      },
    },
    provider: {
      image: {
        needs: { image: true },
        compute(post) {
          return "/images/" + post.image.split(".")[0] + ".webp";
        },
      },
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
      image: {
        needs: { image: true },
        compute(post) {
          return "/images/" + post.image.split(".")[0] + ".webp";
        },
      },
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
