"use client";

import { AppDispatch, RootState, store } from "@/store";
import { setSearch as setStoreSearch } from "@/store/search";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function Search(props: any) {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState(""); //useAppSelector((state) => state.search.search);
  const router = useRouter();
  return (
    <form
      id="search-form-main"
      onSubmit={(e) => {
        e.preventDefault();
        dispatch(setStoreSearch(search));
        router.push("/blogs/1");
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
