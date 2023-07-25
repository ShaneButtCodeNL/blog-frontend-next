"use client";
import {
  faHeart as heartSolid,
  faPlus,
  faTrash,
  faTrashRestore,
  faSkullCrossbones,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { likePost } from "@/functions/serverFunctions";
import { store } from "@/store";
import { formatNumber, openLoginModal } from "@/functions/helpers";
import MakeCommentModal from "./modals/MakeCommentModal";
import React from "react";
import DeletePostModal from "./modals/DeletePostModal";
import RestorePostModal from "./modals/RestorePostModal";
import KillPostModal from "./modals/KillPostModal";

export default function BlogPostDisplayControls({
  listOfLikes,
  blogId,
  deleted,
}: {
  listOfLikes: string[];
  blogId: string;
  deleted: boolean;
}) {
  const [liked, setLiked] = useState(
    store.getState().login.loggedIn
      ? listOfLikes.includes(
          store.getState().login.userDetails?.userId as string
        )
      : false
  );
  const [likeCount, setLikeCount] = useState(listOfLikes.length);

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

  function likeButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    likePost(blogId, token).then((_) => {
      setLikeCount((v) => v + (liked ? -1 : 1));
      setLiked((v) => !v);
    });
  }
  store.subscribe(() => {
    setLiked(
      listOfLikes.includes(store.getState().login.userDetails?.userId as string)
    );
  });
  return (
    <div className="blog-post-controls">
      <div className="blog-post-controls-item like-controls">
        <button
          type="button"
          style={liked ? {} : { display: "none" }}
          onClick={likeButtonClick}
        >
          <FontAwesomeIcon icon={heartSolid} className="heart" />
        </button>
        <button
          type="button"
          style={liked ? { display: "none" } : {}}
          onClick={likeButtonClick}
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
      <div className="blog-post-controls-item make-comment-button">
        {deleted ? (
          <button type="button" onClick={restorePostClick}>
            <FontAwesomeIcon icon={faTrashRestore} />
            {" Restore"}
          </button>
        ) : (
          <button type="button" onClick={deletePostClick}>
            <FontAwesomeIcon icon={faTrash} />
            {" Delete"}
          </button>
        )}
      </div>
      <div
        className="blog-post-controls-item make-comment-button"
        style={deleted ? {} : { display: "none" }}
      >
        <button type="button" onClick={killPostClick}>
          <FontAwesomeIcon icon={faSkullCrossbones} />
          {" Remove"}
        </button>
      </div>

      <MakeCommentModal blogId={blogId} />
      <DeletePostModal blogId={blogId} />
      <RestorePostModal blogId={blogId} />
      <KillPostModal blogId={blogId} />
    </div>
  );
}
