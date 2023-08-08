"use server";
import { revalidatePath, revalidateTag } from "next/cache";
import {
  addRole,
  createBlogPost,
  createComment,
  deleteComment,
  deletePost,
  editComment,
  editPost,
  getAllUsernames,
  getUserDetailsFromUsername,
  isTokenValid,
  killComment,
  killPost,
  likeBlogPost,
  likeBlogPostComment,
  login,
  removeRole,
  restoreComment,
  restorePost,
  revalidateToken,
} from "./apiController";
import { BlogPostEditDetails, CommentDetails } from "@/models/blogPostReturn";

export async function validateTokenFunction(token: string) {
  "use server";
  const valid = await isTokenValid(token);
  return valid;
}
export async function getAllUsernamesFunction(token: string) {
  "use server";
  const res = await getAllUsernames(token);
  return res;
}

export async function getUserDetailsFromUsernameFunction(username: string) {
  "use server";
  const res = await getUserDetailsFromUsername(username);
  return res;
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
  revalidateTag("get-latest-post");
  revalidateTag("main-blog-list");
  return res;
}

export async function likePost(blogId: string, token: string) {
  const res = await likeBlogPost(blogId, token);
  console.log(res);
  revalidatePath(`/blog/${blogId}`);
  return;
}

export async function likeCommentFunction(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await likeBlogPostComment(blogId, commentId, token);
  revalidatePath(`/blog/${blogId}`);
  return;
}

export async function loginFunction(username: string, password: string) {
  const res = await login(username, password);
  if (!res) {
    return;
  }
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
    return;
  }
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

export async function deleteCommentFunction(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await deleteComment(blogId, commentId, token);
  if (!res) return null;
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

export async function restoreCommentFunction(
  blogId: string,
  commentId: string,
  token: string
) {
  console.log("INSIDE SERVER FUNCTION");
  const res = await restoreComment(blogId, commentId, token);
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

export async function killCommentFunction(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await killComment(blogId, commentId, token);
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

export async function editCommentFunction(
  blogId: string,
  commentId: string,
  token: string,
  editDetails: BlogPostEditDetails
) {
  const res = await editComment(blogId, commentId, token, editDetails);
  if (!res) return null;
  revalidatePath(`/blog/${blogId}`);
  revalidateTag("main-blog-list");
  return res;
}
export async function revalidateTagServer(tag: string) {
  revalidateTag(tag);
}

export async function addRoleToUserFunction(
  token: string,
  role: "ADMIN" | "WRITER" | "MODERATOR",
  username: string
) {
  const res = await addRole(token, role, username);
  if (!res) return null;
  revalidateTag("get-user-from-username");
  return res;
}

export async function removeRoleToUserFunction(
  token: string,
  role: "ADMIN" | "WRITER" | "MODERATOR",
  username: string
) {
  const res = await removeRole(token, role, username);
  if (!res) return null;
  revalidateTag("get-user-from-username");

  return res;
}
