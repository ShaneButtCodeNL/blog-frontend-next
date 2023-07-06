import { getDateString } from "@/functions/helpers";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";

export default function BlogPostCommentDisplay(params: any) {
  const mainComment: BlogPostCommentReturn = params.comment;
  return (
    <div key={`key-${mainComment.commentId}`}>
      <div id={`${mainComment.commentId}-title`}>{mainComment.title}</div>
      <div id={`${mainComment.commentId}-details`}>
        <div className="comment-author">{mainComment.author}</div>
        <div className="comment-created-on">
          {getDateString(mainComment.createdOn)}
        </div>
        <div
          className="comment-edited-on"
          style={
            mainComment.lastUpdated > mainComment.createdOn
              ? { display: "none" }
              : {}
          }
        >
          {getDateString(mainComment.lastUpdated)}
        </div>
        <div className="comment-count-replies">
          Replies : {mainComment.topLevelCommentCount}
        </div>
        <div className="comment-actions">
          <button type="button">Hide</button>
          <div className="comment-likes-container">
            <div className="comment-like-count">{mainComment.likes.length}</div>
            <button type="button" className="comment-like-btn">
              LK
            </button>
          </div>
          <button type="button">Reply</button>
        </div>
      </div>
      <div id={`${mainComment.commentId}-body`}>{mainComment.body}</div>
      <div className="comment-replies">
        {mainComment.replies.map((reply) => (
          <BlogPostCommentDisplay comment={reply} key={reply.commentId} />
        ))}
      </div>
    </div>
  );
}
