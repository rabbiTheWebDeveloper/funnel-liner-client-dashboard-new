import { apiSlice } from "../api/apiSlice";


export const productApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getProduct: builder.query({
            query: () => `/products`,
            keepUnusedDataFor: 600,
        }),
        addProduct: builder.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["order"],
        }),
        deleteProductList: builder.mutation({
            query: (id) => ({
                url:  `/products/${id}`,
                method: 'DELETE'
               
            }),
            invalidatesTags: ["order"],
        }),

    }),
});
export const { useGetProductQuery , useDeleteProductListMutation } = productApi;

    // deletePost: builder.mutation({
    //     query: (id) => ({
    //       url: `/posts/${id}`,
    //       method: 'DELETE',
    //       credentials: 'include',
    //     }),
    //     invalidatesTags: ['Post'],