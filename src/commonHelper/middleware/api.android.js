import axios from 'axios';
import i18n from '../../components/languageselector/i18next';

import {getHeaderObject, getOddPlaces} from '../ApiHeaders';
import {getApiEndpoint, LOGIN_TYPE} from '../Constants';
import {consoleLog, getItem, GetTimetaken, LogTimetaken} from '../utils';
import {logs} from './logger';
import {sha512} from 'js-sha512';

export const CALL_POST_API = 'Call Post API';

const currentDateTime = new Date().toISOString();
const callApi = (endpoint, params, headersList, modified = currentDateTime) => {
  if (endpoint == null || endpoint == undefined) {
    return null;
  }
  return axios
    .post(getApiEndpoint(endpoint), JSON.stringify(params), {
      headers: headersList,
      timeout: 60000,
      timeoutErrorMessage: i18n.t('somethingwentwrong'),
    })
    .then(response => {
      try {
        consoleLog('callApiendpoint', getApiEndpoint(endpoint));
        consoleLog('callApiparam', JSON.stringify(params));
        consoleLog(`response- ${JSON.stringify(response.data)}`);
        LogTimetaken(response);
      } catch (e) {
        consoleLog('eee', e);
      }
      try {
        LogTimetaken(response);
      } catch (e) {}
      if (
        getApiEndpoint(endpoint).includes('sso/rnvalidateotp') ||
        getApiEndpoint(endpoint).includes('TransferAuth/Checktwofactor') ||
        getApiEndpoint(endpoint).includes('DeviceAuth/Check')
      ) {
        var headerSecretStr = response.headers['x-imi-hashv2'];
        var responseStr = response.data;
        var uidStr = headersList['X-IMI-UID'];
        const signatureKey = `${JSON.stringify(
          responseStr
        )}&SALT=${getOddPlaces(uidStr)}`;
        const secretHash = sha512(signatureKey);
        if (headerSecretStr === secretHash) {
          return Object.assign({}, response);
        } else {
          return {};
        }
      } else {
        return Object.assign({}, response);
      }
      // return Object.assign({}, response);
    })
    .catch(error => {
      consoleLog('Error data', error);
      return Promise.reject(error);
    });
};

export default store => next => action => {
  const callAPI = action[CALL_POST_API];
  if (typeof callAPI === 'undefined') {
    return next(action);
  }

  let {endpoint, params, key, header, pageType} = callAPI;
  const {types} = callAPI;
  const [requestType, successType, failureType] = types;
  if (!Array.isArray(types) || types.length !== 3) {
    throw new Error('Expected array of 3 action types');
  }
  if (!types.every(type => typeof type === 'string')) {
    throw new Error('Expected action type to be string');
  }

  const actionWith = data => {
    const finalAction = Object.assign({}, action, data);
    delete finalAction[CALL_POST_API];
    return finalAction;
  };

  const successAction = payload => {
    return actionWith({
      type: successType,
      payload: payload,
      key: key,
    });
  };

  const failureAction = error => {
    return actionWith({
      type: failureType,
      payload: error,
      key: key,
    });
  };

  next(actionWith({type: requestType, key: key}));

  const currUnixTime = Date.now();

  const headerList = {
    ...getHeaderObject(store.getState(), currUnixTime.toString(), params),
    ...header,
  };
  return callApi(endpoint, params, headerList).then(
    responseObj => {
      if (responseObj.data.status == '0') {
        return Promise.resolve(responseObj).then(() => {
          return next(successAction(responseObj));
        });
      }
      // else if (sessionExpireCodes.includes(response.data.status_code)) {
      //   return next(failureAction(response));
      // }
      else {
        return next(failureAction(responseObj));
      }
    },
    error => {
      return next(failureAction(error));
    }
  );
};

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
