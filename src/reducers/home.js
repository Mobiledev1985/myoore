const initialState = {};

export const customerProfileReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_CUST_PROFILE_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'CUST_PROFILE_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'CUST_PROFILE_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

export const userdetailsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_USERDET_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'USERDET_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'USERDET_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
