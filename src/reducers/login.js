const initialState = {};

export const sendOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_SEND_OTP_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'SEND_OTP_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'SEND_OTP_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

export const validateOtpReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_VALIDATE_OTP_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'VALIDATE_OTP_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'VALIDATE_OTP_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

export const socialLoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_SOCIAL_LOGIN_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'SOIAL_LOGIN_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'SOCIAL_LOGIN_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

export const uservalReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_VALIDATE_OTP_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'VALIDATE_OTP_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'VALIDATE_OTP_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};




export const userlogindetailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_VAL_USER_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'VAL_USER_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        data: action.payload?.data?.response,
        isLoading: false,
      });
    case 'VAL_USER_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
        data: action.payload?.data?.response,
      });
    default:
      return state;
  }
};
