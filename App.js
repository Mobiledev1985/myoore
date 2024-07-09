import './src/components/languageselector/i18next';

import {
  AppState,
  DeviceEventEmitter,
  Dimensions,
  I18nManager,
  Linking,
  LogBox,
  NativeEventEmitter,
  Platform,
  StatusBar,
} from 'react-native';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {QueryClient, QueryClientProvider} from 'react-query';
import React, {useEffect} from 'react';
import {Adjust, AdjustConfig} from 'react-native-adjust';
import {AdjustOaid} from 'react-native-adjust-oaid';
import {ZDefend} from 'zdefend';
import AppNavigator from './src/navigator/AppNavigator';
import CodePush from 'react-native-code-push';
import DeviceInfo from 'react-native-device-info';
import {NativeModules} from 'react-native';
import {Provider} from 'react-redux';
import QuickActions from 'react-native-quick-actions';
import RNExitApp from 'react-native-exit-app';
import RNRestart from 'react-native-restart';
import {SCREEN_WIDTH} from './src/resources/styles/normalizedimension';
import SharedGroupPreferences from 'react-native-shared-group-preferences';
import Toast from 'react-native-simple-toast';
import {callQueryapi} from './src/commonHelper/middleware/callapi';
import {
  consoleLog,
  getItem,
  removeItem,
  setItem,
} from './src/commonHelper/utils';
import createReduxStore from './src/store/createReduxStore';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import i18n from './src/components/languageselector/i18next';
import messaging from '@react-native-firebase/messaging';
import {persistStore} from 'redux-persist';
import {
  APP_RESTART_LANG,
  LANGUAGE_SWITCHED,
  NMFLOW_TOKEN_ID,
  STORE_FCM_TOKEN,
} from './src/commonHelper/Constants';
import {NavigateByName} from './src/services/NavigationService';
import {getGlobalSettingValue} from './src/services/CommonUtils';
import {Alert} from 'react-native';
import {isDeviceHuawei} from './src/commonHelper/Constants';
import {output} from './src/commonHelper/ApiHeaders';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: callQueryapi,
      retry: false,
    },
  },
});

let codePushOptions = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START,
};

const CleverTap = require('clevertap-react-native');

getItem('ctnotificationpermission').then(val => {
  if (val === '' || val == null || val == undefined) {
    setItem('ctnotificationpermission', 'T');
    CleverTap.promptForPushPermission(true);
  }
});

let localInApp = {
  inAppType: 'alert',
  titleText: 'Get Notified',
  messageText: 'Enable Notification permission',
  followDeviceOrientation: true,
  positiveBtnText: 'Allow',
  negativeBtnText: 'Cancel',
  fallbackToSettings: false, //Setting this parameter to true will open an in-App to redirect you to Mobile's OS settings page.
};

//FCM permissions
const requestUserPermission = async () => {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (enabled) {
      getFcmToken();
    }
  } catch (error) {}
};

CleverTap.isPushPermissionGranted((err, res) => {});

CleverTap.initializeInbox();

CleverTap.addListener(CleverTap.CleverTapPushPermissionResponseReceived, e => {
  /*consume the event*/
});
CleverTap.removeListener(CleverTap.CleverTapPushPermissionResponseReceived);

