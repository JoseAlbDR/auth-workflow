import { Request, Response } from "express";
import {
  ILoginRequest,
  IResetPasswordRequest,
  IUserRequest,
  IVerifyEmailRequest,
} from "../types/authInterfaces";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import crypto from "crypto";
import { BadRequestError, UnauthenticatedError } from "../errors";
import {
  attachCookiesToResponse,
  createTokenUser,
  sendVerificationEmail,
  sendResetPasswordEmail,
} from "../utils";
import { Token } from "../models/Token";

export const registerController = async (req: IUserRequest, res: Response) => {
  const { name, email, password } = req.body;

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const user = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  const origin = "http://localhost:3000";

  // const reqOrigin = req.get("origin");
  // const protocol = req.protocol;
  // const host = req.get("host");
  // const forwardedHost = req.get("x-forwarded-host");
  // const forwardedProtocol = req.get("x-forwarded-proto");
  // console.log("origin: " + reqOrigin);
  // console.log("protocol: " + protocol);
  // console.log("host: " + host);
  // console.log("forwarded-host: " + forwardedHost);
  // console.log("forwarded-protocol: " + forwardedProtocol);

  await sendVerificationEmail({
    name: user.name,
    email: user.email,
    verificationToken: user.verificationToken,
    origin,
  });

  // send verification token back only while testing in postman

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
  });
};

export const loginController = async (req: ILoginRequest, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new UnauthenticatedError("Invalid email");
  }

  const isPasswordCorrect = await user.checkPassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid password");
  }

  if (!user.verified)
    throw new UnauthenticatedError("Please verify your email");

  const tokenUser = createTokenUser(user);

  // Create refresh token

  let refreshToken = "";

  // Check for existing token
  const existingToken = await Token.findOne({ user: user._id });

  if (existingToken) {
    const { isValid } = existingToken;
    if (!isValid) {
      throw new UnauthenticatedError("Invalid Credentials");
    }
    refreshToken = existingToken.refreshToken;
  } else {
    refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: user._id };
    await Token.create(userToken);
  }

  attachCookiesToResponse({ res, user: tokenUser, refreshToken });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logoutController = async (req: Request, res: Response) => {
  await Token.findOneAndDelete({ user: req.user.userId });

  res.cookie("refreshToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });

  res.sendStatus(StatusCodes.OK);
};

export const verifyEmailController = async (
  req: IVerifyEmailRequest,
  res: Response
) => {
  const { verificationToken, email } = req.body;

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError(`${email} is not correct`);
  if (verificationToken !== user.verificationToken)
    throw new UnauthenticatedError(`Token not valid`);

  user.isVerified = true;
  user.verified = new Date();
  user.verificationToken = "";
  await user.save();

  res.status(StatusCodes.OK).json({ msg: "Email verified" });
};

export const forgotPassword = async (req: ILoginRequest, res: Response) => {
  const { email } = req.body;

  if (!email) throw new BadRequestError("Please provide a valid email");

  const user = await User.findOne({ email });

  if (user) {
    user.passwordToken = crypto.randomBytes(70).toString("hex");
    // send email
    const origin = "http://localhost:3000";
    await sendResetPasswordEmail({
      name: user.name,
      email: user.email,
      verificationToken: user.passwordToken,
      origin,
    });

    const tenMinutes = 1000 * 60 * 10;
    user.passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);
    await user.save();
  }

  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your email for reset password link." });
};

export const resetPassword = async (
  req: IResetPasswordRequest,
  res: Response
) => {
  const { token, email, password } = req.body;

  if (!token || !email || !password) {
    throw new BadRequestError("Please provide all values");
  }

  const user = await User.findOne({ email });

  if (user) {
    const currentDate = new Date();

    if (
      user.passwordToken === token &&
      user.passwordTokenExpirationDate &&
      user.passwordTokenExpirationDate > currentDate
    ) {
      user.password = password;
      user.passwordToken = null;
      user.passwordTokenExpirationDate = null;
      await user.save();
    }
  }

  res.status(StatusCodes.OK).send("reset password");
};
