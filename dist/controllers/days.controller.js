"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveDailyCalories = exports.getDayInfo = exports.removeProductFromDay = exports.addProductToDay = void 0;
const models_1 = require("../models");
const calorieCalculator_1 = require("../services/calorieCalculator");
const addProductToDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { date, productId, quantity } = req.body;
        let day = yield models_1.DayModel.findOne({ user: userId, date });
        if (!day) {
            day = new models_1.DayModel({ user: userId, date, consumedProducts: [] });
        }
        day.consumedProducts.push({ product: productId, quantity });
        yield day.save();
        const totalKcal = yield recalculateCalories(userId, date);
        res.json({ day, totalKcal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addProductToDay = addProductToDay;
const removeProductFromDay = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { date, productId } = req.body;
        let day = yield models_1.DayModel.findOne({ user: userId, date });
        if (!day) {
            res.status(404).json({ message: "Day not found" });
            return;
        }
        day.consumedProducts = day.consumedProducts.filter((cp) => cp.product.toString() !== productId);
        yield day.save();
        const totalKcal = yield recalculateCalories(userId, date);
        res.json({ day, totalKcal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeProductFromDay = removeProductFromDay;
const getDayInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const date = req.params.date;
        let day = yield models_1.DayModel.findOne({ user: userId, date }).populate("consumedProducts.product");
        if (!day) {
            day = new models_1.DayModel({
                user: userId,
                date,
                consumedProducts: [],
                dailyKcal: 0,
                notRecommended: [],
            });
            yield day.save();
            res.json({ day, totalKcal: 0 });
        }
        const totalKcal = yield recalculateCalories(userId, date);
        res.json({ day, totalKcal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDayInfo = getDayInfo;
const saveDailyCalories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { height, weight, desiredWeight, age, bloodType } = req.body;
        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
        if (!height || !weight || !desiredWeight || !age || !bloodType) {
            res.status(400).json({ message: "Missing required parameters" });
            return;
        }
        const dailyKcal = (0, calorieCalculator_1.calculateDailyCalories)(Number(weight), Number(height), Number(age), Number(desiredWeight));
        const adjustedKcal = Math.max(dailyKcal, 1200);
        const notRecommended = yield models_1.ProductModel.find({
            [`groupBloodNotAllowed.${Number(bloodType) - 1}`]: true,
        })
            .limit(4)
            .select("title calories categories");
        let day = yield models_1.DayModel.findOne({ user: userId, date: today });
        if (!day) {
            day = new models_1.DayModel({
                user: userId,
                date: today,
                dailyKcal: adjustedKcal,
                notRecommended,
                consumedProducts: [],
            });
        }
        else {
            day.dailyKcal = adjustedKcal;
            day.notRecommended = notRecommended;
        }
        yield day.save();
        res.json({ dailyKcal: adjustedKcal, notRecommended });
    }
    catch (error) {
        console.error("🔥 Error saving daily calories:", error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.saveDailyCalories = saveDailyCalories;
const recalculateCalories = (userId, date) => __awaiter(void 0, void 0, void 0, function* () {
    const day = yield models_1.DayModel.findOne({ user: userId, date }).populate("consumedProducts.product");
    if (!day)
        return 0;
    let totalKcal = 0;
    for (const cp of day.consumedProducts) {
        const productDoc = cp.product;
        if (!productDoc)
            continue;
        const kcal = (cp.quantity / productDoc.weight) * productDoc.calories;
        totalKcal += kcal;
    }
    return totalKcal;
});
