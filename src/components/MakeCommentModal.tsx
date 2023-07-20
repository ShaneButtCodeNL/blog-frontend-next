"use client";

import { createCommentFunction } from "@/functions/serverFunctions";
import { FormEvent, useState } from "react";
import BlogPostCommentDisplay from "./BlogPostCommentDisplay";
import { createPortal } from "react-dom";

export default function MakeCommentModal({ blogId }: { blogId: string }) {
  const [body, setBody] = useState("");
  const addedComments: string[] = [];
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
      addedComments.push(body);
      closeModal();
    });
  }
  return (
    <dialog id="make-comment-modal" onClick={closeModal}>
      <form
        id="make-comment-form"
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
      </form>
    </dialog>
  );
}
