import React from "react";
import { Post } from "../generated/graphql";
import { Link, Typography, Box } from "@material-ui/core";
import NextLink from "next/link";

export interface PostItem {
  post: Pick<Post, "id" | "title" | "summary" | "publishedAt">;
}

const PostItem: React.VFC<PostItem> = ({ post }) => {
  return (
    <Box>
      <Typography variant="h6">
        <NextLink href={"/post/[id]"} as={`/post/${post.id}`}>
          <Link href="'/post/[id]'" color="inherit" underline="hover">
            {post.title}
          </Link>
        </NextLink>
      </Typography>
      <Typography variant="caption">
        {new Date(post.publishedAt).toDateString().slice(4)}
      </Typography>
      <Typography variant="body2">{post.summary}</Typography>
    </Box>
  );
};

export default PostItem;
