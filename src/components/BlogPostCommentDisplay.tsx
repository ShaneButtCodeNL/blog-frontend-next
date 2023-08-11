"use client";

import { getDateString } from "@/functions/helpers";

import { BlogPostCommentReturn } from "@/models/blogPostReturn";

import { useEffect, useState } from "react";
import BlogPostCommentDisplayControls from "./BlogPostCommentDisplayControls";
import Providers from "./Provider";
import { getUserDetailsFromUsername } from "@/functions/apiController";
import { getUserDetailsFromUsernameFunction } from "@/functions/serverFunctions";

export default function BlogPostCommentDisplay({
  mainComment,
  order,
}: {
  mainComment: BlogPostCommentReturn;
  order: number;
}) {
  const [hide, setHide] = useState(false);
  const [author, setAuthor] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [banned, setBanned] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    getUserDetailsFromUsernameFunction(mainComment.author).then((res) => {
      if (res) {
        if (!res.disabled) {
          setAuthor(res.username as string);
          setDisabled(false);
        } else {
          setAuthor("(DELETED)");
          setDisabled(true);
        }
        setBanned(res.banned);
        setLoaded(true);
      }
    });
  }, []);
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
            {loaded ? (
              <div
                className={`comment-author ${banned ? "text-reject" : ""} ${
                  disabled ? "fade-text" : ""
                }`}
              >
                {author}
              </div>
            ) : (
              <div className="comment-author text-hidden">
                {mainComment.author}
              </div>
            )}
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
          hide={hide}
          setHide={setHide}
          key={`${mainComment.commentId}-controls`}
        />
      </Providers>

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
