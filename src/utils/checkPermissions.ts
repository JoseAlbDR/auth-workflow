import mongoose from "mongoose";
import { ITokenUser } from "../types/authInterfaces";
import { UnauthorizedError } from "../errors";

export const checkPermissions = (
  requestUser: ITokenUser,
  resourceUserId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
) => {
  // console.log(requestUser);
  // console.log(resourceUserId);
  // console.log(typeof resourceUserId);

  if (requestUser.role === "admin") return;
  if (resourceUserId && typeof resourceUserId === "object") {
    const userId = resourceUserId as mongoose.Types.ObjectId;
    if (requestUser.userId === userId.toString()) return;
  }

  throw new UnauthorizedError("Not authorized to access this route");
};
