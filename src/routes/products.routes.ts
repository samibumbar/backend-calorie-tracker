import { Router } from "express";
import {
  searchProducts,
  addProduct,
  removeProduct,
  getAllProducts,
} from "../controllers";

const router = Router();

router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.post("/add", addProduct);
router.delete("/remove", removeProduct);

export const productsRoutes = router;
