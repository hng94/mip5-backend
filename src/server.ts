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
import { OrderResolver } from "./resolver/order.resolver";
import { AuthContext } from "./common/type";
import { TimelineResolver } from "./resolver/timeline.resolver";

const PORT = process.env.PORT || 4000;
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
        OrderResolver,
        CategoryResolver,
        TimelineResolver,
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

    // connect expressjs app
    const app = express();
    const path = "/graphql";
    app.use(path, jwtMiddleware);
    server.applyMiddleware({ app });

    // start express server
    app.listen({ port: PORT }, () =>
      console.log(
        `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
      )
    );
  })
  .catch((error) => console.log(error));
