import {
  FILTERTABS_DATA_FAILURE,
  FILTERTABS_DATA_SUCCESS,
  REQUEST_FILTERTABS_DATA,
  REQUEST_TABCONTENT_DATA,
  TABCONTENT_DATA_FAILURE,
  TABCONTENT_DATA_SUCCESS,
} from '../../commonHelper/Constants';

const initialState = {
  isLoading: true,
};

export const tabContent = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_FILTERTABS_DATA:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case FILTERTABS_DATA_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        data: action.payload?.data?.response,
        isLoading: false,
      });
    case FILTERTABS_DATA_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

const initialContentState = {
  isLoading: true,
};
export const tabContentDetail = (state = initialContentState, action) => {
  switch (action.type) {
    case REQUEST_TABCONTENT_DATA:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case TABCONTENT_DATA_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        data: action.payload?.data?.response,
        isLoading: false,
      });
    case TABCONTENT_DATA_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};
