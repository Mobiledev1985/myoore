import {
  WALKTHROUGH_API_FAILURE,
  WALKTHROUGH_API_REQUEST,
  WALKTHROUGH_API_SUCCESS,
} from '../commonHelper/Constants';
import {consoleLog} from '../commonHelper/utils';

const initialState = {
  isLoading: false,
  data: {},
};

const customerprofState = {
  isLoading: false,
  data: {},
};

export const walkthroughGlobalSettings = (state = initialState, action) => {
  switch (action.type) {
    case WALKTHROUGH_API_REQUEST:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case WALKTHROUGH_API_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        data: action.payload.data.response,
        isLoading: false,
      });
    case WALKTHROUGH_API_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
