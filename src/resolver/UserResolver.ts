import { Resolver, Query, Arg, Mutation } from "type-graphql";
import { CreateUserInput } from "../../type/User";
import { User } from "../entity/User";

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hellow world motherfucker";
  }

  @Query(() => [User])
  async users() {
    return await User.find();
  }

  @Mutation(() => User)
  async createUser(@Arg("body") body: CreateUserInput) {
    const user = User.create(body);
    await user.save();
    return user;
  }
}
