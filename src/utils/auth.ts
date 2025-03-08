import { errorCode } from "./../../config/errorCode";

export const checkUserExist = (user: any, field: string) => {
  if (user) {
    const error: any = new Error(`This ${field} has already been registered`);
    error.status = 400;
    error.code = errorCode.userExist;
    throw error;
  }
};

export const checkUserifNotExist = (user: any) => {
  if (!user) {
    const error: any = new Error("This email has not registered.");
    error.status = 401;
    error.code = errorCode.unauthenticated;
    throw error;
  }
};
