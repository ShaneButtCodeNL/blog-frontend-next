"use client";
import {
  faHeart as heartSolid,
  faPlus,
  faTrash,
  faTrashRestore,
  faSkullCrossbones,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { likePost } from "@/functions/serverFunctions";
import { store } from "@/store";
import { formatNumber, openLoginModal } from "@/functions/helpers";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

export default function BlogPostDisplayControls({
  listOfLikes,
  blogId,
  deleted,
  author,
}: {
  listOfLikes: string[];
  blogId: string;
  deleted: boolean;
  author: string;
}) {
  const userDetails = useSelector(
    (state: RootState) => state.login.userDetails
  );
  const loggedIn = useSelector((state: RootState) => state.login.loggedIn);
  const [liked, setLiked] = useState(false);
  const [hasWriterAuth, setHasWriterAuth] = useState(false);
  const [hasAdminAuth, setHasAdminAuth] = useState(false);

  useEffect(() => {
    const likeFlag = listOfLikes.includes(userDetails?.userId as string);
    if (loggedIn) {
      setLiked(likeFlag);
      setHasAdminAuth(hasAccess(adminCredentials));
      setHasWriterAuth(hasAccess(writerCredentials));
    }
  }, [userDetails, loggedIn]);
  const [likeCount, setLikeCount] = useState(listOfLikes.length);

  function hasValidRole(roles: string[]) {
    //const userDetails = store.getState().login.userDetails;
    if (!userDetails) return false;
    if (userDetails.roles.includes("ROLE_OWNER")) return true;
    for (let role of roles) {
      if (userDetails.roles.includes(role)) return true;
    }
    return false;
  }

  interface Credentials {
    roles: string[];
    matchAuthor?: boolean;
  }

  const writerCredentials: Credentials[] = [
    { roles: ["ROLE_ADMIN"] },
    { roles: ["ROLE_WRITER"], matchAuthor: true },
  ];
  const adminCredentials: Credentials[] = [{ roles: ["ROLE_ADMIN"] }];

  function isAuthor() {
    //const userDetails = store.getState().login.userDetails;
    if (!userDetails) return false;
    if (userDetails.roles.includes("ROLE_OWNER")) return true;
    return author === userDetails?.username;
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

  function makeCommentClick() {
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "make-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.show();
  }

  function deletePostClick() {
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "delete-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.show();
  }

  function restorePostClick() {
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "restore-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.show();
  }
  function killPostClick() {
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "kill-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.show();
  }
  function editPostClick() {
    if (deleted) return;

    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const dialog = document.getElementById(
      "edit-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.show();
  }

  function likeButtonClick() {
    if (deleted) return;
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const token = store.getState().login.accessToken;
    likePost(blogId, token).then((_) => {
      setLikeCount((v) => v + (liked ? -1 : 1));
      setLiked((v) => !v);
    });
  }

  return (
    <div className="blog-post-controls">
      <div className="blog-post-controls-item like-controls">
        <button
          type="button"
          style={liked ? {} : { display: "none" }}
          onClick={likeButtonClick}
          disabled={deleted}
        >
          <FontAwesomeIcon icon={heartSolid} className="heart" />
        </button>

        <button
          type="button"
          style={liked ? { display: "none" } : {}}
          onClick={likeButtonClick}
          disabled={deleted}
        >
          <FontAwesomeIcon icon={heartOutline} className="heart" />
        </button>
        <div className="like-count">{" " + formatNumber(likeCount)}</div>
      </div>

      <div className="blog-post-controls-item make-comment-button">
        <button type="button" onClick={makeCommentClick}>
          <FontAwesomeIcon icon={faPlus} />
          {" Comment"}
        </button>
      </div>

      <div
        className="blog-post-controls-item make-comment-button"
        style={deleted && hasAdminAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={restorePostClick}>
          <FontAwesomeIcon icon={faTrashRestore} />
          {" Restore"}
        </button>
      </div>

      <div
        className="blog-post-controls-item make-comment-button"
        style={!deleted && hasWriterAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={deletePostClick}>
          <FontAwesomeIcon icon={faTrash} />
          {" Delete"}
        </button>
      </div>

      <div
        className="blog-post-controls-item make-comment-button"
        style={deleted && hasAdminAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={killPostClick}>
          <FontAwesomeIcon icon={faSkullCrossbones} />
          {" Remove"}
        </button>
      </div>

      <div
        className="blog-post-controls-item make-comment-button"
        style={!deleted && hasWriterAuth ? {} : { display: "none" }}
      >
        <button type="button" onClick={editPostClick}>
          <FontAwesomeIcon icon={faPenToSquare} />
          {" Edit"}
        </button>
      </div>
    </div>
  );
}
