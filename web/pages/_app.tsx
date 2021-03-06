import { ApolloProvider } from "@apollo/client";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import type { AppProps } from "next/app";
import { useRouter } from "next/dist/client/router";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { useApollo } from "../apollo";
import LoadingBackDrop from "../components/Loading";
import "../styles/globals.css";
import theme from "../theme";
import { NextSeo } from "next-seo";

function MyApp({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  const router = useRouter();
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles);
    }
  }, []);

  useEffect(() => {
    const handleStart = () => {
      setPageLoading(true);
    };
    const handleComplete = () => {
      setPageLoading(false);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
  });

  return (
    <React.Fragment>
      <NextSeo
        title={"E Words - A blog by Edward Wong"}
        description={
          "Personal blog by Edward Wong, software Engineer from Hong Kong to Toronto."
        }
      />
      <Head>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LoadingBackDrop open={pageLoading} />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </React.Fragment>
  );
}
export default MyApp;
