"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Search(props: any) {
  const [search, setSearch] = useState(""); //useAppSelector((state) => state.search.search);
  const router = useRouter();
  return (
    <form
      id="search-form-main"
      onSubmit={(e) => {
        e.preventDefault();
        router.push(`/blogs/1${search === "" ? "" : `?searchTitle=${search}`}`);
      }}
      style={{ position: "relative" }}
    >
      <input
        type="text"
        placeholder="Search . . ."
        className="form-input"
        id="search-form-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit" className="search-button">
        <FontAwesomeIcon icon={faMagnifyingGlass} />
      </button>
    </form>
  );
}
