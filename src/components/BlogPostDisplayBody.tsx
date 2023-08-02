export default function BlogPostDisplayBody({
  htmlString,
}: {
  htmlString: string;
}) {
  return (
    <div id="blog-body" dangerouslySetInnerHTML={{ __html: htmlString }}></div>
  );
}
