import BlogListDisplayItem from "./BlogListDisplayItem";
import { getLatestPostFunction } from "@/functions/serverFunctions";
import LatestBlogListDisplayItem from "./LatestBlogDisplayItem";

export default async function LatestBlogPost() {
  const data = await getLatestPostFunction();
  return (
    <div id="latest-blog-post">
      <h2>Latest Post</h2>
      {data ? (
        <LatestBlogListDisplayItem blogWithAuthorDetails={data} />
      ) : (
        <p>Looks like there is no post. Huh how did that happen.</p>
      )}
    </div>
  );
}
