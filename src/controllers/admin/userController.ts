import { Request, Response } from "express";

interface CustomRequest extends Request {
  userId?: string;
  user?: any;
}

export const getAllUser = (req: CustomRequest, res: Response) => {
  res.status(200).json({
    message: " All user",
    data: req.user,
    curentUserRole: req.user.role,
  });
};
