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
        console.log("📩 Request primit cu query params:", req.query);
        const { height, weight, desiredWeight, age, bloodType } = req.query;
        if (!height || !weight || !desiredWeight || !age || !bloodType) {
            console.log("❌ Parametri lipsă!");
            res.status(400).json({ message: "Missing required parameters" });
            return;
        }
        const dailyKcal = (0, calorieCalculator_1.calculateDailyCalories)(Number(weight), Number(height), Number(age), Number(desiredWeight));
        const adjustedKcal = Math.max(dailyKcal, 1200);
        console.log(`📊 Calorii calculate: ${adjustedKcal} kcal`);
        console.log("🔍 Query MongoDB pentru produse nerecomandate...");
        const bloodTypeIndex = Number(bloodType) - 1;
        const notRecommended = yield product_model_1.ProductModel.find({
            groupBloodNotAllowed: { $exists: true, $ne: null },
            [`groupBloodNotAllowed.${Number(bloodType) - 1}`]: true,
        })
            .limit(4)
            .select("title calories categories");
        console.log("📡 Produse nerecomandate returnate:", notRecommended);
        res.json({ dailyKcal: adjustedKcal, notRecommended });
    }
    catch (error) {
        console.error("🔥 Eroare în getPublicCalories:", error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.getPublicCalories = getPublicCalories;
const getPrivateCalories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        console.log("🔑 ID utilizator autentificat:", userId);
        const user = yield user_model_1.UserModel.findById(userId).lean();
        if (!user) {
            console.log("❌ Utilizator inexistent!");
            res.status(404).json({ message: "User not found" });
            return;
        }
        const { height, weight, desiredWeight, age, bloodType } = user;
        if (!height || !weight || !desiredWeight || !age || !bloodType) {
            console.log("❌ Profil utilizator incomplet!");
            res.status(400).json({ message: "User profile is incomplete" });
            return;
        }
        const dailyKcal = (0, calorieCalculator_1.calculateDailyCalories)(weight, height, age, desiredWeight);
        console.log(`📊 Calorii calculate pentru utilizator: ${dailyKcal} kcal`);
        const notRecommended = yield product_model_1.ProductModel.find({
            [`groupBloodNotAllowed.${Number(bloodType)}`]: true,
        })
            .limit(4)
            .select("title calories categories");
        console.log("📡 Produse nerecomandate returnate:", notRecommended);
        res.json({ dailyKcal, notRecommended });
    }
    catch (error) {
        console.error("🔥 Eroare în getPrivateCalories:", error.message);
        res.status(500).json({ message: error.message });
    }
});
exports.getPrivateCalories = getPrivateCalories;
