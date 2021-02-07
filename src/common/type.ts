import { Request } from "express";
import { User } from "../entity/user.entity";
import { AuthDTO } from "../schema/auth.schema";
import { UserDTO } from "../schema/user.schema";

export type AuthContext = {
  currentUser?: AuthDTO;
  req: Request;
};
