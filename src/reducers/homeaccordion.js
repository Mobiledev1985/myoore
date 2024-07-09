import {
  ACCORDION_API_REQUEST,
  ACCORDION_API_FAILURE,
  ACCORDION_API_SUCCESS,
} from '../commonHelper/Constants';

const initialState = {
  isLoading: true,
};

export const homeAccordion = (state = initialState, action) => {
  switch (action.type) {
    case ACCORDION_API_REQUEST:
      return Object.assign({}, state, {
        ...state,
        isLoading: true,
      });
    case ACCORDION_API_SUCCESS:
      return Object.assign({}, state, {
        ...state,
        data: action.payload?.data?.response,
        isLoading: false,
      });
    case ACCORDION_API_FAILURE:
      return Object.assign({}, state, {
        ...state,
        isLoading: false,
        error: action.payload,
      });
    default:
      return state;
  }
};

const accordionInitalState = {};

export const accordionTemplate = (state = accordionInitalState, action) => {
  switch (action.type) {
    case 'REQUEST_TEMPLATE':
      return Object.assign({}, state, {
        ...state,
        [action.key]: {isLoading: true},
      });
    case 'TEMPLATE_DATA_SUCCESS':
      return Object.assign({}, state, {
        ...state,
        [action.key]: {...action.payload.data, isLoading: false},
      });
    case 'TEMPLATE_DATA_FAILURE':
      return Object.assign({}, state, {
        ...state,
        [action.key]: {error: action.payload, isLoading: false},
      });
    default:
      return state;
  }
};
