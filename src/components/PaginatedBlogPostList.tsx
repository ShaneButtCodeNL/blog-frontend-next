"use server";
import { BlogPostReturn, SortTypes } from "@/models/blogPostReturn";
import { AppDispatch, RootState, store } from "@/store";
import BlogListDisplayItem from "./BlogListDisplayItem";
import PaginatedBlogPostListControls from "./PaginatedBlogPostListControls";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { applySorting, applyTitleFilter } from "@/functions/helpers";
import { ReactNode } from "react";
import { getAllBlogPosts } from "@/functions/apiController";
import {
  applySortingServerFunction,
  getAllBlogPostsFunction,
} from "@/functions/serverFunctions";

export default async function PaginatedBlogPostList({
  children,
  itemsCount,
}: {
  children: ReactNode;
  itemsCount: number;
}) {
  return (
    <div id="blog-list-slice-container">
      <div id="blog-list-slice">{children}</div>
      <PaginatedBlogPostListControls listItemCount={itemsCount} />
    </div>
  );
}
