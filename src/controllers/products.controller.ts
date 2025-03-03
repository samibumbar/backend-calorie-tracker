import { Request, Response } from "express";
import { ProductModel } from "../models";

export const searchProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const query = req.query.query as string;
    if (!query) {
      res.status(400).json({ message: "Query param is required" });
      return;
    }

    const products = await ProductModel.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { categories: { $regex: query, $options: "i" } },
      ],
    });
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
