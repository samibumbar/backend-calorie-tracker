import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  categories: string;
  weight: number;
  title: string;
  calories: number;
  groupBloodNotAllowed: boolean[];
}

const ProductSchema = new Schema<IProduct>({
  categories: { type: String, required: true },
  weight: { type: Number, required: true },
  title: { type: String, required: true },
  calories: { type: Number, required: true },
  groupBloodNotAllowed: [{ type: Boolean }],
});

export const ProductModel = mongoose.model<IProduct>(
  "Product",
  ProductSchema,
  "products"
);
