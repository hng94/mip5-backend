import { Resolver, Query, Arg, Authorized } from "type-graphql";
import { User } from "../entity/user.entity";

@Resolver(User)
export class UserResolver {
  @Query(() => String)
  hello() {
    return "hellow world motherfucker";
  }

  @Authorized()
  @Query(() => User)
  async user(@Arg("id") id: string) {
    return await User.findOne(id);
  }
}
