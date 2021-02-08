import { Arg, Query, Resolver } from "type-graphql";
import { Category } from "../entity/category.entity";
import { Project } from "../entity/project.entity";
import { CategoryDTO } from "../schema/category.schema";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [CategoryDTO])
  async categories() {
    return await Category.find();
  }
}
