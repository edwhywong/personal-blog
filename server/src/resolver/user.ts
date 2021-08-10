import { User } from "../entity/User";
import {
  Arg,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
  Ctx,
  Int,
} from "type-graphql";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../utils/tokenUtils";
import { sendRefreshToken } from "../utils/sendRefreshToken";
import { isAuth } from "../middleware/isAuth";
import { MyContext } from "../types/MyContext";
import { verify } from "jsonwebtoken";
import { getConnection } from "typeorm";

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}
@ObjectType()
class LoginResponse {
  @Field({ nullable: true })
  accessToken?: string;

  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
}

@Resolver(User)
export class UserResolver {
  @Query(() => User)
  @UseMiddleware(isAuth)
  async me(@Ctx() { payload }: MyContext) {
    if (payload?.userId) {
      const user = await User.findOne(payload.userId);
      return user;
    }
    return null;
  }

  @Mutation(() => Boolean)
  async revokeRefreshToken(@Arg("userId", () => Int) userId: number) {
    await getConnection()
      .getRepository(User)
      .increment({ id: userId }, "tokenVersion", 1);
    return true;
  }

  @Mutation(() => LoginResponse)
  async refreshToken(@Ctx() { req, res }: MyContext): Promise<LoginResponse> {
    // console.log("req", req);
    const token = req.cookies.jid;

    if (!token) {
      throw new Error("no refresh token");
    }

    let payload: any = null;

    try {
      payload = verify(token, process.env.REFRESH_TOKEN_SECRET!);
    } catch (e) {
      console.error("refresh token error");
      throw e;
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      throw new Error("invalid token");
    }

    if (user.tokenVersion !== payload.tokenVersion) {
      throw new Error("expired token");
    }

    sendRefreshToken(res, createRefreshToken(user));

    return {
      accessToken: createAccessToken(user),
    };
  }

  @Mutation(() => Boolean)
  async registor(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const user = await User.findOne({ where: { email } });
    if (user) {
      throw new Error("user already exists");
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      await User.insert({ email, password: hashedPassword });
    } catch (e) {
      return false;
    }

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return {
        errors: [
          { field: "email", message: "email password mismatch" },
          { field: "password", message: "email password mismatch" },
        ],
      };
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (isValid) {
      sendRefreshToken(res, createRefreshToken(user));
      return {
        accessToken: createAccessToken(user),
      };
    } else {
      return {
        errors: [
          { field: "email", message: "email password mismatch" },
          { field: "password", message: "email password mismatch" },
        ],
      };
    }
  }
}
