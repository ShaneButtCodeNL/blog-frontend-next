"use server";
import {
  BlogPostEditDetails,
  BlogPostReturn,
  BlogWithAuthorDetails,
  CommentDetails,
} from "@/models/blogPostReturn";
import { LoginReturnDetails, UserDetails } from "@/models/userReturn";
import { cookies } from "next/headers";

const userPath = `${process.env.API_HOST}${process.env.API_USER_BASE}`;
const blogPath = `${process.env.API_HOST}${process.env.API_POST_BASE}`;

const loginPath = `${userPath}/login`;
const registerPath = `${userPath}/register`;

const getBlogsPath = `${blogPath}/`;
const getLatestBlogPostPath = `${blogPath}/latest`;
const makeBlogPostPath = `${blogPath}/`;
const getAllUsernamesPath = `${userPath}/all-users`;
const searchBlogPath = `${getBlogsPath}search/title/`;
const deleteBlogPostPath = `${blogPath}/delete/post`;
const deleteCommentPath = `${blogPath}/delete/comment`;
const restorePostPath = `${blogPath}/restore/blog`;
const restoreCommentPath = `${blogPath}/restore/comment`;
const killBlogPostPath = `${blogPath}/blog`;
const makeKillEditCommentPath = `${blogPath}/comment`;
const addRolePathWithoutRole = `${userPath}/add-auth/`;
const removeRolePathWithoutRole = `${userPath}/remove-auth/`;
const banUserPathWithoutUsername = `${userPath}/ban-user/`;
const unbanUserPathWithoutUsername = `${userPath}/unban-user/`;
const disableUserPathWithoutUsername = `${userPath}/disable-user/`;
const enableUserPathWithoutUsername = `${userPath}/enable-user/`;
const deleteUserPathWithoutUsername = `${userPath}/delete-user/`;
const hasAnyAuthCheckPath = `${userPath}/has-any-auth`;

const GET = "GET";
const POST = "POST";
const PUT = "PUT";
const DELETE = "DELETE";

const tenSeconds = 10;
const thirtySeconds = 30;

const getJSONHeader = () => ({
  "Content-Type": "application/json",
});

const getBearerTokenHeader = (token: string) => ({
  Authorization: `Bearer ${token}`,
  "Content-Type": "application/json",
});

export async function refresh() {
  "use server";
  console.log("HERE", typeof window);
  const cookieStore = cookies();

  const res = await fetch("http://localhost:3000/api/refresh", {
    method: POST,
    headers: getJSONHeader(),
    cache: "no-store",
    body: JSON.stringify({ refreshToken: cookieStore.get("jwt")?.value }),
  });
  const refreshToken = res.headers
    .get("set-cookie")
    ?.split("; ")[0]
    .substring(4);
  const dateString = res.headers.get("set-cookie")?.split("; ")[2].substring(8);
  const expires = Date.parse(dateString!);
  cookies().set("jwt", refreshToken!, {
    httpOnly: true,
    secure: true,
    expires,
    sameSite: "strict",
    path: "/",
  });
  const data = await res.json();
  if (!data) throw new Error("User not found");
  const dateStringAccess = parseInt(data.token.expires);
  const expiresAccess = new Date(dateStringAccess!);
  cookies().set("accessToken", data.token.token, {
    httpOnly: true,
    secure: true,
    expires: expiresAccess,
    sameSite: "strict",
    path: "/",
  });
  return data;
}
export async function refreshMiddleware(refreshToken: string) {
  "use server";
  console.log("HERE", typeof window);

  const res = await fetch("http://localhost:3000/api/refresh", {
    method: POST,
    headers: getJSONHeader(),
    cache: "no-store",
    body: JSON.stringify({ refreshToken: refreshToken }),
  });
  const refreshTokenFromRes = res.headers
    .get("set-cookie")
    ?.split("; ")[0]
    .substring(4);
  const dateString = res.headers.get("set-cookie")?.split("; ")[2].substring(8);
  const expires = Date.parse(dateString!);

  const data = await res.json();
  if (!data) throw new Error("User not found");
  const dateStringAccess = parseInt(data.token.expires);
  const expiresAccess = new Date(dateStringAccess!);
  return {
    access: { token: data.token.token, expires: expiresAccess.getTime() },
    refresh: { token: refreshTokenFromRes, expires },
  };
}
export async function login(
  username: String,
  password: String
): Promise<LoginReturnDetails | null> {
  const res = await fetch("http://localhost:3000/api/login", {
    method: POST,
    body: JSON.stringify({ username, password }),
    headers: getJSONHeader(),
    cache: "no-store",
  });
  const refreshToken = res.headers
    .get("set-cookie")
    ?.split("; ")[0]
    .substring(4);
  const dateStringRefresh = res.headers
    .get("set-cookie")
    ?.split("; ")[2]
    .substring(8);
  const expiresRefresh = Date.parse(dateStringRefresh!);
  cookies().set("jwt", refreshToken!, {
    httpOnly: true,
    secure: true,
    expires: expiresRefresh,
    sameSite: "strict",
    path: "/",
  });
  const data = await res.json();
  if (!data) throw new Error("User not found");
  const dateStringAccess = parseInt(data.token.expires);
  console.log("dateSTR", dateStringAccess);
  const expiresAccess = new Date(dateStringAccess!);
  console.log(expiresAccess);
  cookies().set("accessToken", data.token.token, {
    httpOnly: true,
    secure: true,
    expires: expiresAccess,
    sameSite: "strict",
    path: "/",
  });
  return data;
}

