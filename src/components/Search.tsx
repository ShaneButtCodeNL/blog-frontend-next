"use client";

import { AppDispatch, RootState, store } from "@/store";
import { setSearch as setStoreSearch } from "@/store/search";
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
    >
      <input
        type="text"
        placeholder="search"
        className="form-input"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <button type="submit">GO</button>
    </form>
  );
}
