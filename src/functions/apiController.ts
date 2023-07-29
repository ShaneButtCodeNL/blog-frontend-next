import {
  BlogPostEditDetails,
  BlogPostReturn,
  CommentDetails,
} from "@/models/blogPostReturn";
import { LoginReturnDetails, UserDetails } from "@/models/userReturn";

const userPath = `${process.env.API_HOST}${process.env.API_USER_BASE}`;
const blogPath = `${process.env.API_HOST}${process.env.API_POST_BASE}`;

const loginPath = `${userPath}/login`;
const registerPath = `${userPath}/register`;

const getBlogsPath = `${blogPath}/`;
const makeBlogPostPath = `${blogPath}/`;
//const makeCommentPath = `${blogPath}/comment`;
const searchBlogPath = `${getBlogsPath}search/title/`;
const deleteBlogPostPath = `${blogPath}/delete/post`;
const deleteCommentPath = `${blogPath}/delete/comment`;
const restorePostPath = `${blogPath}/restore/blog`;
const restoreCommentPath = `${blogPath}/restore/comment`;
const killBlogPostPath = `${blogPath}/blog`;
const makeKillEditCommentPath = `${blogPath}/comment`;

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

export async function login(
  username: String,
  password: String
): Promise<LoginReturnDetails | null> {
  const res = await fetch(loginPath, {
    method: POST,
    body: JSON.stringify({ username, password }),
    headers: getJSONHeader(),
    cache: "no-store",
  });
  if (res.status >= 400) return null;
  if (!res) return null;
  console.log(res);
  const data = await res.json();
  console.log(data);
  if (!data) throw new Error("User not found");

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
): Promise<UserDetails> {
  const fetchStr = `${userPath}/details/${username}`;
  const res = await fetch(fetchStr, { next: { revalidate: 12 * 60 * 60 } });
  if (!res.ok) throw new Error("User Not Found");
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
  console.log(data);
  if (!data) throw new Error("Register failed");

  return data;
}

export function logoff() {}

export async function getAllBlogPosts(): Promise<BlogPostReturn[]> {
  const res = await fetch(getBlogsPath, {
    method: GET,
    next: {
      revalidate: tenSeconds,
      tags: ["main-blog-list"],
    },
  });
  const data = await res.json();
  console.log(data);
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
  console.log(res);
  if (res.status === 401) {
    return null;
  }
  const data = await res.json();
  if (!data) return null;
  //revalidateTag("main-blog-list");
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

  console.log(data);
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
  const res = await fetch(`${getBlogsPath}post/like/${blogId}/${commentId}`, {
    cache: "no-store",
    method: PUT,
    headers: getBearerTokenHeader(token),
  });
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
