import { Field, InputType } from "type-graphql";
@InputType()
export class CreateUserInput {
  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  age: number;
}
