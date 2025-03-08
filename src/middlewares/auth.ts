import { Request, Response, NextFunction } from "express";
import { errorCode } from "../../config/errorCode";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error";
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

  if (!accessToken) {
    return next(
      createError("Access Token has expired", 401, errorCode.accessTokenExpired)
    );
  }

  //verify acccess token

  let decoded;
  try {
    decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as {
      id: string | null;
    };
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return next(
        createError(
          "Access Token has expired",
          401,
          errorCode.accessTokenExpired
        )
      );
    }
  }

  req.userId = decoded?.id;

  next();
};
