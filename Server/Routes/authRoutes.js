import express from "express";

import {
  registerController,
  resetPasswordController,
} from "../Controllers/authController.js";
import { loginController } from "../Controllers/authController.js";
import { testController } from "../Controllers/authController.js";
import { requireSignIn } from "../Middlewares/authMiddleware.js";

const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);
export default router;

// LOGIN || POST
router.post("/login", loginController);

// RESET PASSWORD || POST
router.post("/resetPassword", resetPasswordController);

// test requireSignIn middleware
router.post("/test", requireSignIn, testController);
