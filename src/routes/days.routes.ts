import { Router } from "express";
import {
  saveDailyCalories,
  getDayInfo,
  addProductToDay,
  removeProductFromDay,
  getDaySummary,
} from "../controllers/days.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();
router.post("/save", authMiddleware, saveDailyCalories);

router.get("/:date", authMiddleware, getDayInfo);
router.post("/add", authMiddleware, addProductToDay);
router.delete("/remove", authMiddleware, removeProductFromDay);
router.get("/:date/summary", authMiddleware, getDaySummary);

export const daysRoutes = router;
