"use client";
import { faHeart as heartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as heartOutline } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { UserDetails } from "@/models/userReturn";
import { useState } from "react";
import { likePost } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { formatNumber } from "@/functions/helpers";

export default function BlogPostDisplayControls({
  listOfLikes,
  blogId,
}: {
  listOfLikes: string[];
  blogId: string;
}) {
  const [liked, setLiked] = useState(
    localStorage.getItem("userDetails")
      ? listOfLikes.indexOf(
          (JSON.parse(localStorage.getItem("userDetails")!) as UserDetails)
            .userId as string
        ) > -1
      : false
  );
  const [likeCount, setLikeCount] = useState(listOfLikes.length);
  const router = useRouter();
  function likeButtonClick() {
    if (!window) return;
    if (!store.getState().login.loggedIn) {
      router.push("/login");
      return;
    }
    const token = localStorage.getItem("token") as string;
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
    </div>
  );
}
