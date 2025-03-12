import express from "express";
import { auth } from "../../../middlewares/auth";
import upload, { uploadMemory } from "../../../middlewares/uploadFile";
import { uploadProfile } from "../../../controllers/api/profileController";

const router = express.Router();

router.patch(
  "/profile/upload",
  auth,
  uploadMemory.single("avatar"),
  uploadProfile
);

export default router;
