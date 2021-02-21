import { Field, ID, InputType, ObjectType } from "type-graphql";
import { BaseClass } from "../entity/base.entity";
import { Comment } from "../entity/comment.entity";
import { Order } from "../entity/order.entity";
import { Project } from "../entity/project.entity";

@ObjectType()
export class UserDTO {
  @Field((type) => ID)
  id: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  email: string;

  @Field()
  password: string;

  projects: Project[];

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  postcode?: string;

  @Field({ nullable: true })
  phone?: string;

  orders?: Order[];

  comments?: Comment[];
}

@InputType()
export class UpdateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;
  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  postcode?: string;

  @Field({ nullable: true })
  phone?: string;
}
