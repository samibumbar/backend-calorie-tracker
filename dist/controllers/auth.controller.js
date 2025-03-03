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
exports.refreshController = exports.logoutController = exports.loginController = exports.registerController = void 0;
const services_1 = require("../services");
const registerController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const user = yield (0, services_1.registerUser)(name, email, password);
        res.status(201).json({ message: "User created", user });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.registerController = registerController;
const loginController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const { user, accessToken, refreshToken } = yield (0, services_1.loginUser)(email, password);
        res.json({ user, accessToken, refreshToken });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.loginController = loginController;
const logoutController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const { refreshToken } = req.body;
        yield (0, services_1.logoutUser)(userId, refreshToken);
        res.json({ message: "Logged out" });
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.logoutController = logoutController;
const refreshController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        const tokens = yield (0, services_1.refreshTokens)(refreshToken);
        res.json(tokens);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
});
exports.refreshController = refreshController;
