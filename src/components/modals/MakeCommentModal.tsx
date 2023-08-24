"use client";

import { createCommentFunction } from "@/functions/serverFunctions";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
import { store } from "@/store";

export default function MakeCommentModal() {
  const params = useParams();
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
    if (!params.blogId) {
      closeModal();
      return;
    }
    const token = store.getState().login.accessToken;
    createCommentFunction(params.blogId, token, { body, title }).then((_) => {
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
