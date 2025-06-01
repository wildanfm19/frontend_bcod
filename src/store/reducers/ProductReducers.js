const initialState = {
    products: null,
    categories: [],
    pagination: {
        currentPage: 1,
        perPage: 12,
        total: 0,
        lastPage: 1,
        from: 1,
        to: 1,
        links: []
    }
};

export const productReducer = (state = initialState, action) => {
    switch (action.type) {
        case "FETCH_PRODUCTS":
            return {
                ...state,
                products: action.payload,
                pagination: action.pagination
            };

             case "FETCH_CATEGORIES":
            return {
                ...state,
                categories: action.payload
            };

        default:
            return state;
    }
};