"use client";
import { BlogPostReturn } from "@/models/blogPostReturn";
import { AppDispatch, RootState, store } from "@/store";
import BlogListDisplayItem from "./BlogListDisplayItem";
import PaginatedBlogPostListControls from "./PaginatedBlogPostListControls";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { applySorting, applyTitleFilter } from "@/functions/helpers";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default function PaginatedBlogPostList() {
  const search = useAppSelector((state) => state.search.search);
  const sortType = useAppSelector((state) => state.blogPostList.sortType);
  const blogList = useAppSelector((state) => state.blogPostList.list);
  const startPage: number =
    (store.getState().blogPostList.currentPage - 1) *
    store.getState().blogPostList.displayNumber;
  const endPage: number =
    startPage + store.getState().blogPostList.displayNumber;
  const list: BlogPostReturn[] = applyTitleFilter(
    applySorting(blogList, sortType),
    search
  ).slice(startPage, endPage);

  return (
    <div id="blog-list-slice-container">
      <div id="blog-list-slice">
        {list.map((blog, index) => (
          <BlogListDisplayItem blog={blog} key={`${blog.blogId}-#${index}`} />
        ))}
      </div>
      <PaginatedBlogPostListControls />
    </div>
  );
}
