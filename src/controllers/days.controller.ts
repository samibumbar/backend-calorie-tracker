import { Request, Response } from "express";
import { DayModel, ProductModel } from "../models";
import { calculateDailyCalories } from "../services/calorieCalculator";

export const addProductToDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { date, productId, quantity } = req.body;

    let day = await DayModel.findOne({ user: userId, date });
    if (!day) {
      day = new DayModel({ user: userId, date, consumedProducts: [] });
    }

    day.consumedProducts.push({ product: productId, quantity });
    await day.save();

    const totalKcal = await recalculateCalories(userId, date);

    res.json({ day, totalKcal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProductFromDay = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { date, productId } = req.body;

    let day = await DayModel.findOne({ user: userId, date });
    if (!day) {
      res.status(404).json({ message: "Day not found" });
      return;
    }

    day.consumedProducts = day.consumedProducts.filter(
      (cp) => cp.product.toString() !== productId
    );
    await day.save();

    const totalKcal = await recalculateCalories(userId, date);

    res.json({ day, totalKcal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDayInfo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const date = req.params.date;

    let day = await DayModel.findOne({ user: userId, date }).populate(
      "consumedProducts.product"
    );

    if (!day) {
      day = new DayModel({
        user: userId,
        date,
        consumedProducts: [],
        dailyKcal: 0,
        notRecommended: [],
      });
      await day.save();
      res.json({ day, totalKcal: 0 });
    }

    const totalKcal = await recalculateCalories(userId, date);

    res.json({ day, totalKcal });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDaySummary = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const date = req.params.date;

    const day = await DayModel.findOne({ user: userId, date }).populate(
      "consumedProducts.product"
    );

    if (!day) {
      res.status(404).json({ message: "No data found for this day" });
      return;
    }

    let totalCaloriesConsumed = 0;
    day.consumedProducts.forEach((cp) => {
      const product = cp.product as any;
      if (product) {
        totalCaloriesConsumed +=
          (cp.quantity / product.weight) * product.calories;
      }
    });

    const remainingCalories = day.dailyKcal - totalCaloriesConsumed;
    const percentageOfNormal =
      day.dailyKcal > 0
        ? Math.round((totalCaloriesConsumed / day.dailyKcal) * 100)
        : 0;

    res.json({
      dailyKcal: day.dailyKcal,
      totalCaloriesConsumed,
      remainingCalories,
      percentageOfNormal,
    });
  } catch (error: any) {
    console.error("🔥 Error in getDaySummary:", error);
    res.status(500).json({ message: error.message });
  }
};

export const saveDailyCalories = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { height, weight, desiredWeight, age, bloodType } = req.body;
    const today = new Date().toISOString().split("T")[0];

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

    const notRecommended = await ProductModel.find({
      [`groupBloodNotAllowed.${Number(bloodType) - 1}`]: true,
    })
      .limit(4)
      .select("title calories categories");

    let day = await DayModel.findOne({ user: userId, date: today });

    if (!day) {
      day = new DayModel({
        user: userId,
        date: today,
        dailyKcal: adjustedKcal,
        notRecommended,
        consumedProducts: [],
      });
    } else {
      day.dailyKcal = adjustedKcal;
      day.notRecommended = notRecommended;
    }

    await day.save();

    res.json({ dailyKcal: adjustedKcal, notRecommended });
  } catch (error: any) {
    console.error("🔥 Error saving daily calories:", error.message);
    res.status(500).json({ message: error.message });
  }
};

const recalculateCalories = async (
  userId: string,
  date: string
): Promise<number> => {
  const day = await DayModel.findOne({ user: userId, date }).populate(
    "consumedProducts.product"
  );

  if (!day) return 0;

  let totalKcal = 0;
  for (const cp of day.consumedProducts) {
    const productDoc: any = cp.product;
    if (!productDoc) continue;

    const kcal = (cp.quantity / productDoc.weight) * productDoc.calories;
    totalKcal += kcal;
  }

  return totalKcal;
};
