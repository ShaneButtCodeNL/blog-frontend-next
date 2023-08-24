"use client";
import { killBlogPostFunction } from "@/functions/serverFunctions";
import { store } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function KillPostModal() {
  const params = useParams();
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "kill-post-modal"
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
    const token = store.getState().login.accessToken;
    killBlogPostFunction(params.blogId, token).then((res) => {
      if (!res) {
        setShowError(true);
        return;
      }
      closeModal();
      router.push("/blogs/1");
    });
  }

  return (
    <dialog
      id="kill-post-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="kill-post-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="kill-post-modal-text">
          Are you sure you want to remove this post? Post will be removed from
          database and will not be recoverable.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <button
          id="kill-post-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Remove
        </button>
        <button
          id="kill-post-modal-cancel"
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
