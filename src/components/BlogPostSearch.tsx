"use client";

import { AppDispatch, RootState, store } from "@/store";
import { setSearch } from "@/store/search";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function BlogPostSearch() {
  const dispatch = useAppDispatch();
  const search = useAppSelector((state) => state.search.search);

  return (
    <div>
      <input
        type="text"
        placeholder="search"
        className="form-input"
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
    </div>
  );
}
