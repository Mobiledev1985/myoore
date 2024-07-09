import {
  Alert,
  Dimensions,
  NativeModules,
  StatusBar,
  PermissionsAndroid,
} from 'react-native';
import {
  clearDataMethod,
  DeeplinkRedirection,
  getGlobalSettingValue,
  loginTypeValue,
} from '../services/CommonUtils';
import {
  LANGUAGE_CHANGE,
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_ITEM_ID,
  SMARTLOGIN,
} from './Constants';
import {RC4Decrypt, RC4Encrypt} from './RC4EncDec';
import {useEffect, useRef} from 'react';

import AsyncStorage from '@react-native-community/async-storage';
import RNExitApp from 'react-native-exit-app';
import ReactNativeBiometrics from 'react-native-biometrics';
import ScreenName from '../navigator/ScreenName';
import {getOddPlaces} from './ApiHeaders';
import i18n from 'i18next';
import {sha512} from 'js-sha512';
import {reject} from 'lodash';

export const HEADER_HEIGHT = StatusBar.currentHeight || 40;
export const {width: WINDOW_WIDTH, height: WINDOW_HEIGHT} =
  Dimensions.get('window');

// Code to get all sim number in android
export const getPhoneNumber = async () => {
  let simNumbers = [];
  const {PhoneNumber} = NativeModules;
  try {
    await PhoneNumber.getPhoneID()
      .then(res => {
        let a = res.replace('[', '').replace(']', '');
        if (a.includes('&,')) {
          let b = a.split('&, ');
          if (b.length > 0) {
            b.forEach(element => {
              simNumbers.push(JSON.parse(element));
            });
          }
        } else {
          simNumbers.push(JSON.parse(a));
        }
      })
      .catch(() => {
        return null;
      });
  } catch (error) {
    return null;
  }
  if (simNumbers.length > 0) {
    return simNumbers;
  } else {
    return null;
  }
};

export const getPhoneName = async () => {
  let simNumbers = [];
  const {PhoneNumber} = NativeModules;
  try {
    await PhoneNumber.getPhoneName()
      .then(res => {
        let a = res.replace('[', '').replace(']', '');
        if (a.includes('&,')) {
          let b = a.split('&, ');
          if (b.length > 0) {
            b.forEach(element => {
              simNumbers.push(JSON.parse(element));
            });
          }
        } else {
          simNumbers.push(JSON.parse(a));
        }
      })
      .catch(() => {
        return null;
      });
  } catch (error) {
    return null;
  }
  if (simNumbers.length > 0) {
    return simNumbers;
  } else {
    return null;
  }
};

export const getSystemLocale = () => {
  let locale;
  // iOS
  if (
    NativeModules.SettingsManager &&
    NativeModules.SettingsManager.settings &&
    NativeModules.SettingsManager.settings.AppleLanguages
  ) {
    locale = NativeModules.SettingsManager.settings.AppleLanguages[0];
    locale = locale.split('-')[0];
    // Android
  } else if (NativeModules.I18nManager) {
    locale = NativeModules.I18nManager.localeIdentifier;
    locale = locale.split('_')[0];
  }

  if (typeof locale === 'undefined') {
    return 'en';
  }

  return locale;
};

export const validURL = str => {
  let pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};

export function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

export function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const context = this;
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
}

// convert tokenurl to encrypted string
const hexStrToStr = hexstr => {
  let str = '';
  for (let n = 0; n < hexstr.length; n += 2) {
    str += String.fromCharCode(parseInt(hexstr.substr(n, 2), 16));
  }
  return str;
};

// encryptedUrl - tokenurl after hex conversion
// decryptKey - odd char from o-auth
const enDecrypt = (encryptedUrl, decryptKey) => {
  let sbox = [],
    key = [],
    tempSwap,
    password = decryptKey;
  for (let p = 0; p < 256; p++) {
    key[p] = password.charCodeAt(p % password.length);
    sbox[p] = p;
  }
  let b = 0;
  for (let a = 0; a < 256; a++) {
    b = (b + sbox[a] + key[a]) % 256;
    tempSwap = sbox[a];
    sbox[a] = sbox[b];
    sbox[b] = tempSwap;
  }
  let i = 0,
    j = 0,
    k;

  let cipher = '';
  for (let y = 0; y < encryptedUrl.length; y++) {
    i = (i + 1) % 256;
    j = (j + sbox[i]) % 256;
    let tempSwap = sbox[i];
    sbox[i] = sbox[j];
    sbox[j] = tempSwap;
    k = sbox[(sbox[i] + sbox[j]) % 256];
    let cipherBy = encryptedUrl.charCodeAt(y) ^ k;
    cipher += String.fromCharCode(cipherBy); //check
  }
  return cipher;
};

