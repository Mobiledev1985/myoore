import {
  BASE_URL,
  CHILDMSISDN,
  SELECTED_LANG,
  TOKEN_ID,
  getApiEndpoint,
  LOGIN_TYPE,
} from '../Constants';
import {GetTimetaken, LogTimetaken, consoleLog, getItem} from '../utils';
import {getEvenPlaces, getOddPlaces, output} from '../ApiHeaders';

import DeviceInfo from 'react-native-device-info';
import {Dimensions} from 'react-native';
import axios from 'axios';
import {sha512} from 'js-sha512';
import i18n from '../../components/languageselector/i18next';
import {generateUUID} from '../../services/CommonUtils';

const {width, height} = Dimensions.get('window');

export const callQueryapi = async ({queryKey}) => {
  // consoleLog('callapi', queryKey);
  const [key, endpoint, param, header, setnochild = false] = queryKey;
  if (endpoint == null || endpoint == undefined) {
    return null;
  }
  const tokenid = await getItem(TOKEN_ID);
  const selectedlang = await getItem(SELECTED_LANG);
  const childMSISDN = await getItem(CHILDMSISDN);
  // consoleLog('endpoint', endpoint);
  // consoleLog('param', JSON.stringify(param));
  // consoleLog('Post API globaltoken', global.UniqueToken);
  // consoleLog('Post API  globallang', global.userlanguage);
  // consoleLog('Post API url', getApiEndpoint(endpoint));

  const currUnixTime = Date.now();
  const headerList = {
    ...getHeaderObject(
      tokenid,
      currUnixTime,
      param,
      selectedlang,
      childMSISDN,
      setnochild,
      endpoint
    ),
    ...header,
  };

  const res = await axios.post(
    getApiEndpoint(endpoint),
    param == null || param == undefined ? {} : JSON.stringify(param),
    {
      headers: headerList,
      timeout: 60000,
      timeoutErrorMessage: i18n.t('somethingwentwrong'),
    }
  );
  try {
    consoleLog('endpoint', getApiEndpoint(endpoint));
    consoleLog('param', JSON.stringify(param));
    // // // consoleLog('headers', '-------------------------------------');
    // // // consoleLog('headers', '-------------------------------------');
    // // // consoleLog('headerList', res.headers);
    consoleLog('apiresponse', JSON.stringify(res.data));
    ///Not for Client Release
    // LogTextLog(endpoint, param, GetTimetaken(res));
    LogTimetaken(res);
  } catch (e) {}
  // return res;
  if (
    getApiEndpoint(endpoint).includes('sso/rnvalidateotp') ||
    getApiEndpoint(endpoint).includes('TransferAuth/Checktwofactor') ||
    getApiEndpoint(endpoint).includes('DeviceAuth/Check')
  ) {
    var headerSecretStr = res.headers['x-imi-hashv2'];
    var responseStr = res.data;
    var uidStr = headerList['X-IMI-UID'];
    const signatureKey = `${JSON.stringify(responseStr)}&SALT=${getOddPlaces(
      uidStr
    )}`;
    const secretHash = sha512(signatureKey);
    if (headerSecretStr === secretHash) {
      return res;
    } else {
      return {};
    }
  } else {
    return res;
  }
};

export const getImageHeaders = (tokenId, selectedLang) => {
  const currUnixTime = Date.now();
  try {
    let _tmpheaders = global.imageheaderslist;
    if (
      _tmpheaders != null &&
      _tmpheaders != undefined &&
      _tmpheaders?.length > 5
    ) {
      return _tmpheaders;
    }
  } catch (e) {}
  const headerList = {
    ...getImageHeaderObject(tokenId, currUnixTime, selectedLang),
  };

  global.imageheaderslist = headerList;
  return headerList;
};
const getImageHeaderObject = (tokenId, timestamp, languageSelected) => {
  const tokenid = tokenId ?? timestamp;
  const platform = DeviceInfo.getSystemName();
  const osVersion = DeviceInfo.getSystemVersion();
  const deviceUniqueId = DeviceInfo.getUniqueId();
  const deviceUniqueIdVal = deviceUniqueId?._j || deviceUniqueId;
  const appVersion = DeviceInfo.getVersion();
  let headerObj = {};
  const resolution = '90X90';
  var headerHash = `${getEvenPlaces(
    timestamp
  )}&${tokenid}$${timestamp}$${platform}$${osVersion}`;
  let childMSISDN = global.setchildmsisdn_encrypt;
  if (childMSISDN != null && childMSISDN.length > 0) {
    headerHash = headerHash + '$' + childMSISDN;
  }
  const hdSignHash = sha512(headerHash);
  headerObj['User-Agent'] = output.userAgent;
  headerObj['X-IMI-App-OS'] = platform;
  headerObj['X-OS'] = platform;
  headerObj['X-IMI-App-Res'] = resolution;
  headerObj['X-IMI-App-Model'] = DeviceInfo.getModel();
  headerObj['X-IMI-App-OSVersion'] = osVersion;
  headerObj['X-IMI-App-UserAgent'] = `IMImobile/OoredooKuwait/${appVersion}`;
  headerObj['X-IMI-CHANNEL'] = 'MOBAPP';
  headerObj['X-IMI-DEV-ID'] = deviceUniqueIdVal?.toString();
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
  headerObj['X-IMI-SERVICEKEY'] = 'A7A45FE9-ECAC-4393-BB40-357F1E5491F7';
  headerObj['X-IMI-TOKENID'] = tokenid?.toString() ?? '';
  headerObj['X-IMI-UID'] = timestamp?.toString() + '';
  headerObj['X-IMI-UNIQUEID'] = deviceUniqueIdVal?.toString();
  headerObj['X-IMI-VERSION'] = appVersion;
  headerObj['X-IMI-RNST'] = new Date().getTime() + '';
  headerObj['X-IMI-APPTYPE'] = '1';
  if (childMSISDN != null && childMSISDN.length > 0) {
    // consoleLog('------------CHILD-LINENO', childMSISDN);
    headerObj['X-IMI-CHILD-LINENO'] = childMSISDN;
  }
  return headerObj;
};

