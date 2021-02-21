import { IsPositive } from "class-validator";
import { Field, ID, InputType, ObjectType } from "type-graphql";
import { Column } from "typeorm";
import { Order } from "../entity/order.entity";
import { Project } from "../entity/project.entity";
import { OrderDTO } from "./order.schema";
import { ProjectDTO } from "./project.schema";

@ObjectType()
export class ProductDTO {
  @Field((type) => ID)
  id: string;

  @Field()
  title!: string;

  @Field()
  description!: string;

  @Field((type) => Number)
  @IsPositive()
  price!: number;

  @Field()
  url!: string;

  @Field((type) => ProjectDTO)
  project: Project;

  @Field((type) => [OrderDTO])
  orders: Order[];
}

@InputType()
export class CreateProductInput {
  @Field()
  title: string;

  @Field()
  description: string;

  @Field((type) => Number)
  @IsPositive()
  price: number;

  @Field()
  url: string;
}

@InputType()
export class UpdateProductInput {
  @Field((type) => ID)
  id: string;

  @Field()
  title: string;

  @Field()
  description: string;

  @Field((type) => Number)
  @IsPositive()
  price: number;

  @Field()
  url: string;
}
