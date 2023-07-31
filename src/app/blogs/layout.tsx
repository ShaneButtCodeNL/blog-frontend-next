import BlogPostListSort from "@/components/BlogPostListSort";
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
      </Providers>

      {children}
    </>
  );
}
