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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const config_1 = require("./config");
const auth_routes_1 = require("./routes/auth.routes");
const calories_routes_1 = require("./routes/calories.routes");
const products_routes_1 = require("./routes/products.routes");
const days_routes_1 = require("./routes/days.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
const swaggerDocument = {
    openapi: "3.0.0",
    info: {
        title: "Calories API",
        version: "1.0.0",
        description: "API for calorie tracking",
    },
    paths: {},
};
app.use("/api-docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
app.use("/api/auth", auth_routes_1.authRoutes);
app.use("/api/calories", calories_routes_1.caloriesRoutes);
app.use("/api/products", products_routes_1.productsRoutes);
app.use("/api/days", days_routes_1.daysRoutes);
const PORT = process.env.PORT || 5000;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, config_1.conectDB)();
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
startServer();
