import Config from 'react-native-config';
const DOMAIN = '';
const IMAGEDOMAIN = '';
const HEDOMAIN = '';
const QUESTDOMAIN = '';

const BASE_URL = `${DOMAIN}/v6/api/`;

const FIREBASE_API_KEY = Config?.FIREBASEAPIKEY?.includes(`';`)
  ? Config?.FIREBASEAPIKEY.replace(`';`, '')
  : Config?.FIREBASEAPIKEY;

export const getAppImage = key => {
  try {
    let _imgarr = key.split('/');
    let _img = _imgarr[_imgarr.length - 1];
    let _url = IMAGEDOMAIN + '/content/images/assets_mobapp/' + _img;
    // consoleLog('getAppImage', _url);
    return _url;
  } catch (e) {}
  return '';
};
const getApiEndpoint = url => {
  if (url?.includes('https:')) {
    return url;
  }
  let _url = url.includes('questapis') ? DOMAIN + url : BASE_URL + url;

  return _url.replace('/v6/api //v6/api/', '/v6/api/');
};

export {BASE_URL, getApiEndpoint, DOMAIN, QUESTDOMAIN, HEDOMAIN};

export const HOME_PAGE_URL = {
  url: '/v6/api/pms/getpagemodules', //url: 'pms/getpagemodules',
  data: {name: 'rn_apphome_v4'},
  // 'rn_apphome_v3'},
};

export const HOME_DASHBOARD_URL = {
  url: '/v6/api/mtx/dashboard', //url: 'pms/getpagemodules',
  data: {type: 'myservices'},
};

export const EndPointUserDetails = {
  url: '/v6/api/sso/rnuserdetails', /// '/v6/api/basicservices/activate', //url: 'pms/getpagemodules',
  data: {},
};

//Shop on App
export const SHOPCART_API = '/onboardingapis/api/shop/getcartdetails';
export const SHOPDELETECART_API = '/onboardingapis/api/shop/removefromcart';
export const SHOP_PACIHASMOBILEID = '/paciapis/api/paci/rnhasmobileid';
export const SHOP_PACIAUTHENTICATIONSTATUS =
  '/paciapis/api/paci/getauthenticationstatus';
export const SHOP_GETAVAILABLENUMBERS = '/nmsapis/api/nms/getavailablenumbers';
export const SHOP_SEARCHNUMBERS = '/nmsapis/api/nms/search';
export const SHOP_PRODUCT_DETAIL = '/onboardingapis/api/shop/getproductdetails';
export const SHOP_PAYMENT_LINK = '/v6/api/payment/ShopPaymentLink';
export const SHOP_SENDOTP_API = '/onboardingapis/api/shop/rnsendotp';
export const SHOP_VERIFYOTP_API = '/onboardingapis/api/shop/rnvalidateotp';

