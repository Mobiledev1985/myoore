import {
  REQUEST_TOKEN_API,
  TOKEN_API_FAILURE,
  TOKEN_API_SUCCESS,
} from '../commonHelper/Constants';

const initialState = {};

const customerprofState = {
  isLoading: false,
  data: {},
};

export const tokenReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_TOKEN_API:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case TOKEN_API_SUCCESS:
      const key = action.key;

      return Object.assign({}, state, {
        ...state,
        ...action.payload.data,
        isLoading: false,
      });
    case TOKEN_API_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    case 'SPLASH_BG_DATA':
      return Object.assign({}, state, {
        ...state,
        imageOrVideoUrl: action.payload.url,
        imageOrVideoPath: action.payload.path,
      });
    case 'TOKEN_UPDATE':
      return Object.assign({}, state, {
        ...state,
        response: {
          ...state.response,
          tokenid: action.payload.tokenId,
        },
      });
    case 'CLEAR_USER_TOKEN':
      return Object.assign({}, state, {
        ...state,
        response: {
          ...state.response,
          tokenid: null,
        },
      });
    default:
      return state;
  }
};
