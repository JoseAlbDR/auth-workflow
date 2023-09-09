import mongoose, { Model } from "mongoose";
import { Response } from "express";

export type IUserModel = Model<IUser, { [_ in never]: never }, IUserMethods>;

export interface IUserMethods {
  checkPassword(candidatePassword: string): Promise<boolean>;
}

export interface ITokenUser {
  userId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  name: string;
  role: Role;
}

export interface ITokenUserPayload {
  payload: ITokenUser;
}

export interface IAttachCookies {
  res: Response;
  user: ITokenUser;
}

export interface IUser {
  _id: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export type Role = "admin" | "user";

export interface IUserRequest {
  body: IUser;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginRequest {
  body: ILogin;
}
