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
import { usePostQueryWithRouter } from "../../../hooks/usePostQueryWithRouter";
import { LoadingButton } from "@material-ui/lab";

const EditPost: React.VFC = () => {
  const router = useRouter();
  const { data, loading } = usePostQueryWithRouter(router);
  const [error, setError] = useState<string | undefined>(undefined);
  const [postInput, setPostInput] = useState<PostInput>({
    title: "",
    summary: "",
    content: "",
    publishedAt: new Date(),
  });
  const [isLoadComplete, setIsLoadComplete] = useState(false);

  const loggedInUserId = useLoginUser();

  const [updatePost, { loading: isUpdatingPost }] = useUpdatePostMutation();

  const handleUpdatePost: React.MouseEventHandler<HTMLButtonElement> = async (
    _e
  ) => {
    const response = await updatePost({
      variables: {
        updatePostPostId: data!.post!.id,
        updatePostInput: {
          title: postInput.title,
          content: postInput.content,
          summary: postInput.summary,
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
    typeof window !== "undefined" &&
      router.replace(`/login?to=post/edit/${data?.post?.id}`);
    return null;
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
        <TextField
          fullWidth
          id="summary"
          name="summary"
          label="Summary"
          placeholder="Summary"
          value={postInput.summary}
          onChange={(e) => {
            setPostInput((input) => ({
              ...input,
              summary: e.target.value,
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
            value={new Date(postInput.publishedAt)}
            onChange={(newValue) => {
              setPostInput((input) => ({
                ...input,
                publishedAt: newValue,
              }));
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <LoadingButton
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleUpdatePost}
          loading={isUpdatingPost}
        >
          Update Post
        </LoadingButton>
        {!!error && <Alert severity="error"></Alert>}
      </Stack>
    </Layout>
  );
};

export default EditPost;
