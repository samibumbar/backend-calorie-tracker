import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  height?: number;
  weight?: number;
  desiredWeight?: number;
  age?: number;
  bloodType?: number;
  dailyKcalGoal?: number;
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  height: { type: Number },
  weight: { type: Number },
  desiredWeight: { type: Number },
  age: { type: Number },
  bloodType: { type: Number },
  dailyKcalGoal: { type: Number },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
