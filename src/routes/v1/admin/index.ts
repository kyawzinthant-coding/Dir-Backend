import express from "express";
import { getAllUser } from "../../../controllers/admin/userController";
import { uploadMemory } from "../../../middlewares/uploadFile";
import {
  createProvider,
  deleteProvider,
  updateProvider,
} from "../../../controllers/admin/providerController";

const router = express.Router();

router.get("/users", getAllUser);

// CRUD for Providers
router.post("/providers", uploadMemory.single("image"), createProvider);
router.patch("/providers", uploadMemory.single("image"), updateProvider);
router.delete("/providers", deleteProvider);

export default router;
