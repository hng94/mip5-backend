import { Field, ID, InputType, InterfaceType, ObjectType } from "type-graphql";
import { Like } from "../entity/like.entity";
import { Project } from "../entity/project.entity";
import { User } from "../entity/user.entity";
import { LikeDTO } from "./like.schema";
import { ProjectDTO } from "./project.schema";
import { UserDTO } from "./user.schema";

@InterfaceType()
abstract class ICommentDTO {
  @Field(() => ID)
  id: string;

  @Field((type) => UserDTO)
  creator!: User;

  @Field((type) => ProjectDTO)
  project!: Project;

  @Field()
  content: string;
}

@ObjectType({ implements: ICommentDTO })
export class CommentDTO implements ICommentDTO {
  id: string;
  creator: User;
  project: Project;
  content: string;

  @Field((type) => Number)
  likeCount: number = 0;

  @Field((type) => [LikeDTO])
  likes: Like[];

  @Field((type) => Date)
  createdDate: Date;
}

@InputType()
export class CreateCommentDTO {
  @Field(() => ID)
  projectId: string;

  @Field(() => String)
  content: string;
}
