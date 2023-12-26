import { configureStore } from "@reduxjs/toolkit";
import { emotionApi } from "./api/emotionApi";

export const store = configureStore({
    reducer: {
        [emotionApi.reducerPath]: emotionApi.reducer
    },
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({}).concat([emotionApi.middleware]),
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch