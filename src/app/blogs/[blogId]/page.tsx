import BlogPostDisplay from "@/components/BlogPostDisplay";
import { getBlogPostByBlogPostId } from "@/functions/apiController";

export default async function Page({ params }: { params: { blogId: string } }) {
  const data = await getBlogPostByBlogPostId(params.blogId);

  return (
    <>
      <h1>BLOG PAGE:</h1>
      <BlogPostDisplay blogPost={data} />
    </>
  );
}
