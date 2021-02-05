import { IsEmail } from "class-validator";
import { Field, InputType, ObjectType } from "type-graphql";

@ObjectType()
export class Auth {
  @Field()
  email!: string;

  @Field()
  token!: string;
}

@InputType()
export class AuthInput {
  @Field()
  email!: string;

  @Field()
  password!: string;
}

@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  password: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  address: string;

  @Field()
  phone: string;

  @Field()
  postcode: string;
}
