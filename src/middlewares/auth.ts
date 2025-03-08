import { Request, Response, NextFunction } from "express";
import { errorCode } from "../../config/errorCode";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error";
import { getUserById, UpdateUser } from "../services/authService";
import { generateTokens } from "../utils/token";
import { setAuthCookies } from "../utils/cookies";
interface CustomRequest extends Request {
  userId?: string | null;
}
export const auth = (req: CustomRequest, res: Response, next: NextFunction) => {
  const accessToken = req.cookies ? req.cookies.accessToken : null;
  const refreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (!refreshToken) {
    return next(
      createError(
        "You are not an authenticated user",
        401,
        errorCode.unauthenticated
      )
    );
  }

  const generateNewTokens = async () => {
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as {
        id: string;
        email: string;
      };
    } catch (error) {
      return next(
        createError("Refresh Token has expired", 401, errorCode.unauthenticated)
      );
    }

    const user = await getUserById(decoded.id);

    if (!user) {
      return next(
        createError(
          "This account has not registered!.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user.email !== decoded.email) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    if (user!.randToken !== refreshToken) {
      return next(
        createError(
          "You are not an authenticated user.",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user!
    );
    await UpdateUser(user!.id, { randToken: newRefreshToken });
    setAuthCookies(res, accessToken, newRefreshToken);

    req.userId = user.id;
    next();
  };

  if (!accessToken) {
    generateNewTokens();
    // return next(
    //   createError("Access Token has expired", 401, errorCode.accessTokenExpired)
    // );
  } else {
    let decoded;
    try {
      decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
        id: string | null;
      };
      req.userId = decoded?.id;
      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        generateNewTokens();
      } else {
        return next(
          createError("Access Token is invalid", 400, errorCode.attack)
        );
      }
    }
  }

  //verify acccess token

  //verify acccess token
};
