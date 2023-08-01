"use client";
import { SortTypes } from "@/models/blogPostReturn";
import { ChangeEvent } from "react";
import { AppDispatch, RootState } from "@/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setSortType } from "@/store/blogPosts";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function BlogPostListSort() {
  const dispatch = useAppDispatch();
  const currentSort = useAppSelector((state) =>
    state.blogPostList.sortType.toString()
  );
  function getSortType(optVal: number) {
    switch (SortTypes[optVal]) {
      case "DATE_DEC": {
        return SortTypes.DATE_DEC;
      }
      case "DATE_ASC": {
        return SortTypes.DATE_ASC;
      }
      case "TITLE_ASC": {
        return SortTypes.TITLE_ASC;
      }
      case "TITLE_DEC": {
        return SortTypes.TITLE_DEC;
      }
      case "LIKES_ASC": {
        return SortTypes.LIKES_ASC;
      }
      case "LIKES_DEC": {
        return SortTypes.LIKES_DEC;
      }
      default:
        return SortTypes.DATE_DEC;
    }
  }
  function selectFunction(e: ChangeEvent<HTMLSelectElement>) {
    dispatch(setSortType(getSortType(parseInt(e.target.value))));
  }
  return (
    <div>
      <select
        onChange={selectFunction}
        defaultValue={currentSort}
        className="form-input"
      >
        {Object.keys(SortTypes)
          .filter((v) => isNaN(Number(v)))
          .map((v: string) => (
            //@ts-ignore
            <option value={SortTypes[v]}>{v}</option>
          ))}
      </select>
    </div>
  );
}
