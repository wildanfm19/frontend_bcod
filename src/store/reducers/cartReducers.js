const initialState = {
    items: [],
    total_items: 0,
    subtotal: 0,
    removed_items: [],
    loading: false,
    error: null
};

export const cartReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_CART":
            return {
                ...state,
                ...action.payload,
                loading: false,
                error: null
            };
            
        case "CART_ERROR":
            return {
                ...state,
                loading: false,
                error: action.payload
            };

        default:
            return state;
    }
};