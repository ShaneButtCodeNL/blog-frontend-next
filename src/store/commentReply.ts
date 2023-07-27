import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface CommentReplyState {
  parentCommentId: string;
  blogId: string;
  body: string;
  title: string;
}

const initialState: CommentReplyState = {
  parentCommentId: "",
  blogId: "",
  body: "",
  title: "",
};

const commentReplySlice = createSlice({
  name: "comment-reply",
  initialState,
  reducers: {
    setParentCommentId: (state, action: PayloadAction<string>) => {
      console.log("SETTING PARENT COMMENT ID");
      state.parentCommentId = action.payload;
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
  },
});

export const { setBlogId, setBody, setParentCommentId, setTitle } =
  commentReplySlice.actions;
export default commentReplySlice.reducer;
