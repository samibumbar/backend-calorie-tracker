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
exports.getDayInfo = exports.removeProductFromDay = exports.addProductToDay = void 0;
const models_1 = require("../models");
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
        res.json(day);
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
        const day = yield models_1.DayModel.findOne({ user: userId, date });
        if (!day) {
            res.status(404).json({ message: "Day not found" });
            return;
        }
        day.consumedProducts = day.consumedProducts.filter((cp) => cp.product.toString() !== productId);
        yield day.save();
        res.json(day);
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
        const day = yield models_1.DayModel.findOne({ user: userId, date }).populate("consumedProducts.product");
        if (!day) {
            res.status(404).json({ message: "Day not found" });
            return;
        }
        let totalKcal = 0;
        for (const cp of day.consumedProducts) {
            const productDoc = cp.product;
            if (!productDoc)
                continue;
            const kcal = (cp.quantity / productDoc.weight) * productDoc.calories;
            totalKcal += kcal;
        }
        res.json({ day, totalKcal });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getDayInfo = getDayInfo;
