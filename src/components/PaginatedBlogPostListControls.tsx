"use client";
import { store } from "@/store";
import Link from "next/link";

export default function PaginatedBlogPostListControls({
  sorted,
  listItemCount,
}: {
  sorted?: string;
  listItemCount: number;
}) {
  console.log("count", listItemCount);
  const firstPage = 1;
  const lastPage = Math.ceil(
    listItemCount / store.getState().blogPostList.displayNumber
  );
  const currentPage: number = store.getState().blogPostList.currentPage;
  const siblings = store.getState().blogPostList.siblings;
  const ellipses = ". . .";
  const leftRange = Math.max(firstPage + 1, currentPage - siblings);
  const rightRange = Math.min(lastPage, currentPage + siblings + 1);
  const range: number[] = Array.from(
    { length: rightRange - leftRange },
    (_, i) => leftRange + i
  );
  return (
    <div
      id="pagination-controls"
      style={firstPage === lastPage ? { display: "none" } : {}}
    >
      <Link
        href={`/blogs/${sorted ? `sorted/${sorted}/` : ""}${currentPage - 1}`}
      >
        <button
          type="button"
          id="prev-page"
          style={currentPage === firstPage ? { display: "none" } : {}}
        >
          {"<"}
        </button>
      </Link>
      <Link href={`/blogs/${sorted ? `sorted/${sorted}/` : ""}${firstPage}`}>
        <button type="button">{firstPage}</button>
      </Link>
      <div style={currentPage - siblings >= 3 ? {} : { display: "none" }}>
        {ellipses}
      </div>
      {range.map((v) => (
        <Link
          href={`/blogs/${sorted ? `sorted/${sorted}/` : ""}${v}`}
          key={`link-key-page-${v}`}
        >
          <button key={`page-key-${v}`}>{v}</button>
        </Link>
      ))}
      <div
        style={currentPage + siblings < lastPage - 1 ? {} : { display: "none" }}
      >
        {ellipses}
      </div>
      <Link href={`/blogs/${sorted ? `sorted/${sorted}/` : ""}${lastPage}`}>
        <button type="button">{lastPage}</button>
      </Link>
      <Link
        href={`/blogs/${sorted ? `sorted/${sorted}/` : ""}${currentPage + 1}`}
      >
        <button
          type="button"
          id="next-page"
          style={currentPage === lastPage ? { display: "none" } : {}}
        >
          {">"}
        </button>
      </Link>
    </div>
  );
}
