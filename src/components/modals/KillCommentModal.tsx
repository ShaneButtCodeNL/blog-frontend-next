"use client";

import { killCommentFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function KillCommentModal() {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "remove-comment-modal"
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
    killCommentFunction(
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
      id="remove-comment-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="remove-comment-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="remove-comment-modal-text">
          Are you sure you want to remove this Comment? Comment will no longer
          be able to be restored. Comments replies will also be removed. This is{" "}
          <strong>Unreversable</strong>.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="remove-comment-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Remove
        </button>
        <button
          id="remove-comment-modal-cancel"
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
