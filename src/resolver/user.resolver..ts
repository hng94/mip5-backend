import { Resolver, Query, Arg, Authorized } from "type-graphql";
import { User as UserEntity } from "../entity/user.entity";
import { UserDTO } from "../schema/user.schema";

@Resolver(UserEntity)
export class UserResolver {
  @Authorized()
  @Query(() => UserDTO)
  async user(@Arg("id") id: string) {
    return await UserEntity.findOne(id);
  }
}
