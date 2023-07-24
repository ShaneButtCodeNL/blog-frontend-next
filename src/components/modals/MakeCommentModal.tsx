"use client";

import { createCommentFunction } from "@/functions/serverFunctions";
import { FormEvent, useState } from "react";
import BlogPostCommentDisplay from "../BlogPostCommentDisplay";
import { createPortal } from "react-dom";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";

export default function MakeCommentModal({ blogId }: { blogId: string }) {
  const [body, setBody] = useState("");
  const [addedComments, setAddedComments] = useState<BlogPostCommentReturn[]>(
    []
  );
  function closeModal() {
    const dialog = document.getElementById(
      "make-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    setBody("");
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = localStorage.getItem("token") as string;
    createCommentFunction(blogId, body, token).then((res) => {
      if (res)
        setAddedComments((v) => [...v, res.comments[res.comments.length - 1]]);
      closeModal();
    });
  }
  return (
    <dialog id="make-comment-modal" className="modal" onClick={closeModal}>
      <form
        id="make-comment-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
      >
        <textarea
          id="make-comment-modal-textarea"
          className="form-input"
          placeholder="Write Comment Here . . ."
          rows={5}
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button type="submit" id="make-comment-submit" className="form-button">
          Submit
        </button>
        <button
          type="button"
          id="make-comment-cancel"
          className="form-button"
          onClick={closeModal}
        >
          Cancel
        </button>
        {document.getElementById("blog-comments") ? (
          createPortal(
            <>
              {addedComments.map((v) => {
                return (
                  <BlogPostCommentDisplay
                    mainComment={v}
                    key={`key-BCD-${v.commentId}`}
                    order={0}
                  />
                );
              })}
            </>,
            document.getElementById("blog-comments")!
          )
        ) : (
          <></>
        )}
      </form>
    </dialog>
  );
}
