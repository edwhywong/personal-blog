import React, { useState } from "react";
import Layout from "../components/Layout";
import Editor from "rich-markdown-editor";
import { Alert, Box, Button, Stack, TextField } from "@material-ui/core";
import AdapterDateFns from "@material-ui/lab/AdapterDateFns";
import LocalizationProvider from "@material-ui/lab/LocalizationProvider";
import DateTimePicker from "@material-ui/lab/DateTimePicker";
import { PostInput, useCreatePostMutation } from "../generated/graphql";
import { useRouter } from "next/dist/client/router";

const CreatePost: React.VFC = () => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [postInput, setPostInput] = useState<PostInput>({
    title: "",
    summary: null,
    content: "",
    publishedAt: new Date(),
  });
  const router = useRouter();
  const [createPost] = useCreatePostMutation();

  const handleCreatePost: React.MouseEventHandler<HTMLButtonElement> = async (
    _e
  ) => {
    const response = await createPost({
      variables: { createPostInput: postInput },
    });
    const postId = response.data?.createPost?.id;
    if (postId) {
      router.push(`/post/${postId}`);
    } else {
      const error = response.errors?.reduce((err, cur) => {
        return err + "\n" + cur;
      }, "");
      setError(error);
    }
  };

  return (
    <Layout>
      <Stack spacing={2}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          placeholder="Title"
          onChange={(e) => {
            setPostInput((input) => ({
              ...input,
              title: e.target.value,
            }));
          }}
        />
        <Editor
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
            value={postInput.publishedAt}
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
          Create Post
        </Button>
        {!!error && <Alert severity="error"></Alert>}
      </Stack>
    </Layout>
  );
};

export default CreatePost;