"use client";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter, useSearchParams } from "next/navigation";
import { ChangeEvent, useState } from "react";

const searchTypes = ["Title"];

export default function BlogPostSearch() {
  const searchParams = useSearchParams();
  const searchTitle = searchParams.get("searchTitle");
  const [searchType, setSearchType] = useState(0);
  const [localSearch, setLocalSearch] = useState(
    searchTitle ? searchTitle : ""
  );
  const router = useRouter();

  function clickFunction() {
    router.push(`/blogs/1?searchTitle=${localSearch}`);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "underline",
      }}
    >
      <select
        style={{
          width: "fit-content",
          marginLeft: "1em",
          backgroundColor: "var(--input-bg)",
          background: "transparent",
        }}
        defaultValue={searchType}
        onChange={(e) => {
          setSearchType(parseInt(e.target.value));
        }}
      >
        {searchTypes.map((v, i) => (
          <option value={i} key={`key-${i}-${v}`}>
            {v}
          </option>
        ))}
      </select>
      <div className="search-box-list" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search . . ."
          className="form-input search-box-list-input"
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value);
          }}
        />
        <button
          type="button"
          className="search-box-list-button"
          onClick={clickFunction}
        >
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
}
