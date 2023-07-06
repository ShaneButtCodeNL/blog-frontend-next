import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { BlogPostReturn } from "@/models/blogPostReturn";

export interface BlogPostList {
  list: BlogPostReturn[];
  currentPage: number;
  displayNumber: number;
  siblings: number;
}

const initialState: BlogPostList = {
  list: [],
  currentPage: 1,
  displayNumber: 5,
  siblings: 2,
};

const blogPostsSlice = createSlice({
  name: "blogPostList",
  initialState,
  reducers: {
    setDisplayNumber: (state, action: PayloadAction<number>) => {
      state.displayNumber = action.payload;
    },
    setSiblings: (state, action: PayloadAction<number>) => {
      state.siblings = action.payload;
    },
    setList: (state, action: PayloadAction<BlogPostReturn[]>) => {
      state.list = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      const newPage = Math.min(
        Math.ceil(state.list.length / state.displayNumber),
        action.payload
      );
      state.currentPage = newPage;
    },
  },
});

export const { setDisplayNumber, setSiblings, setList, setCurrentPage } =
  blogPostsSlice.actions;
export default blogPostsSlice.reducer;
