import express from "express";
import {
  forgotPassword,
  loginController,
  logoutController,
  registerController,
  resetPassword,
  verifyEmailController,
} from "../controllers/authController";
import { validateBody } from "../middleware/joi-validation";
import { validateLogin, validateVerifyEmail } from "../utils/joiValidation";
import { authenticateUser } from "../middleware/authentication";

const router = express.Router();

router.post("/login", validateBody(validateLogin), loginController);
router.post("/register", registerController);
router.post(
  "/verify-email",
  validateBody(validateVerifyEmail),
  verifyEmailController
);
router.delete("/logout", authenticateUser, logoutController);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
