import { param, query, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import {
  getProviderById,
  getProviderList,
} from "../../services/ProviderService";
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

export const getProviderByPagination = [
  query("page", "Page number must be a positive integer")
    .isInt({ gt: 0 })
    .trim()
    .notEmpty()
    .matches(/^[0-9]+$/)
    .optional(),
  query("limit", "Limit must be unsigned integer.")
    .trim()
    .isInt({ gt: 0 })
    .notEmpty()
    .matches(/^[0-9]+$/)
    .optional(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const page = req.query.page || 1;
    const limit = req.query.limit || 5;

    const skip = (Number(page) - 1) * Number(limit);
    const options = {
      skip,
      take: Number(limit) + 1,
      select: {
        id: true,
        name: true,
        image: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    };

    const providers = await getProviderList(options);

    const hasNextPage = providers.length > +limit; // 6 > 5
    let nextPage = null;
    const previousPage = +page != 1 ? +page - 1 : null;

    if (hasNextPage) {
      providers.pop();
      nextPage = +page + 1;
    }

    res.status(200).json({
      message: "Providers list",
      providers,
      currentPage: page,
      hastNextPage: hasNextPage,
      nextPage,
      previousPage,
    });
  },
];
