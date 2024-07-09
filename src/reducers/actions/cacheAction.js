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
} from '../../commonHelper/Constants';

export const getHomeCarousel = data => {
  return {type: GET_HOME_CAROUSEL, payload: data};
};

export const setDashboardData = data => {
  return {type: GET_DASHBBOARD_DATA, payload: data};
};

export const setBillPayApiData = data => {
  return {type: BILL_PAY_RECHARGE_PLANS, payload: data};
};

export const setBalanceApiData = data => {
  return {type: SET_BALANCE_API_DATA, payload: data};
};

export const setQuickLinks = data => {
  return {type: SET_QUICK_LINKS, payload: data};
};

export const setOffersForYouData = data => {
  return {type: SET_OFFERS_FOR_YOU_API_DATA, payload: data};
};

export const setRecommandationData = data => {
  return {type: SET_RECOMMANDATIONS_API_DATA, payload: data};
};

export const setDynamicCardData = data => {
  return {type: GET_DYNAMIC_CARDS_API, payload: data};
};

export const setLoginAuthPageModules = data => {
  return {type: SET_LOGIN_AUTH_OTP_PAGE_MODULES, payload: data};
};

export const setLoginOtpAPIData = data => {
  return {type: SET_LOGIN_OTP_API_DATA, payload: data};
};

export const setLoginPasswordData = data => {
  return {type: SET_LOGIN_PASSWORD_API_DATA, payload: data};
};

export const setCommonAPIData = data => {
  return {type: SET_COMMON_API_DATA, payload: data};
};

export const resetCacheReducer = data => {
  return {type: RESET_CACHE_REDUCER, payload: data};
};
