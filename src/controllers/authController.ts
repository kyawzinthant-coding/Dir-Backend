import { NextFunction, Request, Response } from "express";
import { body, validationResult } from "express-validator";
import {
  createuser,
  getUserByEmail,
  getUserbyUsername,
  UpdateUser,
} from "../services/authService";
import { checkUserExist, checkUserifNotExist } from "../utils/auth";
import bcrypt from "bcrypt";
import { errorCode } from "../../config/errorCode";
import { createError } from "../utils/error";
import jwt from "jsonwebtoken";

export const register = [
  body("username")
    .isLength({ min: 3 })
    .withMessage("Username is required and should be at least 3 characters."),

  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters."),
  //   body("role").isIn(["admin", "user"]).withMessage("Role is invalid."),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });

    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { username, email, password } = req.body;

    try {
      const existingUser = await getUserByEmail(email);
      const existingUserWithUsername = await getUserbyUsername(username);
      checkUserExist(existingUser, "email");
      checkUserExist(existingUserWithUsername, "username");

      const salt = await bcrypt.genSalt(10);
      const hasedPassword = await bcrypt.hash(password, salt);

      const user = {
        username,
        email,
        password: hasedPassword,
        randToken: "Refresh Token",
      };

      const newUser = await createuser(user);

      const accessTokenPayload = { id: newUser.id };
      const refreshTokenPayload = { id: newUser.id, email: newUser.email };

      const accessToken = jwt.sign(
        accessTokenPayload,
        process.env.ACCESS_TOKEN_SECRET!,
        {
          expiresIn: "15m",
        }
      );

      const refreshToken = jwt.sign(
        refreshTokenPayload,
        process.env.REFRESH_TOKEN_SECRET!,
        {
          expiresIn: "30d",
        }
      );

      const userUpdatedData = {
        randToken: refreshToken,
      };

      await UpdateUser(newUser.id, userUpdatedData);

      res
        .cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 15 * 60 * 1000,
        })
        .cookie("refreshToken", refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "none",
          maxAge: 30 * 24 * 60 * 60 * 1000,
        })
        .status(201)
        .json({
          meage: "User created successfully",
          userId: newUser.id,
        });
    } catch (error) {
      console.error(error);
      return next(createError("Server error.", 500, "server_error"));
    }
  },
];

export const Login = [
  body("email").isEmail().withMessage("Please provide a valid email."),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 8 characters."),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const { email, password } = req.body;

    const user = await getUserByEmail(email);
    checkUserifNotExist(user);

    const isMatchPassword = await bcrypt.compare(password, user!.password);

    if (!isMatchPassword) {
      return next(createError("wrongPasswd", 401, errorCode.invalid));
    }

    // Authorization token
    const accessTokenPayload = { id: user!.id };
    const refreshTokenPayload = { id: user!.id, email: user!.email };

    const accessToken = jwt.sign(
      accessTokenPayload,
      process.env.ACCESS_TOKEN_SECRET as string,
      {
        expiresIn: "15m",
      }
    );

    const refreshToken = jwt.sign(
      refreshTokenPayload,
      process.env.REFRESH_TOKEN_SECRET as string,
      {
        expiresIn: "30d",
      }
    );

    const userUpdatedData = {
      randToken: refreshToken,
    };

    await UpdateUser(user!.id, userUpdatedData);

    res
      .cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 15 * 60 * 1000,
      })
      .cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        status: "successfully login",
        uerId: user!.id,
      });
  },
];
