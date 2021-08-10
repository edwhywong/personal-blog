import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, NonEmptyArray } from "type-graphql";
import * as resolvers from "./resolver";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

const main = async () => {
  await createConnection();

  const app = express();

  const corsOptions: CorsOptions = {
    origin: ["https://studio.apollographql.com", "http://localhost:3000"],
    credentials: true,
  };
  app.use(cors(corsOptions));
  app.use(cookieParser());

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: Object.values(resolvers) as unknown as NonEmptyArray<Function>,
      validate: false,
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();

  apolloServer.applyMiddleware({
    app,
    cors: false,
  });

  app.listen(4000, () => {
    console.log("app started");
  });
};

main().catch((err) => {
  console.error(err);
});
