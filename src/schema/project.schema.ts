import { type } from "os";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { SortEnum } from "../common/enum";
import { Category } from "../entity/category.entity";
import { Comment } from "../entity/comment.entity";
import { Like } from "../entity/like.entity";
import { Product } from "../entity/product.entity";
import { Timeline } from "../entity/timeline.entity";
import { User } from "../entity/user.entity";
import { CategoryDTO } from "./category.schema";
import { CommentDTO } from "./comment.schema";
import { LikeDTO } from "./like.schema";
import { CreateProductInput, ProductDTO } from "./product.schema";
import { TimelineDTO } from "./timeline.schema";
import { UserDTO } from "./user.schema";

@ObjectType()
export class ProjectDTO {
  @Field((type) => ID)
  id: string;

  @Field()
  title!: string;

  @Field()
  subTitle!: string;

  @Field({ nullable: true })
  url?: string;

  @Field((type) => CategoryDTO)
  category!: Category;

  @Field()
  story: string = "";

  @Field((type) => UserDTO)
  creator!: User;

  @Field((type) => [TimelineDTO], { nullable: true })
  timelines: Timeline[];

  @Field((type) => [UserDTO])
  backers: User[];

  @Field((type) => [ProductDTO])
  products: Product[];

  @Field((type) => [LikeDTO])
  likes: Like[];

  @Field((type) => Number)
  likeCount: number = 0;

  @Field((type) => [CommentDTO])
  comments: Comment[];

  @Field((type) => Number)
  commentCount: number = 0;
}

@InputType()
export class QueryProjectInput {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  searchKey?: string;

  @Field({ nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  creatorId?: string;

  @Field({ nullable: true })
  order?: SortEnum = null;

  @Field({ nullable: true })
  take?: number = 9;

  @Field({ nullable: true })
  skip?: number = 0;
}

@InputType()
export class UpdateProjectInput {
  @Field((type) => ID, { nullable: true })
  id: string;

  @Field({ nullable: true })
  title?: string;

  @Field({ nullable: true })
  subTitle?: string;

  @Field({ nullable: true })
  url?: string;

  @Field((type) => ID, { nullable: true })
  categoryId?: string;

  @Field({ nullable: true })
  story?: string;

  @Field((type) => Date, { nullable: true })
  startDate?: Date;

  @Field((type) => Number, { nullable: true })
  duration?: number;
}

@InputType()
export class CreateProjectInput {
  @Field()
  title: string;

  @Field()
  subTitle: string;

  @Field({ nullable: true })
  url?: string;

  @Field((type) => ID)
  categoryId: string;

  @Field()
  story: string;

  @Field((type) => Date, { nullable: true })
  startDate?: Date;

  @Field((type) => Number, { nullable: true })
  duration?: number;

  @Field((type) => ID)
  creatorId: string;

  @Field((type) => [CreateProductInput])
  products: Partial<Product>[];
}
