import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./login";
import blogPostsReducer from "./blogPosts";
import commentReplyReducer from "./commentReply";
import searchReducer from "./search";
import { blogPostApi } from "./blogPostApi";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    blogPostList: blogPostsReducer,
    commentReply: commentReplyReducer,
    blogPostApi: blogPostApi.reducer,
    search: searchReducer,
  },
  middleware(getDefaultMiddleware) {
    return getDefaultMiddleware().concat(blogPostApi.middleware);
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
