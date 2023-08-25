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
  logoffServer,
  getAllBlogPosts,
  refresh,
} from "./apiController";
import {
  BlogPostEditDetails,
  BlogPostReturn,
  CommentDetails,
  SortTypes,
} from "@/models/blogPostReturn";
import { cookies } from "next/dist/client/components/headers";
import { store } from "@/store";
import { setSortType } from "@/store/blogPosts";
import { applySorting, applyTitleFilter } from "./helpers";
import { setSearch } from "@/store/search";
import { setAccessToken, setLogin } from "@/store/login";

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
export async function getAllBlogPostsFunction() {
  "use server";
  const res = await getAllBlogPosts();
  return res;
}

export async function getUserDetailsFromUsernameFunction(username: string) {
  "use server";
  const res = await getUserDetailsFromUsername(username);
  return res;
}

export async function logoutServerFunction() {
  "use server";
  await logoffServer();
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

export async function loginFunctionServer(username: string, password: string) {
  "use server";
  const res = await login(username, password);
  if (!res) {
    return;
  }

  return res;
}

export async function refreshFunctionServer() {
  "use server";
  const res = await refresh();

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
export async function updateStoreSortType(sortType: SortTypes) {
  "use server";
  revalidatePath("/blogs/[pageNumber]");
  store.dispatch(setSortType(sortType));
  return;
}
export async function updateStoreSearchTitleServerFunction(
  searchString: string
) {
  "use server";
  revalidatePath("/blogs/[pageNumber]");
  store.dispatch(setSearch(searchString));
  return;
}
export async function applySortingServerFunction(
  list: BlogPostReturn[],
  sortType: SortTypes | null | undefined
) {
  "use server";
  return applySorting(list, sortType);
}
export async function applyTitleFilterServerFunction(
  list: BlogPostReturn[],
  searchString: string
) {
  "use server";
  return applyTitleFilter(list, searchString);
}
