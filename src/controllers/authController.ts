import jwt from "jsonwebtoken";
// controllers/authController.ts
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import {
  createuser,
  getUserByEmail,
  getUserById,
  getUserbyUsername,
  UpdateUser,
} from "../services/authService";
import { checkUserExist, checkUserifNotExist } from "../utils/auth";
import { generateTokens } from "../utils/token";
import { setAuthCookies } from "../utils/cookies";
import bcrypt from "bcrypt";
import { createError } from "../utils/error";
import { loginValidation, registerValidation } from "../middlewares/validation";
import { errorCode } from "../../config/errorCode";
import { generateToken } from "../utils/generateToken";

export const register = [
  ...registerValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { username, email, password } = req.body;

    const [existingUser, existingUserWithUsername] = await Promise.all([
      getUserByEmail(email),
      getUserbyUsername(username),
    ]);

    checkUserExist(existingUser, "email");
    checkUserExist(existingUserWithUsername, "username");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createuser({
      username,
      email,
      password: hashedPassword,
      randToken: generateToken(),
    });
    const { accessToken, refreshToken } = generateTokens(newUser);

    await UpdateUser(newUser.id, { randToken: refreshToken });
    setAuthCookies(res, accessToken, refreshToken);

    res
      .status(201)
      .json({ message: "User created successfully", userId: newUser.id });
  },
];

export const login = [
  ...loginValidation,
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0)
      return next(createError(errors[0].msg, 400, "invalid"));

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    checkUserifNotExist(user);

    const isMatch = await bcrypt.compare(password, user!.password);
    if (!isMatch)
      return next(createError("Invalid email or password.", 401, "invalid"));

    const { accessToken, refreshToken } = generateTokens(user!);
    await UpdateUser(user!.id, { randToken: refreshToken });
    setAuthCookies(res, accessToken, refreshToken);

    res
      .status(200)
      .json({ message: "Successfully logged in", userId: user!.id });
  },
];

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user!.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  let decoded;
  try {
    decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
      id: string;
      email: string;
    };
  } catch (err) {
    return next(
      createError(
        "You are not an authenticated user!.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const user = await getUserById(decoded.id);
  checkUserifNotExist(user);

  if (user?.email != decoded.email) {
    return next(
      createError(
        "You are not an authenticated user!.",
        401,
        errorCode.unauthenticated
      )
    );
  }

  await UpdateUser(user!.id, { randToken: generateToken() });
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Successfully logged out" });
};

interface CustomRequest extends Request {
  userId?: string;
}

export const authCheck = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.userId;
  const user = await getUserById(userId!);
  checkUserifNotExist(user);

  res.status(200).json({
    message: "You are authenticated.",
    userId: user?.id,
    username: user?.username,
    email: user?.email,
  });
};
