import { Request, Response } from "express";
import * as Yup from "yup";
import UserModel from "../models/user.model";
import { encrypt } from "../utils/encryption";
import { generateToken } from "../utils/jwt";
import { IRegUser } from "../middleware/auth.middleware";

type TRegister = {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type TLogin = {
  identifier: string;
  password: string;
};

const registerValidateSchema = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().required(),
  password: Yup.string().required(),
  confirmPassword: Yup.string()
    .required()
    .oneOf([Yup.ref("password"), ""], "Passwords must match"),
});

export default {
  //# register function
  async register(req: Request, res: Response) {
    const { fullName, username, email, password, confirmPassword } = req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({ fullName, username, email, password, confirmPassword });

      const result = await UserModel.create({
        fullName,
        username,
        email,
        password,
      });

      res.status(200).json({ message: "success registration", data: result });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },

  //# login function
  async login(req: Request, res: Response) {
    /**
     #swagger.RequestBody = {
        required: true,
        schema: {
          $ref: "#/components/schemas/LoginRequest"
        }
     }
     */

    const { identifier, password } = req.body as unknown as TLogin;

    try {
      //* add user data based on "identifier" -> email & username

      const userByIdentifier = await UserModel.findOne({
        $or: [{ email: identifier }, { username: identifier }],
      });
      //* Check does the user exist?
      if (!userByIdentifier) {
        return res.status(400).json({ message: "User not found", data: null });
      }
      //* Password validation
      const validatePassword: boolean = encrypt(password) === userByIdentifier.password;

      //* Check is the password corret? exist?
      if (!validatePassword) {
        return res.status(400).json({ message: "Password is incorrect", data: null });
      }

      const token = generateToken({
        id: userByIdentifier._id,
        role: userByIdentifier.role,
      });

      res.status(200).json({ message: "success login", data: token });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },

  async me(req: IRegUser, res: Response) {
    /** 
     #swagger.security = [{
        "bearerAuth": []
     }] 
     * */
    try {
      const user = req.user;
      const result = await UserModel.findById(user?.id);

      res.status(200).json({ message: "success get user", data: result });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({ message: err.message, data: null });
    }
  },
};
