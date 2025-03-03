import { Router } from "express";
import { getPublicCalories, getPrivateCalories } from "../controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/public", getPublicCalories);

router.get("/private", authMiddleware, getPrivateCalories);

export const caloriesRoutes = router;
