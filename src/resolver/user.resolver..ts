import { AuthenticationError } from "apollo-server";
import { Resolver, Query, Arg, Authorized, Mutation, Ctx } from "type-graphql";
import { AuthContext } from "../common/type";
import { User as UserEntity } from "../entity/user.entity";
import { UpdateUserInput, UserDTO } from "../schema/user.schema";

@Resolver(UserEntity)
export class UserResolver {
  @Authorized()
  @Query(() => UserDTO)
  async user(@Arg("id") id: string) {
    return await UserEntity.findOne(id);
  }

  @Authorized()
  @Query(() => UserDTO)
  async profile(@Arg("email") email: string) {
    return await UserEntity.findOne({ email });
  }

  @Authorized()
  @Mutation(() => UserDTO)
  async updateProfile(
    @Arg("data") data: UpdateUserInput,
    @Ctx() context: AuthContext
  ) {
    const user = await UserEntity.findOne(context.currentUser.id);
    if (user) {
      user.firstName = data.firstName;
      user.lastName = data.lastName;
      user.address = data.address;
      user.postcode = data.postcode;
      user.phone = data.phone;
      await user.save();
      return user;
    }
    return new AuthenticationError("Invalid user");
  }
}
