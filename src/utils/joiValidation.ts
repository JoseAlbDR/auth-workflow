// import Joi from "joi";

// export const validateJobFilters = (query: unknown) => {
//   const querySchema = Joi.object<IJobQuery>({
//     search: Joi.string().label("Name"),
//     status: Joi.string(),
//     jobType: Joi.string(),
//     sort: Joi.string(),
//     page: Joi.number(),
//     limit: Joi.number(),
//   });
//   return querySchema.validate(query, {
//     errors: { wrap: { label: false } },
//     messages: {
//       "object.unknown": "Unknown parameter: {#key}",
//       "any.invalid": "Not Allowed Values: {#invalidValues}.",
//       "string.pattern.base": "Invalid syntax for numeric condition: {#value}",
//     },
//   });
// };

import Joi from "joi";
import { ILogin } from "../types/authInterfaces";
import { IUpdatePassword, IUpdateUser } from "../types/userInterfaces";

export const validateLogin = (query: unknown) => {
  const loginSchema = Joi.object<ILogin>({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });

  return loginSchema.validate(query, {
    errors: { wrap: { label: false } },
    messages: {
      "object.unknown": "Unknown parameter: {#key}",
      "any.required": "Please provide {#key}",
    },
  });
};

export const validateUpdatePassword = (query: unknown) => {
  const updatePasswordSchema = Joi.object<IUpdatePassword>({
    oldPassword: Joi.string().required().label("Old Password"),
    newPassword: Joi.string().required().label("New Password"),
  });

  return updatePasswordSchema.validate(query, {
    errors: { wrap: { label: false } },
    messages: {
      "object.unknown": "Unknown parameter: {#key}",
      "any.required": "Please provide {#key}",
    },
  });
};

export const validateUpdateUser = (query: unknown) => {
  const updateUserSchema = Joi.object<IUpdateUser>({
    name: Joi.string().optional(),
    email: Joi.string().email().optional().label("Email"),
  });

  return updateUserSchema.validate(query, {
    errors: { wrap: { label: false } },
    messages: {
      "object.unknown": "Unknown parameter: {#key}",
      "any.required": "Please provide {#key}",
    },
  });
};
