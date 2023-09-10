import { Request, Response } from "express";
import { User } from "../models/User";
import { StatusCodes } from "http-status-codes";
import {
  ISingleUserRequest,
  IUpdatePasswordRequest,
  IUpdateUserRequest,
} from "../types/userInterfaces";
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from "../errors";
import { createTokenUser } from "../utils";
import { attachCookiesToResponse, checkPermissions } from "../utils";
import crypto from "crypto";
import { Token } from "../models/Token";

export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await User.find({ role: "user" }).select("-password");
  res.status(StatusCodes.OK).json({ users });
};

export const getSingleUser = async (req: ISingleUserRequest, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id).select("-password");

  if (!user) {
    throw new NotFoundError("User not found");
  }

  checkPermissions(req.user, user._id);
  res.status(StatusCodes.OK).json({ user });
};

export const showCurrentUser = async (req: Request, res: Response) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};

export const updateUser = async (req: IUpdateUserRequest, res: Response) => {
  const updatedUser = await User.findOneAndUpdate(
    { _id: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (updatedUser) {
    const refreshToken = crypto.randomBytes(40).toString("hex");
    const userAgent = req.headers["user-agent"];
    const ip = req.ip;
    const userToken = { refreshToken, ip, userAgent, user: req.user.userId };
    const tokenUser = createTokenUser(updatedUser);

    await Token.findOneAndUpdate({ user: userToken.user }, { userToken });

    attachCookiesToResponse({ res, user: tokenUser, refreshToken });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  }
};

export const updateUserPassword = async (
  req: IUpdatePasswordRequest,
  res: Response
) => {
  const { oldPassword, newPassword } = req.body;

  if (oldPassword === newPassword)
    throw new BadRequestError("Password can not be the same");

  const user = await User.findById(req.user.userId);

  if (user) {
    const isPasswordValid = await user.checkPassword(oldPassword);

    if (!isPasswordValid) throw new UnauthenticatedError("Invalid password");

    user.password = newPassword;
    await user.save();
    res.status(StatusCodes.OK).json({ msg: "Password updated successfully" });
  }
};
