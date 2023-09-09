import { Request, Response } from "express";
import {
  ILoginRequest,
  IUserRequest,
  IVerifyEmailRequest,
} from "../types/authInterfaces";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
// import { attachCookiesToResponse } from "../utils";
import crypto from "crypto";
import { UnauthenticatedError } from "../errors";
// import { createTokenUser } from "../utils";

export const registerController = async (req: IUserRequest, res: Response) => {
  const { name, email, password } = req.body;

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const verificationToken = crypto.randomBytes(40).toString("hex");

  const newUser = await User.create({
    name,
    email,
    password,
    role,
    verificationToken,
  });

  // send verification token back only while testing in postman

  res.status(StatusCodes.CREATED).json({
    msg: "Success! Please check your email to verify account",
    verificationToken: newUser.verificationToken,
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

  res.status(StatusCodes.OK).json({ user });
};

export const logoutController = (_req: Request, res: Response) => {
  res.cookie("token", "logout", {
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
