import { verify } from "jsonwebtoken";
import { MyContext } from "../types/MyContext";
import { Middleware } from "type-graphql/dist/interfaces/Middleware";

export const isAuth: Middleware<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers.authorization;
  if (!authorization) {
    throw new Error("no token, not authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN_SECRET!);
    context.payload = payload as any;
  } catch (e) {
    throw e;
  }

  return next();
};
