import { BlogPostReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import BlogListDisplayItem from "./BlogListDisplayItem";
import PaginatedBlogPostListControls from "./PaginatedBlogPostListControls";

export default async function PaginatedBlogPostList({
  sorted,
}: {
  sorted?: string;
}) {
  const startPage: number =
    (store.getState().blogPostList.currentPage - 1) *
    store.getState().blogPostList.displayNumber;
  const endPage: number =
    startPage + store.getState().blogPostList.displayNumber;
  const list: BlogPostReturn[] = store
    .getState()
    .blogPostList.list.slice(startPage, endPage);
  return (
    <div id="blog-list-slice-container">
      <div id="blog-list-slice">
        {list.map((blog, index) => (
          <BlogListDisplayItem blog={blog} key={`${blog.blogId}-#${index}`} />
        ))}
      </div>
      <PaginatedBlogPostListControls sorted={sorted} />
    </div>
  );
}
