import express from "express";
import {
  authCheck,
  login,
  logout,
  register,
} from "../../controllers/authController";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/auth-check", auth, authCheck);

export default router;
