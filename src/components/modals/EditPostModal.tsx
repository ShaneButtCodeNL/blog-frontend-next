"use client";
import { editBlogPostFunction } from "@/functions/serverFunctions";
import { BlogPostEditDetails } from "@/models/blogPostReturn";
import { store } from "@/store";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function EditPostModal() {
  const params = useParams();
  const [body, setBody] = useState("");
  const [title, setTitle] = useState("");
  const [showError, setShowError] = useState(false);
  const router = useRouter();
  function closeModal() {
    const dialog = document.getElementById(
      "edit-post-modal"
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
    // Will be either {} , {body} , {title}, {body,title}
    const editDetails: BlogPostEditDetails = Object.assign(
      {},
      body === "" ? {} : { body: body },
      title === "" ? {} : { title: title }
    );
    editBlogPostFunction(params.blogId, token, editDetails).then((res) => {
      if (!res) {
        setShowError(true);
        return;
      }
      router.refresh();
      closeModal();
    });
  }

  return (
    <dialog
      id="edit-post-modal"
      role="dialog"
      className="modal"
      onClick={closeModal}
    >
      <form
        id="edit-post-modal-form"
        className="modal-form"
        onClick={(e) => e.stopPropagation()}
        onSubmit={submitFormFunction}
        method="dialog"
      >
        <div id="edit-post-modal-text">
          Enter new details below. If you leave it blank the content will not be
          affected. These changes are not reversable.
          <div
            style={showError ? {} : { display: "none" }}
            className="text-reject"
          >
            Something went wrong.
          </div>
        </div>
        <label htmlFor="edit-form-new-title">Title :</label>
        <input
          type="text"
          className="form-input"
          name="edit-form-new-title"
          placeholder="Title . . ."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          className="form-input"
          placeholder="New Body Text . . ."
          value={body}
          onChange={(e) => setBody(e.target.value)}
        ></textarea>
        <button
          id="edit-post-modal-confirm"
          type="submit"
          className="form-button"
          autoFocus
        >
          Confirm Edit
        </button>
        <button
          id="edit-post-modal-cancel"
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
