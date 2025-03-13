import express from "express";
import { auth } from "../../../middlewares/auth";
import { uploadMemory } from "../../../middlewares/uploadFile";
import { uploadProfile } from "../../../controllers/api/profileController";
import { getProvider } from "../../../controllers/api/providerController";
import { getSerie } from "../../../controllers/api/SeriesController";

const router = express.Router();

router.patch(
  "/profile/upload",
  auth,
  uploadMemory.single("avatar"),
  uploadProfile
);

router.get("/providers/:id", getProvider);
router.get("/series/:id", getSerie);
export default router;
