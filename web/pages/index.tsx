import {
  Button,
  Skeleton as MuiSkeleton,
  Stack,
  Box,
  Typography,
  Divider,
} from "@material-ui/core";
import React from "react";
import Layout from "../components/Layout";
import PostItem from "../components/PostItem";
import { usePostsQuery } from "../generated/graphql";

const Skeleton = () => {
  return (
    <div>
      <MuiSkeleton sx={{ height: 25 }} />
      <MuiSkeleton sx={{ height: 15, width: 100 }} />
      <MuiSkeleton sx={{ height: 25, width: "80%" }} />
    </div>
  );
};

export default function Home() {
  const { data, loading, fetchMore, variables } = usePostsQuery({
    variables: { postsLimit: 20, postsCursor: null },
  });

  return (
    <Layout variant="sm">
      <Box mb={2}>
        <Typography variant="h5" mb={1} color="primary">
          Blog Posts
        </Typography>
        <Divider light />
      </Box>
      {!data && loading ? (
        <Stack spacing={2}>
          <Skeleton /> <Skeleton /> <Skeleton /> <Skeleton /> <Skeleton />
        </Stack>
      ) : (
        <Box>
          <Stack spacing={2}>
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
