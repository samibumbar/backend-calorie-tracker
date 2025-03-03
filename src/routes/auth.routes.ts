import { Router } from "express";
import {
  registerController,
  loginController,
  logoutController,
  refreshController,
} from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/register", registerController);

router.post("/login", loginController);

router.post("/logout", authMiddleware, logoutController);

router.post("/refresh", refreshController);

export const authRoutes = router;
