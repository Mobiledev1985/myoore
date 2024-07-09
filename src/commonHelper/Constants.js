import {moderateScale, scale, verticalScale} from './scalingUtils';

import DeviceInfo from 'react-native-device-info';
import {consoleLog} from './utils';
import {BASE_URL, QUESTDOMAIN} from '../resources/route/endpoints';

const getApiEndpoint = url => {
  if (url?.includes('https:') || url?.includes('http:')) {
    return url;
  }
  //let _url = BASE_URL + url;
  let _url =
    url.includes('questapis') ||
    url.includes('onboardingapis') ||
    url.includes('paciapis') ||
    url.includes('nmsapis')
      ? QUESTDOMAIN + url
      : BASE_URL + url;
  _url = _url.replace('/v6/api//v6/api/', '/v6/api/');
  consoleLog('_url', url);
  return _url;
};

export {BASE_URL, getApiEndpoint};
export const isDeviceHuawei = DeviceInfo.getBrand().toLowerCase() === 'huawei';
export const isDeviceVersionMoreThan13 =
  parseFloat(DeviceInfo.getSystemVersion()) >= 13;

const version = DeviceInfo.getSystemVersion();
export const androidVersionNumber = Number(version.split('.')[0]);

// reducer constants
export const SPLASH_SCREEN_LOADED = 'SPLASH_SCREEN_LOADED';

export const GET_HOME_CAROUSEL = 'GET_HOME_CAROUSEL';
export const GET_DASHBBOARD_DATA = 'GET_DASHBBOARD_DATA';
export const BILL_PAY_RECHARGE_PLANS = 'BILL_PAY_RECHARGE_PLANS';
export const SET_BALANCE_API_DATA = 'SET_BALANCE_API_DATA';
export const SET_QUICK_LINKS = 'SET_QUICK_LINKS';
export const SET_OFFERS_FOR_YOU_API_DATA = 'SET_OFFERS_FOR_YOU_API_DATA';
export const SET_RECOMMANDATIONS_API_DATA = 'SET_RECOMMANDATIONS_API_DATA';
export const GET_DYNAMIC_CARDS_API = 'GET_DYNAMIC_CARDS_API';
export const SET_LOGIN_AUTH_OTP_PAGE_MODULES =
  'SET_LOGIN_AUTH_OTP_PAGE_MODULES';
export const SET_LOGIN_OTP_API_DATA = 'SET_LOGIN_OTP_API_DATA';
export const SET_LOGIN_PASSWORD_API_DATA = 'SET_LOGIN_PASSWORD_API_DATA';
export const SET_COMMON_API_DATA = 'SET_COMMON_API_DATA';
export const RESET_CACHE_REDUCER = 'RESET_CACHE_REDUCER';

export const REQUEST_TOKEN_API = 'REQUEST_TOKEN_API';
export const TOKEN_API_SUCCESS = 'TOKEN_API_SUCCESS';
export const TOKEN_API_FAILURE = 'TOKEN_API_FAILURE';

export const LOGIN_REQUEST_ACTION = 'LOGIN_REQUEST_ACTION';
export const LOGIN_SUCCESS_ACTION = 'LOGIN_SUCCESS_ACTION';
export const LOGIN_FAILURE_ACTION = 'LOGIN_FAILURE_ACTION';

export const LANGUAGE_SELECTED = 'LANGUAGE_SELECTED';
export const WALKTHROUGH_COMPLETE = 'WALKTHROUGH_COMPLETE';

export const WALKTHROUGH_API_REQUEST = 'WALKTHROUGH_API_REQUEST';
export const WALKTHROUGH_API_SUCCESS = 'WALKTHROUGH_API_SUCCESS';
export const WALKTHROUGH_API_FAILURE = 'WALKTHROUGH_API_FAILURE';

export const CUSTPROFILE_API_REQUEST = 'CUSTPROFILE_API_REQUEST';
export const CUSTPROFILE_API_SUCCESS = 'CUSTPROFILE_API_SUCCESS';
export const CUSTPROFILE_API_FAILURE = 'CUSTPROFILE_API_FAILURE';

export const USER_LOGGEDIN = 'USER_LOGGEDIN';
export const POSTPAID_SIM_HEADER_BACKGROUNDCOLOR =
  'POSTPAID_SIM_HEADER_BACKGROUNDCOLOR';
