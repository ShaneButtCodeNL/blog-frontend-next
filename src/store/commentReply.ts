import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CommentReplyState {
  parentCommentId: string | null;
  blogId: string;
  body: string;
  title: string;
}

const initialState: CommentReplyState = {
  parentCommentId: null,
  blogId: "",
  body: "",
  title: "",
};

const commentReplySlice = createSlice({
  name: "comment-reply",
  initialState,
  reducers: {
    setParentCommentId: (state, action: PayloadAction<string>) => {
      if (action.payload === "") state.parentCommentId = null;
      else state.parentCommentId = action.payload;
    },
    setBlogId: (state, action: PayloadAction<string>) => {
      state.blogId = action.payload;
    },
    setBody: (state, action: PayloadAction<string>) => {
      state.body = action.payload;
    },
    setTitle: (state, action: PayloadAction<string>) => {
      state.title = action.payload;
    },
    reset: (state) => {
      state.blogId = "";
      state.body = "";
      state.parentCommentId = "";
      state.title = "";
    },
  },
});

export const { setBlogId, setBody, setParentCommentId, setTitle } =
  commentReplySlice.actions;
export default commentReplySlice.reducer;
