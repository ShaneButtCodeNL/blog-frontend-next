"use client";
import { deleteBlogPostFunction } from "@/functions/serverFunctions";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function DeletePostModal() {
  const params = useParams();
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "delete-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    setShowError(false);
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window || !params.blogId) {
      closeModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    deleteBlogPostFunction(params.blogId, token).then((res) => {
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
      id="delete-post-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="delete-post-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="delete-post-modal-text">
          Are you sure you want to delete this post? Post will remain in
          database but will no longer be viewable by users.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="delete-post-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Delete
        </button>
        <button
          id="delete-post-modal-cancel"
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
