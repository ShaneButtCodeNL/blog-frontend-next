import { getDateString } from "@/functions/helpers";

import { BlogPostCommentReturn } from "@/models/blogPostReturn";

import { useEffect, useState } from "react";
import BlogPostCommentDisplayControls from "./BlogPostCommentDisplayControls";
import Providers from "./Provider";
import { getUserDetailsFromUsernameFunction } from "@/functions/serverFunctions";
import BlogPostCommentDisplayWrapper from "./BlogPostCommentDisplayWrapper";

export default async function BlogPostCommentDisplay({
  mainComment,
}: {
  mainComment: BlogPostCommentReturn;
}) {
  const user = await getUserDetailsFromUsernameFunction(mainComment.author);
  if (!user) return null;
  const disabled = user.disabled;
  const banned = user.banned;
  const author = disabled ? "(DELETED)" : user.username;
  return (
    <div
      className="blog-post-comment-inner"
      key={`key-${mainComment.commentId}`}
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
            <div
              className={`comment-author ${banned ? "text-reject" : ""} ${
                disabled ? "fade-text" : ""
              }`}
            >
              {author}
            </div>
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

      <Providers>
        <BlogPostCommentDisplayControls
          mainComment={mainComment}
          key={`${mainComment.commentId}-controls`}
        />
      </Providers>

      {mainComment.deleted ? (
        <></>
      ) : (
        <div id={`${mainComment.commentId}-body`}>{mainComment.body}</div>
      )}
      <div className="comment-replies">
        {mainComment.replies.map((reply, i) => (
          <BlogPostCommentDisplayWrapper
            order={mainComment.replies.length - 1 - i}
            key={reply.commentId}
          >
            <BlogPostCommentDisplay mainComment={reply} key={reply.commentId} />
          </BlogPostCommentDisplayWrapper>
        ))}
      </div>
    </div>
  );
}
