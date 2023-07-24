"use client";
import { deleteBlogPostFunction } from "@/functions/serverFunctions";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

export default function DeletePostModal({ blogId }: { blogId: string }) {
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "delete-post-modal"
    ) as HTMLDialogElement;
    if (!dialog) return;
    dialog.close();
  }

  function submitFormFunction(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!window) {
      closeModal();
      return;
    }
    const token = localStorage.getItem("token") as string;
    deleteBlogPostFunction(blogId, token).then((res) => {
      closeModal();
      if (res) router.push(`/blog/${blogId}/deleted`);
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
