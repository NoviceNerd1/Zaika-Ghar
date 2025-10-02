import jwt from "jsonwebtoken";
import { type IUserDocument } from "../models/user.model.js";
import { type Response } from "express";

export const generateToken = (res: Response, user: IUserDocument) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
    expiresIn: "7d", // Increased to 7 days for better UX
  });

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction, // MUST be true for sameSite: 'none'
    sameSite: isProduction ? "none" : "lax", // 'none' for cross-site in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    domain: isProduction ? ".yourdomain.com" : undefined, // Add your domain if needed
  });

  return token;
};
