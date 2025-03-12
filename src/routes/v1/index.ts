import express from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import apiRoutes from "./api";
import { auth } from "../../middlewares/auth";
import { authorize } from "../../middlewares/authorise";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/admin", auth, authorize(true, "ADMIN"), adminRoutes);
router.use("/api/v1/user", auth, apiRoutes);

export default router;
