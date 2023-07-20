"use client";

import { FormEvent } from "react";

export default function MakeCommentModal() {
  function closeModal() {
    const dialog = document.getElementById(
      "make-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
