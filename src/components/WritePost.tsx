"use client";

import { makeNewPostFunction } from "@/functions/serverFunctions";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function WritePost(params: any) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    "use client";
    e.preventDefault();
    makeNewPostFunction(
      title,
      body,
      localStorage.getItem("token") as string
    ).then((res) => {
      if (!res) router.push("/write-post/error");
      router.push(`/blog/${res?.blogId}`);
    });
  }

  return (
    <form id="write-new-post-form" onSubmit={onSubmit}>
      <label htmlFor="title" id="new-post-label-title" className="form-label">
        Title
      </label>
      <input
        type="text"
        className="form-input"
        id="new-post-input-title"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        required
        className="form-input"
        id="new-post-input-body"
        placeholder="Write Post Body Here"
        value={body}
        rows={10}
        onChange={(e) => setBody(e.target.value)}
        spellCheck={true}
      ></textarea>
      <button type="submit" id="new-post-submit-button" className="form-button">
        Make Post
      </button>
      <button
        type="button"
        id="new-post-cancel-button"
        className="form-button"
        onClick={router.back}
      >
        Cancel
      </button>
    </form>
  );
}
