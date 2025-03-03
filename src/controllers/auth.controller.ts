import { Request, Response } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokens,
} from "../services";

export const registerController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "User created", user });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await loginUser(
      email,
      password
    );

    res.json({
      user: { name: user.name },
      accessToken,
      refreshToken,
    });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = (req as any).userId;
    const { refreshToken } = req.body;
    await logoutUser(userId, refreshToken);
    res.json({ message: "Logged out" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const refreshController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    const tokens = await refreshTokens(refreshToken);
    res.json(tokens);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
