import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, IUserModel } from "../types/authInterfaces";
import validator from "validator";

const UserSchema = new mongoose.Schema<IUser, IUserModel, IUserMethods>({
  name: {
    type: String,
    required: [true, "User Name is required"],
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: [true, "User Email is required"],
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: "Please provide valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "User Password is required"],
    minlength: 6,
  },
  role: {
    type: String,
    enum: {
      values: ["admin", "user"],
      message: "Role can only be admin or user",
    },
    default: "user",
  },
});

UserSchema.pre("save", async function () {
  // UpdateUser with User.findOne() and User.save()
  // console.log(this.modifiedPaths());
  // console.log(this.isModified("password"));
  // if (!this.isModified("password")) return
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(this.password, salt);
  this.password = hashedPass;
});

UserSchema.methods.checkPassword = async function (
  this: IUser,
  candidatePassword: string
) {
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

export const User = mongoose.model<IUser, IUserModel>("User", UserSchema);
