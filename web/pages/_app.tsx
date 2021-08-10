import { ApolloProvider } from "@apollo/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import type { AppProps } from "next/app";
import { apolloClient } from "../apollo";
import "../styles/globals.css";

const theme = extendTheme({
  fonts: {
    heading: 'sohne, "Helvetica Neue", Helvetica, Arial, sans-serif;',
    body: "Helvetica Neue",
  },
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ApolloProvider client={apolloClient}>
      <ChakraProvider theme={theme}>
        <Component {...pageProps} />
      </ChakraProvider>
    </ApolloProvider>
  );
}
export default MyApp;
