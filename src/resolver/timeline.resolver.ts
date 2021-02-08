import { ApolloError, AuthenticationError } from "apollo-server";
import { Arg, Authorized, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { AuthContext } from "../common/type";
import { Comment } from "../entity/comment.entity";
import { Project } from "../entity/project.entity";
import { Timeline } from "../entity/timeline.entity";
import { User } from "../entity/user.entity";
import { CreateTimelineDTO, TimelineDTO } from "../schema/timeline.schema";

@Resolver(Timeline)
export class TimelineResolver {
  @Authorized()
  @Mutation(() => TimelineDTO)
  async createTimeline(
    @Arg("data") data: CreateTimelineDTO,
    @Ctx() context: AuthContext
  ) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser.id);
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
  async removeTimeline(@Arg("id") id: string, @Ctx() context: AuthContext) {
    try {
      const { currentUser } = context;
      const creator = await User.findOne(currentUser.id);
      const timeline = await Timeline.findOne(id);
      if (!timeline) throw new ApolloError("Timeline not found", "404");
      if (creator.id !== timeline.creator.id) {
        throw new AuthenticationError("Invalid user");
      }
      (await timeline).remove();
      return true;
    } catch (error) {
      throw error;
    }
  }
}
