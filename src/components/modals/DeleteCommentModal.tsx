"use client";

import { deleteCommentFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DeleteCommentModal() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "delete-comment-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    setShowError(false);
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window) {
      closeModal();
      return;
    }
    const token = store.getState().login.accessToken;
    deleteCommentFunction(
      store.getState().commentReply.blogId,
      store.getState().commentReply.commentId,
      token
    ).then((res) => {
      if (!res) {
        setShowError(true);
        return;
      }
      closeModal();
      router.refresh();
    });
  }

  return (
    <dialog
      id="delete-comment-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="delete-comment-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="delete-comment-modal-text">
          Are you sure you want to delete this Comment? Comment will no longer
          be viewable by users.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="delete-comment-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Delete
        </button>
        <button
          id="delete-comment-modal-cancel"
          type="button"
          className="form-button"
          onClick={closeModal}
          formMethod="dialog"
        >
          Cancel
        </button>
      </form>
    </dialog>
  );
}
