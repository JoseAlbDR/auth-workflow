import express from "express";
import {
  loginController,
  logoutController,
  registerController,
} from "../controllers/authController";
import { validateBody } from "../middleware/joi-validation";
import { validateLogin } from "../utils/joiValidation";

const router = express.Router();

router.post("/login", validateBody(validateLogin), loginController);
router.post("/register", registerController);
router.get("/logout", logoutController);

export default router;
