import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import Cookies from "js-cookie";

const token = Cookies.get("token");

const data = Cookies.get();
const mainData = data?.user;
let parseData;
if (mainData != null) {
    parseData = JSON?.parse(mainData);
}

export let shopId = parseData?.shop_id
export let domain = parseData?.domain
export let userId = parseData?.id

export const apiSlice = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "https://web.funnelliner.com/api/v1/client",
        prepareHeaders: (headers, { getState }) => {
            const state = getState();
            headers.set('Authorization', `Bearer ${token}`);
            headers.set('shop-id', shopId);
            headers.set('id', userId);
            headers.set('Content-Type', 'application/multipart/form-data');
            headers.set('X-Requested-With', 'XMLHttpRequest');
            return headers;
        },
    }),

    tagTypes: ["order"],
    endpoints: (builder) => ({}),

});