import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../entity/user.entity";
import { UserDTO } from "./user.schema";

@ObjectType()
export class TimelineDTO {
  @Field((type) => UserDTO)
  creator: User;

  @Field((type) => String)
  content: string;

  @Field((type) => Date)
  createdDate: Date;
}

@InputType()
export class CreateTimelineDTO {
  @Field((type) => String)
  projectId: string;

  @Field((type) => String)
  content: string;
}
