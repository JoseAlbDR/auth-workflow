import { Request, Response } from "express";
import { ILoginRequest, IUserRequest } from "../types/authInterfaces";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import { attachCookiesToResponse } from "../utils";
import { UnauthenticatedError } from "../errors";
import { createTokenUser } from "../utils";

export const registerController = async (req: IUserRequest, res: Response) => {
  const { name, email, password } = req.body;

  // first registered user is an admin
  const isFirstAccount = (await User.countDocuments({})) === 0;
  const role = isFirstAccount ? "admin" : "user";

  const newUser = await User.create({ name, email, password, role });

  const tokenUser = createTokenUser(newUser);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
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

  const tokenUser = createTokenUser(user);

  attachCookiesToResponse({ res, user: tokenUser });

  res.status(StatusCodes.OK).json({ user: tokenUser });
};

export const logoutController = (_req: Request, res: Response) => {
  res.cookie("token", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.sendStatus(StatusCodes.OK);
};
