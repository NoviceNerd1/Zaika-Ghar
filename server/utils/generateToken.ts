import jwt from "jsonwebtoken";
import { type IUserDocument } from "../models/user.model.js";
import { type Response } from "express";
import { getCookieConfig } from "../utils/cookieConfig.js";

export const generateToken = (res: Response, user: IUserDocument) => {
  const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY!, {
    expiresIn: "7d",
  });

  res.cookie("token", token, getCookieConfig(true));

  console.log(`Cookie set with sameSite: none for cross-site access`);
  return token;
};
