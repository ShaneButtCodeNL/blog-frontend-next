import { BlogPostReturn } from "@/models/blogPostReturn";
import { getDateString } from "@/functions/helpers";
import BlogPostCommentDisplay from "./BlogPostCommentDisplay";
import BlogPostDisplayControls from "./BlogPostDisplayControls";
import Providers from "./Provider";

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
      <Providers>
        <BlogPostDisplayControls
          listOfLikes={blogPost.likes}
          blogId={blogPost.blogId}
          author={blogPost.author}
          deleted={blogPost.deleted}
        />
      </Providers>
      <div id="blog-comments">
        {blogPost.comments.map((comment, i) => (
          <BlogPostCommentDisplay
            mainComment={comment}
            key={`key-BCD-${comment.commentId}`}
            order={blogPost.comments.length - i + 1}
          />
        ))}
      </div>
    </div>
  );
}