export const doFunct = (text, decryptKey = 'imS2lf$#12904') => {
  // const encrypted = hexStrToStr(text);
  return strToHeXstring(enDecrypt(text, decryptKey));
};

const strToHeXstring = str => {
  return str
    .split('')
    .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
    .join('');
};

export function capatalize(input) {
  return input
    .toLowerCase()
    .split(' ')
    .map(s => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');
}

export function consoleLog(string, value) {
  if (__DEV__) {
    // console.log(string, value || '');
  }
  try {
    if (value.length < 300) {
      // global.requesttime += string + '|' + (value || '') + '\r\n';
    }
  } catch (e) {}
}

export function LogTimetaken(resp) {
  try {
    if (resp.config.headers['X-IMI-RNST'] != null) {
      let _url = resp.config.url;
      let _param = resp.config.data;
      let _rt = resp.config.headers['X-IMI-RNST'];
      let _total = new Date().getTime() - _rt;
      // global.requesttime +=
      //   _url.replace('BASE_URL', '') + '|' + _total + '\r\n';
      consoleLog('TT', _total);
    }
  } catch (e) {}
}
export function GetTimetaken(resp) {
  try {
    if (resp.config.headers['X-IMI-RNST'] != null) {
      let _rt = resp.config.headers['X-IMI-RNST'];
      let _total = new Date().getTime() - _rt;
      return _total;
    }
  } catch (e) {}
  return 0;
}
export function LogHttpError(url, data, error) {
  try {
    if (data.config.headers['X-IMI-RNST'] != null) {
      let _url = url;
      let _param = data + '\r\n' + error;
      // global.requesttime += _url + '|' + _param + '|' + '' + '\r\n';
    }
  } catch (e) {}
}

export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

const BiometricSensorErrorCode = [
  'E_FAILED_TO_SHOW_AUTH',
  'LAErrorSystemCancel',
  'LAErrorPasscodeNotSet',
  'LAErrorTouchIDNotAvailable',
  'LAErrorTouchIDNotEnrolled',
  'RCTTouchIDUnknownError',
  'RCTTouchIDNotSupported',
];

/**
 * Its use to check smart login enabled or not and detects successfully authenticated or not.
 */
export const isBiometricSensorAvailable = (
  dispatch,
  reduxState,
  navigation
) => {
  try {
    removeItem(LANGUAGE_CHANGE);
    global.setchangelanguage = null;
    loginTypeValue();
    getItem(SMARTLOGIN)
      .then(value => {
        if (value === 'T') {
          // Platform.OS === 'ios'
          //   ?
          const rnBiometrics = new ReactNativeBiometrics({
            allowDeviceCredentials: true,
          });
          rnBiometrics
            .isSensorAvailable()
            .then(resultObject => {
              const {available} = resultObject;
              consoleLog('biometrics available...', available);
              consoleLog('biometrics resultObject...', resultObject);
              if (available) {
                global.checkbiometric = 'yes';
                showBiometricsPopup(dispatch, reduxState, navigation);
              } else {
                // biometrics not available
                showAlertbeforelogin(
                  getGlobalSettingValue('biometricNotAvlError'),
                  navigation,
                  false,
                  dispatch,
                  reduxState
                );
              }
            })
            .catch(err => {
              consoleLog('biometrics failed..', err);
              showAlert(i18n.t('biometricErrorMesg'));
            });
        } else {
          navigateToHome(navigation);
        }
      })
      .catch(err => {
        // if there is any error while fetching data from local storage
        navigateToHome(navigation);
      });
  } catch (error) {
    // if there is any error in try block
    navigateToHome(navigation);
  }
};

export const isBiometricAvailableSmartLogin = async navigation => {
  try {
    // removeItem(LANGUAGE_CHANGE);
    // global.setchangelanguage = null;
    // loginTypeValue();
    return getItem(SMARTLOGIN)
      .then(value => {
        const rnBiometrics = new ReactNativeBiometrics({
          allowDeviceCredentials: true,
        });

        return rnBiometrics
          .isSensorAvailable()
          .then(async resultObject => {
            const {available} = resultObject;
            if (available) {
              let result = await showBiometricsPopupSmartLogin(navigation);
              if (result == null || result == undefined) {
                return false;
              }
              return result;
            } else {
              // biometrics not available
              // showAlertSmartlogin(
              //   i18n.t('biometricNotAvlError'),
              //   navigation,
              //   false
              // );
              return false;
            }
          })
          .catch(err => {
            consoleLog('biometrics failed......', err);
            showAlertSmartlogin(i18n.t('biometricErrorMesg'));
            return false;
          });
      })
      .catch(err => {
        // if there is any error while fetching data from local storage
        // navigateToHome(navigation);
        return false;
      });
  } catch (error) {
    showAlertSmartlogin(i18n.t('biometricErrorMesg'));
    return false;

    // if there is any error in try block
    // navigateToHome(navigation);
  }
};

export const isBiometricAvailablepurchase = async navigation => {
  try {
    // removeItem(LANGUAGE_CHANGE);
    // global.setchangelanguage = null;
    // loginTypeValue();
    return getItem(SMARTLOGIN)
      .then(value => {
        const rnBiometrics = new ReactNativeBiometrics({
          allowDeviceCredentials: true,
        });

        return rnBiometrics
          .isSensorAvailable()
          .then(async resultObject => {
            const {available} = resultObject;
            if (available) {
              let result = await showBiometricsPopupSmartLogin(navigation);
              if (result == null || result == undefined) {
                return false;
              }
              return result;
            } else {
              // biometrics not available
              Alert.alert(
                getGlobalSettingValue('purchasebiometricalerttitle') ||
                  i18n.t('Alert'),
                getGlobalSettingValue('purchasebiometricalertmsg') ||
                  i18n.t('biometricErrorMesg'),
                [
                  {
                    text: i18n.t('ok'),
                    onPress: () => {},
                  },
                ]
              );
              return false;
            }
          })
          .catch(err => {
            consoleLog('biometrics failed......', err);
            showAlertSmartlogin(i18n.t('biometricErrorMesg'));
            return false;
          });
      })
      .catch(err => {
        // if there is any error while fetching data from local storage
        // navigateToHome(navigation);
        return false;
      });
  } catch (error) {
    showAlertSmartlogin(i18n.t('biometricErrorMesg'));
    return false;

    // if there is any error in try block
    // navigateToHome(navigation);
  }
};

const showAlertbeforelogin = (
  errMesg,
  navigation,
  available = true,
  dispatch,
  reduxState
) => {
  Alert.alert(getGlobalSettingValue('biometricErrorTitle'), errMesg, [
    {
      text: i18n.t('ok'),
      onPress: () => {
        if (available) {
          clearDataMethod(dispatch, reduxState, navigation);
          // navigation.navigate(ScreenName.authStack, {
          //   screen: ScreenName.landingScreen,
          // });
          // RNExitApp.exitApp();
        } else {
          // when biometric is not available, so setting up the SMARTLOGIN false and move a user to home screen
          setItem(SMARTLOGIN, 'F');
          navigateToHome(navigation);
        }
      },
    },
  ]);
};

const showAlert = (errMesg, navigation, available = true) => {
  Alert.alert(getGlobalSettingValue('biometricErrorTitle'), errMesg, [
    {
      text: i18n.t('ok'),
      onPress: () => {
        if (available) {
          navigation.navigate(ScreenName.authStack, {
            screen: ScreenName.landingScreen,
          });
          // RNExitApp.exitApp();
        } else {
          // when biometric is not available, so setting up the SMARTLOGIN false and move a user to home screen
          setItem(SMARTLOGIN, 'F');
          navigateToHome(navigation);
        }
      },
    },
  ]);
};

const showAlertSmartlogin = (errMesg, navigation, available = true) => {
  Alert.alert(getGlobalSettingValue('biometricErrorTitle'), errMesg, [
    {
      text: i18n.t('ok'),
      onPress: () => {
        if (available) {
          global.settingbiometricvalue = false;
          // RNExitApp.exitApp();
        } else {
          // when biometric is not available, so setting up the SMARTLOGIN false and move a user to home screen
          setItem(SMARTLOGIN, 'F');
          // navigateToHome(navigation);
        }
      },
    },
  ]);
};

/**
 * Its use to navigate the user to home
 * @param navigation
 */
const navigateToHome = navigation => {
  // global.UniqueToken = new Date().getTime().toString();
  global.isfirstredirect = 'T';
  if (global.startupredirection != null) {
    DeeplinkRedirection(navigation);
  } else if (global.navigationTabState) {
    console.log('hellosdgvhshgxvhksgfhkgsxhkcv');
    setItem(SHOP_CART_ID, '');
    setItem(SHOP_ITEM_ID, '');
    setItem(SHOP_ACCOUNT_ID, '');
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ScreenName.tabStack,
          state: {routes: [{name: global.navigationTabState}]},
        },
      ],
    });
  } else {
    navigation.reset({
      index: 0,
      routes: [
        {
          name: ScreenName.tabStack,
          state: {routes: [{name: ScreenName.homeStack}]},
        },
      ],
    });
  }
};

