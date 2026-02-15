
import { apiSlice } from "../api/apiSlice";


export const categoryApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getCategory: builder.query({
            query: () => `/categories`,

        }),
        getSingleCategory: builder.query({
            query: (id) => `/categories/${id}`,

        }),
        addCategory: builder.mutation({
            query: (data) => ({
                url: '/categories',
                method: 'POST',
                body: data,
                formData: true,
              }),
        }),
        updateCategory: builder.mutation({
            query: ({ id, data }) => ({
                url: `/categories/${id}`,
                method: 'PATCH',
                credentials: 'include',
                body: data,
            }),
            // invalidatesTags: ['comments'],
        }),

    }),
});
export const { useAddCategoryMutation, useGetCategoryQuery, useGetSingleCategoryQuery, useUpdateCategoryMutation } = categoryApi;






