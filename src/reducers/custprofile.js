import {
  CUSTPROFILE_API_REQUEST,
  CUSTPROFILE_API_FAILURE,
  CUSTPROFILE_API_SUCCESS,
} from '../commonHelper/Constants';

const customerprofState = {
  isLoading: false,
  data: {},
};
export const customProfileReducer = (state = customerprofState, action) => {
  switch (action.type) {
    case CUSTPROFILE_API_REQUEST:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case CUSTPROFILE_API_SUCCESS:
      const key = action.key;
      return Object.assign({}, state, {
        ...state,
        [key]: action.payload,
        isLoading: false,
      });
    case CUSTPROFILE_API_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
