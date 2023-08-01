import BlogPostListSort from "@/components/BlogPostListSort";
import BlogPostSearch from "@/components/BlogPostSearch";
import Providers from "@/components/Provider";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Providers>
        <BlogPostListSort />
        <BlogPostSearch />
      </Providers>

      {children}
    </>
  );
}
