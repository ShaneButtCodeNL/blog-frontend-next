"use client";
import { BlogPostReturn } from "@/models/blogPostReturn";
import Link from "next/link";
import markdownParserToHTMLString from "@/functions/markdownParser";
import { useEffect, useState } from "react";
import { getUserDetailsFromUsernameFunction } from "@/functions/serverFunctions";

export default function BlogListDisplayItem({
  blog,
}: {
  blog: BlogPostReturn;
}) {
  const [author, setAuthor] = useState("(DELETED)");
  const [loading, setLoading] = useState(true);
  const [disabled, setDisabled] = useState(true);
  const [banned, setBanned] = useState(false);
  useEffect(() => {
    getUserDetailsFromUsernameFunction(blog.author).then((user) => {
      if (user) {
        if (!user.disabled) {
          setAuthor(user.username as string);
          setDisabled(false);
        }
        setBanned(user.banned);
        setLoading(false);
      }
    });
  }, []);
  return (
    <div className="blog-display-item-wrapper">
      <div
        className="loading-display-item"
        style={loading ? {} : { display: "none" }}
      ></div>
      <div
        className="loading-display-item-text"
        style={loading ? {} : { display: "none" }}
      >
        Loading
      </div>
      <div
        className="blog-display-item"
        key={`key-${blog.blogId}`}
        style={loading ? { display: "none" } : {}}
      >
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
                    {author}
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
    </div>
  );
}
