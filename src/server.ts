import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import swaggerUi from "swagger-ui-express";
import { conectDB } from "./config";

import { authRoutes } from "./routes/auth.routes";
import { caloriesRoutes } from "./routes/calories.routes";
import { productsRoutes } from "./routes/products.routes";
import { daysRoutes } from "./routes";

dotenv.config();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const swaggerDocument = {
  openapi: "3.0.0",
  info: {
    title: "Calories API",
    version: "1.0.0",
    description: "API for calorie tracking",
  },
  paths: {},
};

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/auth", authRoutes);
app.use("/api/calories", caloriesRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/days", daysRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async (): Promise<void> => {
  try {
    await conectDB();
    console.log("✅ Registered routes:");
    app._router.stack.forEach((r: any) => {
      if (r.route && r.route.path) {
        console.log(`➡️ ${r.route.path}`);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
