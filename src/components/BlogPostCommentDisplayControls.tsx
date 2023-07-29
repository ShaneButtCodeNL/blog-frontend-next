"use client";

import {
  formatNumber,
  openLoginModal,
  openMakeCommentReplyModal,
} from "@/functions/helpers";
import {
  deleteCommentFunction,
  likeCommentFunction,
} from "@/functions/serverFunctions";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import { Dispatch, SetStateAction, useState } from "react";
import {
  setBlogId,
  setCommentId,
  setParentCommentId,
} from "@/store/commentReply";
import { faHeart as isNotLiked } from "@fortawesome/free-regular-svg-icons";
import {
  faPenToSquare,
  faSkullCrossbones,
  faTrash,
  faTrashArrowUp,
  faHeart as isLiked,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BlogPostCommentDisplayControls({
  mainComment,
  setHide,
  hide,
}: {
  mainComment: BlogPostCommentReturn;
  setHide: Dispatch<SetStateAction<boolean>>;
  hide: boolean;
}) {
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
    const dialog = document.getElementById(
      "delete-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    store.dispatch(setCommentId(mainComment.commentId));
    store.dispatch(setBlogId(mainComment.blogId));
    dialog.show();
  }

  function killButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "remove-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    store.dispatch(setCommentId(mainComment.commentId));
    store.dispatch(setBlogId(mainComment.blogId));
    dialog.show();
  }

  function restoreButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "restore-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    store.dispatch(setCommentId(mainComment.commentId));
    store.dispatch(setBlogId(mainComment.blogId));
    dialog.show();
  }

  function editButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "edit-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    store.dispatch(setCommentId(mainComment.commentId));
    store.dispatch(setBlogId(mainComment.blogId));
    dialog.show();
  }

  return (
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
        <button
          type="button"
          onClick={restoreButtonClick}
          title="Restore Comment"
        >
          <FontAwesomeIcon icon={faTrashArrowUp} />
          {" Restore"}
        </button>
      </div>
      <div
        className="blog-post-controls-item make-comment-button like-controls"
        style={mainComment.deleted ? {} : { display: "none" }}
      >
        <button type="button" onClick={killButtonClick} title="Remove Comment">
          <FontAwesomeIcon icon={faSkullCrossbones} />
          {" Remove"}
        </button>
      </div>
      <div
        className="blog-post-controls-item make-comment-button like-controls"
        style={mainComment.deleted ? { display: "none" } : {}}
      >
        <button type="button" onClick={editButtonClick} title="Edit Comment">
          <FontAwesomeIcon icon={faPenToSquare} />
          {" Edit"}
        </button>
      </div>
    </div>
  );
}
