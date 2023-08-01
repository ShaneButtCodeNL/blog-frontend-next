"use client";
import { store } from "@/store";
import { setCurrentPage, setList } from "@/store/blogPosts";

export default function PreloadPageNumber({ page }: { page: number }) {
  store.dispatch(setCurrentPage(page));
  return null;
}
