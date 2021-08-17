import { Skeleton, Typography } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import React from "react";
import Layout from "../../components/Layout";
import { usePostQuery } from "../../generated/graphql";
import Editor from "rich-markdown-editor";

const Post: React.VFC = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, error, loading } = usePostQuery({
    variables: { postId: intId },
    skip: intId === -1,
  });

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
    </Layout>
  );
};

export default Post;
