import express from "express";
import {
  authenticateUser,
  authorizePermissions,
} from "../middleware/authentication";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} from "../controllers/userController";
import { validateBody } from "../middleware/joi-validation";
import {
  validateUpdatePassword,
  validateUpdateUser,
} from "../utils/joiValidation";

const router = express.Router();

router
  .route("/")
  .get(authenticateUser, authorizePermissions("admin"), getAllUsers);

router.route("/showMe").get(authenticateUser, showCurrentUser);

router
  .route("/updateUser")
  .patch(authenticateUser, validateBody(validateUpdateUser), updateUser);

router
  .route("/updateUserPassword")
  .patch(
    authenticateUser,
    validateBody(validateUpdatePassword),
    updateUserPassword
  );

router.route("/:id").get(authenticateUser, getSingleUser);

export default router;