/**
 * Its use to prompts the user for their fingerprint or face id for ios
 */
const showBiometricsPopup = (dispatch, reduxState, navigation) => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  rnBiometrics
    .simplePrompt({
      promptMessage: i18n.t('BiometricsMessage'),
    })
    .then(resultObject => {
      const {success} = resultObject;
      if (success) {
        navigateToHome(navigation);
      } else {
        consoleLog('user cancelled biometric prompt');
        showAlertbeforelogin(
          i18n.t('biometricErrorMesg'),
          navigation,
          true,
          dispatch,
          reduxState
        );
      }
    })
    .catch(() => {
      consoleLog('biometrics failed!!');
      // showAlert(i18n.t('biometricErrorMesg'));
    });
};
const showBiometricsPopupSmartLogin = navigation => {
  const rnBiometrics = new ReactNativeBiometrics({
    allowDeviceCredentials: true,
  });
  return rnBiometrics
    .simplePrompt({
      promptMessage: i18n.t('BiometricsMessage'),
    })
    .then(resultObject => {
      const {success} = resultObject;
      if (success) {
        return new Promise(resolve => {
          resolve(true);
        });
      } else {
        global.settingbiometricvalue = true;
        consoleLog('user cancelled biometric prompt');
        // showAlertSmartlogin(i18n.t('biometricErrorMesg'));
        return new Promise(resolve => {
          resolve(false);
        });
      }
    })
    .catch(() => {
      consoleLog('biometrics failed!!');
      // showAlertSmartlogin(i18n.t('biometricErrorMesg'));
      return new Promise(resolve => {
        resolve(false);
      });
    });
};
// Encrypted - Decrypted Data with the help of RC4