//Clevertap Notification click Method
CleverTap.addListener(CleverTap.CleverTapPushNotificationClicked, event => {
  consoleLog('add listener for clevertap', event);

  if (Platform.OS === 'android') {
    try {
      global.pushchildnumber = event?.childmsisdn;
      global.pushischildnumber = event?.switchnumber;
      let pushtemplateurl = event?.pt_default_dl || '';
      if (event?.click1) {
        pushtemplateurl = event?.pt_dl1;
      } else if (event?.click2) {
        pushtemplateurl = event?.pt_dl2;
      } else if (event?.click3) {
        pushtemplateurl = event?.pt_dl3;
      } else if (event?.click4) {
        pushtemplateurl = event?.pt_dl4;
      } else if (event?.click5) {
        pushtemplateurl = event?.pt_dl5;
      }

      let Url = event?.wzrk_dl || event?.url || pushtemplateurl;
      if (Url == null || Url == undefined || Url == '') {
        if (
          event?.redirecturl != null &&
          event?.redirecturl != undefined &&
          event?.redirecturl != ''
        ) {
          Url = event?.redirecturl;
        } else {
          return;
        }
      }
      if (Url.startsWith('https') || Url.startsWith('http')) {
        if (
          Url.startsWith(
            ''
          ) ||
          Url.startsWith(
            ''
          )
        ) {
          Linking.openURL(Url);
        } else {
          if (
            (event?.redirecturl != null && event?.redirecturl != undefined) ||
            (event?.url != null && event?.url != undefined)
          ) {
            if (
              event?.url.startsWith('https') ||
              event?.url.startsWith('http')
            ) {
              if (event.external == 'true' || event.external == true) {
                Linking.openURL(Url);
              } else {
                global.deeplinkurl = Url;
              }
              return;
            } else {
              Linking.openURL(Url);
              return;
            }
          } else {
            Linking.openURL(Url);
            return;
          }
        }
      }
      if (Url.includes(' ')) {
        Url = Url.replace(' ', '')
          .replace(' ', '')
          .replace(' ', '')
          .replace(' ', '');
      }

      if (Url?.includes('')) {
        global.transferInternationalCredit = 'yes';
      }
      if (Url?.includes('')) {
        global.internetTransferAddMember = 'yes';
      }
      if (Url?.includes('')) {
        global.xpressprofittransferbalance = 'yes';
      }
      if (Url?.includes('www...com')) {
        var redirectarray = Url.split('page=');
        global.deeplinkurl = redirectarray[1];
        Linking.openURL(Url);
      } else if (Url?.includes('')) {
        var redirectarray = Url.split('page=');
        global.deeplinkurl = redirectarray[1];
      } else {
        global.deeplinkurl = Url;
        Linking.openURL('' + Url);
      }
      return;
    } catch (error) {}
  } else {
    setTimeout(
      () => {
        try {
          global.pushchildnumber = event?.customExtras?.childmsisdn;
          global.pushischildnumber = event?.customExtras?.switchnumber;
          let Url =
            event?.customExtras?.wzrk_dl ||
            event?.wzrk_dl ||
            event?.customExtras?.url ||
            event?.customExtras?.pt_dl1 ||
            event?.customExtras?.pt_dl ||
            event?.redirecturl ||
            event?.url;
          if (Url == null || Url == undefined || Url == '') {
            if (
              event?.customExtras?.redirecturl != null &&
              event?.customExtras?.redirecturl != undefined &&
              event?.customExtras?.redirecturl != ''
            ) {
              Url = event?.customExtras?.redirecturl;
            } else {
              return;
            }
          }
          if (Url.startsWith('https') || Url.startsWith('http')) {
            if (
              Url.startsWith(
                ''
              ) ||
              Url.startsWith(
                ''
              )
            ) {
              Linking.openURL(Url);
            } else {
              if (
                event?.customExtras?.url.startsWith('https') ||
                event?.customExtras?.url.startsWith('http') ||
                event?.customExtras?.pt_dl1.startsWith('https') ||
                event?.customExtras?.pt_dl1.startsWith('http')
              ) {
                if (
                  event?.customExtras?.external == 'true' ||
                  event?.customExtras?.external == true
                ) {
                  Linking.openURL(Url);
                } else {
                  NavigateByName(global.navigation, Url, null);
                }
                return;
              } else {
                Linking.openURL(Url);
                return;
              }
            }
          }
          if (Url.includes(' ')) {
            Url = Url.replace(' ', '')
              .replace(' ', '')
              .replace(' ', '')
              .replace(' ', '');
          }
          consoleLog('add listener for clevertap111', Url);
          if (Url?.includes('')) {
            global.transferInternationalCredit = 'yes';
          }
          if (Url?.includes('')) {
            global.internetTransferAddMember = 'yes';
          }
          if (Url?.includes('')) {
            global.xpressprofittransferbalance = 'yes';
          }
          if (Url?.includes('')) {
            var redirectarray = Url.split('page=');
            global.deeplinkurl = redirectarray[1];
          } else if (Url?.includes('')) {
            var redirectarray = Url.split('page=');
            global.deeplinkurl = redirectarray[1];
            global.ignorenavigatemethod = 'yes';
            Linking.openURL(Url);
          } else {
            global.deeplinkurl = Url;
            setTimeout(() => {
              Linking.openURL('' + Url);
            }, 500);
          }
          return;
        } catch (error) {}
      },
      global.applaunched === 'yes' ? 10 : 500
    );
  }
});

