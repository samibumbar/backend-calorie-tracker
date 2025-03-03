"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const controllers_1 = require("../controllers");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post("/register", controllers_1.registerController);
router.post("/login", controllers_1.loginController);
router.post("/logout", auth_middleware_1.authMiddleware, controllers_1.logoutController);
router.post("/refresh", controllers_1.refreshController);
exports.authRoutes = router;
