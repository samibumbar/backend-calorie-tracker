import mongoose, { Schema, Document } from "mongoose";

interface IConsumedProduct {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IDay extends Document {
  user: mongoose.Types.ObjectId;
  date: string;
  consumedProducts: IConsumedProduct[];
  dailyKcal: number;
  notRecommended: { title: string }[];
}

const ConsumedProductSchema = new Schema<IConsumedProduct>({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
});

const DaySchema = new Schema<IDay>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  consumedProducts: [ConsumedProductSchema],
  dailyKcal: { type: Number, default: 0 },
  notRecommended: [{ title: String }],
});

export const DayModel = mongoose.model<IDay>("Day", DaySchema);
