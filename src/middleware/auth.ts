import { AuthenticationError } from "apollo-server";
import * as config from "config";
import * as expressJWT from "express-jwt";
import * as jwt from "jsonwebtoken";
import { AuthChecker } from "type-graphql";
import { Context } from "../common/type";

const secretKey: string = config.get("secretKey");

export const jwtMiddleware = expressJWT({
  secret: secretKey,
  credentialsRequired: false,
  algorithms: ["HS256"],
});

export const customAuthChecker: AuthChecker<Context> = (ctx) => {
  const {
    context: { req },
  } = ctx;

  const token = req.headers.authorization.split(" ")[1];
  if (jwt.verify(token, secretKey)) {
    return true;
  }
  throw new AuthenticationError("Invalid Authentication");
};
