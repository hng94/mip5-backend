import { IsPositive } from "class-validator";
import { Column, Entity, ManyToOne } from "typeorm";
import { OrderStatus } from "../common/enum";
import { BaseClass } from "./base.entity";
import { Product } from "./product.entity";
import { User } from "./user.entity";

@Entity()
export class Order extends BaseClass {
  @ManyToOne(() => User, (user) => user.orders)
  creator!: User;

  @ManyToOne(() => Product, (product) => product.orders)
  product!: Product;

  @Column({ nullable: false })
  @IsPositive()
  quantity!: number;

  @Column()
  status: OrderStatus = OrderStatus.Process;
}
