import { NextRouter } from "next/dist/client/router";
import { usePostQuery } from "../generated/graphql";

export const usePostQueryWithRouter = (router: NextRouter) => {
  const intId =
    typeof router.query.id === "string" ? parseInt(router.query.id) : -1;
  return usePostQuery({
    variables: { postId: intId },
    skip: intId === -1,
  });
};
