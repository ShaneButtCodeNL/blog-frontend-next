import Link from "next/link";

export default function Nav(props: any) {
  return (
    <nav>
      NAV
      <Link href={"/login"}>
        <button type="button">Login</button>
      </Link>
    </nav>
  );
}
