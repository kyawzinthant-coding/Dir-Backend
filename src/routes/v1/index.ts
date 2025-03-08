import express from "express";
import authRoutes from "./auth";
import userRoutes from "./admin/user";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.use("/api/v1/auth", authRoutes);
router.use("/api/v1/admin", auth, userRoutes);

export default router;
