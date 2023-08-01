"use client";

import { store } from "@/store";

export default function Test() {
  return (
    <>
      {store.getState().blogPostList.list.map((v) => (
        <div>
          {v.title} {v.author}
        </div>
      ))}
    </>
  );
}
