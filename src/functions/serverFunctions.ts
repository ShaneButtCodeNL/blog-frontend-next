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
  banUser,
  unbanUser,
  deleteUser,
  disableUser,
  enableUser,
  getLatestPost,
  register,
  isUsernameAvailable,
  hasAnyAuth,
  hasAllAuth,
} from "./apiController";
import { BlogPostEditDetails, CommentDetails } from "@/models/blogPostReturn";
import { cookies } from "next/dist/client/components/headers";

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
  "use server";
  const res = await likeBlogPostComment(blogId, commentId, token);
  revalidatePath(`/blog/${blogId}`);
  return;
}

export async function loginFunction(username: string, password: string) {
  const res = await login(username, password);
  if (!res) {
    return;
  }
  await setTokenInCookie(res.token as string);
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
  console.log(res);
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
export async function banUserFunction(token: string, username: string) {
  "use server";
  const res = await banUser(token, username);
  revalidateTag("get-user-from-username");
  return res;
}
export async function unbanUserFunction(token: string, username: string) {
  "use server";
  const res = await unbanUser(token, username);
  revalidateTag("get-user-from-username");
  return res;
}
export async function disableUserFunction(token: string, username: string) {
  "use server";
  const res = await disableUser(token, username);
  revalidateTag("get-user-from-username");
  return res;
}
export async function enableUserFunction(token: string, username: string) {
  "use server";
  const res = await enableUser(token, username);
  revalidateTag("get-user-from-username");
  return res;
}
export async function deleteUserFunction(token: string, username: string) {
  "use server";
  const res = await deleteUser(token, username);
  revalidateTag("get-user-from-username");
  revalidateTag("get-all-usernames");
  return res;
}
export async function getLatestPostFunction() {
  "use server";
  const res = await getLatestPost();
  return res;
}
export async function setTokenInCookie(token: string) {
  "use server";
  console.log("SETTING COOKIE", token);
  cookies().set({ name: "token", value: token, httpOnly: true });
}

export async function registerFunction(username: string, password: string) {
  "use server";
  const res = await register(username, password);
  if (!res) {
    return;
  }
  return res;
}
export async function checkUsernameIsAvailableFunction(username: string) {
  "use server";
  const res = await isUsernameAvailable(username);
  console.log("is ", username as string, " available: ", res);
  return res === true;
}

export async function hasAnyAuthFunction(
  token: string | undefined,
  roles: string[]
) {
  const res = await hasAnyAuth(token, roles);
  return res;
}

export async function hasAllAuthFunction(
  token: string | undefined,
  roles: string[]
) {
  const res = await hasAllAuth(token, roles);
  return res;
}
