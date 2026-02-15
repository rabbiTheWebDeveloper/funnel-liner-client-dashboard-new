// import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import Cookies from "js-cookie";

// const token = Cookies.get("token");

// const data = Cookies.get();
// const mainData = data?.user;
// let parseData;
// if (mainData != null) {
//     parseData = JSON?.parse(mainData);
// }

// export let shopId = parseData?.shop_id
// export let domain = parseData?.domain
// export let userId = parseData?.id

// export const orderApiSlice = createApi({
//         reducerPath: "orderApi",
//         baseQuery: fetchBaseQuery({
//             baseUrl: "https://dev.funnelliner.com/api/v1/client",
//             prepareHeaders: (headers, {getState}) => {
//                 const state = getState();
//                 headers.set('Authorization', `Bearer qYo86aXYskRZnMyVzJkfHMTwsC0eScRvvqoGeDV8YADAOvsUWO8Rl0kK8xKyAIfi7GUvmJXfxllVuPOK`);
//                 headers.set('shop-id', '852413');
//                 headers.set('id', "14");
//                 headers.set('Content-Type', 'application/multipart/form-data');
//                 headers.set('X-Requested-With' , 'XMLHttpRequest');
//                 return headers;
//             },
//         }),
//     endpoints: (builder) => ({
//             getOrders: builder.query({
//                 query: () => "/orders",
//                 keepUnusedDataFor: 600,
//             }),
//             }),
//     });
//         export const {useGetOrdersQuery} =orderApiSlice ;