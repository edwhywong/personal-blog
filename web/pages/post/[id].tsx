import { Box, IconButton, Typography } from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import {
  PostDocument,
  PostQuery,
  PostsDocument,
  PostsQuery,
  useDeletePostMutation,
} from "../../generated/graphql";
import Editor from "rich-markdown-editor";
import { Delete, Edit } from "@material-ui/icons";
import NextLink from "next/link";
import { useLoginUser } from "../../hooks/useLoginUser";
import { addApolloState, initializeApollo } from "../../apollo";
import { NextSeo } from "next-seo";
import { constructPostId, getPostIntId } from "../../utils/postUtils";

interface PostProps {
  data: PostQuery | undefined;
}

const Post: React.VFC<PostProps> = ({ data }) => {
  const router = useRouter();

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

  useEffect(() => {
    if (window.location.hash && data?.post) {
      setTimeout(() => {
        window.location.href = window.location.hash;
      }, 0);
    }
  }, [data?.post]);

  if (!data?.post) {
    return <Layout>could not find post</Layout>;
  }

  return (
    <>
      <NextSeo
        title={data.post.title}
        description={data.post.summary || data.post.title}
      />
      <Layout>
        <Typography variant="h4" mb={4}>
          {data.post.title}
        </Typography>
        <Editor readOnly={true} value={data.post.content} />
        {data.post.authorId === loggedInUserId && (
          <Box display="flex" justifyContent="flex-end">
            <NextLink
              href={"/post/edit/[id]"}
              as={`/post/edit/${data.post.id}`}
            >
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
    </>
  );
};

export async function getStaticPaths() {
  const apolloClient = initializeApollo();

  const { data }: { data: PostsQuery | undefined } = await apolloClient.query({
    query: PostsDocument,
    variables: { postsLimit: 20, postsCursor: null },
  });

  const paths = data?.posts.posts.map((post) => ({
    params: { id: constructPostId(post) },
  }));

  return { paths, fallback: "blocking" };
}

export async function getStaticProps({ params }: { params: { id: string } }) {
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: PostDocument,
    variables: { postId: getPostIntId(params.id) },
  });

  return addApolloState(apolloClient, {
    props: {
      data,
    },
    revalidate: 1800,
  });
}

export default Post;
