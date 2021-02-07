import { ApolloError, AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthContext } from "../common/type";
import { Comment } from "../entity/comment.entity";
import { Project } from "../entity/project.entity";
import { User } from "../entity/user.entity";
import { CommentDTO, CreateCommentDTO } from "../schema/comment.schema";

@Resolver(Comment)
export class CommentResolver {
  @Authorized()
  @Mutation(() => CommentDTO)
  async createComment(
    @Arg("data") data: CreateCommentDTO,
    @Ctx() context: AuthContext
  ) {
    try {
      const creator = await User.findOne(context.currentUser?.id);
      const project = await Project.findOne(data.projectId);
      const newComment = Comment.create(data);
      newComment.creator = creator;
      newComment.project = project;
      await newComment.save();
      return newComment;
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeComment(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser?.id);
      const comment = Comment.findOne(id);
      if (!comment) throw new ApolloError("Comment not found", "404");
      (await comment).remove();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
