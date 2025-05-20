import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducers";
import { errorReducer } from "./errorReducer";

export const store = configureStore({
    reducer: {
         products: productReducer,
         errors: errorReducer,
    },
    preloadedState: {
    },
});

export default store;