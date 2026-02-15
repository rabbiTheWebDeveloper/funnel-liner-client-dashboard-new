import { apiSlice } from "../api/apiSlice";


export const orderApi = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getOrders: builder.query({
            query: (data) => `/orders?type=${data}`,
            keepUnusedDataFor: 600,
        }),
        addOrder: builder.mutation({
            query: (data) => ({
                url: "/orders",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["order"],
        })
    }),
    });
    export const { useGetOrdersQuery ,useAddOrderMutation} = orderApi;






