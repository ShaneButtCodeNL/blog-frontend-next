"use client";

import { AppDispatch, RootState, store } from "@/store";
import { setSearch } from "@/store/search";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
const searchTypes = ["Title"];

export default function BlogPostSearch() {
  const dispatch = useAppDispatch();
  const [searchType, setSearchType] = useState(0);
  const [localSearch, setLocalSearch] = useState(
    useAppSelector((state) => state.search.search)
  );
  let throttlePause = false;
  const delayForThrottleInMilleSeconds = 750;
  const throttle = (e: ChangeEvent<HTMLInputElement>) => {
    if (throttlePause) return;
    throttlePause = true;
    setTimeout(() => {
      dispatch(setSearch(e.target.value));
      throttlePause = false;
      router.push("/blogs/1");
    }, delayForThrottleInMilleSeconds);
  };
  const router = useRouter();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        textDecoration: "underline",
      }}
    >
      <label style={{ display: "none" }}></label>
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
          <option value={i}>{v}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search . . ."
        className="form-input"
        value={localSearch}
        onChange={(e) => {
          setLocalSearch(e.target.value);
          throttle(e);
        }}
      />
    </div>
  );
}
