import { NextFunction, Response } from "express";
import xss from "xss";

type RequestWithXSSBody = { body: { [x: string]: string } };

const xssMiddleware = (
  req: RequestWithXSSBody,
  _res: Response,
  next: NextFunction
) => {
  if (req.body) {
    for (const key in req.body) {
      req.body[key] = xss(req.body[key]);
    }
  }

  next();
};

export default xssMiddleware;
