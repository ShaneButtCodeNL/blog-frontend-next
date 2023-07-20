"use server";
import {
  createBlogPost,
  createComment,
  isTokenValid,
  likeBlogPost,
  login,
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

export async function loginFunction(username: string, password: string) {
  const res = await login(username, password);
  if (!res) {
    console.log("fail");
    return;
  }
  console.log("PASS");
  return res;
}

export async function createCommentFunction(
  blogId: string,
  body: string,
  token: string,
  parentCommentId: string | null = null
) {
  const res = await createComment(blogId, body, token, parentCommentId);
  if (!res) {
    console.log("FAIL MAKE COMMENT");
    return;
  }
  console.log("PASS MAKE COMMENT");
  return res;
}
