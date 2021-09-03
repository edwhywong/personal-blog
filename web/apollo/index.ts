import { useMemo } from "react";
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  gql,
  NormalizedCacheObject,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ACCESS_TOKEN_KEY } from "../constants";
import jwtDecode from "jwt-decode";
import Router from "next/router";
import merge from "deepmerge";
import isEqual from "lodash/isEqual";

const NON_AUTH_OPERATION_MAP: Record<string, boolean> = {
  Login: true,
  RefreshToken: true,
  Post: true,
  Posts: true,
};

export const APOLLO_STATE_PROP_NAME = "__APOLLO_STATE__";

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = createHttpLink({
  uri: process.env.API_END_POINT!,
  credentials: "include",
});

const refreshAuthToken = async () => {
  return apolloClient.mutate({
    mutation: gql`
      mutation RefreshToken {
        refreshToken {
          accessToken
        }
      }
    `,
  });
};

const authLink = setContext(async (req, { headers }) => {
  if (req.operationName && NON_AUTH_OPERATION_MAP[req.operationName]) return;
  // get the authentication token from local storage if it exists
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && new Date().getTime() / 1000 > (jwtDecode(token) as any).exp) {
    try {
      const response = await refreshAuthToken();
      let newAcessToken = response.data?.refreshToken?.accessToken;
      if (newAcessToken) {
        localStorage.setItem(ACCESS_TOKEN_KEY, newAcessToken);
        token = newAcessToken;
      } else {
        throw new Error("Refresh Token Failed");
      }
    } catch (e) {
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      Router.push("/login");
    }
  }
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

function createApolloClient() {
  return new ApolloClient({
    ssrMode: typeof window === "undefined",
    link: authLink.concat(httpLink),
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            posts: {
              keyArgs: false,
              merge(existing = { hasMore: true, posts: [] }, incoming) {
                return {
                  hasMore: incoming.hasMore,
                  posts: [...existing.posts, ...incoming.posts],
                };
              },
            },
          },
        },
      },
    }),
  });
}

export function initializeApollo(initialState: any = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the existing cache into data passed from getStaticProps/getServerSideProps
    const data = merge(initialState, existingCache, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter((d) =>
          sourceArray.every((s) => !isEqual(d, s))
        ),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _apolloClient;
  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;

  return _apolloClient;
}

export function addApolloState(
  client: ApolloClient<NormalizedCacheObject>,
  pageProps: any
) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps: any) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}
