import { BlogPostReturn } from "@/models/blogPostReturn";
import { getDateString } from "@/functions/helpers";
import BlogPostCommentDisplay from "./BlogPostCommentDisplay";
import BlogPostDisplayControls from "./BlogPostDisplayControls";
import Providers from "./Provider";
import markdownParserToHTMLString from "@/functions/markdownParser";
import BlogPostDisplayBody from "./BlogPostDisplayBody";
import { getUserDetailsFromUsername } from "@/functions/apiController";
import BlogPostCommentDisplayWrapper from "./BlogPostCommentDisplayWrapper";

export default async function BlogPostDisplay(params: any) {
  const blogPost: BlogPostReturn = params.blogPost;
  const user = await getUserDetailsFromUsername(blogPost.author);
  let author = "(DELETED)";
  if (user) {
    if (!user.disabled) author = user.username as string;
  }

  return (
    <div id="blog-post-display-container">
      {blogPost.deleted ? (
        <div>Blog Post is Deleted.</div>
      ) : (
        <>
          <h2 id="blog-post-title">{blogPost.title}</h2>
          <div id="blog-creation-details">
            <div id="blog-author">
              Written By:{" "}
              <span className={`${user?.disabled ? "fade-text" : ""}`}>
                {author}
              </span>
            </div>
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
          <BlogPostDisplayBody
            htmlString={markdownParserToHTMLString(blogPost.body)}
          />
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
          <BlogPostCommentDisplayWrapper
            key={`key-BCD-wrapper-${comment.commentId}`}
            order={blogPost.comments.length - i + 1}
          >
            <BlogPostCommentDisplay
              mainComment={comment}
              key={`key-BCD-${comment.commentId}`}
            />
          </BlogPostCommentDisplayWrapper>
        ))}
      </div>
    </div>
  );
}
