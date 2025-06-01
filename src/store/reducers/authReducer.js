const initialState = {
  user: null,
  seller_profile: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
      return {
        ...state,
        user: action.payload.user,
        seller_profile: action.payload.seller_profile,
        loading: false,
        error: null,
      };

    case "GET_PROFILE":
      return {
        ...state,
        user: action.payload.user,
        seller_profile: action.payload.seller_profile,
        loading: false,
        error: null,
      };

    case "IS_FETCHING_PROFILE":
      return {
        ...state,
        loading: true,
      };

    case "PROFILE_ERROR":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "LOG_OUT":
      return {
        user: null,
        seller_profile: null,
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};
