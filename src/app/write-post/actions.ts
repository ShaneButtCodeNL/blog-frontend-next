import { createBlogPost } from "@/functions/apiController";

export default async function createBlogPostFunction(
  title: string,
  body: string,
  token: string
) {
  const res = await createBlogPost(title, body, token);
}