//Clevertap InApp Notification Button Click
CleverTap.addListener(
  CleverTap.CleverTapInAppNotificationButtonTapped,
  event => {
    consoleLog(
      'add listener for clevertap CleverTapInAppNotificationButtonTapped 1',
      event
    );
    setTimeout(
      () => {
        try {
          if (Platform.OS === 'android') {
            let Url = event?.redirecturl || event?.url;
            if (Url == null || Url == undefined || Url == '') {
              return;
            }
            if (Url.startsWith('https') || Url.startsWith('http')) {
              if (
                (event?.redirecturl != null &&
                  event?.redirecturl != undefined) ||
                (event?.url != null && event?.url != undefined)
              ) {
                if (
                  event?.url.startsWith('https') ||
                  event?.url.startsWith('http') ||
                  event?.redirecturl.startsWith('https') ||
                  event?.redirecturl.startsWith('http')
                ) {
                  if (event?.external == 'true' || event?.external == true) {
                    Linking.openURL(Url);
                  } else {
                    global.deeplinkurl = Url;
                    NavigateByName(global.navigation, Url, null);
                  }
                  return;
                } else {
                  Linking.openURL(Url);
                  return;
                }
              }
            }
            if (Url.includes(' ')) {
              Url = Url.replace(' ', '')
                .replace(' ', '')
                .replace(' ', '')
                .replace(' ', '');
            }
            if (Url?.includes('')) {
              global.transferInternationalCredit = 'yes';
            }
            if (Url?.includes('')) {
              global.internetTransferAddMember = 'yes';
            }
            if (Url?.includes('')) {
              global.xpressprofittransferbalance = 'yes';
            }
            if (Url?.includes('')) {
              var redirectarray = Url.split('page=');
              global.deeplinkurl = redirectarray[1];
              global.notifyredirect = global.deeplinkurl;
            } else if (Url?.includes('')) {
              var redirectarray = Url.split('page=');
              global.deeplinkurl = redirectarray[1];
              global.notifyredirect = global.deeplinkurl;
              Linking.openURL(Url);
            } else {
              global.deeplinkurl = Url;
              global.notifyredirect = Url;
              Linking.openURL('' + Url);
            }
          } else {
            let Url =
              event?.customExtras?.redirecturl ||
              event?.customExtras?.url ||
              event?.redirecturl ||
              event?.url;
            if (Url == null || Url == undefined || Url == '') {
              return;
            }
            if (Url.startsWith('https') || Url.startsWith('http')) {
              if (
                (event?.customExtras?.redirecturl != null &&
                  event?.customExtras?.redirecturl != undefined) ||
                (event?.customExtras?.url != null &&
                  event?.customExtras?.url != undefined)
              ) {
                if (
                  event?.customExtras?.url.startsWith('https') ||
                  event?.customExtras?.url.startsWith('http') ||
                  event?.customExtras?.redirecturl.startsWith('https') ||
                  event?.customExtras?.redirecturl.startsWith('http')
                ) {
                  if (
                    event?.customExtras?.external == 'true' ||
                    event?.customExtras?.external == true
                  ) {
                    Linking.openURL(Url);
                  } else {
                    global.deeplinkurl = Url;
                    NavigateByName(global.navigation, Url, null);
                  }
                  return;
                } else {
                  Linking.openURL(Url);
                  return;
                }
              } else {
                Linking.openURL(Url);
                return;
              }
            }
            if (Url.includes(' ')) {
              Url = Url.replace(' ', '')
                .replace(' ', '')
                .replace(' ', '')
                .replace(' ', '');
            }
            consoleLog('add listener for clevertap111', Url);
            if (Url?.includes('')) {
              global.transferInternationalCredit = 'yes';
            }
            if (Url?.includes('')) {
              global.internetTransferAddMember = 'yes';
            }
            if (Url?.includes('')) {
              global.xpressprofittransferbalance = 'yes';
            }
            if (Url?.includes('')) {
              var redirectarray = Url.split('page=');
              global.deeplinkurl = redirectarray[1];
              global.notifyredirect = global.deeplinkurl;
              Linking.openURL(Url);
            } else if (Url?.includes('')) {
              var redirectarray = Url.split('page=');
              global.deeplinkurl = redirectarray[1];
              global.notifyredirect = global.deeplinkurl;
              Linking.openURL(Url);
            } else {
              global.deeplinkurl = Url;
              global.notifyredirect = Url;
              consoleLog('add listener for clevertap111', Url);
              Linking.openURL('' + Url);
            }
          }
        } catch (error) {}
      },
      global.applaunched === 'yes' ? 10 : 2000
    );
  }
);

//Firebase Token Get Method
const getFcmToken = async () => {
  try {
    CleverTap.createNotificationChannel(
      'Notification',
      'Notification Channel',
      'This channel is for supporting push notification in android O',
      4,
      true
    );

    const fcmToken = await messaging().getToken();
    if (fcmToken) {
      global.fcmToken = fcmToken;
      setItem(STORE_FCM_TOKEN, global.fcmToken);
      adjustMethod(fcmToken);
      consoleLog('FCM TOKEN: ', global.fcmToken);
    } else {
      // TODO: handle no token for prod
      consoleLog('Failed', 'No token received');
    }
  } catch (error) {}
};

const adjustMethod = fcmToken => {
  const adjustConfig = new AdjustConfig(
    isDeviceHuawei && !output?.hasGms ? '' : '',
    AdjustConfig.EnvironmentSandbox
  );
  if (isDeviceHuawei && !output?.hasGms) {
    AdjustOaid.readOaid();
  }
  adjustConfig.setFbAppId('');
  adjustConfig.setAttConsentWaitingInterval(25);
  Adjust.setPushToken(fcmToken);
  adjustConfig.setShouldLaunchDeeplink(true);
  adjustConfig.setDeferredDeeplinkCallbackListener(function (deeplink) {
    console.log('Deferred deep link URL content: ' + deeplink);
  });
  Adjust.create(adjustConfig);
};
//Quick links click method
/**
 * its call when app is open from kill mode
 * @param {object} data
 */
