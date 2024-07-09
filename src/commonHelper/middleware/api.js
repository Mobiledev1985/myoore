// import axios from 'axios';
// import i18n from '../../components/languageselector/i18next';

// import {getHeaderObject} from '../ApiHeaders';
// import {getApiEndpoint} from '../Constants';
// import {consoleLog, LogTimetaken} from '../utils';
// import {logs} from './logger';

// export const CALL_POST_API = 'Call Post API';

// const currentDateTime = new Date().toISOString();
// const callApi = (endpoint, params, headersList, modified = currentDateTime) => {
//   // consoleLog('callApiendpoint params: ', getApiEndpoint(endpoint), params);

//   return axios
//     .post(getApiEndpoint(endpoint), JSON.stringify(params), {
//       headers: headersList,
//       timeout: 60000,
//       timeoutErrorMessage: i18n.t('somethingwentwrong'),
//     })
//     .then(response => {
//       try {
//         consoleLog('callApiendpoint', getApiEndpoint(endpoint));
//         consoleLog('callApiparam', JSON.stringify(params));
//         // consoleLog('headersList', JSON.stringify(headersList));
//         // consoleLog(`response- ${JSON.stringify(response.data)}`);
//       } catch (e) {
//         consoleLog('eee', e);
//       }
//       try {
//         LogTimetaken(response);
//       } catch (e) {}
//       return Object.assign({}, response);
//     })
//     .catch(error => {
//       consoleLog('Error data', error);
//       return Promise.reject(error);
//     });
// };

// export default store => next => action => {
//   const callAPI = action[CALL_POST_API];
//   if (typeof callAPI === 'undefined') {
//     return next(action);
//   }

//   let {endpoint, params, key, header, pageType} = callAPI;
//   const {types} = callAPI;
//   const [requestType, successType, failureType] = types;
//   if (!Array.isArray(types) || types.length !== 3) {
//     throw new Error('Expected array of 3 action types');
//   }
//   if (!types.every(type => typeof type === 'string')) {
//     throw new Error('Expected action type to be string');
//   }

//   const actionWith = data => {
//     const finalAction = Object.assign({}, action, data);
//     delete finalAction[CALL_POST_API];
//     return finalAction;
//   };

//   const successAction = payload => {
//     return actionWith({
//       type: successType,
//       payload: payload,
//       key: key,
//     });
//   };

//   const failureAction = error => {
//     return actionWith({
//       type: failureType,
//       payload: error,
//       key: key,
//     });
//   };

//   next(actionWith({type: requestType, key: key}));

//   const currUnixTime = Date.now();

//   const headerList = {
//     ...getHeaderObject(store.getState(), currUnixTime.toString(), params),
//     ...header,
//   };
//   return callApi(endpoint, params, headerList).then(
//     responseObj => {
//       if (responseObj.data.status == '0') {
//         return Promise.resolve(responseObj).then(() => {
//           return next(successAction(responseObj));
//         });
//       }
//       // else if (sessionExpireCodes.includes(response.data.status_code)) {
//       //   return next(failureAction(response));
//       // }
//       else {
//         return next(failureAction(responseObj));
//       }
//     },
//     error => {
//       return next(failureAction(error));
//     }
//   );
// };
