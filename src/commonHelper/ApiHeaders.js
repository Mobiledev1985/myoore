import DeviceInfo from 'react-native-device-info';
import {Dimensions} from 'react-native';
import {IS_LOGGED_IN} from './Constants';
import NetInfo from '@react-native-community/netinfo';
import {consoleLog, getItem} from './utils';
import {sha512} from 'js-sha512';

const {width, height} = Dimensions.get('window');
export var output = {};

export const loadDeviceInfo = async () => {
  output.userAgent = await DeviceInfo.getUserAgent();
  output.networkType = (await NetInfo.fetch()).type;
  output.devcieName = await DeviceInfo.getDeviceName();
  output.isLoggedInValue = await getItem(IS_LOGGED_IN);
  output.hasGms = await DeviceInfo.hasGms();
};

export const getOddPlaces = t => {
  try {
    var v = '';
    for (let i = 0; i < t.length; ) {
      v += t[i];
      i = i + 2;
    }
    return v;
  } catch (e) {
    return t;
  }
};

export const getEvenPlaces = t => {
  try {
    var v = '';
    let _tt = t + '';
    for (let i = 1; i < _tt.length; ) {
      v += _tt[i];
      i = i + 2;
    }
    return v + '';
  } catch (e) {
    return t;
  }
};

const getHeaderObject = (reduxState, timestamp, reqBody, emptytoken) => {
  const {
    tokenReducer: {response},
    userData: {languageSelected},
  } = reduxState;

  var tokenid = response?.tokenid ?? timestamp;
  // consoleLog('---------response?.tokenid', response?.tokenid);
  const asynctokenid = global.tokenid;
  // consoleLog('---------global.tokenid', asynctokenid);
  if (asynctokenid != null && asynctokenid.length > 5) {
    tokenid = asynctokenid;
    // consoleLog('---------userTokenid', tokenid);
  }
  if (emptytoken == 'T') {
    tokenid = timestamp;
  }

  const platform = DeviceInfo.getSystemName();
  const osVersion = DeviceInfo.getSystemVersion();
  const deviceUniqueId = DeviceInfo.getUniqueId();
  const deviceUniqueIdVal = deviceUniqueId?._j || deviceUniqueId;
  const appVersion = DeviceInfo.getVersion();
  let headerObj = {};
  const resolution = `${String(width)}x${String(height)}`;
  let _timevent = getEvenPlaces(timestamp);
  const headerHash = `${_timevent}&${tokenid}$${timestamp}$${platform}$${osVersion}`;
  const signatureKey = `${JSON.stringify(reqBody)}&SALT=${getOddPlaces(
    tokenid
  )}`;
  const hdSignHash = sha512(headerHash);
  const signatureHash = sha512(signatureKey);

  headerObj['User-Agent'] = output.userAgent;
  headerObj['X-IMI-App-OS'] = platform;
  headerObj['X-OS'] = platform;
  headerObj.Authorization =
    'Basic ';
  headerObj['Content-Type'] = 'application/json';
  headerObj['X-IMI-App-Res'] = resolution;
  headerObj['X-IMI-App-Model'] = DeviceInfo.getModel();
  headerObj['X-IMI-App-OSVersion'] = osVersion;
  headerObj['X-IMI-App-UserAgent'] = `I/${appVersion}`;
  headerObj['X-IMI-CHANNEL'] = 'MOBAPP';
  headerObj['X-IMI-DEV-ID'] = deviceUniqueIdVal;
  headerObj['X-IMI-ISREMEMBER'] = output.isLoggedInValue === 'true' ? '1' : '0';
  headerObj['X-IMI-HDSIGN'] = hdSignHash;
  headerObj['X-IMI-LANGUAGE'] =
    languageSelected != null &&
    languageSelected != undefined &&
    languageSelected != '' &&
    languageSelected == 'ar'
      ? languageSelected
      : 'en';
  headerObj['langcookie'] =
    languageSelected != null &&
    languageSelected != undefined &&
    languageSelected != '' &&
    languageSelected == 'ar'
      ? languageSelected
      : 'en';
  headerObj['X-IMI-NETWORK'] = output.networkType;
  headerObj['X-IMI-SERVICEKEY'] = '';
  headerObj['X-IMI-SIGNATURE'] = signatureHash;
  headerObj['X-IMI-TOKENID'] = tokenid?.toString() ?? '';
  headerObj['X-IMI-UID'] = timestamp?.toString();
  headerObj['X-IMI-UNIQUEID'] = deviceUniqueIdVal;
  headerObj['X-IMI-VERSION'] = appVersion;
  // headerObj['X-WAP-MSISDN'] = '72637946287364';
  // consoleLog('--------------tokenid', tokenid);
  headerObj['X-IMI-RNST'] = new Date().getTime() + '';
  headerObj['X-IMI-APPTYPE'] = '1';
  // consoleLog('--------------headerObj', headerObj);
  return headerObj;
};

export {getHeaderObject};
