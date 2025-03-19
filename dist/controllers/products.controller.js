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
exports.removeProduct = exports.addProduct = exports.getAllProducts = exports.searchProducts = void 0;
const models_1 = require("../models");
// Căutare produse (inclusiv cele nou adăugate)
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.query;
        if (!query) {
            res.status(400).json({ message: "Query param is required" });
            return;
        }
        const products = yield models_1.ProductModel.find({
            title: { $regex: query, $options: "i" }, // Caută doar după titlu
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.searchProducts = searchProducts;
// Returnează toate produsele
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield models_1.ProductModel.find();
        res.json(products);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.getAllProducts = getAllProducts;
// Adăugare produs nou
const addProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, calories } = req.body;
        if (!title || calories === undefined) {
            res.status(400).json({ message: "Title and calories are required" });
            return;
        }
        // Verificăm dacă produsul există deja
        const existingProduct = yield models_1.ProductModel.findOne({ title });
        if (existingProduct) {
            res.status(400).json({ message: "Product already exists" });
            return;
        }
        const newProduct = new models_1.ProductModel({
            title,
            calories,
            categories: "Default",
            weight: 100,
            groupBloodNotAllowed: [false, false, false, false],
        });
        yield newProduct.save();
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.addProduct = addProduct;
// Ștergere produs
const removeProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        if (!productId) {
            res.status(400).json({ message: "Product ID is required" });
            return;
        }
        const deletedProduct = yield models_1.ProductModel.findByIdAndDelete(productId);
        if (!deletedProduct) {
            res.status(404).json({ message: "Product not found" });
            return;
        }
        res.json({ message: "Product removed successfully" });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
});
exports.removeProduct = removeProduct;
