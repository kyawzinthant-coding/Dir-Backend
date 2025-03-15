import { prisma } from "./prismaClient";

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
        previewImage: data.previewImage,
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
