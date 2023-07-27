"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  createBlogPost,
  createComment,
  deletePost,
  editPost,
  isTokenValid,
  killPost,
  likeBlogPost,
  login,
  restorePost,
  revalidateToken,
} from "./apiController";
import { BlogPostEditDetails, CommentDetails } from "@/models/blogPostReturn";

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
  revalidatePath(`/blog/${blogId}`);
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
  token: string,
  { body, title, parentCommentId }: CommentDetails
) {
  const res = await createComment(blogId, token, {
    body,
    title,
    parentCommentId,
  });
  console.table({ body, title, parentCommentId });
  if (!res) {
    console.log("FAIL MAKE COMMENT");
    return;
  }
  console.log("PASS MAKE COMMENT");
  revalidatePath(`/blog/${blogId}`);

  return res;
}

export async function deleteBlogPostFunction(blogId: string, token: string) {
  const res = await deletePost(blogId, token);
  if (!res) {
    return null;
  }
  revalidatePath(`/blog/${blogId}`);
  revalidateTag("main-blog-list");

  return res;
}
export async function restoreBlogPostFunction(blogId: string, token: string) {
  const res = await restorePost(blogId, token);
  if (!res) {
    return null;
  }
  revalidatePath(`/blog/${blogId}`);
  revalidateTag("main-blog-list");
  return res;
}
export async function killBlogPostFunction(blogId: string, token: string) {
  const res = await killPost(blogId, token);
  if (!res) {
    return null;
  }
  revalidatePath(`/blog/${blogId}`);
  revalidateTag("main-blog-list");
  return res;
}
export async function editBlogPostFunction(
  blogId: string,
  token: string,
  editDetails: BlogPostEditDetails
) {
  const res = await editPost(blogId, token, editDetails);
  if (!res) return null;
  revalidatePath(`/blog/${blogId}`);
  revalidateTag("main-blog-list");
  return res;
}
