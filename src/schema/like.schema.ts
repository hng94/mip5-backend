import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Comment } from "../entity/comment.entity";
import { Project } from "../entity/project.entity";
import { User } from "../entity/user.entity";
import { CommentDTO } from "./comment.schema";
import { ProjectDTO } from "./project.schema";
import { UserDTO } from "./user.schema";

@ObjectType()
export class LikeDTO {
  @Field((type) => UserDTO)
  creator: User;

  @Field((type) => ProjectDTO, { nullable: true })
  project?: Project;

  @Field((type) => CommentDTO, { nullable: true })
  comment?: Comment;

  @Field((type) => Date)
  createdDate: Date;
}

@InputType()
export class LikeProjectInputDTO {
  @Field((type) => ID)
  projectId: string;
}

@InputType()
export class LikeCommentInputDTO {
  @Field((type) => ID)
  commentId: string;
}
