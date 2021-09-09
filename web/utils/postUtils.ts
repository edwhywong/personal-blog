import { Post } from "../generated/graphql";

const SEPARATOR = "-";

export const sanitizeTextForUrl = (text: string) => {
  return text.replace(/[^aA-zZ0-9]/g, SEPARATOR);
};

export const constructPostId = (
  post: Pick<Post, "id" | "title" | "summary" | "publishedAt">
) => {
  return `${sanitizeTextForUrl(post.title)}${SEPARATOR}${post.id}`;
};

export const getPostIntId = (path: string) => {
  return parseInt(path.split(SEPARATOR).pop()!);
};