export const POSTPAID_SIM_HEADER_TINTCOLOR = 'POSTPAID_SIM_HEADER_TINTCOLOR';

export const POSTPAID_CVM_STORE_DATA = 'POSTPAID_CVM_STORE_DATA';
export const STORE_DASHBOARD_QUEST_POP_DATA = 'STORE_DASHBOARD_QUEST_POP_DATA';
export const STORE_NOJOOM_QUEST_POP_DATA = 'STORE_NOJOOM_QUEST_POP_DATA';

export const STORE_OPACITY_CVM_THEME = 'STORE_OPACITY_CVM_THEME';
export const STORE_SCROLLING_VALUE = 'STORE_SCROLLING_VALUE';
export const TRACKCOMPLAINTS_TOAST = 'TRACKCOMPLAINTS_TOAST';
export const PERSONALINFO_TOAST = 'PERSONALINFO_TOAST';

// home notifications
export const NOTIFICATION_API_REQUEST = 'NOTIFICATION_API_REQUEST';
export const NOTIFICATION_API_SUCCESS = 'NOTIFICATION_API_SUCCESS';
export const NOTIFICATION_API_FAILURE = 'NOTIFICATION_API_FAILURE';

// home accordion
export const ACCORDION_API_REQUEST = 'ACCORDION_API_REQUEST';
export const ACCORDION_API_SUCCESS = 'ACCORDION_API_SUCCESS';
export const ACCORDION_API_FAILURE = 'ACCORDION_API_FAILURE';

export const LAYOUT_API_REQUEST = 'LAYOUT_API_REQUEST';
export const LAYOUT_API_SUCCESS = 'LAYOUT_API_SUCCESS';
export const LAYOUT_API_FAILURE = 'LAYOUT_API_FAILURE';

// tabs in each screen
export const REQUEST_FILTERTABS_DATA = 'REQUEST_FILTERTABS_DATA';
export const FILTERTABS_DATA_SUCCESS = 'FILTERTABS_DATA_SUCCESS';
export const FILTERTABS_DATA_FAILURE = 'FILTERTABS_DATA_FAILURE';

// tabs content in each screen
export const REQUEST_TABCONTENT_DATA = 'REQUEST_TABCONTENT_DATA';
export const TABCONTENT_DATA_SUCCESS = 'TABCONTENT_DATA_SUCCESS';
export const TABCONTENT_DATA_FAILURE = 'TABCONTENT_DATA_FAILURE';
/* style constants */
// full width
export const FULL_WIDTH_PERCENTAGE = '100%';
export const FULL_HEIGHT_PERCENTAGE = '100%';

//vertical scales
export const VERTICAL_SCALE_5 = verticalScale(5);
export const VERTICAL_SCALE_8 = verticalScale(8);
export const VERTICAL_SCALE_10 = verticalScale(10);
export const VERTICAL_SCALE_15 = verticalScale(15);
export const VERTICAL_SCALE_18 = verticalScale(18);
export const VERTICAL_SCALE_20 = verticalScale(20);
export const VERTICAL_SCALE_25 = verticalScale(25);
export const VERTICAL_SCALE_27 = verticalScale(27);
export const VERTICAL_SCALE_30 = verticalScale(30);
export const VERTICAL_SCALE_40 = verticalScale(40);
export const VERTICAL_SCALE_42 = verticalScale(42);
export const VERTICAL_SCALE_45 = verticalScale(45);
export const VERTICAL_SCALE_50 = verticalScale(50);
export const VERTICAL_SCALE_60 = verticalScale(60);
export const VERTICAL_SCALE_80 = verticalScale(80);
export const VERTICAL_SCALE_90 = verticalScale(90);
export const VERTICAL_SCALE_100 = verticalScale(100);
export const VERTICAL_SCALE_120 = verticalScale(120);
export const VERTICAL_SCALE_130 = verticalScale(130);
export const VERTICAL_SCALE_150 = verticalScale(150);
export const VERTICAL_SCALE_180 = verticalScale(180);
//horizontal scales
export const HORIZONTAL_SCALE_5 = scale(5);
export const HORIZONTAL_SCALE_7 = scale(7);
export const HORIZONTAL_SCALE_10 = scale(10);
export const HORIZONTAL_SCALE_12 = scale(12);
export const HORIZONTAL_SCALE_15 = scale(15);
export const HORIZONTAL_SCALE_17 = scale(17);
export const HORIZONTAL_SCALE_20 = scale(20);
export const HORIZONTAL_SCALE_25 = scale(25);
export const HORIZONTAL_SCALE_30 = scale(30);
export const HORIZONTAL_SCALE_35 = scale(35);
export const HORIZONTAL_SCALE_40 = scale(40);
export const HORIZONTAL_SCALE_180 = scale(180);

