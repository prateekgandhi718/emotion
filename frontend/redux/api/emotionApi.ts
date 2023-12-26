import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";

const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_EMOTION_BE_API_ENDPOINT}/api`,
    prepareHeaders: async (headers) => { 
        const session = await getSession() as any
        if (session.accessToken && session.idToken) {
            const idToken = session.idToken
            const accessToken = session.accessToken 

            headers.set("Authorization", `Bearer ${idToken}`)
            headers.set("x-access-token", accessToken)
        }
        return headers
    },
})

export const emotionApi = createApi({
    reducerPath: "emotionApi",
    baseQuery: baseQuery,
    endpoints: (builder) => ({
        getHello: builder.query<any, Number>({
            query: (sampleNumber) => ({
                url: `get-hello-world?sampleNumber=${sampleNumber}`,
                method: "GET",
            }),
        })
    }),
})

export const { util, useGetHelloQuery } = emotionApi