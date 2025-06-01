// src/store/reducers/categoryReducer.js

const initialState = {
    categories: [],
    loading: false,
    error: null,
};

export const categoryReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_CATEGORIES_REQUEST':
            return { ...state, loading: true, error: null };
        case 'FETCH_CATEGORIES_SUCCESS':
            return { ...state, loading: false, categories: action.payload };
        case 'FETCH_CATEGORIES_FAILURE':
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
}; 