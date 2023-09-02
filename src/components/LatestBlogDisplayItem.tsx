"use server";
import { BlogWithAuthorDetails } from "@/models/blogPostReturn";
import Link from "next/link";
import markdownParserToHTMLString from "@/functions/markdownParser";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";

export default async function LatestBlogListDisplayItem({
  blogWithAuthorDetails,
}: {
  blogWithAuthorDetails: BlogWithAuthorDetails;
}) {
  const blog = blogWithAuthorDetails.blogDetails;
  const disabled = blogWithAuthorDetails.authorDetails.disabled;
  const banned = blogWithAuthorDetails.authorDetails.banned;
  const author = blogWithAuthorDetails.authorDetails.username;
  return (
    <div className="blog-display-item-wrapper">
      <div className="blog-display-item" key={`key-${blog.blogId}`}>
        <Link href={`/blog/${blog.blogId}`}>
          {blog.deleted ? (
            <div>Post Deleted</div>
          ) : (
            <>
              <div className="blog-display-title-bar">
                <h1 className="blog-display-title">{blog.title} </h1>
                <div className="blog-display-author">
                  by{" "}
                  <i
                    className={`blog-display-author-name ${
                      disabled ? "fade-text" : ""
                    } ${banned ? "text-reject" : ""}`}
                  >
                    {disabled ? "(DELETED)" : author}
                  </i>
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
                <div className="blog-display-like-count like-controls">
                  <div className="like-count">{blog.likes.length}</div>
                  <FontAwesomeIcon icon={faHeart} className="heart" />
                </div>
                <div className="blog-to-display-comment-count like-controls">
                  <div className="like-count">{blog.topLevelCommentCount}</div>
                  <FontAwesomeIcon icon={faCommentDots} />
                </div>
              </div>
            </>
          )}
        </Link>
      </div>
    </div>
  );
}
