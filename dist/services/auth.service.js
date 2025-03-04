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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokens = exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const models_1 = require("../models");
const registerUser = (name, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield models_1.UserModel.findOne({ email });
    if (existingUser) {
        throw new Error("User already exists");
    }
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const newUser = new models_1.UserModel({ name, email, password: hashedPassword });
    yield newUser.save();
    return newUser;
});
exports.registerUser = registerUser;
const loginUser = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield models_1.UserModel.findOne({ email }).lean();
    if (!user) {
        throw new Error("Invalid credentials");
    }
    if (!user.password) {
        throw new Error("User password is missing");
    }
    const isMatch = yield bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new Error("Invalid credentials");
    }
    const accessToken = jsonwebtoken_1.default.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const refreshToken = jsonwebtoken_1.default.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
    return {
        user: { _id: user._id, name: user.name, email: user.email },
        accessToken,
        refreshToken,
    };
});
exports.loginUser = loginUser;
const logoutUser = (userId, refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    yield models_1.SessionModel.deleteOne({ userId, refreshToken });
    return true;
});
exports.logoutUser = logoutUser;
const refreshTokens = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const session = yield models_1.SessionModel.findOne({
            userId: decoded.userId,
            refreshToken,
        });
        if (!session) {
            throw new Error("Invalid session");
        }
        const newAccessToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
        const newRefreshToken = jsonwebtoken_1.default.sign({ userId: decoded.userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });
        session.refreshToken = newRefreshToken;
        yield session.save();
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    }
    catch (error) {
        throw new Error("Invalid refresh token");
    }
});
exports.refreshTokens = refreshTokens;
