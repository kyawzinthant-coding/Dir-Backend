import express from "express";
import { getAllUser } from "../../../controllers/admin/userController";
import { uploadMemory } from "../../../middlewares/uploadFile";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "../../../controllers/admin/providerController";
import {
  createSerie,
  deleteSeries,
  updateSeries,
} from "../../../controllers/admin/SeriesController";
import {
  createCourse,
  deleteCourse,
  updateCourse,
} from "../../../controllers/admin/courseController";

const router = express.Router();

router.get("/users", getAllUser);

// CRUD for Providers
router.post("/providers", uploadMemory.single("image"), createProvider);
router.patch("/providers", uploadMemory.single("image"), updateProvider);
router.delete("/providers", deleteProvider);

//CRUD for Series
router.post("/series", uploadMemory.single("image"), createSerie);
router.patch("/series", uploadMemory.single("image"), updateSeries);
router.delete("/series", deleteSeries);

//CRUD for Course
router.post(
  "/courses",
  uploadMemory.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  createCourse
);
router.patch(
  "/courses",
  uploadMemory.fields([
    { name: "previewImage", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  updateCourse
);
router.delete("/courses", deleteCourse);

export default router;