/**
 * Its use to set encrypted item in AsyncStorage
 * @param key
 * @param value
 */
export const setItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, RC4Encrypt(value));
  } catch (e) {}
};

/**
 * It's use to get decrypted item from AsyncStorage
 * @param key
 * @param defaultValue
 */
export const getItem = async (key, defaultValue) => {
  let output = defaultValue || null;
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      output = RC4Decrypt(value);
    }
  } catch (e) {}

  return output;
};

export const setNewItem = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {}
};

/**
 * It's use to get decrypted item from AsyncStorage
 * @param key
 * @param defaultValue
 */
export const getNewItem = async (key, defaultValue) => {
  let output = defaultValue || null;
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      output = value;
    }
  } catch (e) {}

  return output;
};

/**
 * It's use to remove item from AsyncStorage
 * @param key
 */
export const removeItem = key => {
  try {
    // consoleLog('removeItem', key);
    AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

// End

export const TO_LOWER_CASE = val => {
  try {
    if (!val) {
      return '';
    } else {
      return val.toLowerCase();
    }
  } catch (error) {}
  return '';
};

export const TO_UPPER_CASE = val => {
  try {
    if (val == null || val == undefined || val === '') {
      return '';
    } else {
      return val.toUpperCase();
    }
  } catch (error) {}
  return val;
};

export const JsonCallbackWebview = data => {
  try {
    consoleLog('JsonCallbackWebview', data);
    var obj = JSON.parse(data);
    let action = obj?.key;
    let value = JSON.parse(obj?.value);
    if (action === 'authsuccess') {
      let hash = value?.hash;
      let objdata = value?.data;
      let tokenid = global.tokenid ?? Date.now().toString();
      const headerHash = `${JSON.stringify(objdata)}&SALT=${getOddPlaces(
        tokenid
      )}`;
      const hdSignHash = sha512(headerHash);
      if (hdSignHash === hash) {
        consoleLog('JsonCallbackWebview', data);
        if (objdata?.simtype === 'physicalsim') {
          return objdata;
        } else {
          return objdata;
        }
      }
    } else if (action === 'cancel') {
      let hash = value?.hash;
      let objdata = value?.data;
      let tokenid = global.tokenid ?? Date.now().toString();
      const headerHash = `${JSON.stringify(objdata)}&SALT=${getOddPlaces(
        tokenid
      )}`;
      const hdSignHash = sha512(headerHash);
      if (hdSignHash === hash) {
        consoleLog('JsonCallbackWebview', data);
        if (objdata?.navigate === 'esimSimswap') {
          return objdata;
        } else {
          return objdata;
        }
      }
    } else if (action === 'deeplink') {
      let hash = value?.hash;
      let objdata = value?.data;
      let tokenid = global.tokenid ?? Date.now().toString();
      const headerHash = `${JSON.stringify(objdata)}&SALT=${getOddPlaces(
        tokenid
      )}`;
      const hdSignHash = sha512(headerHash);
      if (hdSignHash === hash) {
        consoleLog('JsonCallbackWebview', data);

        return objdata;
      }
    } else if (action === 'authfail') {
      let hash = value?.hash;
      let objdata = value?.data;
      let tokenid = global.tokenid ?? Date.now().toString();
      const headerHash = `${JSON.stringify(objdata)}&SALT=${getOddPlaces(
        tokenid
      )}`;
      const hdSignHash = sha512(headerHash);
      if (hdSignHash === hash) {
        consoleLog('JsonCallbackWebview_ramesh', data);
        if (objdata?.simtype === 'physicalsim') {
          return objdata;
        } else {
          return objdata;
        }
      }
    }
    return '';
  } catch (e) {}
};

export const getIpAddr = async () => {
  try {
    const response = await fetch('https://api.ipify.org');
    const ip = response.text();
    return ip;
  } catch (e) {}
};

export const isLinkExternal = val => {
  try {
    if (val == null || val === undefined) {
      return false;
    }
    if (
      val == 'False' ||
      val == 'false' ||
      val == 'F' ||
      val == 'f' ||
      val === false
    ) {
      return false;
    }
    if (
      val == 'True' ||
      val == 'true' ||
      val == 'T' ||
      val == 't' ||
      val == '1' ||
      val === true
    ) {
      return true;
    }
  } catch (e) {}
  return false;
};
export const GetMaxHeight = (count, def, max) => {
  try {
    let _cnt = count * def;
    if (max < _cnt) {
      return max;
    } else {
      if (def > _cnt) {
        return def;
      } else {
        return _cnt;
      }
    }
  } catch (e) {}
  return max;
};
export function UnitTestProps(pagename, type, id) {
  try {
    let _key =
      pagename
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '') +
      '_' +
      type
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '') +
      '_' +
      id
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '')
        .replace(' ', '');
    // consoleLog('Appium Key', _key);
    return {testID: _key, accessibilityLabel: _key};
  } catch (e) {
    consoleLog(e);
  }
  return {};
}

export const decodeUnicode = str => {
  try {
    var unicodeStr = str;
    var r = /\\u([\d\w]{4})/gi;
    unicodeStr = unicodeStr.replace(r, function (match, grp) {
      return String.fromCharCode(parseInt(grp, 16));
    });
    return unicodeStr;
  } catch (e) {}
};

export const isnojoomkeyword = str => {
  try {
    const nojoomkeywords = [
      'nojoom',
      'nojoomdeals',
      'buynojoompoints',
      'nojoomhistory',
      'nojoommynumbers',
      'transferyourpoints',
      'nojoomservices',
      'earnpartners',
      'nojoompointshistory',
      'earnpartnerdetails',
      'loyaltypartnerdetails',
      'nojoompartners',
    ];
    if (nojoomkeywords.indexOf(str) != -1) {
      return true;
    }
  } catch (e) {}
  return false;
};

export const checkReadContactsPermission = async type => {
  //result would be false if not granted and true if required permission is granted.
  const result = await PermissionsAndroid.check(type);
  return result;
};

export const findObjectByKey = (array, key, value) => {
  for (let i = 0; i < array.length; i++) {
    if (array[i][key] === value) {
      return array[i];
    }
  }
  return false; // Return null if object not found
};
