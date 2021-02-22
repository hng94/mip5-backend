import { Field, ID, InputType, ObjectType } from "type-graphql";
import { OrderStatus } from "../common/enum";
import { Product } from "../entity/product.entity";
import { User } from "../entity/user.entity";
import { ProductDTO } from "../schema/product.schema";
import { UserDTO } from "../schema/user.schema";

@ObjectType()
export class OrderDTO {
  @Field((type) => ID)
  id: string;

  @Field((type) => UserDTO)
  creator: User;

  @Field((type) => ProductDTO)
  product: Product;

  @Field((type) => Number)
  quantity: number;

  @Field((type) => OrderStatus)
  status: OrderStatus = OrderStatus.Process;

  @Field((type) => Date)
  createdDate: Date;
}

@InputType()
export class CreateOrderInput {
  @Field((type) => ID)
  productId: string;

  @Field((type) => Number)
  quantity: number;
}

@InputType()
export class UpdateOrderInput {
  @Field((type) => ID)
  productId: string;

  @Field((type) => OrderStatus)
  status: OrderStatus;
}
