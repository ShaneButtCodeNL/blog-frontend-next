"use client";

import { formatNumber, openLoginModal } from "@/functions/helpers";
import {
  getUserDetailsFromUsernameFunction,
  likeCommentFunction,
} from "@/functions/serverFunctions";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
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
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function BlogPostCommentDisplayControls({
  mainComment,
}: {
  mainComment: BlogPostCommentReturn;
}) {
  const userDetails = useSelector(
    (state: RootState) => state.login.userDetails
  );
  const loggedIn = useSelector((state: RootState) => state.login.loggedIn);
  const token = useSelector((state: RootState) => state.login.accessToken);
  const [likeCount, setLikeCount] = useState(mainComment.likes.length);
  const [liked, setLiked] = useState(false);
  const [hasUserAuth, setUserAuth] = useState(false);
  const [hasWriterAuth, setHasWriterAuth] = useState(false);
  const [hasAdminAuth, setHasAdminAuth] = useState(false);
  useEffect(() => {
    getUserDetailsFromUsernameFunction(userDetails?.username as string).then(
      (res) => setLiked(mainComment.likes.includes(res?.userId as string))
    );
    setHasAdminAuth(hasAccess(adminCredentials));
    setHasWriterAuth(hasAccess(writerCredentials));
    setUserAuth(hasAccess(userCredentials));
  }, [loggedIn, userDetails, token]);

  interface Credentials {
    roles: string[];
    matchAuthor?: boolean;
  }
  const userCredentials: Credentials[] = [
    { roles: ["ROLE_USER"], matchAuthor: true },
  ];
  const writerCredentials: Credentials[] = [
    { roles: ["ROLE_ADMIN"] },
    { roles: ["ROLE_WRITER"], matchAuthor: true },
  ];
  const adminCredentials: Credentials[] = [{ roles: ["ROLE_ADMIN"] }];

  function hasValidRole(roles: string[]) {
    //const userDetails = store.getState().login.userDetails;
    if (!userDetails) return false;
    if (userDetails.roles.includes("ROLE_OWNER")) return true;
    for (let role of roles) {
      if (userDetails.roles.includes(role)) return true;
    }
    return false;
  }

  function isAuthor() {
    //const userDetails = store.getState().login.userDetails;
    if (!userDetails) return false;
    if (userDetails.roles.includes("ROLE_OWNER")) return true;
    return mainComment.author === userDetails?.username;
  }

  function hasAccess(credentials: Credentials[]) {
    for (const { roles, matchAuthor } of credentials) {
      const validRole = hasValidRole(roles);
      if (validRole) {
        return matchAuthor ? isAuthor() : true;
      }
    }
    return false;
  }

  function likeButtonClick() {
    if (!window) return;

    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }

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

  function replyButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "make-comment-reply-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    store.dispatch(setCommentId(mainComment.commentId));
    store.dispatch(setBlogId(mainComment.blogId));
    store.dispatch(setParentCommentId(mainComment.commentId));
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
        style={mainComment.deleted ? { display: "none" } : {}}
      >
        <button type="button" onClick={replyButtonClick}>
          Reply
        </button>
      </div>
      <div
        className="blog-post-controls-item make-comment-button like-controls"
        style={
          !mainComment.deleted && (hasWriterAuth || hasUserAuth)
            ? {}
            : { display: "none" }
        }
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
        style={mainComment.deleted && hasAdminAuth ? {} : { display: "none" }}
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
        style={mainComment.deleted && hasAdminAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={killButtonClick} title="Remove Comment">
          <FontAwesomeIcon icon={faSkullCrossbones} />
          {" Remove"}
        </button>
      </div>
      <div
        className="blog-post-controls-item make-comment-button like-controls"
        style={!mainComment.deleted && hasWriterAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={editButtonClick} title="Edit Comment">
          <FontAwesomeIcon icon={faPenToSquare} />
          {" Edit"}
        </button>
      </div>
    </div>
  );
}
