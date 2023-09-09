import { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors";
import Joi from "joi";
import { CustomBody } from "../types/joiInterfaces";

type ValidationFunction = <T extends CustomBody>(
  data: T
) => Joi.ValidationResult<CustomBody>;

const validateBody =
  (validationFunction: ValidationFunction) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const valid = validationFunction(req.body);

    if (valid.error) {
      const messages = valid.error.details.map(
        (detail): string => detail.message
      );
      throw new BadRequestError(messages.join(" "));
    }

    req.body = valid.value;
    next();
  };

export { validateBody };
