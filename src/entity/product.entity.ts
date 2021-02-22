import { IsPositive } from "class-validator";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
import { BaseClass } from "./base.entity";
import { Order } from "./order.entity";
import { Project } from "./project.entity";

@Entity()
export class Product extends BaseClass {
  @Column({ nullable: false })
  title!: string;

  @Column({ nullable: false })
  description!: string;

  @Column({ nullable: false })
  @IsPositive()
  price!: number;

  @Column({ nullable: false })
  url!: string;

  @ManyToOne(() => Project, (project) => project.products)
  project: Project;

  @OneToMany(() => Order, (order) => order.product, {
    eager: true,
    cascade: true,
  })
  orders: Order[];
}
