import BlogPostDisplay from "@/components/BlogPostDisplay";
import { getBlogPostByBlogPostId } from "@/functions/apiController";
import { BlogPostReturn } from "@/models/blogPostReturn";
import { GetServerSideProps, InferGetServerSidePropsType } from "next";

//Doesn't work ???
export const getServerSideProps: GetServerSideProps<{
  data: BlogPostReturn;
}> = async (context) => {
  const blogId = context.params?.blogId as string;
  console.log("\n\n\nBlogID\n\n\n", blogId);
  const data = await getBlogPostByBlogPostId(blogId);
  return { props: { data } };
};

export default async function Page({ params }: { params: { blogId: string } }) {
  //{ data }: InferGetServerSidePropsType<typeof getServerSideProps>
  const data = await getBlogPostByBlogPostId(params.blogId);
  //console.log("IN SERVER");
  //console.log(data);

  return <BlogPostDisplay blogPost={data} />;
}
