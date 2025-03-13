import express from "express";
import { auth } from "../../../middlewares/auth";
import { uploadMemory } from "../../../middlewares/uploadFile";
import { uploadProfile } from "../../../controllers/api/profileController";
import { getProvider } from "../../../controllers/api/providerController";

const router = express.Router();

router.patch(
  "/profile/upload",
  auth,
  uploadMemory.single("avatar"),
  uploadProfile
);

router.get("/providers/:id", getProvider);

export default router;
