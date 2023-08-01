"use client";
import { BlogPostReturn } from "@/models/blogPostReturn";
import { store } from "@/store";
import { setList } from "@/store/blogPosts";
import { useRef } from "react";

export default function PreloadBlogList({ list }: { list: BlogPostReturn[] }) {
  const loaded = useRef(false);
  if (!loaded.current) {
    store.dispatch(setList(list));
    loaded.current = true;
  }
  return null;
}
