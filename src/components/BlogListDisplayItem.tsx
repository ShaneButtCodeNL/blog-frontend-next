import { BlogPostReturn } from "@/models/blogPostReturn";
import Link from "next/link";
import markdownParserToHTMLString from "@/functions/markdownParser";

export default function BlogListDisplayItem({
  blog,
}: {
  blog: BlogPostReturn;
}) {
  return (
    <div className="blog-display-item" key={`key-${blog.blogId}`}>
      <Link href={`/blog/${blog.blogId}`}>
        {blog.deleted ? (
          <div>Post Deleted</div>
        ) : (
          <>
            <div className="blog-display-title-bar">
              <h1 className="blog-display-title">{blog.title} </h1>
              <div className="blog-display-author">
                by <i className="blog-display-author-name">{blog.author}</i>
              </div>
            </div>
            <div className="blog-display-body-preview">
              {markdownParserToHTMLString(
                blog.body.length > 50
                  ? blog.body.substring(0, 47) + "..."
                  : blog.body,
                { asString: true }
              )}
            </div>
            <div className="blog-to-display-social-interactions">
              <div className="blog-display-like-count">
                {blog.likes.length}HRT
              </div>
              <div className="blog-to-display-comment-count">
                {blog.topLevelCommentCount} comments
              </div>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
