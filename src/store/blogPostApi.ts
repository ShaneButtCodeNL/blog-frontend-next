import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query";

import { BlogPostReturn } from "@/models/blogPostReturn";

export const blogPostApi = createApi({
  reducerPath: "blogPostApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000/api/" }),
  tagTypes: ["blogPosts"],
  endpoints: (builder) => ({
    search: builder.query<BlogPostReturn[], string>({
      query: (q) => `search?title=${q}`,
      providesTags: (res, err, search) => [{ type: "blogPosts", search }],
    }),
  }),
});
