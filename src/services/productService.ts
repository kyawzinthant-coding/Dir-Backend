import { prisma } from "./prismaClient";

export const createCourseService = async (data: any) => {
  try {
    // Create the course first
    const course = await prisma.course.create({
      data: {
        name: data.name,
        description: data.description,
        requirements: data.requirements,
        price: +data.price,
        format: data.format,
        edition: data.edition,
        authors: data.authors,
        previewImage: data.previewImage, // Optimized preview image
        video_preview: data.video_preview,
        series: { connect: { id: data.seriesId } }, // Connect to the existing series
      },
    });

    // If there are course images, create CourseImage entries
    if (data.courseImages.length > 0) {
      await prisma.courseImage.createMany({
        data: data.courseImages.map((image: string) => ({
          courseId: course.id,
          image,
        })),
      });
    }

    return course;
  } catch (error) {
    console.error("Error creating course:", error);
    throw new Error("Database error while creating course");
  }
};
