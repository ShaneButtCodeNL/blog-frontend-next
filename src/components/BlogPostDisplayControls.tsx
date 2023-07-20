"use client";
import {
  faHeart as heartSolid,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDetails } from "@/models/userReturn";
import { useState } from "react";
import { createCommentFunction, likePost } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { formatNumber, openLoginModal } from "@/functions/helpers";
import MakeCommentModal from "./MakeCommentModal";

export default function BlogPostDisplayControls({
  listOfLikes,
  blogId,
}: {
  listOfLikes: string[];
  blogId: string;
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

  function likeButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      openLoginModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    likePost(blogId, token).then((res) => {
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
      <MakeCommentModal />
    </div>
  );
}
