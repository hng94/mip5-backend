import { Arg, Mutation, Query, Resolver } from "type-graphql";
import * as config from "config";
import * as jwt from "jsonwebtoken";
import { AuthenticationError } from "apollo-server";
import { Auth, CreateUserInput } from "../schema/auth.schema";
import { User } from "../entity/user.entity";

const secretKey: string = config.get("secretKey");
@Resolver(User)
export class AuthResolver {
  @Query(() => Auth)
  async login(@Arg("email") email: string, @Arg("password") password: string) {
    try {
      const user = await User.findOne({ email });
      const validPassword = await user.comparePassword(password);
      if (validPassword) {
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
          },
          secretKey,
          { expiresIn: "1d" }
        );
        return { email: user.email, token } as Auth;
      }
    } catch (error) {
      throw new AuthenticationError("Login Failed");
    }
  }

  @Mutation(() => Auth)
  async register(@Arg("data") data: CreateUserInput) {
    try {
      const user = User.create(data);
      await user.save();
      const token = jwt.sign({ id: user.id, email: user.email }, secretKey);
      return { id: user.id, email: user.email, token } as Auth;
    } catch (error) {
      throw error;
    }
  }
}
