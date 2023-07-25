"use client";
import { restoreBlogPostFunction } from "@/functions/serverFunctions";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RestorePostModal({ blogId }: { blogId: string }) {
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "restore-post-modal"
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
    restoreBlogPostFunction(blogId, token).then((res) => {
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
      id="restore-post-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="restore-post-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="restore-post-modal-text">
          Are you sure you want to restore this post? Post will again be
          viewable by users.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="restore-post-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Restore
        </button>
        <button
          id="restore-post-modal-cancel"
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
