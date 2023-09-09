import express from "express";
import {
  loginController,
  logoutController,
  registerController,
  verifyEmailController,
} from "../controllers/authController";
import { validateBody } from "../middleware/joi-validation";
import { validateLogin, validateVerifyEmail } from "../utils/joiValidation";

const router = express.Router();

router.post("/login", validateBody(validateLogin), loginController);
router.post("/register", registerController);
router.post(
  "/verifyEmail",
  validateBody(validateVerifyEmail),
  verifyEmailController
);
router.get("/logout", logoutController);

export default router;
