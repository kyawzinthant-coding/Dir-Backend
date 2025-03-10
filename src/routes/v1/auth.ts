import express from "express";
import {
  authCheck,
  EmailCheck,
  getMe,
  login,
  logout,
  register,
  UserNameCheck,
} from "../../controllers/authController";
import { auth } from "../../middlewares/auth";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/check-email", EmailCheck);
router.post("/check-username", UserNameCheck);

router.get("/auth-check", auth, authCheck);
router.get("/me", auth, getMe);

export default router;
