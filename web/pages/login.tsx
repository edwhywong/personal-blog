import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { ACCESS_TOKEN_KEY } from "../constants";
import { useLoginMutation } from "../generated/graphql";
import { fieldErrorsToFormError } from "../utils";

const Login: React.VFC = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values, actions) => {
          // graph ql login
          const response = await login({ variables: values });
          if (response.data?.login.errors) {
            actions.setErrors(
              fieldErrorsToFormError(response.data?.login.errors)
            );
          } else if (response.data?.login.accessToken) {
            localStorage.setItem(
              ACCESS_TOKEN_KEY,
              response.data.login.accessToken
            );
            router.push("/");
          }
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
