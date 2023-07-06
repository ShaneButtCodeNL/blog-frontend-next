"use clent";

import Link from "next/link";

export default function Home() {
  return (
    <main>
      <p>HOME PAGE</p>
      <Link href="/blog">blog</Link>
    </main>
  );
}
