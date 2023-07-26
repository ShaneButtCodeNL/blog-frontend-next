"use server";
import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import { getAllBlogPosts } from "@/functions/apiController";
import { store } from "@/store";
import { setCurrentPage, setList } from "@/store/blogPosts";

//TODO FIX

// function setPage(num: number) {
//   "use client";
//   store.dispatch(setCurrentPage(num));
// }

export default async function Page({
  params,
}: {
  params: { pageNumber: number };
}) {
  const data = await getAllBlogPosts();
  store.dispatch(setList(data));
  store.dispatch(setCurrentPage(params.pageNumber));
  return (
    <main>
      <PaginatedBlogPostList />
    </main>
  );
}