function navigateFromQuickAction(data) {
  if (data && data?.userInfo?.url) {
    setTimeout(() => {
      try {
        global.deeplinkurl = data?.userInfo?.url;
        global.notifyredirect = global.deeplinkurl;
        Linking.openURL(
          `${data?.userInfo?.url}`
        );
      } catch (error) {}
    }, 100);
  }
}

QuickActions.popInitialAction()
  .then(navigateFromQuickAction)
  .catch(console.error);

/**
 * its call when app is open from background mode
 */
DeviceEventEmitter.addListener('quickActionShortcut', data => {
  try {
    navigateFromQuickAction(data);
  } catch (error) {}
});

//Widget Deeplinks
if (Platform.OS === 'ios') {
  const linkClick = url => {
    try {
      const url_ = url.url;

      if (url && url.url) {
        const typeKey = url_.split('type=').pop().split('&')[0];
        const pageName = url_.split('page=').pop().split('&')[0];

        if (typeKey === 'widget') {
          if (global.dynamicLinks != 'yes') {
            Linking.removeEventListener('url', linkClick);
            global.deeplinkurl = pageName;
            Linking.openURL(url.url.replace('type=widget&', ''));
          } else {
            global.dynamicLinks = null;
          }
        }

        return;
      }
    } catch (e) {}
  };

  AppState.addEventListener('change', state => {
    try {
      if (state === 'background') {
        Linking.addEventListener('url', linkClick);
      }
    } catch (error) {}
  });

  Linking.getInitialURL().then(url => {
    try {
      if (url) {
        const typeKey = url.split('type=').pop().split('&')[0];
        const pageName = url.split('page=').pop().split('&')[0];

        if (typeKey === 'widget') {

          setTimeout(
            () => {
              global.deeplinkurl = pageName;
              global.notifyredirect = global.deeplinkurl;
              Linking.openURL(url.replace('type=widget&', ''));
              return;
            },
            global.applaunched === 'yes' ? 10 : 10000
          );
        }
      }
    } catch (error) {}
  });
}

if (Platform.OS === 'android') {
  /**
   * App widget event listeners, here we receive data from native widget
   */
  try {
    const eventEmitter = new NativeEventEmitter(NativeModules.SharedStorage);
    eventEmitter.addListener('EventReminder', event => {
      try {
        if (event && event.pageName) {
          const typeKey = event.pageName.split('type=').pop().split('&')[0];
          const pageName = event.pageName.split('page=').pop().split('&')[0];

          if (typeKey === 'widget') {
            setTimeout(() => {
              global.deeplinkurl = pageName;
              global.notifyredirect = global.deeplinkurl;
              Linking.openURL(`${pageName}`);
            }, 100);
          }
        }
      } catch (e) {}
    });
  } catch (e) {}
}

