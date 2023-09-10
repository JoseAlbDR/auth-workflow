import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, UnauthenticatedError } from "../errors";
import { attachCookiesToResponse, isTokenValid } from "../utils";
import { IPayload, Role } from "../types/authInterfaces";
import { Token } from "../models/Token";
const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken, accessToken } = req.signedCookies as Record<
    string,
    string
  >;

  try {
    if (accessToken) {
      const payload = isTokenValid(accessToken) as IPayload;
      req.user = payload.user;
      return next();
    }

    const payload = isTokenValid(refreshToken) as IPayload;
    const existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });

    if (!existingToken || !existingToken?.isValid) {
      throw new UnauthenticatedError("Authentication Invalid");
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    console.log(error);
    throw new UnauthenticatedError("Unauthenticated");
  }
};

const authorizePermissions = (...roles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { role } = req.user;
    if (!roles.includes(role))
      throw new UnauthorizedError("Unauthorized to view this route");
    next();
  };
};

export { authenticateUser, authorizePermissions };
