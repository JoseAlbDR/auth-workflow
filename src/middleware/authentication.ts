import { Request, Response, NextFunction } from "express";
import { UnauthorizedError, UnauthenticatedError } from "../errors";
import { isTokenValid } from "../utils";
import { ITokenUser, Role } from "../types/authInterfaces";
const authenticateUser = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { token } = req.signedCookies as Record<string, string>;

  if (!token) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  try {
    const payload = isTokenValid(token) as ITokenUser;
    const { userId, name, role } = payload;
    req.user = { userId, name, role };
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
