import { BlogPostReturn } from "@/models/blogPostReturn";
import { LoginReturnDetails, UserDetails } from "@/models/userReturn";
import { headers } from "next/dist/client/components/headers";
import next from "next/types";
import { cache } from "react";

const userPath = `${process.env.API_HOST}${process.env.API_USER_BASE}`;
const blogPath = `${process.env.API_HOST}${process.env.API_POST_BASE}`;

const loginPath = `${userPath}/login`;
const registerPath = `${userPath}/register`;

const getBlogsPath = `${blogPath}/`;
const searchBlogPath = `${getBlogsPath}search/title/`;

const GET = "GET";
const POST = "POST";
const PUT = "PUT";

const tenSeconds = 10;
const thirtySeconds = 30;

const getJSONHeader = () => ({
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
  if (res.status == 404) return null;
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
    next: { revalidate: tenSeconds },
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
) {}

export function createComment() {}

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
    next: { revalidate: thirtySeconds },
  });
  const data = await res.json();
  console.log(data);
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
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const data: string = await res.json();
  return data;
}
