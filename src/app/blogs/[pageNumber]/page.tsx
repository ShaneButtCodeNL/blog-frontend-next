import PaginatedBlogPostList from "@/components/PaginatedBlogPostList";
import Providers from "@/components/Provider";
import PreloadBlogList from "@/components/preloaders/PreloadBlogList";
import PreloadPageNumber from "@/components/preloaders/PreloadPageNumber";
import { getAllBlogPosts } from "@/functions/apiController";
import { applySorting } from "@/functions/helpers";
import { SortTypes } from "@/models/blogPostReturn";

export default async function Page({
  params,
}: {
  params: { pageNumber: number };
}) {
  const data = await getAllBlogPosts();
  return (
    <>
      <PreloadBlogList list={data} />
      <PreloadPageNumber page={params.pageNumber} />
      <Providers>
        <PaginatedBlogPostList />
      </Providers>
    </>
  );
}
