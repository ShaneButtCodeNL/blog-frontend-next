import BlogPostDisplay from "@/components/BlogPostDisplay";
import { getBlogPostByBlogPostId } from "@/functions/apiController";

export default async function Page({ params }: { params: { blogId: string } }) {
  const data = await getBlogPostByBlogPostId(params.blogId);

  return (
    <>
      <BlogPostDisplay blogPost={data} />
    </>
  );
}
