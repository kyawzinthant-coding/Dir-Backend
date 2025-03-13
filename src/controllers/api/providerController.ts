import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { getProviderById } from "../../services/ProviderService";
import { checkModelIfExist } from "../../utils/check";

export const getProvider = [
  param("id", "Provider id is required").notEmpty(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const providerId = req.params.id;
    const provider = await getProviderById(providerId);
    checkModelIfExist(provider);

    res.status(200).json({
      message: "Provider details",
      provider,
    });
  },
];

export const getProviderByPagination = async () => {};
