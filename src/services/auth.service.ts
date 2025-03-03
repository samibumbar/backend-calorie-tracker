import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserModel, SessionModel, IUser } from "../models";

export const registerUser = async (
  name: string,
  email: string,
  password: string
) => {
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    throw new Error("User already exists");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new UserModel({ name, email, password: hashedPassword });
  await newUser.save();
  return newUser;
};

interface LoginResponse {
  user: Pick<IUser, "_id" | "name" | "email">;
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const user = await UserModel.findOne({ email }).lean();

  if (!user) {
    throw new Error("Invalid credentials");
  }

  if (!user.password) {
    throw new Error("User password is missing");
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  const accessToken = jwt.sign(
    { userId: user._id, name: user.name },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { userId: user._id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );

  return {
    user: { _id: user._id, name: user.name, email: user.email },
    accessToken,
    refreshToken,
  };
};

export const logoutUser = async (userId: string, refreshToken: string) => {
  await SessionModel.deleteOne({ userId, refreshToken });
  return true;
};

export const refreshTokens = async (refreshToken: string) => {
  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { userId: string };
    const session = await SessionModel.findOne({
      userId: decoded.userId,
      refreshToken,
    });
    if (!session) {
      throw new Error("Invalid session");
    }

    const newAccessToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET as string,
      { expiresIn: "15m" }
    );
    const newRefreshToken = jwt.sign(
      { userId: decoded.userId },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    session.refreshToken = newRefreshToken;
    await session.save();

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  } catch (error) {
    throw new Error("Invalid refresh token");
  }
};
