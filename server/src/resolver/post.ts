import { isAuth } from "../middleware/isAuth";
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
  InputType,
} from "type-graphql";
import { Post } from "../entity/Post";
import { MyContext } from "src/types/MyContext";
import { getConnection } from "typeorm";

@InputType()
class PostInput {
  @Field()
  title: string;
  @Field({ nullable: true })
  summary?: string;
  @Field()
  content: string;
  @Field()
  publishedAt: Date;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @Query(() => Post, { nullable: true })
  post(@Arg("id", () => Int) id: number) {
    return Post.findOne(id);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ) {
    const realLimit = Math.min(20, limit);
    const realLimitPlusOne = realLimit + 1;

    const qb = getConnection()
      .getRepository(Post)
      .createQueryBuilder("p")
      .where("p.publishedAt <= :currentDate", {
        currentDate: new Date(),
      })
      .orderBy("p.publishedAt", "DESC")
      .limit(realLimitPlusOne);
    if (cursor) {
      qb.where('p."publishedAt" < :cursor', { cursor: new Date(cursor) });
    }

    const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimitPlusOne,
    };
  }

  @Mutation(() => Post, { nullable: true })
  @UseMiddleware(isAuth)
  async createPost(
    @Ctx() { payload }: MyContext,
    @Arg("input") input: PostInput
  ) {
    if (payload?.userId) {
      return Post.create({
        ...input,
        authorId: payload.userId,
      }).save();
    } else {
      return null;
    }
  }

  @Mutation(() => Post)
  @UseMiddleware(isAuth)
  async updatePost(
    @Ctx() { payload }: MyContext,
    @Arg("postId", () => Int) postId: number,
    @Arg("input") input: PostInput
  ): Promise<Post | null> {
    if (payload?.userId) {
      const post = await Post.findOne(postId);
      if (post?.authorId !== payload.userId) {
        return null;
      } else {
        const updatedPost = await getConnection()
          .createQueryBuilder()
          .update(Post)
          .set({
            ...input,
          })
          .where('id = :id and "authorId" = :authorId', {
            id: postId,
            authorId: payload.userId,
          })
          .returning("*")
          .execute();

        return updatedPost.raw[0];
      }
    } else {
      return null;
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deletePost(
    @Ctx() { payload }: MyContext,
    @Arg("postId", () => Int) postId: number
  ) {
    if (payload?.userId) {
      await Post.delete({ id: postId, authorId: payload.userId });
    }
    return true;
  }
}
