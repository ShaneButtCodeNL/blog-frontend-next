"use client";
import { SortTypes } from "@/models/blogPostReturn";
import { ChangeEvent } from "react";
import { AppDispatch, RootState, store } from "@/store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { setSortType } from "@/store/blogPosts";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";
import { updateStoreSortType } from "@/functions/serverFunctions";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

const sortTypeToReadableString: string[] = [
  "You Shoud never See this one",
  "Ascending Dates",
  "Descending Dates",
  "Ascending Title",
  "Descending Title",
  "Least Liked",
  "Most Liked",
];

export default function BlogPostListSort() {
  const router = useRouter();
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
    updateStoreSortType(getSortType(parseInt(e.target.value))).then((_) => {
      router.refresh();
    });
  }
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ textDecoration: "underline", marginLeft: "1em" }}>
        Sort{" "}
      </label>
      <select
        onChange={selectFunction}
        defaultValue={currentSort}
        id="sort-type-selection"
        className="form-input sort-selection"
      >
        {Object.keys(SortTypes)
          .filter((v) => isNaN(Number(v)))
          .map((v: string, i: number) => (
            <option
              key={`option-${i + 1}-${v}`}
              value={
                //@ts-ignore
                SortTypes[v]
              }
              id={`sort-option-${i + 1}`}
              className="sort-option"
            >
              {
                //@ts-ignore
                sortTypeToReadableString[SortTypes[v]]
              }
            </option>
          ))}
      </select>
    </div>
  );
}
