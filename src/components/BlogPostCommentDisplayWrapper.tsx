"use client";
import { faAnglesDown, faAnglesUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useState } from "react";

type Props = {
  children: ReactNode;
  order: number;
};

export default function BlogPostCommentDisplayWrapper({
  children,
  order,
}: Props) {
  const [hide, setHide] = useState(false);
  return (
    <div
      className={`blog-post-comment-container ${hide ? "hide-comment" : ""}`}
      style={{ order }}
    >
      <div className="comment-show-hide-button-wrapper">
        <button
          type="button"
          className="comment-show-hide-button"
          title={hide ? "Show Comment" : "Hide Comment"}
          onClick={() => setHide((e) => !e)}
        >
          {hide ? (
            <FontAwesomeIcon icon={faAnglesUp} />
          ) : (
            <FontAwesomeIcon icon={faAnglesDown} />
          )}
        </button>
      </div>
      {children}
    </div>
  );
}