export async function getAllUsernames(token: string) {
  const res = await fetch(getAllUsernamesPath, {
    method: POST,
    headers: getBearerTokenHeader(token),
    next: { revalidate: 5 * 60, tags: ["get-all-usernames"] },
  });
  if (!res || !res.ok) return [];
  const data = res.json();
  return data;
}

export async function isUsernameAvailable(username: string): Promise<boolean> {
  const fetchStr = `${userPath}/exists/${username}`;
  const res = await fetch(fetchStr);
  if (res.ok) {
    return true;
  }
  return false;
}

export async function getUserDetailsFromUsername(
  username: string
): Promise<UserDetails | null> {
  const fetchStr = `${userPath}/details/${username}`;
  const res = await fetch(fetchStr, {
    next: { revalidate: 60 * 60, tags: ["get-user-from-username"] },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function isTokenValid(token: string): Promise<boolean> {
  const fetchStr = `${userPath}/validate-token`;
  const res = await fetch(fetchStr, {
    method: POST,
    headers: getJSONHeader(),
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data = await res.json();
  return data;
}

export async function revalidateToken(token: string): Promise<string> {
  const fetchStr = `${userPath}/revalidate-token`;
  const res = await fetch(fetchStr, {
    method: POST,
    headers: getJSONHeader(),
    body: JSON.stringify({ token }),
    cache: "no-store",
  });
  const data: string = await res.text();
  return data;
}

export async function register(
  username: String,
  password: String
): Promise<LoginReturnDetails> {
  const res = await fetch(registerPath, {
    method: POST,
    body: JSON.stringify({ username, password }),
    headers: getJSONHeader(),
    next: { revalidate: 10 },
  });
  const data = await res.json();
  if (!data) throw new Error("Register failed");

  return data;
}

export async function logoffServer() {
  cookies().delete("token");
}

export async function getAllBlogPosts(): Promise<BlogPostReturn[]> {
  const res = await fetch(getBlogsPath, {
    method: GET,
    cache: "no-store",
    next: {
      tags: ["main-blog-list"],
    },
  });
  const data = await res.json();
  if (!data) throw new Error("Something went wrong");
  return data;
}

export async function createBlogPost(
  title: string,
  body: string,
  token: string
): Promise<BlogPostReturn | null> {
  const res = await fetch(makeBlogPostPath, {
    method: POST,
    headers: getBearerTokenHeader(token),
    cache: "no-store",
    body: JSON.stringify({ title, body }),
  });
  if (res.status === 401) {
    return null;
  }
  const data = await res.json();
  if (!data) return null;
  return data;
}

export async function createComment(
  blogId: string,
  token: string,
  { body, title, parentCommentId }: CommentDetails
) {
  const payload = Object.assign(
    { blogId, body },
    title === "" ? {} : { title },
    parentCommentId && parentCommentId !== "" ? { parentCommentId } : {}
  );
  const res = await fetch(makeKillEditCommentPath, {
    method: POST,
    headers: getBearerTokenHeader(token),
    cache: "no-store",
    body: JSON.stringify(payload),
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}

export async function searchBlogPostsWithTitleSnippit(
  titleSnippit: String
): Promise<BlogPostReturn[]> {
  const res = await fetch(`${searchBlogPath}${titleSnippit}`, {
    method: GET,
  });
  const data = await res.json();
  if (!data) throw new Error("Somthing happened. Darn monkeys.");
  return data;
}

export async function getBlogPostByBlogPostId(
  blogId: String
): Promise<BlogPostReturn> {
  const res = await fetch(`${getBlogsPath}post/${blogId}`, {
    cache: "no-store",
  });
  const data = await res.json();
  if (!data) throw new Error("Something went wrong");
  return data;
}

export async function likeBlogPostComment(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await fetch(
    `${getBlogsPath}comment/like/${blogId}/${commentId}`,
    {
      cache: "no-store",
      method: PUT,
      headers: getBearerTokenHeader(token),
    }
  );
  const data: string = await res.text();
  return data;
}

export async function likeBlogPost(blogId: string, token: string) {
  const res = await fetch(`${getBlogsPath}post/like/${blogId}`, {
    cache: "no-store",
    method: PUT,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data: string = await res.text();
  return data;
}

export async function deleteComment(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await fetch(deleteCommentPath, {
    method: PUT,
    cache: "no-store",
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ blogId, commentId }),
  });
  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

export async function deletePost(blogId: string, token: string) {
  const res = await fetch(deleteBlogPostPath, {
    cache: "no-store",
    method: PUT,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ blogId }),
  });
  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

export async function restoreComment(
  blogId: string,
  commentId: string,
  token: string
) {
  const payload = { blogId, commentId };
  const res = await fetch(restoreCommentPath, {
    cache: "no-store",
    method: PUT,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify(payload),
  });
  if (!res.ok) return null;
  const data = res.json();
  return data;
}

export async function restorePost(blogId: string, token: string) {
  const res = await fetch(restorePostPath, {
    cache: "no-store",
    method: PUT,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ blogId }),
  });
  if (!res.ok) return null;
  const data = res.json();

  return data;
}

export async function killComment(
  blogId: string,
  commentId: string,
  token: string
) {
  const res = await fetch(makeKillEditCommentPath, {
    cache: "no-store",
    method: DELETE,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ blogId, commentId }),
  });
  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

export async function killPost(blogId: string, token: string) {
  const res = await fetch(killBlogPostPath, {
    cache: "no-store",
    method: DELETE,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ blogId }),
  });
  if (!res.ok) return null;
  const data = await res.json();

  return data;
}

export async function editComment(
  blogId: string,
  commentId: string,
  token: string,
  { title, body }: BlogPostEditDetails
) {
  const res = await fetch(makeKillEditCommentPath, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    cache: "no-store",
    body: JSON.stringify(
      Object.assign(
        { blogId, commentId },
        body ? { body } : {},
        title ? { title } : {}
      )
    ),
  });
  if (!res.ok) return null;
  const data = res.json();
  return data;
}

export async function editPost(
  blogId: string,
  token: string,
  { title, body }: BlogPostEditDetails
) {
  const res = await fetch(getBlogsPath, {
    method: PUT,
    cache: "no-store",
    headers: getBearerTokenHeader(token),
    body: JSON.stringify(
      Object.assign({ blogId }, body ? { body } : {}, title ? { title } : {})
    ),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function getLatestPost(): Promise<BlogWithAuthorDetails | null> {
  const res = await fetch(getLatestBlogPostPath, {
    method: GET,
    headers: getJSONHeader(),
    next: { revalidate: thirtySeconds, tags: ["get-latest-post"] },
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data;
}

export async function addRole(token: string, role: string, username: string) {
  const res = await fetch(`${addRolePathWithoutRole}${role.toLowerCase()}`, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    body: JSON.stringify({ username }),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}

export async function removeRole(
  token: string,
  role: "ADMIN" | "WRITER" | "MODERATOR",
  username: string
) {
  const res = await fetch(
    `${removeRolePathWithoutRole}${role.toLocaleLowerCase()}`,
    {
      method: PUT,
      headers: getBearerTokenHeader(token),
      body: JSON.stringify({ username }),
      cache: "no-cache",
    }
  );
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}

export async function banUser(token: string, username: string) {
  const res = await fetch(`${banUserPathWithoutUsername}${username}`, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}
export async function unbanUser(token: string, username: string) {
  const res = await fetch(`${unbanUserPathWithoutUsername}${username}`, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}
export async function disableUser(token: string, username: string) {
  const res = await fetch(`${disableUserPathWithoutUsername}${username}`, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}
export async function enableUser(token: string, username: string) {
  const res = await fetch(`${enableUserPathWithoutUsername}${username}`, {
    method: PUT,
    headers: getBearerTokenHeader(token),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}
export async function deleteUser(token: string, username: string) {
  const res = await fetch(`${deleteUserPathWithoutUsername}${username}`, {
    method: DELETE,
    headers: getBearerTokenHeader(token),
    cache: "no-cache",
  });
  if (!res || !res.ok) return null;
  const data = await res.json();
  return data;
}
export async function hasAnyAuth(token: string | undefined, roles: string[]) {
  if (!token) return null;
  const res = await fetch(hasAnyAuthCheckPath, {
    method: POST,
    headers: getJSONHeader(),
    cache: "no-cache",
    body: JSON.stringify({ token, roles }),
  });
  if (!res || !res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}
export async function hasAllAuth(token: string | undefined, roles: string[]) {
  if (!token) return null;
  const res = await fetch(hasAnyAuthCheckPath, {
    method: POST,
    headers: getJSONHeader(),
    cache: "no-cache",
    body: JSON.stringify({ token, roles }),
  });
  if (!res || !res.ok) {
    return null;
  }

  const data = await res.json();
  return data;
}
