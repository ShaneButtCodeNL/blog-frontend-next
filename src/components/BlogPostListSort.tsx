"use client";
import { SortTypes } from "@/models/blogPostReturn";
import { ChangeEvent } from "react";
import { useRouter } from "next/navigation";

export default function BlogPostListSort() {
  const router = useRouter();
  function selectFunction(e: ChangeEvent<HTMLSelectElement>) {
    router.push(`/blogs/sorted/${e.target.value}/1`);
  }
  return (
    <div>
      <select
        onChange={selectFunction}
        defaultValue={"DATE_DEC"}
        className="form-input"
      >
        {Object.keys(SortTypes)
          .filter((v) => isNaN(Number(v)))
          .map((v: string) => (
            //@ts-ignore
            <option value={v}>{v}</option>
          ))}
      </select>
    </div>
  );
}
