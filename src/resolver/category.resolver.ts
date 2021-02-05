import { Arg, Query, Resolver } from "type-graphql";
import { Category } from "../entity/category.entity";
import { Project } from "../entity/project.entity";

@Resolver(Category)
export class CategoryResolver {
  @Query(() => [Category])
  async categories() {
    return await Category.find();
  }
}
