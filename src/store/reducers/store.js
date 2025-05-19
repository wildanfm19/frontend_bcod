import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducers";

export const store = configureStore({
    reducer: {
         products: productReducer
    },
    preloadedState: {
       
    },
});

export default store;