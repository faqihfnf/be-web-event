import { Types } from "mongoose";
import { User } from "../models/user.model";
import jwt from "jsonwebtoken";
import { SECRET } from "./env";

export interface IUserToken extends Omit<User, "password" | "activationCode" | "isActive" | "email" | "fullName" | "profilePicture" | "username"> {
  id?: Types.ObjectId;
}

//# digunakan saat login berhasil dimana data user dibuat sebagai token
export const generateToken = (user: IUserToken): string => {
  const token = jwt.sign(user, SECRET, { expiresIn: "1h" });
  return token;
};

//# digunakan untuk mengambil data user dari token agar diketahui user yang sedang login
export const getUserData = (token: string) => {
  const user = jwt.verify(token, SECRET) as IUserToken;
  return user;
};
