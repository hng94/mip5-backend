import { Request } from "express";
import { User } from "../entity/user.entity";

export type Context = {
  user?: Partial<User>;
  req: Request;
};
