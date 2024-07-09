import {
  BILL_PAY_RECHARGE_PLANS,
  GET_DASHBBOARD_DATA,
  GET_DYNAMIC_CARDS_API,
  GET_HOME_CAROUSEL,
  RESET_CACHE_REDUCER,
  SET_BALANCE_API_DATA,
  SET_COMMON_API_DATA,
  SET_LOGIN_AUTH_OTP_PAGE_MODULES,
  SET_LOGIN_OTP_API_DATA,
  SET_LOGIN_PASSWORD_API_DATA,
  SET_OFFERS_FOR_YOU_API_DATA,
  SET_QUICK_LINKS,
  SET_RECOMMANDATIONS_API_DATA,
} from '../commonHelper/Constants';

const initialState = {
  homecCarousel_Array: [],
  dashboardApi: {},
  Dashboard_billPayApi: {},
  Dashboard_balanceApi: {},
  QuickLinks_linksAPI: {},
  OffersForYou_Array: [],
  recommandations_Array: [],
  DynamicAPI_Array: [],
  LoginAuthOtp_PageModule: {},
  LoginOTP_Array: [],
  LoginPassword_Obj: {},
  commonAPI_Array: [],
};

export const cacheReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_HOME_CAROUSEL:
      return Object.assign({}, state, {
        ...state,
        homecCarousel_Array: [...state, action.payload],
      });
    case GET_DASHBBOARD_DATA:
      return Object.assign({}, state, {
        ...state,
        dashboardApi: action.payload,
      });
    case BILL_PAY_RECHARGE_PLANS:
      return Object.assign({}, state, {
        ...state,
        Dashboard_billPayApi: action.payload,
      });
    case SET_BALANCE_API_DATA:
      return Object.assign({}, state, {
        ...state,
        Dashboard_balanceApi: action.payload,
      });
    case SET_QUICK_LINKS:
      return Object.assign({}, state, {
        ...state,
        QuickLinks_linksAPI: action.payload,
      });
    case SET_OFFERS_FOR_YOU_API_DATA:
      return Object.assign({}, state, {
        ...state,
        OffersForYou_Array: [...state.OffersForYou_Array, action.payload],
      });
    case SET_RECOMMANDATIONS_API_DATA:
      return Object.assign({}, state, {
        ...state,
        recommandations_Array: [...state.recommandations_Array, action.payload],
      });
    case GET_DYNAMIC_CARDS_API:
      return Object.assign({}, state, {
        ...state,
        DynamicAPI_Array: [...state.DynamicAPI_Array, action.payload],
      });
    case SET_LOGIN_AUTH_OTP_PAGE_MODULES:
      return Object.assign({}, state, {
        ...state,
        LoginAuthOtp_PageModule: action.payload,
      });
    case SET_LOGIN_OTP_API_DATA:
      return Object.assign({}, state, {
        ...state,
        LoginOTP_Array: [...state.LoginOTP_Array, action.payload],
      });
    case SET_LOGIN_PASSWORD_API_DATA:
      return Object.assign({}, state, {
        ...state,
        LoginPassword_Obj: [...state.LoginPassword_Obj, action.payload],
      });
    case SET_COMMON_API_DATA:
      return Object.assign({}, state, {
        ...state,
        commonAPI_Array: [...state.commonAPI_Array, action.payload],
      });
    case RESET_CACHE_REDUCER:
      return Object.assign({}, state, {
        homecCarousel_Array: [],
        dashboardApi: {},
        Dashboard_billPayApi: {},
        Dashboard_balanceApi: {},
        QuickLinks_linksAPI: {},
        OffersForYou_Array: [],
        recommandations_Array: [],
        DynamicAPI_Array: [],
        LoginAuthOtp_PageModule: {},
        LoginOTP_Array: [],
        LoginPassword_Obj: {},
        commonAPI_Array: [],
      });
    default:
      return state;
  }
};
