import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import { getAllBlogPosts } from "@/functions/apiController";
import { store } from "@/store";
import { setCurrentPage, setList } from "@/store/blogPosts";

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
