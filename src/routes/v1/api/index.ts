import express from "express";
import { auth } from "../../../middlewares/auth";
import { uploadMemory } from "../../../middlewares/uploadFile";
import { uploadProfile } from "../../../controllers/api/profileController";
import {
  getProvider,
  getProviderByPagination,
} from "../../../controllers/api/providerController";
import {
  getSerie,
  getSeriesByProvider,
} from "../../../controllers/api/SeriesController";
import { getCoursesBySeries } from "../../../controllers/api/courseController";

const router = express.Router();

router.patch(
  "/profile/upload",
  auth,
  uploadMemory.single("avatar"),
  uploadProfile
);

router.get("/providers/:id", getProvider);
router.get("/series/:id", getSerie);

// get sereies with provider

router.get("/providers", getProviderByPagination);
router.get("/providers/:providerId/series", getSeriesByProvider);

// // get courses with series
router.get("/series/:seriesId/courses", getCoursesBySeries);
// router.get("/providers/:providerId/series/:seriesId/courses/:courseId");

export default router;
