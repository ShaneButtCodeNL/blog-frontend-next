"use server";
import {
  createBlogPost,
  isTokenValid,
  likeBlogPost,
  revalidateToken,
} from "./apiController";

export async function validateTokenFunction(token: string) {
  "use server";
  const valid = await isTokenValid(token);
  return valid;
}

export async function revalidateTokenFunction(token: string) {
  "use server";
  const newToken = await revalidateToken(token);
  return newToken;
}

export async function makeNewPostFunction(
  title: string,
  body: string,
  token: string
) {
  "use server";
  const res = await createBlogPost(title, body, token);
  return res;
}
export async function likePost(blogId: string, token: string) {
  const res = await likeBlogPost(blogId, token);
  console.log(res);
  return;
}
