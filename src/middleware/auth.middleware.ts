import { NextFunction, Request, Response } from "express";
import { getUserData, IUserToken } from "../utils/jwt";

export interface IRegUser extends Request {
  user?: IUserToken;
}

export default (req: Request, res: Response, next: NextFunction) => {
  const autorization = req.headers.authorization;

  if (!autorization) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  const [prefix, token] = autorization.split(" ");

  if (!(prefix === "Bearer" && token)) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  const user = getUserData(token);

  if (!user) {
    return res.status(403).json({ message: "Unauthorized", data: null });
  }

  (req as IRegUser).user = user;

  next();
};
