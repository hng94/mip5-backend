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
      .leftJoinAndSelect("project.comments", "comment")
      .leftJoinAndSelect("project.creator", "creator")
      .leftJoinAndSelect("project.category", "category")
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

    return projects;
  }

  @Query(() => ProjectDTO)
  async project(@Arg("id") id: string) {
    const project = await Project.findOne(id);
    // const query = getRepository(Project)
    //   .createQueryBuilder("project")
    //   .leftJoinAndSelect("project.comments", "comment")
    //   .leftJoinAndSelect("project.timelines", "timeline")
    //   .leftJoinAndSelect("project.creator", "creator")
    //   .leftJoinAndSelect("project.products", "product")
    //   .leftJoinAndSelect("product.orders", "order")
    //   .leftJoinAndSelect("project.category", "category")
    //   .leftJoinAndSelect("project.likes", "like")
    //   .withDeleted()
    //   .where("project.id = :id", {
    //     id,
    //   })
    //   .select();
    // const project = await query.getOne();
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
    @Arg("data") data: CreateProjectInput,
    @Arg("id") id: string,
    @Ctx() context: AuthContext
  ) {
    try {
      let project = await Project.findOne(id);
      let product = project.products?.[0];
      Object.keys(data).forEach((prop) => {
        if (prop != "id" && prop !== "products" && data[prop]) {
          project[prop] = data[prop];
        }
      });
      if (product) {
        product.title = data.products[0].title;
        product.description = data.products[0].description;
        product.price = data.products[0].price;
        product.url = data.products[0].url;
      }
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
  @Mutation(() => String)
  async removeProject(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      // const softDeleteQuery = getRepository(Project)
      //   .createQueryBuilder("project")
      //   .leftJoinAndSelect("project.creator", "creator")
      //   .where("project.id = :id", {
      //     id,
      //   })
      //   .andWhere("creator.id = :creatorId", {
      //     creatorId: context.currentUser.id,
      //   })
      //   .softDelete();
      // await softDeleteQuery.execute();
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
