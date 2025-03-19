"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const router = (0, express_1.Router)();
router.get("/", controllers_1.getAllProducts); // Afișează toate produsele
router.get("/search", controllers_1.searchProducts); // Căutare produse
router.post("/add", controllers_1.addProduct); // Adăugare produs nou
router.delete("/remove", controllers_1.removeProduct); // Ștergere produs
exports.productsRoutes = router;
