import React, { useState } from "react";
import Layout from "../../../components/Layout";
import Editor from "rich-markdown-editor";
import { Alert, Box, Button, TextField, Stack } from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import {
  PostInput,
  usePostQuery,
  useUpdatePostMutation,
} from "../../../generated/graphql";
import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";
import { useLoginUser } from "../../../hooks/useLoginUser";

const EditPost: React.VFC = () => {
  const router = useRouter();
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  const { data, loading } = usePostQuery({
    variables: { postId: intId },
    skip: intId === -1,
  });
  const [error, setError] = useState<string | undefined>(undefined);
  const [postInput, setPostInput] = useState<PostInput>({
    title: "",
    summary: null,
    content: "",
    publishedAt: new Date(),
  });
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  const loggedInUserId = useLoginUser();

  const [updatePost] = useUpdatePostMutation();

  const handleCreatePost: React.MouseEventHandler<HTMLButtonElement> = async (
    _e
  ) => {
    const response = await updatePost({
      variables: {
        updatePostPostId: intId,
        updatePostInput: {
          title: postInput.title,
          content: postInput.content,
          publishedAt: postInput.publishedAt,
        },
      },
    });
    const postId = response.data?.updatePost?.id;
    if (postId) {
      router.push(`/post/${postId}`);
    } else {
      const error = response.errors?.reduce((err, cur) => {
        return err + "\n" + cur;
      }, "");
      setError(error);
    }
  };

  useEffect(() => {
    if (data?.post) {
      setPostInput({ ...data.post });
      setIsLoadComplete(true);
    }
  }, [data]);

  if (loading || !isLoadComplete) {
    return <Layout>loading...</Layout>;
  }

  if (data?.post?.authorId !== loggedInUserId) {
    return <Layout>Unauthorized</Layout>;
  }

  return (
    <Layout>
      <Stack spacing={2}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          placeholder="Title"
          value={postInput.title}
          onChange={(e) => {
            setPostInput((input) => ({
              ...input,
              title: e.target.value,
            }));
          }}
        />
        <Editor
          defaultValue={postInput.content}
          onChange={(valFn) => {
            setPostInput((input) => ({
              ...input,
              content: valFn(),
            }));
          }}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateTimePicker
            label="Publish Date"
            value={new Date(parseInt(postInput.publishedAt))}
            onChange={(newValue) => {
              setPostInput((input) => ({
                ...input,
                publishedAt: newValue,
              }));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleCreatePost}
        >
          Update Post
        </Button>
        {!!error && <Alert severity="error"></Alert>}
      </Stack>
    </Layout>
  );
};

export default EditPost;
