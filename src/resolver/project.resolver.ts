import { AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { getRepository } from "typeorm";
import { AuthContext } from "../common/type";
import { BaseClass } from "../entity/base.entity";
import { Category } from "../entity/category.entity";
import { Comment } from "../entity/comment.entity";
import { Like } from "../entity/like.entity";
import { Product } from "../entity/product.entity";
import { Project } from "../entity/project.entity";
import { Timeline } from "../entity/timeline.entity";
import { User } from "../entity/user.entity";
import {
  CreateProjectInput,
  ProjectDTO,
  QueryProjectInput,
  UpdateProjectInput,
} from "../schema/project.schema";

@Resolver(Project)
export class ProjectResolver {
  @Query(() => [ProjectDTO])
  async projects(@Arg("data") data: QueryProjectInput) {
    const query = getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.creator", "user")
      .leftJoinAndSelect("project.category", "category")
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

  @Query(() => ProjectDTO)
  async project(@Arg("id") id: string) {
    const project = await Project.findOne(id);
    return project;
  }

  @Authorized()
  @Mutation(() => ProjectDTO)
  async createProject(
    @Arg("data") data: CreateProjectInput,
    @Ctx() context: AuthContext
  ) {
    const { currentUser } = context;
    try {
      const category = await Category.findOne({ id: data.categoryId });
      const creator = await User.findOne({ id: currentUser.id });
      if (category && creator) {
        const project = await Project.create(data);
        project.creator = creator;
        project.category = category;
        project.products = new Array<Product>();
        data.products.forEach((product) => {
          project.products.push(product as Product);
        });
        project.comments = new Array<Comment>();
        project.backers = new Array<User>();
        project.likes = new Array<Like>();
        project.timelines = new Array<Timeline>();
        const firstTimeline = new Timeline(project.creator, "Project created");
        project.timelines.push(firstTimeline);
        await project.save();
        return project;
      }
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => ProjectDTO)
  async updateProject(
    @Arg("data") data: UpdateProjectInput,
    @Ctx() context: AuthContext
  ) {
    try {
      let project = await Project.findOne(data.id);
      Object.keys(data).forEach((prop) => {
        if (prop != "id" && data[prop]) {
          project[prop] = data[prop];
        }
      });
      if (data.categoryId) {
        const category = await Category.findOne(data.categoryId);
        project.category = category;
      }
      await project.save();
      return project;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeProject(@Arg("id") id: string, @Ctx() context) {
    try {
      const project = await Project.findOne(id);
      await project.softRemove();
      project.save();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
