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
exports.searchProducts = void 0;
const models_1 = require("../models");
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.query;
        if (!query) {
            res.status(400).json({ message: "Query param is required" });
            return;
        }
        const products = yield models_1.ProductModel.find({
            $or: [
                { title: { $regex: query, $options: "i" } },
                { categories: { $regex: query, $options: "i" } },
            ],
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.searchProducts = searchProducts;
