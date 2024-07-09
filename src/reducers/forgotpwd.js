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

export const forgotpwdReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'REQUEST_FORGOT_PWD_API':
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case 'FORGOT_PWD_SUCCESS':
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case 'FORGOT_PWD_FAILURE':
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
