import { ITokenUser, IUser } from "../types/authInterfaces";

export const createTokenUser = (user: IUser): ITokenUser => {
  return { name: user.name, userId: user._id, role: user.role };
};
