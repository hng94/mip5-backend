import { ApolloError, AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { Comment } from "../entity/comment.entity";
import { Project } from "../entity/project.entity";
import { Timeline } from "../entity/timeline.entity";
import { User } from "../entity/user.entity";
import { CommentDTO, CreateCommentDTO } from "../schema/comment.schema";
import { CreateTimelineDTO, TimelineDTO } from "../schema/timeline.schema";

@Resolver(Timeline)
export class TimelineResolver {
  @Authorized()
  @Mutation(() => TimelineDTO)
  async createTimeline(
    @Arg("data") data: CreateTimelineDTO,
    @Ctx() context: AuthenticationError
  ) {
    try {
      const { user: currentUser } = context;
      const creator = await User.findOne(currentUser.Id);
      if (creator.id !== context.user.id) {
        throw new AuthenticationError("Invalid user");
      }
      const project = await Project.findOne(data.projectId);
      const newTimeline = Timeline.create(data);
      newTimeline.creator = creator;
      newTimeline.project = project;
      await newTimeline.save();
      return newTimeline;
    } catch (error) {
      throw error;
    }
  }

  @Authorized()
  @Mutation(() => Boolean)
  async removeComment(
    @Arg("id") id: string,
    @Arg("creatorId") creatorId: string,
    @Ctx() context
  ) {
    try {
      const creator = await User.findOne(creatorId);
      if (creator.id !== context.user.id) {
        throw new AuthenticationError("Invalid user");
      }
      const comment = Timeline.findOne(id);
      if (!comment) throw new ApolloError("Timeline not found", "404");
      (await comment).remove();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
