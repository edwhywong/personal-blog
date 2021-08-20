import { Form, Formik } from "formik";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { ACCESS_TOKEN_KEY } from "../constants";
import { useLoginMutation } from "../generated/graphql";
import { fieldErrorsToFormError } from "../utils";
import { Box, TextField, Typography } from "@material-ui/core";
import { Button } from "@material-ui/core";
import Wrapper from "../components/Wrapper";

const Login: React.VFC = ({}) => {
  const router = useRouter();
  const [login] = useLoginMutation();

  return (
    <Wrapper variant="xs" center>
      <Typography variant="h3">E Words</Typography>
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
            if (typeof router.query.to === "string") {
              router.push(router.query.to);
            } else {
              router.push("/");
            }
          }
        }}
      >
        {({ isSubmitting, values, handleChange, touched, errors }) => (
          <Form>
            <Box marginY={2}>
              <TextField
                fullWidth
                variant="outlined"
                id="email"
                name="email"
                label="Email"
                placeholder="Email"
                value={values.email}
                onChange={handleChange}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Box>
            <Box marginY={2}>
              <TextField
                fullWidth
                variant="outlined"
                id="password"
                name="password"
                label="Password"
                placeholder="Password"
                type="password"
                value={values.password}
                onChange={handleChange}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Box>
            <Box marginY={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={isSubmitting}
              >
                Login
              </Button>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Login;
