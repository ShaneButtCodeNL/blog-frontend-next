"use client";

import { editCommentFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function EditCommentModal() {
  const [showError, setShowError] = useState(false);
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");

  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "edit-comment-modal"
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
    editCommentFunction(
      store.getState().commentReply.blogId,
      store.getState().commentReply.commentId,
      token,
      { body, title }
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
      id="edit-comment-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="edit-comment-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <label className="form-label">New Title :</label>
        <input
          type="text"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label className="form-label">New Body :</label>
        <textarea
          className="form-input"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button
          id="edit-comment-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Edit
        </button>
        <button
          id="edit-comment-modal-cancel"
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
