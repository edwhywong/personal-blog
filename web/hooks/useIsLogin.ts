import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { ACCESS_TOKEN_KEY } from "../constants";

export const useIsLogin = () => {
  if (typeof window === "undefined") return false;
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (!accessToken) return false;
  console.log("token", jwt_decode(accessToken));
  return !!(jwt_decode(accessToken) as any).userId;
};
