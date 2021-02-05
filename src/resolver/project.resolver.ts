import { AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { Context } from "../common/type";
import { BaseClass } from "../entity/base.entity";
import { Category } from "../entity/category.entity";
import { Product } from "../entity/product.entity";
import {
  CreateProjectInput,
  Project,
  QueryProjectInput,
} from "../entity/project.entity";
import { User } from "../entity/user.entity";

@Resolver(Project)
export class ProjectResolver {
  @Query(() => [Project])
  async projects(@Arg("data") data: QueryProjectInput) {
    const query = getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.creator", "user")
      .leftJoinAndSelect("project.category", "category")
      .leftJoinAndSelect("project.comments", "comments")
      .leftJoinAndSelect("project.likes", "likes")
      .select();

    //build query
    if (data.searchKey) {
      query.where("project.name ~* :searchKey", {
        searchKey: data.searchKey,
      });
    }

    if (data.creatorId) {
      query.andWhere("creator.id = :creatorId", {
        creatorId: data.creatorId,
      });
    }

    if (data.categoryId) {
      query.andWhere("category.id = :categoryId", {
        categoryId: data.categoryId,
      });
    }

    if (data.order) {
      query.orderBy(`project.${data.order}`, "ASC");
    }

    const projects = query.skip(data.skip).take(data.take).getMany();

    return projects;
  }

  @Query(() => Project)
  async project(@Arg("id") id: string) {
    const project = await Project.findOne(id);
    return project;
  }

  @Mutation(() => Project)
  async createProject(@Arg("data") data: CreateProjectInput) {
    try {
      const category = await Category.findOneOrFail({ id: data.categoryId });
      const creator = await User.findOneOrFail({ email: data.creatorEmail });
      if (category && creator) {
        const project = await Project.create({
          title: data.title,
          creator,
          category,
        });
        const product = await Product.create(data.product);
        project.products.push(product);
        await project.save();
        return project;
      }
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Project)
  async updateProject(@Arg("data") data: QueryProjectInput, @Ctx() context) {
    try {
      let project = await Project.findOne(data.id);
      const currentUser = await context.user;
      if (project && project.creator.id === currentUser.id) {
        Object.keys(data).forEach((prop) => {
          if (data[prop]) {
            project[prop] = data[prop];
          }
        });
        await project.save();
        return project;
      } else {
        throw new AuthenticationError("Invalid User");
      }
    } catch (error) {
      return error;
    }
  }
}
