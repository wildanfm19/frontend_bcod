const initialState = {
  user: null,
  loading: false,
  error: null,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "LOGIN_USER":
    case "GET_PROFILE":
      return {
        ...state,
        user: action.payload,
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
        loading: false,
        error: null,
      };

    default:
      return state;
  }
};
