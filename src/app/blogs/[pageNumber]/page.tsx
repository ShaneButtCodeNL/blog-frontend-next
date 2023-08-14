"use server";
import BlogListDisplayItem from "@/components/BlogListDisplayItem";
import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import Providers from "@/components/Provider";
import PreloadBlogList from "@/components/preloaders/PreloadBlogList";
import PreloadPageNumber from "@/components/preloaders/PreloadPageNumber";
import { getAllBlogPosts } from "@/functions/apiController";
import {
  applySortingServerFunction,
  applyTitleFilterServerFunction,
} from "@/functions/serverFunctions";
import { store } from "@/store";
import { setCurrentPage } from "@/store/blogPosts";
type SearchParams = {
  searchTitle?: string;
};

export default async function Page({
  params,
  searchParams,
}: {
  params: { pageNumber: number };
  searchParams: SearchParams;
}) {
  const pageNumber = params.pageNumber;
  const data = await getAllBlogPosts();
  store.dispatch(setCurrentPage(pageNumber));
  const sortType = store.getState().blogPostList.sortType;
  const searchTitle = searchParams.searchTitle ? searchParams.searchTitle : "";
  const numberOfEntriesForPage = store.getState().blogPostList.displayNumber;
  const start = (pageNumber - 1) * numberOfEntriesForPage;
  const end =
    (pageNumber - 1) * numberOfEntriesForPage + numberOfEntriesForPage;
  const displayData = await applyTitleFilterServerFunction(
    await applySortingServerFunction(data, sortType),
    searchTitle
  );
  return (
    <>
      <PreloadBlogList list={data} />
      <PreloadPageNumber page={pageNumber} />
      <Providers>
        <PaginatedBlogPostList
          itemsCount={displayData.length}
          searchTitle={searchTitle}
        >
          {displayData.slice(start, end).map((v, i) => (
            <BlogListDisplayItem blog={v} key={`${i}-blog-item`} />
          ))}
        </PaginatedBlogPostList>
      </Providers>
    </>
  );
}
