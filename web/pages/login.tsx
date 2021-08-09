import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";

const Login: React.VFC = ({}) => {
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={(values, actions) => {
          // graph ql login
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <Box mb={2}>
              <InputField name="email" placeholder="email" label="Email" />
            </Box>
            <InputField
              name="password"
              placeholder="password"
              label="Password"
              type="password"
            />
            <Button
              mt={4}
              isFullWidth={true}
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              Login
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