const getHeaderObject = (
  tokenId,
  timestamp,
  reqBody,
  languageSelected,
  childMSISDN,
  setnochild,
  endpoint
) => {
  const tokenid = tokenId ?? timestamp;
  const platform = DeviceInfo.getSystemName();
  const osVersion = DeviceInfo.getSystemVersion();
  const deviceUniqueId = DeviceInfo.getUniqueId();
  const deviceUniqueIdVal = deviceUniqueId?._j || deviceUniqueId;
  const appVersion = DeviceInfo.getVersion();
  let headerObj = {};
  const resolution = `${String(width)}x${String(height)}`;
  let _tevenplaces = getEvenPlaces(timestamp);
  let headerHash = `${_tevenplaces}&${tokenid}$${timestamp}$${platform}$${osVersion}`;
  global.headerHash = headerHash;
  global.headerHashtime = timestamp;
  if (
    global.cvmOfferChildMsisdn != null &&
    global.cvmOfferChildMsisdn != undefined &&
    global.cvmOfferChildMsisdn != '' &&
    global.cvmOfferisSelected == 'T' &&
    global.cvmOfferisSelected != null &&
    global.cvmOfferisSelected != undefined &&
    global.cvmOfferisSelected != ''
  ) {
    // if (endpoint.includes('offers/activate')) {
    // global.cvmOfferisSelected = false;
    childMSISDN = global.cvmOfferChildMsisdn;
    // }
  }
  if (childMSISDN != null && childMSISDN.length > 0 && !setnochild) {
    headerHash = headerHash + '$' + childMSISDN;
  }
  const signatureKey = `${JSON.stringify(reqBody)}&SALT=${getOddPlaces(
    tokenid
  )}`;
  // consoleLog('headerHash', headerHash);
  const hdSignHash = sha512(headerHash);
  // consoleLog('hdSignHash', hdSignHash);
  const signatureHash = sha512(signatureKey);

  headerObj['User-Agent'] = output.userAgent;
  headerObj['X-IMI-App-OS'] = platform;
  headerObj['X-OS'] = platform;
  headerObj.Authorization =
    'Basic 8dbc05ac4f2912013157811dc578728bec6fc8a4c0d28f9cf0';
  headerObj['Content-Type'] = 'application/json';
  headerObj['X-IMI-App-Res'] = resolution;
  headerObj['X-IMI-App-Model'] = DeviceInfo.getModel();
  headerObj['X-IMI-App-OSVersion'] = osVersion;
  headerObj['X-IMI-App-UserAgent'] = `IMImobile/OoredooKuwait/${appVersion}`;
  headerObj['X-IMI-CHANNEL'] = 'MOBAPP';
  headerObj['X-IMI-DEV-ID'] = deviceUniqueIdVal;
  headerObj['X-IMI-ISREMEMBER'] = '1';
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
  headerObj['X-IMI-SERVICEKEY'] = 'A7A45FE9-ECAC-4393-BB40-357F1E5491F7';
  headerObj['X-IMI-SIGNATURE'] = signatureHash;
  headerObj['X-IMI-TOKENID'] = tokenid?.toString() ?? '';
  headerObj['X-IMI-UID'] = timestamp?.toString(); ///'1617866819752523';
  headerObj['X-IMI-UNIQUEID'] = deviceUniqueIdVal;
  headerObj['X-IMI-VERSION'] = appVersion;
  headerObj['X-IMI-RNST'] = new Date().getTime() + '';
  headerObj['X-IMI-APPTYPE'] = '1';
  headerObj['X-TRANSFER-AUTH-UNIQUEID'] = deviceUniqueIdVal || generateUUID(32);
  if (childMSISDN != null && childMSISDN.length > 0 && !setnochild) {
    // consoleLog('------------CHILD-LINENO', childMSISDN);
    headerObj['X-IMI-CHILD-LINENO'] = childMSISDN;
  }
  // consoleLog("  headerObj['X-IMI-TOKENID']", headerObj['X-IMI-TOKENID']);
  // headerObj['X-WAP-MSISDN'] = '72637946287364';
  return headerObj;
};

function GetUrlEndpoint(url) {
  try {
    let _u = url.replace(BASE_URL, '');
    _u = _u
      .replace('/', '_')
      .replace('/', '_')
      .replace('/', '_')
      .replace('/', '_')
      .replace('/', '_');
    // consoleLog('url', _u);
    return _u;
  } catch (e) {}
  return '';
}

export function LogTextLog(endpoint, input, timetaken) {
  try {
    const _dtt = new Date();
    let _txt =
      '\r\nurl:' + endpoint + '\r\nReq:' + input != null && input != undefined
        ? JSON.stringify(input)
        : '' + '\r\nPgName:' + global.currentpage + '\r\nTT:' + timetaken; ///GetTimetaken(res)
    var RNFS = require('react-native-fs');
    var path =
      RNFS.DownloadDirectoryPath +
      '/myooredoo_' +
      _dtt.getDate() +
      '_' +
      _dtt.getHours() +
      '_logs_' +
      global.currentpage +
      '.txt';
    RNFS.appendFile(path, _txt, 'utf8')
      .then(res => {
        getItem(LOGIN_TYPE).then(val => {
          consoleLog('logintype:', val);
        });
        consoleLog(res);
      })
      .catch(err => {
        consoleLog(err);
      });
  } catch (e) {
    consoleLog(e);
  }
}
