"use server";
import { BlogPostReturn } from "@/models/blogPostReturn";
import Link from "next/link";
import markdownParserToHTMLString from "@/functions/markdownParser";
import { getUserDetailsFromUsernameFunction } from "@/functions/serverFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots, faHeart } from "@fortawesome/free-solid-svg-icons";

export default async function BlogListDisplayItem({
  blog,
}: {
  blog: BlogPostReturn;
}) {
  const user = await getUserDetailsFromUsernameFunction(blog.author);
  const disabled = user ? user.disabled : true;
  const banned = user ? user.banned : false;
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
                      banned ? "text-reject" : ""
                    } ${disabled ? "fade-text" : ""}`}
                  >
                    {disabled ? "(DELETED)" : blog.author}
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
