import { ILogin } from "./authInterfaces";
import { IUpdatePassword, IUpdateUser } from "./userInterfaces";
export type CustomBody = ILogin | IUpdatePassword | IUpdateUser;
