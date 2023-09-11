import jwt from "jsonwebtoken";
import "dotenv/config";
import { IAttachCookies, ITokenUserPayload } from "../types/authInterfaces";

export const createJWT = ({ payload }: ITokenUserPayload): string => {
  const token = jwt.sign(payload, process.env.JWT_SECRET);
  return token;
};

export const isTokenValid = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET);

export const attachCookiesToResponse = ({
  res,
  user,
  refreshToken,
}: IAttachCookies) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const oneMonth = 1000 * 60 * 60 * 24 * 30;
  // const fiveSeconds = 1000 * 5;
  res.cookie("accessToken", accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie("refreshToken", refreshTokenJWT, {
    httpOnly: true,
    expires: new Date(Date.now() + oneMonth),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};

export const attachSingleCookieToResponse = ({ res, user }: IAttachCookies) => {
  const token = createJWT({ payload: { user } });
  // const oneDay = 1000 * 60 * 60 * 24;
  const fiveSeconds = 1000 * 5;
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + fiveSeconds),
    secure: process.env.NODE_ENV === "production",
    signed: true,
  });
};
