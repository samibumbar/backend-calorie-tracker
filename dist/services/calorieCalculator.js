"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateDailyCalories = void 0;
const calculateDailyCalories = (weight, height, age, desiredWeight) => {
    return (10 * weight + 6.25 * height - 5 * age - 161 - 10 * (weight - desiredWeight));
};
exports.calculateDailyCalories = calculateDailyCalories;
