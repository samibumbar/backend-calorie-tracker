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
exports.getPrivateCalories = exports.getPublicCalories = void 0;
const product_model_1 = require("../models/product.model");
const user_model_1 = require("../models/user.model");
const calorieCalculator_1 = require("../services/calorieCalculator");
const getPublicCalories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { height, weight, desiredWeight, age, bloodType } = req.query;
        if (!height || !weight || !desiredWeight || !age || !bloodType) {
            res.status(400).json({ message: "Missing required parameters" });
            return;
        }
        const dailyKcal = (0, calorieCalculator_1.calculateDailyCalories)(Number(weight), Number(height), Number(age), Number(desiredWeight));
        const adjustedKcal = Math.max(dailyKcal, 1200);
        const bloodTypeIndex = Number(bloodType) - 1;
        const notRecommended = yield product_model_1.ProductModel.find({
            groupBloodNotAllowed: { $exists: true, $ne: null },
            [`groupBloodNotAllowed.${Number(bloodType) - 1}`]: true,
        })
            .limit(4)
            .select("title calories categories");
        res.json({ dailyKcal: adjustedKcal, notRecommended });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPublicCalories = getPublicCalories;
const getPrivateCalories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield user_model_1.UserModel.findById(userId).lean();
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { height, weight, desiredWeight, age, bloodType } = user;
        if (!height || !weight || !desiredWeight || !age || !bloodType) {
            res.status(400).json({ message: "User profile is incomplete" });
            return;
        }
        const dailyKcal = (0, calorieCalculator_1.calculateDailyCalories)(weight, height, age, desiredWeight);
        const notRecommended = yield product_model_1.ProductModel.find({
            [`groupBloodNotAllowed.${Number(bloodType)}`]: true,
        })
            .limit(4)
            .select("title calories categories");
        res.json({ dailyKcal, notRecommended });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getPrivateCalories = getPrivateCalories;
