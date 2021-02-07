import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import { buildSchema } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { jwtMiddleware, customAuthChecker } from "./middleware/auth";

//Resolvers
import { UserResolver } from "./resolver/user.resolver.";
import { AuthResolver } from "./resolver/auth.resolver";
import { ProjectResolver } from "./resolver/project.resolver";
import { CategoryResolver } from "./resolver/category.resolver";
import { CommentResolver } from "./resolver/comment.resolver";
import { LikeResolver } from "./resolver/like.resolver";
import { AuthDTO } from "./schema/auth.schema";

createConnection()
  .then(async () => {
    // create appollo server
    const schema = await buildSchema({
      resolvers: [
        UserResolver,
        AuthResolver,
        ProjectResolver,
        CommentResolver,
        LikeResolver,
        // CategoryResolver,
      ],
      authChecker: customAuthChecker,
    });
    const server = new ApolloServer({
      schema,
      context: ({ req }) => {
        const context = {
          req,
          user: req.user as AuthDTO, // `req.user` comes from `express-jwt`
        };
        return context;
      },
    });

    // connect expressjs app
    const app = express();
    app.use(jwtMiddleware);
    server.applyMiddleware({ app });

    // start express server
    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  })
  .catch((error) => console.log(error));
