"use client";

/**
 * TODO Add modals for confirmation
 * TODO Add restore,remove,and edit functionality
 */
import {
  formatNumber,
  getDateString,
  openLoginModal,
  openMakeCommentReplyModal,
} from "@/functions/helpers";
import {
  deleteCommentFunction,
  likeCommentFunction,
} from "@/functions/serverFunctions";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import { setParentCommentId } from "@/store/commentReply";
import { faHeart as isNotLiked } from "@fortawesome/free-regular-svg-icons";
import {
  faSkullCrossbones,
  faTrash,
  faTrashArrowUp,
  faHeart as isLiked,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function BlogPostCommentDisplay({
  mainComment,
  order,
}: {
  mainComment: BlogPostCommentReturn;
  order: number;
}) {
  const [hide, setHide] = useState(false);
  const [likeCount, setLikeCount] = useState(mainComment.likes.length);
  const [liked, setLiked] = useState(
    store.getState().login.loggedIn
      ? mainComment.likes.includes(
          store.getState().login.userDetails?.userId as string
        )
      : false
  );

  function likeButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    likeCommentFunction(mainComment.blogId, mainComment.commentId, token).then(
      (_) => {
        setLikeCount((v) => v + (liked ? -1 : 1));
        setLiked((v) => !v);
      }
    );
  }

  function deleteButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    deleteCommentFunction(
      mainComment.blogId,
      mainComment.commentId,
      token
    ).then((_) => {});
  }
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
      <div className="comment-actions">
        <div
          className="blog-post-controls-item make-comment-button like-controls"
          style={mainComment.deleted ? { display: "none" } : {}}
        >
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
        </div>
        <div className="blog-post-controls-item make-comment-button like-controls">
          <button
            type="button"
            className=""
            onClick={likeButtonClick}
            title={mainComment.deleted ? "Disabled" : "Like"}
            disabled={mainComment.deleted}
          >
            <FontAwesomeIcon
              icon={liked ? isLiked : isNotLiked}
              className="heart"
            />
          </button>
          <div className="like-count">{" " + formatNumber(likeCount)}</div>
        </div>
        <div
          className="blog-post-controls-item make-comment-button like-controls"
          style={mainComment.deleted || hide ? { display: "none" } : {}}
        >
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
          className="blog-post-controls-item make-comment-button like-controls"
          style={mainComment.deleted ? { display: "none" } : {}}
        >
          <button
            type="button"
            onClick={deleteButtonClick}
            title="Delete Comment"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
        <div
          className="blog-post-controls-item make-comment-button like-controls"
          style={mainComment.deleted ? {} : { display: "none" }}
        >
          <button type="button" onClick={() => {}} title="Restore Comment">
            <FontAwesomeIcon icon={faTrashArrowUp} />
            {" Restore"}
          </button>
        </div>
        <div
          className="blog-post-controls-item make-comment-button like-controls"
          style={mainComment.deleted ? {} : { display: "none" }}
        >
          <button type="button" onClick={() => {}} title="Remove Comment">
            <FontAwesomeIcon icon={faSkullCrossbones} />
            {" Remove"}
          </button>
        </div>
      </div>
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
