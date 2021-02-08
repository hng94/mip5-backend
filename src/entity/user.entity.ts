import {
  IsEmail,
  IsLowercase,
  IsNotEmpty,
  IsPostalCode,
} from "class-validator";
import {
  Entity,
  Column,
  Unique,
  OneToMany,
  BeforeInsert,
  Index,
} from "typeorm";
import { BaseClass } from "./base.entity";
import { Comment } from "./comment.entity";
import { Order } from "./order.entity";
import { Project } from "./project.entity";
import * as bcrypt from "bcryptjs";

@Entity()
@Unique(["email"])
export class User extends BaseClass {
  @Column({ nullable: false })
  @IsNotEmpty()
  firstName!: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  lastName!: string;

  @Column({ nullable: false })
  @IsEmail({}, { message: "Incorrect email" })
  @IsLowercase()
  @Index()
  email!: string;

  @Column({ nullable: false })
  password!: string;

  @OneToMany(() => Project, (project) => project.creator)
  projects?: Project[];

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postcode?: string;

  @Column({ nullable: true })
  phone?: string;

  @OneToMany(() => Order, (order) => order.creator)
  orders?: Order[];

  @OneToMany(() => Comment, (comment) => comment.creator, {
    cascade: true,
    onDelete: "CASCADE",
  })
  comments?: Comment[];

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  async comparePassword(attempt: string): Promise<boolean> {
    const valid = await bcrypt.compare(attempt, this.password);
    return valid;
  }
}
