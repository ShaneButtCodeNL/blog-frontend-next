import { BlogPostReturn } from "@/models/blogPostReturn";
import Link from "next/link";

export default function BlogListDisplayItem(params: any) {
  const blogToDisplay: BlogPostReturn = params.blog;

  return (
    <div className="blog-display-item" key={`key-${blogToDisplay.blogId}`}>
      <Link href={`/blog/${blogToDisplay.blogId}`}>
        {blogToDisplay.deleted ? (
          <div>Post Deleted</div>
        ) : (
          <>
            <div className="blog-display-title-bar">
              <h1 className="blog-display-title">{blogToDisplay.title} </h1>
              <div className="blog-display-author">
                by{" "}
                <i className="blog-display-author-name">
                  {blogToDisplay.author}
                </i>
              </div>
            </div>
            <div className="blog-display-body-preview">
              {blogToDisplay.body.length > 50
                ? blogToDisplay.body.substring(0, 47) + "..."
                : blogToDisplay.body}
            </div>
            <div className="blog-to-display-social-interactions">
              <div className="blog-display-like-count">
                {blogToDisplay.likes.length}HRT
              </div>
              <div className="blog-to-display-comment-count">
                {blogToDisplay.topLevelCommentCount} comments
              </div>
            </div>
          </>
        )}
      </Link>
    </div>
  );
}
