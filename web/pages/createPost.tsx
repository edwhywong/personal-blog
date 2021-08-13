import React from "react";
import Layout from "../components/Layout";
import Editor from "rich-markdown-editor";
import { Box, Button, TextField } from "@material-ui/core";

const CreatePost: React.VFC = () => {
  return (
    <Layout>
      <Box marginY={2}>
        <TextField
          fullWidth
          id="title"
          name="title"
          label="Title"
          placeholder="Title"
        />
      </Box>
      <Editor />
      <Box marginY={2}>
        <Button fullWidth variant="contained" color="primary">
          Create Post
        </Button>
      </Box>
    </Layout>
  );
};

export default CreatePost;
