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

const NON_AUTH_OPERATION_MAP: Record<string, boolean> = {
  Login: true,
  RefreshToken: true,
};

let apolloClient: ApolloClient<NormalizedCacheObject>;

const httpLink = createHttpLink({
  uri: "http://localhost:4000/graphql",
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

apolloClient = new ApolloClient({
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

export { apolloClient };
