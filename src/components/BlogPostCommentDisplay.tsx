"use client";
import { getDateString, openMakeCommentReplyModal } from "@/functions/helpers";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import { setParentCommentId } from "@/store/commentReply";
import { useState } from "react";

export default function BlogPostCommentDisplay({
  mainComment,
  order,
}: {
  mainComment: BlogPostCommentReturn;
  order: number;
}) {
  const [hide, setHide] = useState(false);
  return (
    <div
      className="blog-post-comment-container"
      key={`key-${mainComment.commentId}`}
      style={{ order }}
    >
      <div id={`${mainComment.commentId}-title`}>{mainComment.title}</div>
      <div
        id={`${mainComment.commentId}-details`}
        className="blog-post-comment-display-details"
      >
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
      </div>
      <div className="comment-actions">
        <button
          type="button"
          onClick={() => setHide(true)}
          style={hide ? { display: "none" } : {}}
        >
          Hide
        </button>
        <button
          type="button"
          onClick={() => setHide(false)}
          style={hide ? {} : { display: "none" }}
        >
          Show
        </button>

        <div className="comment-likes-container" style={{ display: "flex" }}>
          <div className="comment-like-count">{mainComment.likes.length}</div>
          <button type="button" className="comment-like-btn">
            LK
          </button>
        </div>
        <button
          type="button"
          style={hide ? { display: "none" } : {}}
          onClick={() => {
            console.log(mainComment.commentId);
            store.dispatch(setParentCommentId(mainComment.commentId));
            openMakeCommentReplyModal(mainComment.blogId);
          }}
        >
          Reply
        </button>
      </div>
      <div
        id={`${mainComment.commentId}-body`}
        style={hide ? { display: "none" } : {}}
      >
        {mainComment.body}
      </div>
      <div className="comment-replies" style={hide ? { display: "none" } : {}}>
        {mainComment.replies.map((reply, i) => (
          <BlogPostCommentDisplay
            mainComment={reply}
            order={mainComment.replies.length - i + 1}
            key={reply.commentId}
          />
        ))}
      </div>
    </div>
  );
}
