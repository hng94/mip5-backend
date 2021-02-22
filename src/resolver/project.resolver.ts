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

function getCurrentFund(project: Project) {
  const price = project.products?.[0].price || 0;
  const quantity = project.products?.[0].orders
    .map((o) => o.quantity)
    .reduce((q, total) => q + total, 0);
  const currentFund = price * quantity;
  return currentFund;
}

@Resolver(Project)
export class ProjectResolver {
  @Query(() => [ProjectDTO])
  async projects(@Arg("data") data: QueryProjectInput) {
    const query = getRepository(Project)
      .createQueryBuilder("project")
      .leftJoinAndSelect("project.comments", "comment")
      .leftJoinAndSelect("project.creator", "creator")
      .leftJoinAndSelect("project.category", "category")
      .leftJoinAndSelect("project.products", "product")
      .leftJoinAndSelect("product.orders", "order")
      .leftJoinAndSelect("project.likes", "like")
      .select();

    //build query
    if (data.searchKey) {
      query.where("project.title ~* :searchKey", {
        searchKey: data.searchKey,
      });
    }

    if (data.creatorId) {
      query.andWhere("creator.id = :creatorId", {
        creatorId: data.creatorId,
      });
    }

    // if (data.categoryId) {
    //   query.andWhere("category.id = :categoryId", {
    //     categoryId: data.categoryId,
    //   });
    // }

    // if (data.order) {
    //   query.orderBy(`project.${data.order}`, "ASC");
    // }

    // const projects = await query.skip(data.skip).take(data.take).getMany();
    query.andWhere("project.deletedDate IS NULL");
    const projects = await query.getMany();
    projects.forEach((p) => (p.currentFund = getCurrentFund(p)));
    return projects;
  }

  @Query(() => ProjectDTO)
  async project(@Arg("id") id: string) {
    const project = await Project.findOne(id);
    project.currentFund = getCurrentFund(project);
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
  @Mutation(() => String)
  async updateProject(
    @Arg("data") data: CreateProjectInput,
    @Arg("id") id: string,
    @Ctx() context: AuthContext
  ) {
    try {
      let project = await Project.findOne(id);
      let product = await Product.findOne(project.products[0].id);
      Object.keys(data).forEach((prop) => {
        if (prop != "id" && prop !== "products" && data[prop]) {
          project[prop] = data[prop];
        }
      });
      if (product) {
        project.products[0].title = data.products[0].title;
        project.products[0].description = data.products[0].description;
        project.products[0].price = data.products[0].price;
        project.products[0].url = data.products[0].url;
      }

      if (data.categoryId) {
        const category = await Category.findOne(data.categoryId);
        project.category = category;
      }
      await project.save();
      return id;
    } catch (error) {
      return error;
    }
  }

  @Authorized()
  @Mutation(() => String)
  async removeProject(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      const project = await Project.findOne(
        { id },
        {
          relations: ["products", "products.orders", "creator"],
        }
      );
      if (project.creator.id != context.currentUser.id) {
        return new AuthenticationError("Invalid user");
      }
      Project.softRemove(project);
      return id;
    } catch (error) {
      throw error;
    }
  }
}
