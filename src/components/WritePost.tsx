"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export default function WritePost(params: any) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const router = useRouter();

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <form id="write-new-post-form" onSubmit={onSubmit}>
      <label htmlFor="title">Title</label>
      <input
        type="text"
        id="new-post-form-title-input"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        placeholder="Write Post Body Here"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      ></textarea>
      <button type="submit">Make Post</button>
      <button type="button" onClick={router.back}>
        Cancel
      </button>
    </form>
  );
}
