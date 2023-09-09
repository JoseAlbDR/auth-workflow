import jwt from "jsonwebtoken";
import "dotenv/config";
import { IAttachCookies, ITokenUserPayload } from "../types/authInterfaces";

export const createJWT = ({ payload }: ITokenUserPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
  return token;
};

export const isTokenValid = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const attachCookiesToResponse = ({ res, user }: IAttachCookies) => {
  const token = createJWT({ payload: user });
  const oneDay = 1000 * 60 * 60 * 24;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + oneDay),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
