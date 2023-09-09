import { Request } from "express";

export interface ISingleUserRequest extends Request {
  params: {
    id: string;
  };
}

export interface IUpdatePassword {
  oldPassword: string;
  newPassword: string;
}

export interface IUpdateUser {
  name: string;
  email: string;
}

export interface IUpdatePasswordRequest extends Request {
  body: IUpdatePassword;
}

export interface IUpdateUserRequest extends Request {
  body: IUpdateUser;
}
