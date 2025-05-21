import { configureStore } from "@reduxjs/toolkit";
import { productReducer } from "./ProductReducers";
import { errorReducer } from "./errorReducer";
import { cartReducer } from "./cartReducers";
import { authReducer } from "./authReducer";

const user = localStorage.getItem("auth")
    ? JSON.parse(localStorage.getItem("cartItems")) 
    : null; 

const cartItems = localStorage.getItem("cartItems")
? JSON.parse(localStorage.getItem("cartItems")) 
: []; 

    const initialState = {
        auth: {user: user},
        carts: {cart: cartItems},
    };

export const store = configureStore({
    reducer: {
         products: productReducer,
         errors: errorReducer,
         carts: cartReducer,
         auth: authReducer,
    },
    preloadedState: initialState,
});

export default store;