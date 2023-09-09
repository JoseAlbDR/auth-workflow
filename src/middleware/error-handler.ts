import { NextFunction, Request, Response } from "express";
import CustomAPIError from "../errors/custom-error";
import { StatusCodes } from "http-status-codes";
import { MongoError } from "mongodb";
import {
  ICastMongoError,
  IDuplicateMongoError,
  IRequiredMongoError,
} from "../types/errorInterfaces";
import { Error } from "mongoose";

const errorHandlerMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.log(err);
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }

  if (err.name === "ValidationError") {
    const { errors } = err as IRequiredMongoError;
    const msg = Object.values(errors)
      .map((item) => item.message)
      .join(", ");
    return res.status(StatusCodes.BAD_REQUEST).json({ msg });
  }

  if (err.name === "CastError") {
    const { value } = err as ICastMongoError;
    const msg = `No item found with id: ${value}, ID passed in must be a string of 12 bytes or a string of 24 hex characters or an integer`;
    return res.status(StatusCodes.NOT_FOUND).json({ msg });
  }

  if (err instanceof MongoError && err.code === 11000) {
    const msg = `Duplicate value entered for ${Object.keys(
      (err as IDuplicateMongoError).keyValue
    ).join(", ")} please enter a valid value`;
    return res.status(StatusCodes.BAD_REQUEST).json({ msg });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
};

export default errorHandlerMiddleware;
