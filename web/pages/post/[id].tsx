import { Box, IconButton, Skeleton, Typography } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import React from "react";
import Layout from "../../components/Layout";
import { useDeletePostMutation, usePostQuery } from "../../generated/graphql";
import Editor from "rich-markdown-editor";
import { Delete, Edit } from "@material-ui/icons";
import NextLink from "next/link";
import { useLoginUser } from "../../hooks/useLoginUser";
import { usePostQueryWithRouter } from "../../hooks/usePostQueryWithRouter";

const Post: React.VFC = () => {
  const router = useRouter();
  const { data, error, loading } = usePostQueryWithRouter(router);

  const loggedInUserId = useLoginUser();

  const [deletePost] = useDeletePostMutation();

  const handleDelete = async () => {
    const response = await deletePost({
      variables: { deletePostPostId: data!.post!.id },
    });
    if (!response.errors) {
      router.replace("/");
    }
  };

  if (loading) {
    return (
      <Layout>
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </Layout>
    );
  }

  if (error) {
    return <Layout>{error}</Layout>;
  }

  if (!data?.post) {
    return <Layout>could not find post</Layout>;
  }

  return (
    <Layout>
      <Typography variant="h4" mb={4}>
        {data.post.title}
      </Typography>
      <Editor readOnly={true} value={data.post.content} />
      {data.post.authorId === loggedInUserId && (
        <Box display="flex" justifyContent="flex-end">
          <NextLink href={"/post/edit/[id]"} as={`/post/edit/${data.post.id}`}>
            <IconButton aria-label="edit">
              <Edit />
            </IconButton>
          </NextLink>
          <IconButton aria-label="delete" onClick={handleDelete}>
            <Delete />
          </IconButton>
        </Box>
      )}
    </Layout>
  );
};

export default Post;
