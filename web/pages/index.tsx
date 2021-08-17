import {
  Button,
  Skeleton,
  Stack,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";
import { usePostsQuery } from "../generated/graphql";

export default function Home() {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { postsLimit: 20, postsCursor: null },
  });

  return (
    <Layout variant="sm">
      {!data && loading ? (
        <>
          <Skeleton /> <Skeleton /> <Skeleton />
        </>
      ) : (
        <Box>
          <Stack spacing={2}>
            <Box>
              <Typography variant="h5" mb={1} color="primary">
                Blog Posts
              </Typography>
              <Divider light />
            </Box>
            {data?.posts.posts.map((p) => (
              <PostItem key={p.id} post={p} />
            ))}
          </Stack>
          {data?.posts.hasMore && (
            <Box mt={4} display="flex" justifyContent="center">
              <Button
                variant="contained"
                onClick={() => {
                  fetchMore({
                    variables: {
                      postLimit: variables?.postsLimit,
                      postsCursor: new Date(
                        parseInt(
                          data.posts.posts[data.posts.posts.length - 1]
                            .publishedAt
                        )
                      ).toISOString(),
                    },
                  });
                }}
              >
                Load More
              </Button>
            </Box>
          )}
        </Box>
      )}
    </Layout>
  );
}
