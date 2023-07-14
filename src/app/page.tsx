import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>HOME PAGE</p>
      <Link href="/blogs/1">BLOGS</Link>
    </main>
  );
}
