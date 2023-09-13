import Link from "next/link";

export default async function NotFound() {
  return (
    <div>
      <h2>Are we Lost?</h2>
      <p>Could not find requested resource</p>
      <p>
        Return <a href="/">Home</a>
      </p>
      <p>
        View <a href="/blogs/1">All Posts</a>
      </p>
    </div>
  );
}
