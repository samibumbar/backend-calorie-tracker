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
      title: { $regex: query, $options: "i" },
    });

    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllProducts = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const products = await ProductModel.find();
    res.json(products);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const addProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, calories } = req.body;

    if (!title || calories === undefined) {
      res.status(400).json({ message: "Title and calories are required" });
      return;
    }

    const existingProduct = await ProductModel.findOne({ title });
    if (existingProduct) {
      res.status(400).json({ message: "Product already exists" });
      return;
    }

    const newProduct = new ProductModel({
      title,
      calories,
      categories: "Default",
      weight: 100,
      groupBloodNotAllowed: [false, false, false, false],
    });
    await newProduct.save();

    res.status(201).json(newProduct);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removeProduct = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { productId } = req.body;

    if (!productId) {
      res.status(400).json({ message: "Product ID is required" });
      return;
    }

    const deletedProduct = await ProductModel.findByIdAndDelete(productId);
    if (!deletedProduct) {
      res.status(404).json({ message: "Product not found" });
      return;
    }

    res.json({ message: "Product removed successfully" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
