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

export default router;
