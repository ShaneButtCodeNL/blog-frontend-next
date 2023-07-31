import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import { getAllBlogPosts } from "@/functions/apiController";
import { applySorting } from "@/functions/helpers";
import { SortTypes } from "@/models/blogPostReturn";
import { store } from "@/store";
import { setCurrentPage, setList } from "@/store/blogPosts";

export default async function Page({
  params,
}: {
  params: { pageNumber: number };
}) {
  const data = await applySorting(await getAllBlogPosts(), SortTypes.DATE_DEC);
  store.dispatch(setList(data));
  store.dispatch(setCurrentPage(params.pageNumber));
  return <PaginatedBlogPostList />;
}