let App = props => {
  const theme = DefaultTheme;
  const store = createReduxStore();
  const persistor = persistStore(store);
  //Zimperium methods
  const deviceStatusCallback = deviceStatus => {
    var activeThreats = deviceStatus.activeThreats;

    var result = '\n\n' + 'DEVICE STATUS CALLBACK RESULT: ' + '\n\n';
    result += 'Date: ' + deviceStatus.statusDate + '\n';
    result += 'Login Status: ' + deviceStatus.loginStatus + '\n';

    result += '                                             ' + '\n';
    result +=
      '\n\n' + '=========== NEW ACTIVE THREAT INFO =========== ' + '\n\n';
    for (const threat of activeThreats) {
      result += 'Threat Name: ' + threat.localizedName + '\n';
      result += 'Threat ID: ' + threat.internalThreatID + '\n';
      result += 'Threat UUID: ' + threat.UUID + '\n';
      result += '                                             ' + '\n';

      try {
        if (threat.severity == 'CRITICAL') {
          Toast.show(i18n.t(''), 5000);
          setTimeout(() => {
            RNExitApp.exitApp();
          }, 3000);
          return;
        }
      } catch (error) {}
    }

    result += '                                             ' + '\n';

    result += '\n\n' + '=========== POLICIES INFO =========== ' + '\n\n';
    for (const policies of deviceStatus.devicePolicies) {
      result += 'Date: ' + policies.policyDownloadDate + '\n';
      result += 'Type: ' + policies.policyType + '\n';
      result += 'Hash: ' + policies.policyHash + '\n';
      result += '                                             ' + '\n';
    }
    consoleLog(result);
  };

  const alertUserAndBlockLinkedFunctionCallback = (label, threat) => {
    console.log('Linked Function, registered label: ', label);
    console.log('Linked Function, threat internal name: ', threat);
    try {
      Toast.show(threat.localizedAlertText || i18n.t(''), 3000);
      setTimeout(() => {
        RNExitApp.exitApp();
      }, 2000);
    } catch (error) {}
  };
  const alertUserAndContinueLinkedFunctionCallback = (label, threat) => {
    console.log('Linked Function, registered label: ', label);
    console.log('Linked Function, threat internal name: ', threat);
    try {
      Alert.alert(threat.localizedAlertText);
    } catch (error) {}
  };

  useEffect(() => {
    const setupZDefend = async () => {
      ZDefend.addDeviceStatusCallback({
        deviceStatusCallback: deviceStatusCallback,
      });
      ZDefend.registerLinkedFunction({
        label: 'alertUserAndBlock',
        linkedFunctionCallback: alertUserAndBlockLinkedFunctionCallback,
      });
      ZDefend.registerLinkedFunction({
        label: 'alertUserAndContinue',
        linkedFunctionCallback: alertUserAndContinueLinkedFunctionCallback,
      });
    };
    setupZDefend();
    // This is called when the component unmounts.
    return () => {
      ZDefend.deRegister();
    };
  }, []);

  useEffect(async () => {
    let linkingListener = Linking.addEventListener('url', handleDeepLink);
    await Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });
    //removing listner
    return () => {
      if (linkingListener && linkingListener.remove) {
        linkingListener.remove();
      }
      Adjust.componentWillUnmount();
    };
  }, []);

  const handleDeepLink = event => {
    if (event != null && event !== undefined && event !== '') {
      getItem(LANGUAGE_SWITCHED).then(val => {
        if (val === 'T') {
          setItem(LANGUAGE_SWITCHED, 'F');
          return;
        } else {
          setTimeout(
            () => {
              let Url = event?.url;
              if (
                Url != null &&
                Url !== undefined &&
                Url !== '' &&
                (Url.includes('adj') || Url.includes('adjust'))
              ) {
                var redirectarray = Url.split('&adj');
                var deeplink = redirectarray[0];
                var redirectarraypage = deeplink.split('page=');
                global.deeplinkurl = redirectarraypage[1];
                global.notifyredirect = global.deeplinkurl;
                Linking.openURL(
                  '' + redirectarraypage[1]
                );
              }
            },
            global.applaunched === 'yes' ? 10 : 2000
          );
        }
      });
    }
  };

  useEffect(() => {
    try {
      getItem('').then(val => {
        if (val === '' || val == null || val == undefined) {
          setItem('', 'T');
          CleverTap.promptPushPrimer(localInApp);
        }
      });
    } catch (error) {}
  }, []);

  useEffect(() => {
    const handleAppStateChange = nextAppState => {
      try {
        if (
          !global.EnableStatusApiTimer &&
          global.EnableStatusApiTimer != null &&
          global.EnableStatusApiTimer != undefined
        ) {
          if (nextAppState === 'inactive' || nextAppState === 'background') {
            global.appinActiveTime = new Date();
          } else {
            if (
              global.appinActiveTime != null &&
              global.appinActiveTime != undefined &&
              global.appinActiveTime != ''
            ) {
              try {
                var activeTime = new Date();
                const diffIndays = Math.abs(
                  activeTime - global.appinActiveTime
                );
                var diffTimer = Math.round(diffIndays / 1000);
                if (
                  getGlobalSettingValue('refreshapptimer') != null &&
                  getGlobalSettingValue('refreshapptimer') != undefined &&
                  getGlobalSettingValue('refreshapptimer') != '' &&
                  diffTimer > getGlobalSettingValue('refreshapptimer')
                ) {
                  DeviceEventEmitter.emit('closeTimerModal');
                  const _SplashScreenModule = NativeModules.SplashScreen;
                  _SplashScreenModule.show();
                  RNRestart.Restart();
                }
              } catch (error) {}
            }
          }
        }
      } catch (error) {}
    };
    AppState.addEventListener('change', handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const checkFoldState = () => {
    const {width, height} = Dimensions.get('window');
    // Assume the device is folded if the height is greater than the width
    // const isDeviceFolded = height > width;
    if (global.isDeviceFoldedWidth != width) {
      global.isDeviceFoldedWidth = width;
      const _SplashScreenModule = NativeModules.SplashScreen;
      _SplashScreenModule.show();
      RNRestart.Restart();
    }
  };

  useEffect(() => {
    const {width, height} = Dimensions.get('window');
    global.isDeviceFoldedWidth = width;
    Dimensions.addEventListener('change', checkFoldState);

    return () => {
      Dimensions.removeEventListener('change', checkFoldState);
    };
  }, []);

  //Widget deeplink method
  useEffect(() => {
    try {
      if (Platform.OS === 'android') {
        NativeModules.SharedStorage.set(
          JSON.stringify({
            layoutDirection: I18nManager.isRTL ? 1 : 0,
            loginMetaData: [
              {
                loginBtnText: i18n.t('').toUpperCase(),
                shopBtnText: i18n.t(''),
                helpText: i18n.t(''),
                payText: i18n.t(''),
                helloText: i18n.t(''),
                welcomeText: i18n.t(''),
                w_login_redirect:
                  '',
                w_shop_redirect:
                  '',
                w_help_redirect:
                  '',
                w_pay_redirect:
                  '',
              },
            ],
          }),
          success => {},
          error => {}
        );
      }
    } catch (e) {}
    async function sendWidgetData() {
      try {
        const appGroupIdentifier = '';

        let myAppData = {
          w_loginBtnText: i18n.t('').toUpperCase(),
          w_shopBtnText: i18n.t(''),
          w_helpText: i18n.t(''),
          w_payText: i18n.t(''),
          w_helloText: i18n.t(''),
          w_welcomeText: i18n.t(''),
          w_layoutDirection: I18nManager.isRTL,
          w_login_redirect:
            '',
          w_shop_redirect: '',
          w_help_redirect:
            '',
          w_pay_redirect:
            '',
        };

        await SharedGroupPreferences.setItem(
          'myAppData',
          myAppData,
          appGroupIdentifier
        );
      } catch (errorCode) {
        consoleLog(errorCode);
      }
    }

    if (Platform.OS === 'ios') {
      sendWidgetData();
    }
  }, []);

  //Firbase dynamic links killed method
  dynamicLinks()
    .getInitialLink()
    .then(link => {
      console.log('link---->', link, global.firebsedynamiclink);
      getItem(LANGUAGE_SWITCHED).then(val => {
        if (val === 'T') {
          global.firebsedynamiclink = null;
          global.deeplinkkilledstateurl = null;
          global.deeplinkKeyword = null;
          global.hashdeeplink = null;
          global.notifyredirect = null;
          setItem(LANGUAGE_SWITCHED, 'F');
        } else {
          if (link == null || link === undefined || link === '') {
            link = global.firebsedynamiclink;
            global.firebsedynamiclink = null;
            global.requestermsisdn = null;
            global.requesterofferid = null;
            global.productpaymenttype = null;
            global.isKilledDynamiclink = 'yes';
            return;
          }
          global.isKilledDynamiclink = 'yes';
          let Url = link.url || link;
          if (Url == null || Url == undefined || Url == '') {
            global.requestermsisdn = null;
            global.requesterofferid = null;
            global.productpaymenttype = null;
          } else {
            setTimeout(() => {
              try {
                if (Url.includes(' ')) {
                  Url = Url.replace(' ', '')
                    .replace(' ', '')
                    .replace(' ', '')
                    .replace(' ', '');
                }
                if (Url?.includes('')) {
                  global.transferInternationalCredit = 'yes';
                }
                if (Url?.includes('')) {
                  global.internetTransferAddMember = 'yes';
                }
                if (Url?.includes('')) {
                  global.xpressprofittransferbalance = 'yes';
                }
                if (Url?.includes('')) {
                  if (Url?.includes('')) {
                    global.firbasedeeplinkurl = Url;
                    let regex = /[?&]([^=#]+)=([^&#]*)/g,
                      params = {},
                      match;
                    while ((match = regex.exec(Url))) {
                      params[match[1]] = match[2];
                      consoleLog(match[1], match[2]);
                    }
                    getItem(APP_RESTART_LANG).then(val => {
                      if (val === 'T') {
                        setItem(APP_RESTART_LANG, '');
                      } else {
                        let urlkeyword =
                          params?.paymenttype + '#' + params?.offerid;
                        global.deeplinkKeyword = urlkeyword;
                        global.requestermsisdn = params?.msisdn;
                        global.requesterofferid = params?.offerid;
                        global.productpaymenttype = params?.paymenttype;
                        global.deeplinkurl =
                          params?.paymenttype + '#' + params?.offerid;
                        global.notifyredirect =
                          params?.paymenttype + '#' + params?.offerid;
                        Linking.openURL(
                          '' + urlkeyword
                        );
                        return;
                      }
                    });
                  } else {
                    var redirectarray = Url.split('page=');
                    global.deeplinkurl = redirectarray[1];
                    global.notifyredirect = global.deeplinkurl;
                    if (
                      !Url?.includes('')
                    ) {
                      consoleLog('not includesss');
                      try {
                        if (Url != null && Url != undefined) {
                          if (
                            Url.startsWith('https') ||
                            Url.startsWith('http')
                          ) {
                            Linking.openURL(Url);
                            return;
                          }
                        }
                      } catch (error) {}
                    }
                  }
                } else if (Url?.includes('')) {
                  var redirectarray = Url.split('page=');
                  global.deeplinkurl = redirectarray[1];
                  global.notifyredirect = global.deeplinkurl;
                  if (global.applaunched !== 'yes') {
                    Linking.openURL(Url);
                  }
                } else {
                  global.deeplinkurl = Url;
                  global.notifyredirect = global.deeplinkurl;
                  try {
                    if (
                      global.deeplinkurl != null &&
                      global.deeplinkurl != undefined
                    ) {
                      if (
                        global.deeplinkurl.startsWith('https') ||
                        global.deeplinkurl.startsWith('http')
                      ) {
                        Linking.openURL(global.deeplinkurl);
                        return;
                      }
                    }
                  } catch (error) {}
                  consoleLog('global', Url);
                  if (global.applaunched !== 'yes') {
                    Linking.openURL('' + Url);
                  }
                }
              } catch (error) {}
            }, 10);
          }
        }
      });
    });

  //Pushnotification click action method
  useEffect(() => {
    global.islogout = '';
    global.isHomeDeviceCheck = 'true';
    requestUserPermission();

    Dimensions.addEventListener('change', e => {
      if (
        !DeviceInfo.isTablet() &&
        SCREEN_WIDTH > 540 &&
        Platform.OS == 'android'
      ) {
        const _SplashScreenModule = NativeModules.SplashScreen;
        _SplashScreenModule.show();
        RNRestart.Restart();
      }
    });
    if (props?.UIApplicationLaunchOptionsRemoteNotificationKey) {
      try {
        let notificationObject =
          props?.UIApplicationLaunchOptionsRemoteNotificationKey;
        if (Platform.OS === 'ios') {
          getItem(APP_RESTART_LANG).then(val => {
            if (val === 'T') {
              setItem(APP_RESTART_LANG, '');
            } else {
              global.notificationCalledInKilled = 'yes';
              let Url =
                notificationObject?.wzrk_dl || notificationObject?.pt_dl1;
              global.pushchildnumber = notificationObject?.childmsisdn;
              global.pushischildnumber = notificationObject?.switchnumber;
              if (Url !== undefined && Url !== null) {
                setTimeout(() => {
                  if (Url.includes(' ')) {
                    Url = Url.replace(' ', '')
                      .replace(' ', '')
                      .replace(' ', '')
                      .replace(' ', '');
                  }
                  if (Url.startsWith('https') || Url.startsWith('http')) {
                    Linking.openURL(Url);
                    return;
                  }
                  if (
                    (notificationObject?.redirecturl != null &&
                      notificationObject?.redirecturl != undefined) ||
                    (notificationObject?.url != null &&
                      notificationObject?.url != undefined)
                  ) {
                    if (
                      notificationObject?.redirecturl.startsWith('https') ||
                      notificationObject?.redirecturl.startsWith('http') ||
                      notificationObject?.url.startsWith('https') ||
                      notificationObject?.url.startsWith('http')
                    ) {
                      if (
                        notificationObject?.external == 'true' ||
                        notificationObject?.external == true
                      ) {
                        Linking.openURL(Url);
                      } else {
                        global.deeplinkurl = Url;
                        global.deeplinkkilledstateurl = Url;
                      }
                      return;
                    }
                  }
                  if (Url?.includes('')) {
                    global.transferInternationalCredit = 'yes';
                  }
                  if (Url?.includes('')) {
                    global.internetTransferAddMember = 'yes';
                  }
                  if (Url?.includes('')) {
                    global.xpressprofittransferbalance = 'yes';
                  }
                  if (Url?.includes('')) {
                    var redirectarray = Url.split('page=');
                    global.deeplinkurl = redirectarray[1];
                    Linking.openURL(Url);
                  } else if (Url?.includes('')) {
                    var redirectarray = Url.split('page=');
                    global.deeplinkurl = redirectarray[1];
                    Linking.openURL(Url);
                  } else {
                    if (
                      notificationObject?.wzrk_dl != null &&
                      notificationObject?.wzrk_dl != undefined
                    ) {
                      if (
                        notificationObject?.wzrk_dl.startsWith('https') ||
                        notificationObject?.wzrk_dl.startsWith('http')
                      ) {
                        return;
                      }
                    }
                    if (
                      notificationObject?.pt_dl1 != null &&
                      notificationObject?.pt_dl1 != undefined
                    ) {
                      if (
                        notificationObject?.pt_dl1.startsWith('https') ||
                        notificationObject?.pt_dl1.startsWith('http')
                      ) {
                        return;
                      }
                    }

                    global.deeplinkurl = Url;
                    consoleLog('URLON APP', Url);
                    Linking.openURL('' + Url);
                  }
                }, 2000);
              } else {
                Url =
                  notificationObject?.redirecturl ||
                  notificationObject?.url ||
                  notificationObject?.pt_dl1;
                if (Url != null && Url != undefined) {
                  if (Url.startsWith('https') || Url.startsWith('http')) {
                    if (
                      notificationObject?.external == 'true' ||
                      notificationObject?.external == true
                    ) {
                      Linking.openURL(Url);
                    } else {
                      global.deeplinkurl = Url;
                      global.deeplinkkilledstateurl = Url;
                    }
                    return;
                  } else {
                    global.deeplinkurl = Url;
                    global.deeplinkkilledstateurl = Url;
                    Linking.openURL(
                      '' + Url
                    );
                  }
                }
              }
            }
          });
        }
      } catch (error) {}
    }
  }, [props?.UIApplicationLaunchOptionsRemoteNotificationKey]);

  //Dynamic links for open state
  const handleDynamicLink = link => {
    try {
      consoleLog('dynamic linking 2', link);
      if (link == null || link == undefined || link == '') {
        global.requestermsisdn = null;
        global.requesterofferid = null;
        global.productpaymenttype = null;

        return;
      }
      if (link.url == null || link.url == undefined || link.url == '') {
        global.requestermsisdn = null;
        global.requesterofferid = null;
        global.productpaymenttype = null;

        return;
      }
      
      if (link?.url.includes('')) {
        // ...navigate to your offers screen
        var redirectarray = link?.url.split('page=');
        var redirecturl = redirectarray[1];
        redirecturl = redirecturl.replace('+', '');
        global.deeplinkurl = redirecturl;
        global.notifyredirect = redirecturl;

        Linking.openURL('' + redirecturl);
      } else if (link?.url?.includes('')) {
        global.firbasedeeplinkurl = link?.url;
        let regex = /[?&]([^=#]+)=([^&#]*)/g,
          params = {},
          match;
        while ((match = regex.exec(link?.url))) {
          params[match[1]] = match[2];
          consoleLog(match[1], match[2]);
        }
        let urlkeyword = params?.paymenttype + '#' + params?.offerid;
        global.deeplinkKeyword = urlkeyword;
        global.requestermsisdn = params?.msisdn;
        global.requesterofferid = params?.offerid;
        global.productpaymenttype = params?.paymenttype;
        global.deeplinkurl = params?.paymenttype + '#' + params?.offerid;
        global.notifyredirect = params?.paymenttype + '#' + params?.offerid;

        setTimeout(() => {
          Linking.openURL('' + urlkeyword);
        }, 500);

        return;
      } else {
        if (link?.url.includes('https:') || link?.url.includes('http:')) {
          Linking.openURL(link?.url);
          return;
        }
      }
    } catch (error) {}
  };

  //Dynamic links method handle for open state
  useEffect(() => {
    removeItem(NMFLOW_TOKEN_ID);
    try {
      const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
      // When the component is unmounted, remove the listener
      return () => unsubscribe();
    } catch (error) {}
  }, []);

  //Notification implemeted using local notification
  useEffect(() => {
    try {
      global.deeplinkKeyword = null;
      global.islogout = '';
      global.applaunched = '';
      requestUserPermission();

      messaging().getInitialNotification(async remoteMessage => {
        const dataFromNotification = remoteMessage?.data;
      });
    } catch (error) {}
  }, []);

  return (
    <PaperProvider theme={theme}>
      <Provider store={store}>
        <StatusBar
          translucent
          backgroundColor={'transparent'}
          barStyle={'dark-content'}
        />
        <QueryClientProvider client={queryClient}>
          <AppNavigator />
        </QueryClientProvider>
      </Provider>
    </PaperProvider>
  );
};

//Code push method
var updateDialogOptionsNew = {
  title: 'Update available',
  optionalUpdateMessage: '',
  mandatoryContinueButtonLabel: 'Download',
  mandatoryUpdateMessage: ' ',
  appendReleaseDescription: true,
  descriptionPrefix: '',
};
App = CodePush(codePushOptions)(App);
let _isenable = true;
CodePush.sync(
  {
    deploymentKey:
      Platform.OS === 'ios'
        ? ''
        : '',
    updateDialog: updateDialogOptionsNew,
  },
  status => {
    switch (status) {
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
        // Show "downloading" modal
        Toast.show('Downloading please wait...');
        break;
      case CodePush.SyncStatus.INSTALLING_UPDATE:
        Toast.show('Installing please wait...');
        // Hide "downloading" modal
        break;
      case CodePush.SyncStatus.UPDATE_INSTALLED:
        Toast.show('Download Completed');
        // Hide "downloading" modal
        break;
    }
  },
  ({receivedBytes, totalBytes}) => {
    /* Update download modal progress */
    if (_isenable) {
      let _a = (receivedBytes / totalBytes) * 100;
      _a = Math.round(_a);
      Toast.show('Download in Progress ' + _a + '%');
      _isenable = false;
      setTimeout(() => {
        _isenable = true;
      }, 2000);
    }
  }
);
export default App;
