import { useMeQuery } from "../generated/graphql";

const Me = () => {
  const { data, loading } = useMeQuery();

  if (data?.me.email) {
    return data.me.email;
  } else {
    return "not authorized";
  }
};

export default Me;
