import { getLatestPost } from "@/functions/apiController";
import BlogListDisplayItem from "./BlogListDisplayItem";

export default async function LatestBlogPost() {
  const data = await getLatestPost();
  return (
    <div id="latest-blog-post">
      {data ? (
        <BlogListDisplayItem blog={data} />
      ) : (
        <p>Looks like there is no post. Huh how did that happen.</p>
      )}
    </div>
  );
}
