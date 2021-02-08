import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-lambda";
import { jwtMiddleware, customAuthChecker } from "./middleware/auth";

//Resolvers
import { UserResolver } from "./resolver/user.resolver.";
import { AuthResolver } from "./resolver/auth.resolver";
import { ProjectResolver } from "./resolver/project.resolver";
import { CategoryResolver } from "./resolver/category.resolver";
import { CommentResolver } from "./resolver/comment.resolver";
import { LikeResolver } from "./resolver/like.resolver";
import { AuthDTO } from "./schema/auth.schema";
import { OrderResolver } from "./resolver/order.resolver";
import { AuthContext } from "./common/type";

async function loadServer() {
  // create appollo server
  const schema = await buildSchema({
    resolvers: [
      UserResolver,
      AuthResolver,
      ProjectResolver,
      CommentResolver,
      LikeResolver,
      OrderResolver,
      CategoryResolver,
    ],
    authChecker: customAuthChecker,
  });
  const server = new ApolloServer({
    schema,
    context: ({ req }) => {
      const context: AuthContext = {
        req,
        currentUser: req.user as AuthDTO, // `req.user` comes from `express-jwt`
      };
      return context;
    },
    playground: {
      endpoint: "/dev/graphql",
    },
  });

  return server;
}
exports.graphqlHandler = async () => {
  const handler = (await loadServer()).createHandler({
    cors: {
      origin: "*",
      credentials: true,
    },
  });
  return handler;
};
