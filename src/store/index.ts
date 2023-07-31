import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./login";
import blogPostsReducer from "./blogPosts";
import commentReplyReducer from "./commentReply";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    blogPostList: blogPostsReducer,
    commentReply: commentReplyReducer,
  },
});

store.subscribe(() =>
  console.log("Current state\n", store.getState().blogPostList)
);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
