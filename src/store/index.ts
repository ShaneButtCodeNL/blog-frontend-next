import { configureStore } from "@reduxjs/toolkit";

import loginReducer from "./login";
import blogPostsReducer from "./blogPosts";

export const store = configureStore({
  reducer: {
    login: loginReducer,
    blogPostList: blogPostsReducer,
  },
});

//store.subscribe(() => console.log("Current state\n", store.getState()));

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
