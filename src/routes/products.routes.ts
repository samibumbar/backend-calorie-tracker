import { Router } from "express";
import { searchProducts } from "../controllers";

const router = Router();

router.get("/search", searchProducts);

export const productsRoutes = router;
