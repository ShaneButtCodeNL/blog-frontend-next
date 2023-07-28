"use client";

import { restoreCommentFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RestoreCommentModal() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "restore-comment-modal"
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
    const token = localStorage.getItem("token") as string;
    restoreCommentFunction(
      store.getState().commentReply.blogId,
      store.getState().commentReply.commentId,
      token
    ).then((res) => {
      if (!res) {
        console.log("RES", res);
        setShowError(true);
        return;
      }
      closeModal();
      router.refresh();
    });
  }

  return (
    <dialog
      id="restore-comment-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="restore-comment-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="restore-comment-modal-text">
          Are you sure you want to restore this Comment? Comment will again be
          viewable by users.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="restore-comment-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Restore
        </button>
        <button
          id="restore-comment-modal-cancel"
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
