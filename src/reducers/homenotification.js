import {
  NOTIFICATION_API_FAILURE,
  NOTIFICATION_API_REQUEST,
  NOTIFICATION_API_SUCCESS,
} from '../commonHelper/Constants';

const initialState = {
  isLoading: true,
};

export const homeNotification = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_API_REQUEST:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case NOTIFICATION_API_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        data: action.payload.data,
        isLoading: false,
      });
    case NOTIFICATION_API_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
