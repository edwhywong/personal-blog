import { Response } from "express";

export const sendRefreshToken = (res: Response, refreshToken: string) => {
  res.cookie("jid", refreshToken, {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: "none",
    secure: true,
  });
};
