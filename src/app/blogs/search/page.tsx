import Test from "@/components/Test";
import PreloadBlogList from "@/components/preloaders/PreloadBlogList";
import { getAllBlogPosts } from "@/functions/apiController";
import { store } from "@/store";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const data = await getAllBlogPosts();
  return (
    <>
      <PreloadBlogList list={data} />
      <input type="text" />
      {store.getState().blogPostList.list.map((v) => (
        <div>{v.title}</div>
      ))}
      <Test />
    </>
  );
}
