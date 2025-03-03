import { Request, Response } from "express";
import { ProductModel } from "../models/product.model";
import { UserModel } from "../models/user.model";
import { calculateDailyCalories } from "../services/calorieCalculator";

export const getPublicCalories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { height, weight, desiredWeight, age, bloodType } = req.query;

    if (!height || !weight || !desiredWeight || !age || !bloodType) {
      res.status(400).json({ message: "Missing required parameters" });
      return;
    }

    const dailyKcal = calculateDailyCalories(
      Number(weight),
      Number(height),
      Number(age),
      Number(desiredWeight)
    );

    const adjustedKcal = Math.max(dailyKcal, 1200);

    const bloodTypeIndex = Number(bloodType) - 1;
    const notRecommended = await ProductModel.find({
      groupBloodNotAllowed: { $exists: true, $ne: null },
      [`groupBloodNotAllowed.${Number(bloodType) - 1}`]: true,
    })
      .limit(4)
      .select("title calories categories");

    res.json({ dailyKcal: adjustedKcal, notRecommended });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPrivateCalories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;

    const user = await UserModel.findById(userId).lean();

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const { height, weight, desiredWeight, age, bloodType } = user;

    if (!height || !weight || !desiredWeight || !age || !bloodType) {
      res.status(400).json({ message: "User profile is incomplete" });
      return;
    }

    const dailyKcal = calculateDailyCalories(
      weight,
      height,
      age,
      desiredWeight
    );

    const notRecommended = await ProductModel.find({
      [`groupBloodNotAllowed.${Number(bloodType)}`]: true,
    })
      .limit(4)
      .select("title calories categories");

    res.json({ dailyKcal, notRecommended });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
