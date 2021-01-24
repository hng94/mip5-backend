import { Field, ObjectType } from "type-graphql";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { BaseClass } from "./BaseClass";

@Entity()
@ObjectType()
export class User extends BaseClass {
  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => Number)
  @Column()
  age: number;
}
