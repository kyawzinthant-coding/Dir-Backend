import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/authService";
import { createError } from "../utils/error";
import { errorCode } from "../../config/errorCode";

interface CustomRequest extends Request {
  userId?: string;
  user?: any;
}
export const authorize = (permission: boolean, ...roles: string[]) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    const userId = req.userId;
    const user = await getUserById(userId!);

    if (!user) {
      return next(
        createError(
          "This account has not registered!",
          401,
          errorCode.unauthenticated
        )
      );
    }

    const result = roles.includes(user.role);

    if (permission && !result) {
      const err: any = new Error("This action is not allowed.");
      err.status = 403;
      err.code = errorCode.unauthorised;
      return next(err);
    }

    if (!permission && result) {
      const err: any = new Error("This action is not allowed.");
      err.status = 403;
      err.code = errorCode.unauthorised;
      return next(err);
    }

    req.user = user;
    next();
  };
};
