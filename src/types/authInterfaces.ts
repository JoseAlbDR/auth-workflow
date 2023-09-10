import mongoose, { Model } from "mongoose";
import { Request, Response } from "express";

export type IUserModel = Model<IUser, { [_ in never]: never }, IUserMethods>;

export interface IUserMethods {
  checkPassword(candidatePassword: string): Promise<boolean>;
}

export interface ITokenUser {
  userId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  name: string;
  role: Role;
}

export interface IPayload {
  user: ITokenUser;
  refreshToken?: string;
}

export interface ITokenUserPayload {
  payload: IPayload;
}

export interface IAttachCookies {
  res: Response;
  user: ITokenUser;
  refreshToken: string;
}

export interface IUser {
  _id: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  name: string;
  email: string;
  password: string;
  role: Role;
  verificationToken: string;
  isVerified: boolean;
  verified: Date;
}

export interface IVerifyEmail {
  verificationToken: string;
  email: string;
}

export interface IVerifyEmailRequest extends Request {
  body: IVerifyEmail;
}

export type Role = "admin" | "user";

export interface IUserRequest extends Request {
  body: IUser;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginRequest extends Request {
  body: ILogin;
}
