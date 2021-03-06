import "reflect-metadata";
import express from "express";
import { createConnection } from "typeorm";
import { ApolloServer } from "apollo-server-express";
import { buildSchema, NonEmptyArray } from "type-graphql";
import * as resolvers from "./resolver";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";

const main = async () => {
  const conn = await createConnection();
  conn.runMigrations();

  const app = express();

  const corsOptions: CorsOptions = {
    origin: process.env.ALLOW_ORGINS!.split("|"),
    credentials: true,
  };
  console.log("corsOptions", corsOptions);
  app.use(cors(corsOptions));
  app.set("trust proxy", 1);
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

  app.listen(parseInt(process.env.PORT!), () => {
    console.log("app started");
  });
};

main().catch((err) => {
  console.error(err);
});
