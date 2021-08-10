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
  return apolloClient
    .mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken {
            accessToken
          }
        }
      `,
    })
    .then((res) => {
      const newAccessToken = res.data?.refreshToken?.accessToken;
      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);
      return newAccessToken;
    });
};

const authLink = setContext(async (req, { headers }) => {
  if (req.operationName && NON_AUTH_OPERATION_MAP[req.operationName]) return;
  // get the authentication token from local storage if it exists
  let token = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (token && new Date().getTime() / 1000 > (jwtDecode(token) as any).exp) {
    try {
      token = await refreshAuthToken();
    } catch (e) {
      console.log("refresh token error", e);
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
  cache: new InMemoryCache(),
});

export { apolloClient };
