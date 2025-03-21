import { body, param, validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";
import { createError } from "../../utils/error";
import { errorCode } from "../../../config/errorCode";
import { checkModelIfExist } from "../../utils/check";
import {
  getOneSerie,
  getOneSeriesWithRelationShip,
  getSeriesByProviderService,
} from "../../services/seriesService";
import { getProviderById } from "../../services/ProviderService";

export const getSerie = [
  param("id", "Series id is required").notEmpty(),

  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    // If validation error occurs
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const serieId = req.params.id;
    const serie = await getOneSeriesWithRelationShip(serieId);
    checkModelIfExist(serie);

    res.status(200).json({
      message: "Series details",
      serie,
    });
  },
];

export const getSeriesByProvider = [
  param("providerId", "Provider id is required").notEmpty(),
  async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req).array({ onlyFirstError: true });
    if (errors.length > 0) {
      return next(createError(errors[0].msg, 400, errorCode.invalid));
    }

    const providerId = req.params.providerId;
    const provider = await getProviderById(providerId);
    const series = await getSeriesByProviderService(providerId);
    checkModelIfExist(series);

    res.status(200).json({
      message: "Series details",
      provider,
      series,
    });
  },
];

export const getProviderByPagination = async () => {};
