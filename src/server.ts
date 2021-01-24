import "reflect-metadata";
import { createConnection } from "typeorm";
import * as express from "express";
import * as bodyParser from "body-parser";
import { Request, Response, NextFunction } from "express";
import Routes from "./route";
import { buildSchema } from "type-graphql";
import { ApolloServer, gql } from "apollo-server-express";
import { UserResolver } from "./resolver/UserResolver";

const PORT = 8000;

createConnection()
  .then(async (connection) => {
    // create appollo server
    const schema = await buildSchema({
      resolvers: [UserResolver],
    });
    const server = new ApolloServer({ schema });

    // connect expressjs app
    const app = express();
    server.applyMiddleware({ app });

    // start express server
    app.listen({ port: 4000 }, () =>
      console.log(
        `🚀 Server ready at http://localhost:4000${server.graphqlPath}`
      )
    );
  })
  .catch((error) => console.log(error));
