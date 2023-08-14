"use client";

import { createCommentFunction } from "@/functions/serverFunctions";
import { FormEvent, useState } from "react";
import BlogPostCommentDisplay from "../BlogPostCommentDisplay";
import { createPortal } from "react-dom";
import { BlogPostCommentReturn } from "@/models/blogPostReturn";

export default function MakeCommentModal({ blogId }: { blogId: string }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  function closeModal() {
    const dialog = document.getElementById(
      "make-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    setBody("");
    setTitle("");
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const token = localStorage.getItem("token") as string;
    createCommentFunction(blogId, token, { body, title }).then((res) => {
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
        <input
          type="text"
          className="form-input"
          placeholder="Title . . ."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          id="make-comment-modal-input"
        />
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
