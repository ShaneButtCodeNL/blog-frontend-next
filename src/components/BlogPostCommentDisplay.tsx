"use client";

/**
 * TODO Add modals for confirmation
 * TODO Add restore,remove,and edit functionality
 */
import { getDateString } from "@/functions/helpers";

import { BlogPostCommentReturn } from "@/models/blogPostReturn";

import { useState } from "react";
import BlogPostCommentDisplayControls from "./BlogPostCommentDisplayControls";

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
      {mainComment.deleted ? (
        <div id={`${mainComment.commentId}-title`}>Comment Deleted</div>
      ) : (
        <>
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
        </>
      )}

      <BlogPostCommentDisplayControls
        mainComment={mainComment}
        hide={hide}
        setHide={setHide}
      />

      {mainComment.deleted ? (
        <></>
      ) : (
        <div
          id={`${mainComment.commentId}-body`}
          style={hide ? { display: "none" } : {}}
        >
          {mainComment.body}
        </div>
      )}
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
