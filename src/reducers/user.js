import {
  DO_NOT_SHOW_FIFA_INSTANT,
  GET_HEADER_MOBILE_NUMBER,
  IS_LOGGED_IN,
  IS_RELOAD_SLIDER,
  LANGUAGE_SELECTED,
  PERSONALINFO_TOAST,
  POSTPAID_CVM_STORE_DATA,
  POSTPAID_SIM_HEADER_BACKGROUNDCOLOR,
  POSTPAID_SIM_HEADER_TINTCOLOR,
  SELECTED_LANG,
  SPLASH_SCREEN_LOADED,
  STORE_DASHBOARD_QUEST_POP_DATA,
  STORE_NOJOOM_QUEST_POP_DATA,
  STORE_OPACITY_CVM_THEME,
  STORE_SCROLLING_VALUE,
  SUPPORT_NEEDHELP_TITLE_NAME,
  TRACKCOMPLAINTS_TOAST,
  USER_LOGGEDIN,
  WALKTHROUGH_COMPLETE,
} from '../commonHelper/Constants';
import {getSystemLocale, setItem, getItem} from '../commonHelper/utils';

import colors from '../resources/styles/colors';
let selectedLang;
let initialState = {};
const getLanguage = async () => {
  selectedLang = await getItem(SELECTED_LANG).then(async resp => {
    return resp;
  });
  return selectedLang ? selectedLang : getSystemLocale();
};

getLanguage().then(e => {
  initialState = {
    languageSelected: e,
    isLoggedIn: false,
    isWalkThroughComplete: false,
    splashScreenLoaded: false,
    bgColor: colors.YELLOW,
    showRoamingPopup: true,
    reloadpage: '',
    nojoombgcolor: colors.OOREDOO_RED,
    isLoading: false,
    isAssistTextSelected: false,
    isReloadSlider: '',
    DoNotShow: false,
    cvmopacity: 1,
    scrollinghome: 0,
  };
});

export const userData = (state = initialState, action) => {
  switch (action.type) {
    case LANGUAGE_SELECTED:
      return Object.assign({}, state, {
        ...state,
        languageSelected:
          action.payload != null &&
          action.payload !== undefined &&
          action.payload !== '' &&
          action.payload === 'ar'
            ? action.payload
            : 'en',
      });
    case WALKTHROUGH_COMPLETE:
      return Object.assign({}, state, {
        ...state,
        isWalkThroughComplete: action.payload,
      });
    case SPLASH_SCREEN_LOADED:
      return Object.assign({}, state, {
        ...state,
        splashScreenLoaded: action.payload,
      });
    case USER_LOGGEDIN:
      setItem(IS_LOGGED_IN, JSON.stringify(action.payload));
      let as = {...state};
      if (!action.payload) {
        as = Object.keys(as)
          .filter(k => !k.includes('bgcolor'))
          .reduce((k, m) => {
            k[m] = as[m];
            return k;
          }, {});
      }
      return Object.assign({}, as, {
        ...as,
        isLoggedIn: action.payload,
        showRoamingPopup: true,
        loadedOnce: false,
      });
    case POSTPAID_SIM_HEADER_BACKGROUNDCOLOR:
      return Object.assign({}, state, {
        ...state,

        postpaidsimheadercolor: action.payload,
      });
    case POSTPAID_SIM_HEADER_TINTCOLOR:
      return Object.assign({}, state, {
        ...state,

        postpaidsimheadertintcolor: action.payload,
      });
    case STORE_DASHBOARD_QUEST_POP_DATA:
      return Object.assign({}, state, {
        ...state,

        questdashboarddata: action.payload,
      });
    case STORE_NOJOOM_QUEST_POP_DATA:
      return Object.assign({}, state, {
        ...state,

        nojoomdashboarddata: action.payload,
      });
    case 'BG_COLOR':
      const routeName = action.payload?.routeName + '_bgcolor';
      return Object.assign({}, state, {
        ...state,
        loadedOnce: action?.payload?.loadedOnce ?? false,
        [routeName]: action.payload.bgcolor,
      });
    case 'NOJOOM_BG_COLOR':
      return Object.assign({}, state, {
        ...state,
        nojoombgcolor: action.payload,
      });
    case 'RELOAD_PAGE':
      return Object.assign({}, state, {
        ...state,
        reloadpage: action.payload,
      });
    case 'SHOW_ROAMING_POPUP':
      return Object.assign({}, state, {
        ...state,
        showRoamingPopup: action.payload,
      });
    case 'SHOW_LOADER':
      return Object.assign({}, state, {
        ...state,
        isLoading: action.payload,
      });
    case 'ISASSIST_TEXTBOX_SELECTED':
      return Object.assign({}, state, {
        ...state,
        isAssistTextSelected: action.payload,
      });
    case IS_RELOAD_SLIDER:
      return Object.assign({}, state, {
        ...state,
        isReloadSlider: action.payload,
      });
    case DO_NOT_SHOW_FIFA_INSTANT:
      return Object.assign({}, state, {
        ...state,
        DoNotShow: action.payload,
      });
    case POSTPAID_CVM_STORE_DATA:
      return Object.assign({}, state, {
        ...state,
        cvmdata: action.payload,
      });
    case STORE_OPACITY_CVM_THEME:
      return Object.assign({}, state, {
        ...state,
        opacity: action.payload,
      });
    case STORE_SCROLLING_VALUE:
      return Object.assign({}, state, {
        ...state,
        scrollingvalue: action.payload,
      });
    case GET_HEADER_MOBILE_NUMBER:
      return Object.assign({}, state, {
        ...state,
        headermobilenumber: action.payload,
      });
    case SUPPORT_NEEDHELP_TITLE_NAME:
      return Object.assign({}, state, {
        ...state,
        supportNeedhelpTitleName: action.payload,
      });
    case TRACKCOMPLAINTS_TOAST:
      return Object.assign({}, state, {
        ...state,
        toastdata: action.payload,
      });
    case PERSONALINFO_TOAST:
      return Object.assign({}, state, {
        ...state,
        personalToastData: action.payload,
      });
    default:
      return state;
  }
};
