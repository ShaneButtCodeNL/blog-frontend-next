import { BlogPostReturn } from "@/models/blogPostReturn";
import { getDateString } from "@/functions/helpers";
import BlogPostCommentDisplay from "./BlogPostCommentDisplay";
import BlogPostDisplayControls from "./BlogPostDisplayControls";

export default function BlogPostDisplay(params: any) {
  const blogPost: BlogPostReturn = params.blogPost;

  return (
    <div id="blog-post-display-container">
      {blogPost.deleted ? (
        <div>Blog Post is Deleted.</div>
      ) : (
        <>
          <h2 id="blog-post-title">{blogPost.title}</h2>
          <div id="blog-creation-details">
            <div id="blog-author">Written By: {blogPost.author}</div>
            <div id="blog-writen-on">
              Created On: {getDateString(blogPost.createdOn)}
            </div>
            <div
              id="blog-edited-on"
              style={
                blogPost.lastUpdated === blogPost.createdOn
                  ? { display: "none" }
                  : {}
              }
            >
              Updated On: {getDateString(blogPost.lastUpdated)}
            </div>
          </div>
          <div id="blog-body">{blogPost.body}</div>
        </>
      )}
      <BlogPostDisplayControls
        listOfLikes={blogPost.likes}
        blogId={blogPost.blogId}
        deleted={blogPost.deleted}
      />
      <div id="blog-comments">
        {blogPost.comments.map((comment, i) => (
          <BlogPostCommentDisplay
            comment={comment}
            key={`key-BCD-${comment.commentId}`}
            order={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
