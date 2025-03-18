import { Course, Format } from "@prisma/client";
import { prisma } from "./prismaClient";

interface CourseArgs {
  name: string;
  description: string;
  requirements: string[];
  price: number;
  format: Format;
  edition: string;
  authors: string[];
  previewImage: string;
  video_preview: string;
  seriesId: string;
  courseImages: any;
}

export const createCourseService = async (data: any) => {
  try {
    // Create the course
    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        requirements: data.requirements,
        price: +data.price,
        format: data.format,
        edition: data.edition,
        authors: data.authors,
        previewImage: { connect: { id: data.imageId } },
        video_preview: data.video_preview,
        series: { connect: { id: data.seriesId } },
      },
    });

    // Create CourseImage entries one by one
    const courseImages = await Promise.all(
      data.courseImages.map((image: string) =>
        prisma.courseImage.create({
          data: {
            courseId: course.id,
            image,
          },
        })
      )
    );

    // Return course with images
    return {
      ...course,
      CourseImage: courseImages,
    };
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Database error while creating course");
  }
};

export const getCourseByIdService = async (courseId: string) => {
  return await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      CourseImage: true,
      previewImage: true,
    },
  });
};

export const updateOneCourse = async (courseId: string, courseData: any) => {
  try {
    // Filter out undefined values
    const courseInfo: any = Object.fromEntries(
      Object.entries({
        name: courseData.name,
        description: courseData.description,
        requirements: courseData.requirements,
        price: courseData.price !== undefined ? +courseData.price : undefined,
        format: courseData.format,
        edition: courseData.edition,
        authors: courseData.authors,
        previewImage: courseData.previewImage
          ? { connect: { id: courseData.previewImage } }
          : undefined, // ✅ Fix previewImage
        video_preview: courseData.video_preview,
        series: courseData.seriesId
          ? { connect: { id: courseData.seriesId } }
          : undefined,
      }).filter(([_, v]) => v !== undefined) // Remove undefined values
    );

    // If images are updated, replace them
    if (courseData.courseImages && courseData.courseImages.length > 0) {
      await prisma.courseImage.deleteMany({
        where: { courseId },
      });

      await prisma.courseImage.createMany({
        data: courseData.courseImages.map((image: string) => ({
          courseId,
          image,
        })),
      });
    }

    // Update the course
    const course = await prisma.course.update({
      where: { id: courseId },
      data: courseInfo,
    });

    return course;
  } catch (error) {
    console.error("Error updating course:", error);
    throw new Error("Database error while updating course");
  }
};

export const deleteOneCourse = async (courseId: string) => {
  return await prisma.course.delete({
    where: { id: courseId },
  });
};

export const getCourseList = async (options: any) => {
  return prisma.course.findMany(options);
};

export const getCoursesBySeriesService = async (id: string) => {
  return prisma.course.findMany({
    where: {
      seriesId: id,
    },
    select: {
      id: true,
      name: true,
      previewImage: true,
      description: true,
      price: true,
      imageId: true,
    },
  });
};