// overall scales
export const SCALE_SIZE_5 = moderateScale(5);
export const SCALE_SIZE_8 = moderateScale(8);
export const SCALE_SIZE_10 = moderateScale(10);
export const SCALE_SIZE_12 = moderateScale(12);
export const SCALE_SIZE_14 = moderateScale(14);
export const SCALE_SIZE_16 = moderateScale(16);
export const SCALE_SIZE_18 = moderateScale(18);
export const SCALE_SIZE_19 = moderateScale(19);
export const SCALE_SIZE_20 = moderateScale(20);
export const SCALE_SIZE_22 = moderateScale(22);
export const SCALE_SIZE_25 = moderateScale(25);
export const SCALE_SIZE_30 = moderateScale(30);
export const SCALE_SIZE_36 = moderateScale(36);
export const SCALE_SIZE_40 = moderateScale(40);
export const SCALE_SIZE_45 = moderateScale(45);
export const SCALE_SIZE_50 = moderateScale(50);
export const SCALE_SIZE_115 = moderateScale(115);
export const SCALE_SIZE_140 = moderateScale(140);

// AsyncStorage key's
export const SMARTLOGIN = 'SMARTLOGIN';
export const IS_LOGGED_IN = 'isLoggedIn';
export const TOKEN_ID = 'tokenid';
export const NMFLOW_TOKEN_ID = 'nmflowtokenid';
export const SELECTED_LANG = 'selectedLang';
export const APP_RESTART_LANG = 'apprestart';
export const CHILDMSISDN = 'childMSISDN';
export const LOGIN_TYPE = 'loginType';
export const CODEPUSH_VERSION = 'codepushversion';
export const SOCIAL_PROFILE_PIC = 'socialProfilepic';
export const SOCIAL_ID_KEY = 'socialidkey';
export const HIDE_ROAMING_POPUP = 'hideRoamingPopup';
export const STATUSBAR_COLOR = 'splashStatusBarColor';
export const NO_THANKS = 'nothanks';
export const PUSH_REGISTER = 'pushregister';
export const TOKEN_TIME = 'tokentime';
export const SELECTED_MSISDN = 'selectedMSISDN';
export const CUSTOMER_PROFILE = 'customerprofile';
export const RATE_PLAN_TYPE = 'rateplantype';
export const IS_INTERNAL_REDIRECT = 'isinternalredirect';
export const APP_INSTALLED = 'appinstalled';
export const IS_RELOAD_SLIDER = 'IS_RELOAD_SLIDER';
export const DO_NOT_SHOW_FIFA_INSTANT = 'DO_NOT_SHOW_FIFA_INSTANT';
export const MOBILEID_TIMER_STATUS = 'mobileidtimerstatus';
export const DEVICE_UNQUIE_ID = 'deviceunqueid';
export const STORE_EMAIL_MOBILE = 'storeEmailMobile';
export const STORE_FCM_TOKEN = 'storefcmtoken';
export const APP_SIM_PERMISSION = 'simaccesspermission';
export const PHOTO_PERMISSION = 'photopermission';
export const LOGGEDIN_MSISDN = 'loggedinMSISDN';
export const VIDEO_INSTALL_ONE_TIME = 'videoplayfirstinstall';
export const LANGUAGE_STORE = 'LanguageStore';
export const GET_HEADER_MOBILE_NUMBER = 'GET_HEADER_MOBILE_NUMBER';
export const SUPPORT_NEEDHELP_TITLE_NAME = 'SUPPORT_NEEDHELP_TITLE_NAME';
export const SHOP_CART_ID = 'shopcartid';
export const SHOP_ITEM_ID = 'shopitemid';
export const SHOP_ACCOUNT_ID = 'accountid';
export const SHOP_CART_TIME = 'shopcarttime';
export const SHOP_PROGRESS_TIME = 'shopprogresstime';
//Sim status
export const PHYSICAL = 'PHYSICAL';
export const READY_TO_ACTIVATE = 'READY_TO_ACTIVATE';
export const ALREADY_ACTIVATE = 'ALREADY_ACTIVATE';
export const ESIM_TO_ESIM = 'ESIM_TO_ESIM';
export const LANGUAGE_CHANGE = 'LANGUAGE_CHANGE';
export const LANGUAGE_SWITCHED = 'LANGUAGE_SWITCHED';
export const NOJOOM_PAGE_VISIT = 'NOJOOM_PAGE_VISIT';
export const DAILY_APP_VISIT = 'DAILY_APP_VISIT';
export const SMARTPAY_PAGE_VISIT = 'SMARTPAY_PAGE_VISIT';
export const CONST_REGEX_NAME =
  /[`~0-9!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g;
export const CONST_REGEX_ADDRESS =
  /[`!@#₹$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§《》¡¿•×÷()_|+\=?;:'",.<>\{\}\[\]\\\/]/g;
export const CONST_REGEX_MOBILE =
  /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g;
export const CONST_REGEX_EMAIL_ADDRESS =
  /[`!#₹$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§《》¡¿•×÷()|+\=?;:'",<>\{\}\[\]\\\/]/g;
export const CONST_REGEX_AMOUNT =
  /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》a-zA-Z ¡¿•×÷()_|+\-=?;:'",<>\{\}\[\]\\\/]/g;
export const CONST_REGEX_FAQ = /[<>'"\u2018\u2019\u201C\u201D]/g;

export const anothercarddata = [
  {
    cardnumber: '',
    cardid: '1',
    address: '',
    customer: '',
    funding: '',
    brand: '',
    exp_month: '',
    exp_year: '',
    first_six: '',
    last_four: '',
    name: '',
    icon: '',
    lblexpiry: '',
    optiontype: '',
    titlecolor: '',
    backgroundcolor: '',
    isAnotherCard: true,
    disabled: false,
  },
];

export const renewDataResp = {
  status: '0',
  msisdn: null,
  customertype: null,
  rateplantype: null,
  isprepaid: false,
  code: '31900',
  message: 'SUCCESS',
  infomsg: '',
  actualmessage: null,
  refcode: null,
  transid: 'd23c42bde80f4b279e95afb592394b86',
  time: '2023-03-14T15:33:32.587',
  reftime: '0',
  timetaken: '0',
  response: [
    {
      msisdn: '66298243',
      heading: 'Contract Renewal',
      buttontext: 'RENEW',
      nickname: '',
      AvailableOffers: [
        {
          serviceid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191428',
          offerid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191428',
          servicetype: 'INTERACTIVE',
          servicecode: '',
          name: 'Special renewal offer!',
          description:
            'Renew your 5KD plan and get extra 5GB and 150 local minutes.',
          validity: null,
          stepdatavalue: null,
          stepvoicevalue: null,
          status: 'I',
          statusdesc: 'INTERACTIVE',
          image:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          webimage:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          visible: false,
          popup: {
            title: 'Confirmation',
            activate_message:
              'Are you sure you want to activate Special renewal offer!?',
            deactivate_message:
              'Are you sure you want to deactivate Special renewal offer!?',
            activate_button: 'Continue',
            deactivate_button: 'Cancel',
            cancel_button: 'Cancel',
            confirmation: true,
            openurl: false,
            confirm_url: '',
          },
          expirationdate: '',
          rnexpirationdate: null,
          effectivedate: '',
          position: 0,
          title: 'Special renewal offer!',
          actionbutton: 'Subscribe',
          category: 'PostpaidCVM',
          ordercatg: 'PostpaidCVM',
          subcategory: 'Renewal',
          lockunlock: false,
          unlockimage: '',
          actiontype: null,
          external: 'F',
          maxgb: '',
          maxmins: '',
          maxvalidity: '',
          minmins: null,
          minvalidity: null,
          mingb: null,
          pricepergb: '',
          priceperminute: '',
          redeemflag: 'N',
          tid: '3b634deeda3442a1bb7b8b2bf4d14ade',
          totalavailablecoins: '0',
          validityrange: null,
          localminrange: null,
          datarange: null,
          servicenode: null,
          chargeamount: null,
          planid: null,
          isreccurent: null,
          iscancellable: null,
          languagecode: null,
          operation: null,
          sequenceno: null,
          amount: '5',
          currency: 'KD',
          usage: null,
          ctype: null,
          isitsurpriseoffer: false,
          redeemcoins: false,
          refcode: '',
          transdate: '',
          group: '',
          group_position: -1,
          showindisablemode: false,
          offercode: '5191428',
          share: {
            showshareicon: true,
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            bundleimage:
              'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
            deeplinkurl: 'https://app.ooredoo.com.kw/specialdeals',
            sharedtext:
              'Checkout this offer from Ooredoo! https://app.ooredoo.com.kw/specialdeals',
          },
          fifa: null,
          offertype: 'Renewal',
          offergroup: '',
        },
        {
          serviceid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191433',
          offerid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191433',
          servicetype: 'INTERACTIVE',
          servicecode: '',
          name: 'Special renewal offer!',
          description:
            'Renew your 5KD plan and get extra 25GB and 250 local minutes .',
          validity: null,
          stepdatavalue: null,
          stepvoicevalue: null,
          status: 'I',
          statusdesc: 'INTERACTIVE',
          image:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          webimage:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          visible: false,
          popup: {
            title: 'Confirmation',
            activate_message:
              'Are you sure you want to activate Special renewal offer!?',
            deactivate_message:
              'Are you sure you want to deactivate Special renewal offer!?',
            activate_button: 'Continue',
            deactivate_button: 'Cancel',
            cancel_button: 'Cancel',
            confirmation: true,
            openurl: false,
            confirm_url: '',
          },
          expirationdate: '',
          rnexpirationdate: null,
          effectivedate: '',
          position: 0,
          title: 'Special renewal offer!',
          actionbutton: 'Subscribe',
          category: 'PostpaidCVM',
          ordercatg: 'PostpaidCVM',
          subcategory: 'Renewal',
          lockunlock: false,
          unlockimage: '',
          actiontype: null,
          external: 'F',
          maxgb: '',
          maxmins: '',
          maxvalidity: '',
          minmins: null,
          minvalidity: null,
          mingb: null,
          pricepergb: '',
          priceperminute: '',
          redeemflag: 'N',
          tid: '3b634deeda3442a1bb7b8b2bf4d14ade',
          totalavailablecoins: '0',
          validityrange: null,
          localminrange: null,
          datarange: null,
          servicenode: null,
          chargeamount: null,
          planid: null,
          isreccurent: null,
          iscancellable: null,
          languagecode: null,
          operation: null,
          sequenceno: null,
          amount: '5',
          currency: 'KD',
          usage: null,
          ctype: null,
          isitsurpriseoffer: false,
          redeemcoins: false,
          refcode: '',
          transdate: '',
          group: '',
          group_position: -1,
          showindisablemode: false,
          offercode: '5191433',
          share: {
            showshareicon: true,
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            bundleimage:
              'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
            deeplinkurl: 'https://app.ooredoo.com.kw/specialdeals',
            sharedtext:
              'Checkout this offer from Ooredoo! https://app.ooredoo.com.kw/specialdeals',
          },
          fifa: null,
          offertype: 'Renewal',
          offergroup: '',
        },
      ],
      badges: {
        badgetitle: 'Badges',
        pop_title: 'Ooredoo Surprise',
        pop_description:
          'Collect 5 badges and the next Surprise offer of your choice will be free!',
        pop_more_text: 'Read more',
        pop_more_url: 'https://www.ooredoo.com.kw/portal/en/OoredooSurprise',
        pop_isexternal: 'false',
      },
      CoinsInfo: {
        enablesurprise: false,
        surpriseheadertext: 'YOUR NEXT PURCHASE IS ON US',
        surprisecounttext:
          'Complete your five Ooredoo Surprise purchase in X days to get your free surprise packs',
        coinslimit: 5,
        coinscount: 0,
        redeemcoins: false,
        Expirymsg: null,
        coins: null,
      },
      SurpriseOffersCount: 0,
      subheading: 'Renewal',
      header_bgcolor: '#28D0BF',
      subheader_bgcolor: '#2CD5C4',
      header_icon:
        'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23860&lang=en',
    },
    {
      msisdn: '65893136',
      heading: 'Contract Renewal on 65893136',
      buttontext: 'RENEW',
      nickname: '',
      AvailableOffers: [
        {
          serviceid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191428',
          offerid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191428',
          servicetype: 'INTERACTIVE',
          servicecode: '',
          name: 'Special renewal offer!',
          description:
            'Renew your 5KD plan and get extra 5GB and 150 local minutes.',
          validity: null,
          stepdatavalue: null,
          stepvoicevalue: null,
          status: 'I',
          statusdesc: 'INTERACTIVE',
          image:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          webimage:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          visible: false,
          popup: {
            title: 'Confirmation',
            activate_message:
              'Are you sure you want to activate Special renewal offer!?',
            deactivate_message:
              'Are you sure you want to deactivate Special renewal offer!?',
            activate_button: 'Continue',
            deactivate_button: 'Cancel',
            cancel_button: 'Cancel',
            confirmation: true,
            openurl: false,
            confirm_url: '',
          },
          expirationdate: '',
          rnexpirationdate: null,
          effectivedate: '',
          position: 0,
          title: 'Special renewal offer!',
          actionbutton: 'Subscribe',
          category: 'PostpaidCVM',
          ordercatg: 'PostpaidCVM',
          subcategory: 'Renewal',
          lockunlock: false,
          unlockimage: '',
          actiontype: null,
          external: 'F',
          maxgb: '',
          maxmins: '',
          maxvalidity: '',
          minmins: null,
          minvalidity: null,
          mingb: null,
          pricepergb: '',
          priceperminute: '',
          redeemflag: 'N',
          tid: '3b634deeda3442a1bb7b8b2bf4d14ade',
          totalavailablecoins: '0',
          validityrange: null,
          localminrange: null,
          datarange: null,
          servicenode: null,
          chargeamount: null,
          planid: null,
          isreccurent: null,
          iscancellable: null,
          languagecode: null,
          operation: null,
          sequenceno: null,
          amount: '5',
          currency: 'KD',
          usage: null,
          ctype: null,
          isitsurpriseoffer: false,
          redeemcoins: false,
          refcode: '',
          transdate: '',
          group: '',
          group_position: -1,
          showindisablemode: false,
          offercode: '5191428',
          share: {
            showshareicon: true,
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            bundleimage:
              'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
            deeplinkurl: 'https://app.ooredoo.com.kw/specialdeals',
            sharedtext:
              'Checkout this offer from Ooredoo! https://app.ooredoo.com.kw/specialdeals',
          },
          fifa: null,
          offertype: 'Renewal',
          offergroup: '',
        },
        {
          serviceid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191433',
          offerid: '3b634deeda3442a1bb7b8b2bf4d14ade_5191433',
          servicetype: 'INTERACTIVE',
          servicecode: '',
          name: 'Special renewal offer!',
          description:
            'Renew your 5KD plan and get extra 25GB and 250 local minutes .',
          validity: null,
          stepdatavalue: null,
          stepvoicevalue: null,
          status: 'I',
          statusdesc: 'INTERACTIVE',
          image:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          webimage:
            'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
          visible: false,
          popup: {
            title: 'Confirmation',
            activate_message:
              'Are you sure you want to activate Special renewal offer!?',
            deactivate_message:
              'Are you sure you want to deactivate Special renewal offer!?',
            activate_button: 'Continue',
            deactivate_button: 'Cancel',
            cancel_button: 'Cancel',
            confirmation: true,
            openurl: false,
            confirm_url: '',
          },
          expirationdate: '',
          rnexpirationdate: null,
          effectivedate: '',
          position: 0,
          title: 'Special renewal offer!',
          actionbutton: 'Subscribe',
          category: 'PostpaidCVM',
          ordercatg: 'PostpaidCVM',
          subcategory: 'Renewal',
          lockunlock: false,
          unlockimage: '',
          actiontype: null,
          external: 'F',
          maxgb: '',
          maxmins: '',
          maxvalidity: '',
          minmins: null,
          minvalidity: null,
          mingb: null,
          pricepergb: '',
          priceperminute: '',
          redeemflag: 'N',
          tid: '3b634deeda3442a1bb7b8b2bf4d14ade',
          totalavailablecoins: '0',
          validityrange: null,
          localminrange: null,
          datarange: null,
          servicenode: null,
          chargeamount: null,
          planid: null,
          isreccurent: null,
          iscancellable: null,
          languagecode: null,
          operation: null,
          sequenceno: null,
          amount: '5',
          currency: 'KD',
          usage: null,
          ctype: null,
          isitsurpriseoffer: false,
          redeemcoins: false,
          refcode: '',
          transdate: '',
          group: '',
          group_position: -1,
          showindisablemode: false,
          offercode: '5191433',
          share: {
            showshareicon: true,
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            icon: 'https://stgapp.ooredoo.com.kw/v6/api/banner/src?id=24147&lang=en',
            bundleimage:
              'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23862&lang=en',
            deeplinkurl: 'https://app.ooredoo.com.kw/specialdeals',
            sharedtext:
              'Checkout this offer from Ooredoo! https://app.ooredoo.com.kw/specialdeals',
          },
          fifa: null,
          offertype: 'Renewal',
          offergroup: '',
        },
      ],
      badges: {
        badgetitle: 'Badges',
        pop_title: 'Ooredoo Surprise',
        pop_description:
          'Collect 5 badges and the next Surprise offer of your choice will be free!',
        pop_more_text: 'Read more',
        pop_more_url: 'https://www.ooredoo.com.kw/portal/en/OoredooSurprise',
        pop_isexternal: 'false',
      },
      CoinsInfo: {
        enablesurprise: false,
        surpriseheadertext: 'YOUR NEXT PURCHASE IS ON US',
        surprisecounttext:
          'Complete your five Ooredoo Surprise purchase in X days to get your free surprise packs',
        coinslimit: 5,
        coinscount: 0,
        redeemcoins: false,
        Expirymsg: null,
        coins: null,
      },
      SurpriseOffersCount: 0,
      subheading: 'Renewal',
      header_bgcolor: '#28D0BF',
      subheader_bgcolor: '#2CD5C4',
      header_icon:
        'https://stgapp.ooredoo.com.kw/v6/api/banner/get?id=23860&lang=en',
    },
  ],
  bgcolor: null,
  data: null,
  captchatid: null,
  tokenid: null,
  survey: null,
  salert: null,
  headertext: null,
  headerimg: null,
  unreadcount: null,
  spinwinoffer: null,
  isesimenable: null,
  authtype_original: null,
  deeplink: null,
  deeplinktext: null,
};

export const smartpaynumbers = [
  {
    nickname: 'Raffi',
    msisdn: '667876888',
    planname: 'Shamel Voice',
    icon: null,
  },
];
export const smartpaygetnumbers = {
  status: '0',
  msisdn: null,
  customertype: null,
  rateplantype: null,
  isprepaid: false,
  code: '740000',
  message: 'success',
  infomsg: '',
  actualmessage: null,
  refcode: null,
  transid: '6182b666fc16467aa0d7e014236a0938',
  time: '2023-01-04T14:54:14.279',
  reftime: '0',
  timetaken: '872',
  response: {
    title: 'Number selection',
    description: 'Select/unselect numbers to pay under this card..',
    alllabel: 'All',
    numbers: [
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },

      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel sai',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Prepaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel ram',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel ram',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel Voice',
        isdisabled: false,
        isdifferentenrolled: true,
        numbertype: 'Postpaid',
        isdifferenttooltip: 'This number is enrolled by another login',
      },

      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel ravi',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Prepaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
      {
        msisdn: '60467687',
        tapcustomerid: null,
        savecardid: null,
        bscscsid: '26286986',
        status: null,
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        icon: 'https://stgapp.ooredoo.com.kw/Content/Images/Usermeta/656676/1666528680060_638021362807770710.jpg',
        nickname: 'STG tester t',
        planname: 'Shamel krishna',
        isdisabled: false,
        isdifferentenrolled: false,
        numbertype: 'Postpaid',
      },
    ],
    meta: {
      termstitle: 'Terms & Conditions',
      termagree: 'Agree for',
      termredirectionurl: '',
    },
    enablealert: {
      showalert: 'T',
      title: 'Are you sure you want to Add this number !MSISDN! to smart pay?',
      desc: '',
      btncanceltext: 'CANCEL',
      btnupdatenowtext: 'CONFIRM',
      cardexpirymsg: '',
    },
  },
  bgcolor: null,
  data: null,
  captchatid: null,
  tokenid: null,
  survey: null,
  salert: null,
  headertext: null,
  headerimg: null,
  unreadcount: null,
  spinwinoffer: null,
  isesimenable: null,
  authtype_original: null,
  deeplink: null,
  deeplinktext: null,
};

export const managesmartpaydata = {
  status: '0',
  msisdn: null,
  customertype: null,
  rateplantype: null,
  isprepaid: false,
  code: '686900',
  message: '',
  infomsg: '',
  actualmessage: null,
  refcode: null,
  transid: 'a34cdc77f6c24d209ddb35e4720f1ab5',
  time: '2023-07-12T08:48:13.940',
  reftime: '0',
  timetaken: '2482',
  response: {
    settingicon:
      'https://stgapp.ooredoo.com.kw/Content/Images/icons/settings.png',
    settinglabel: 'Settings',
    numberheading: 'Auto-payed numbers',
    Savedcard: {
      cardheading: 'Saved Card',
      cardnumber: 'xxxx 1111',
      maskednumber: 'xxxx 1111',
      cardbrand: 'VISA',
      icon: 'http://stgapp.ooredoo.com.kw/Content/Images/icons/visacard.png',
      cardname: 'test',
      expiry: 'Expires in 7/26',
      expiryyear: '26',
      expirymonth: '7',
      tapsavedcardid: 'card_8DEL502381PGDq9xx60837',
      bgcolor: '#15195A',
    },
    managenumbers: [
      {
        msisdn: '63630931',
        icon: '',
        nickname: 'testpost',
        tapcustomerid: 'cus_TS02A3220231510k0HN0607395',
        savecardid: 'card_8DEL502381PGDq9xx60837',
        bscscsid: '27439195',
        status: '1',
        planname: 'Shamel Voice',
        billcycle: '0',
        numbertype: 'Postpaid',
        tooltip: 'next billing cycle will show here',
        noactivesmartpaytooltip: 'No active smart pay number are available',
      },
      // {
      //   "msisdn": "63630931",
      //   "icon": "",
      //   "nickname": "testpost",
      //   "tapcustomerid": "cus_TS02A3220231510k0HN0607395",
      //   "savecardid": "card_8DEL502381PGDq9xx60837",
      //   "bscscsid": "27439195",
      //   "status": "1",
      //   "planname": "Shamel Voice",
      //   "billcycle": "0",
      //   "numbertype": "Postpaid",
      //   "tooltip": "your pack will automatically renwal on 24-jan-2023",
      //   "noactivesmartpaytooltip": "No active smart pay number are available"
      // }
    ],
    Alert: {
      showalert: 'F',
      title:
        'Your card will expire in !EXPIRYDUE! months. To continue using Smart Pay, please update your payment method',
      desc: 'To continue using Smart Pay, please update your payment method',
      btncanceltext: 'CANCEL',
      btnupdatenowtext: 'UPDATE NOW',
      cardexpirymsg: '',
    },
    singlenumberdisablealert: {
      showalert: 'T',
      title:
        'Are you sure you want to Deselet all numbers? This disable smart pay automatically',
      desc: '',
      btncanceltext: 'CANCEL',
      btnupdatenowtext: 'CONFIRM',
      cardexpirymsg: '',
    },
    disablealert: {
      showalert: 'T',
      title:
        'Are you sure you want to delete this number !MSISDN! from smart pay?',
      desc: '',
      btncanceltext: 'CANCEL',
      btnupdatenowtext: 'CONFIRM',
      cardexpirymsg: '',
    },
  },
  bgcolor: null,
  data: null,
  captchatid: null,
  tokenid: null,
  survey: null,
  salert: null,
  headertext: null,
  headerimg: null,
  unreadcount: null,
  spinwinoffer: null,
  isesimenable: null,
  authtype_original: null,
  deeplink: null,
  deeplinktext: null,
  walletdwnlinkinfo: null,
  recommendationcount: null,
};
