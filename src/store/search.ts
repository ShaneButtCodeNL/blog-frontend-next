import { BlogPostReturn } from "@/models/blogPostReturn";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface SearchState {
  search: string;
  blogList: BlogPostReturn[];
}

const initialState: SearchState = {
  search: "",
  blogList: [],
};

const search = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearch: (state, action: PayloadAction<string>) => {
      state.search = action.payload;
    },
    setBlogList: (state, action: PayloadAction<BlogPostReturn[]>) => {
      state.blogList = action.payload;
    },
  },
});

export const { setSearch, setBlogList } = search.actions;
export default search.reducer;
