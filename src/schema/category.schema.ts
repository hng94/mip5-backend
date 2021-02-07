import { Field, ID, ObjectType } from "type-graphql";
import { Project } from "../entity/project.entity";
import { ProjectDTO } from "./project.schema";

@ObjectType()
export class CategoryDTO {
  @Field((type) => ID)
  id: string;

  @Field()
  name: string;

  @Field((type) => [ProjectDTO])
  projects?: Project[];
}
