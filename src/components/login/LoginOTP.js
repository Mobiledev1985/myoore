import * as actions from './actions';

import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  FONT_12,
  FONT_13,
  FONT_14,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_28,
  FONT_30,
  HEIGHT_30,
  HEIGHT_40,
  HEIGHT_80,
  HORIZONTAL_10,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_12,
  VERTICAL_15,
  VERTICAL_30,
  WIDTH_1,
  WIDTH_110,
  WIDTH_150,
  WIDTH_30,
  WIDTH_40,
  WIDTH_50,
  WIDTH_80,
} from '../../resources/styles/responsive';
import {
  BackHandler,
  DeviceEventEmitter,
  Dimensions,
  I18nManager,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  FULL_WIDTH_PERCENTAGE,
  HORIZONTAL_SCALE_15,
  HORIZONTAL_SCALE_25,
  isDeviceHuawei,
  isDeviceVersionMoreThan13,
  LOGIN_TYPE,
  SCALE_SIZE_12,
  SCALE_SIZE_14,
  SCALE_SIZE_20,
  SCALE_SIZE_25,
  SCALE_SIZE_30,
  SCALE_SIZE_8,
  TOKEN_ID,
  VERTICAL_SCALE_10,
  VERTICAL_SCALE_15,
  VERTICAL_SCALE_20,
  VERTICAL_SCALE_25,
  VERTICAL_SCALE_30,
  VERTICAL_SCALE_40,
  VERTICAL_SCALE_5,
  VERTICAL_SCALE_8,
  SOCIAL_ID_KEY,
  SOCIAL_PROFILE_PIC,
  VERTICAL_SCALE_80,
  VERTICAL_SCALE_130,
  VERTICAL_SCALE_180,
  VERTICAL_SCALE_150,
  VERTICAL_SCALE_60,
  VERTICAL_SCALE_90,
  VERTICAL_SCALE_100,
  VERTICAL_SCALE_120,
  STORE_EMAIL_MOBILE,
  MOBILEID_TIMER_STATUS,
  SELECTED_MSISDN,
  SHOP_CART_ID,
  SHOP_ITEM_ID,
  SHOP_ACCOUNT_ID,
  LOGGEDIN_MSISDN,
} from '../../commonHelper/Constants';
import {GetCacheKey, GetCacheKeyProfile} from '../../services/CacheUtil';
import {
  HEADER_HEIGHT,
  consoleLog,
  debounce,
  isBiometricSensorAvailable,
  setItem,
  UnitTestProps,
  doFunct,
  removeItem,
  getItem,
  findObjectByKey,
} from '../../commonHelper/utils';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
} from '../../resources/styles/fonts';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  UpdateProfileInfo,
  loginTypeValue,
  regexNumberTest,
  regexPasswordTest,
  clearDataMethod,
  GetMobileNo,
  getGlobalSettingValue,
} from '../../services/CommonUtils';
import {connect, useDispatch, useSelector} from 'react-redux';

import Clipboard from '@react-native-community/clipboard';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import {HOME_PAGE_URL, DEVICE_AUTH_API} from '../../resources/route/endpoints';
import {LandingPageButton, ModalPageButton} from '../../commonHelper/Button';
import PageLoader from '../../commonHelper/PageLoader';
import RNOtpVerify from 'react-native-otp-verify';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import ScreenHeader from '../../commonHelper/ScreenHeader';
import ScreenName from '../../navigator/ScreenName';
import Textinput from '../../models/basic/Textinput';
import colors from '../../resources/styles/colors';
import {setLoggedInUser} from '../home/actions';
import {
  useIsFocused,
  StackActions,
  useFocusEffect,
} from '@react-navigation/native';
import {useQuery, useMutation} from 'react-query';
import {useTranslation} from 'react-i18next';
import {output} from '../../commonHelper/ApiHeaders';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';

import {
  heightPixel,
  isSmallHeight,
  isTablet,
  SCREEN_HEIGHT,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import BottomPoppup from '../../commonHelper/BottomPopup';
import {
  callQueryapi,
  getImageHeaders,
} from '../../commonHelper/middleware/callapi';
import BottomAuthenticationLoginPopup from '../../commonHelper/BottomAuthenticationLoginPopup';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-simple-toast';
import {setLoginOtpAPIData} from '../../reducers/actions/cacheAction';

var transID = '';
const {height} = Dimensions.get('screen');
const RESEND_OTP_TIME_LIMIT = 50; // 10 secs
let resendOtpTimerInterval;

const LoginOTP = ({
  navigation,
  route,
  sendOTP,
  validateOTP,
  updateToken,
  socialLogin,
}) => {
  const isFocused = useIsFocused();
  // const userlogindetail = useSelector(state => state.userlogindetailReducer);
  const {t, i18n} = useTranslation();
  const EMPTY_PASS_ERROR = t('pepwd');
  const dispatch = useDispatch();
  const {mobileNo} = route.params;
  const {trans_id} = route.params;
  const {response} = route.params;
  const userlogindetail = response;
  const [transid, setTransId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(mobileNo);
  const [showModal, setshowModal] = useState(false);
  const [showValidAuth, setshowValidAuth] = useState(false);
  const [bottomAuthpopUp, setbottomAuthpopUp] = useState(false);
  const [bottomAuthDescription, setbottomAuthDescription] = useState(null);
  const [otpButtontext, setotpButtontext] = useState(null);
  const [paciButtontext, setpaciButtontext] = useState(null);
  const [ButtonTexttitle, setButtonTexttitle] = useState(null);
  const [popupError, setpopupError] = useState('');
  const [showloaderindicator, setShowloaderindicator] = useState(false);
  const showloader = React.useRef(false);
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.LoginOTP_Array
  );
  const home_key = 'HomePageURL_Key_LoginOTP';
  const customerprofile_key = 'CustomerURL_Key_LoginOTP';
  // otp related states
  const isotpentered = useRef(false);
  const [otperror, setOtperror] = useState(false);
  const [errorMessage, setErrorMessage] = useState(t('peobp'));

  const [otpValue, setOtpValue] = useState('');
  const otpValRef = useRef('');
  const transidRef = useRef('');
  const mobilenumberRef = useRef('');
  const resendButtonClicked = useRef('');
  // new added states for new flow

  const [ispasswordLogin, setispasswordLogin] = useState(false);
  const [issocialLogin, setisSocialLogin] = useState(false);
  const [isotpLogin, setisotpLogin] = useState(false);

  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [error, setError] = useState('');
  const [pwderror, setpwdError] = useState(false);
  const [selectedType, setselectedType] = useState('');
  const [selectedEmail, setselectedEmail] = useState('');
  const [selectedUID, setselectedUID] = useState('');
  const [submitHitted, setsubmitHitted] = useState(false);

  const [logintypAuth, setlogintypAuth] = useState('');

  const reduxState = useSelector(state => state);
  const checkSocial = () => {
    if (
      userlogindetail?.data?.sfa === 'T' ||
      userlogindetail?.data?.sga === 'T' ||
      userlogindetail?.data?.sta === 'T' ||
      userlogindetail?.data?.saa === 'T'
    ) {
      return true;
    } else {
      return false;
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          debounceOnChange();
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isFocused])
  );
  useEffect(() => {
    try {
      if (
        resendButtonClicked.current != 'yes' &&
        (global.transid == null ||
          global.transid == undefined ||
          global.transid == '')
      ) {
        transidRef.current = trans_id;
        global.transid = trans_id;
        setTransId(trans_id);
      } else {
        transidRef.current = global.transid;
        global.transid = global.transid;
        setTransId(global.transid);
      }
    } catch (error) {}
  }, []);

  useEffect(() => {
    if (userlogindetail?.data?.epd === 'T' && checkSocial()) {
      setisSocialLogin(true);
    } else if (userlogindetail?.data?.epd === 'T' && !checkSocial()) {
      setispasswordLogin(true);
    } else if (userlogindetail?.data?.epd === 'F' && checkSocial()) {
      setisSocialLogin(true);
    } else {
      setisSocialLogin(false);
      setispasswordLogin(false);
      setisotpLogin(false);
    }
  }, []);

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const params_cp = '{"source":"homepage","sec":"splash"}';

  const [data, setdata] = useState();
  const [data1, setdata1] = useState();
  // React.useEffect(() => {
  //   try {
  //     if (cachedAPIData && cachedAPIData?.length > 0) {
  //       const foundObj = findObjectByKey(cachedAPIData, 'Key', home_key);
  //       if (foundObj != null && foundObj != undefined && foundObj) {
  //         setdata(foundObj?.Resp_Obj);
  //       } else {
  //         homepagepm.mutate();
  //       }
  //     } else {
  //       homepagepm.mutate();
  //     }

  //     if (cachedAPIData && cachedAPIData?.length > 0) {
  //       const foundObj = findObjectByKey(
  //         cachedAPIData,
  //         'Key',
  //         customerprofile_key
  //       );
  //       if (foundObj != null && foundObj != undefined && foundObj) {
  //         UpdateProfileInfo(foundObj?.Resp_Obj);
  //         setdata1(foundObj?.Resp_Obj);
  //       } else {
  //         // custProfileData.mutate();
  //       }
  //     } else {
  //       //  custProfileData.mutate();
  //     }
  //   } catch (r) {}
  // }, []);

  const homepagepm = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, HOME_PAGE_URL.url, HOME_PAGE_URL.data],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);

          if (cachedAPIData && cachedAPIData?.length > 0) {
            const foundObj = findObjectByKey(cachedAPIData, 'Key', home_key);
            if (foundObj) {
            } else {
              let tempObj = {
                Key: home_key,
                Resp_Obj: udata?.data,
              };
              dispatch(setLoginOtpAPIData(tempObj));
            }
          } else {
            let tempObj = {
              Key: home_key,
              Resp_Obj: udata?.data,
            };
            dispatch(setLoginOtpAPIData(tempObj));
          }
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  // const homepagepm = useQuery(
  //   [GetCacheKey('home_list'), HOME_PAGE_URL.url, HOME_PAGE_URL.data, {}],
  //   {
  //     retry: false,
  //     cacheTime: 300000,
  //     staleTime: 300000,
  //     enabled: false,
  //   }
  // );
  // const custProfileData = useQuery(['', 'customerprofile/get', params_cp, {}], {
  //   retry: false,
  //   cacheTime: 100000,
  //   staleTime: 100000,
  //   enabled: false,
  //   onSuccess: (udata, variables, context) => {
  //     try {
  //       if (udata?.data?.status === '0') {
  //         if (udata?.data?.response != null) {
  //           UpdateProfileInfo(udata?.data?.response);
  //         }
  //       } else {
  //         setpopupError(udata?.data?.message);
  //         setTimeout(() => {
  //           setshowModal(true);
  //         }, 1000);
  //       }
  //     } catch (e) {}
  //     validUserApi.mutate();
  //   },
  //   onError: (uerror, variables, context) => {
  //     validUserApi.mutate();
  //   },
  // });

  const custProfileData = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, 'customerprofile/get', params_cp],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          if (udata?.data?.status === '0') {
            if (udata?.data?.response != null) {
              UpdateProfileInfo(udata?.data?.response);
              setdata1(udata?.data?.response);

              if (cachedAPIData && cachedAPIData?.length > 0) {
                const foundObj = findObjectByKey(
                  cachedAPIData,
                  'Key',
                  customerprofile_key
                );
                if (foundObj) {
                } else {
                  let tempObj = {
                    Key: customerprofile_key,
                    Resp_Obj: udata?.data?.response,
                  };
                  dispatch(setLoginOtpAPIData(tempObj));
                }
              } else {
                let tempObj = {
                  Key: customerprofile_key,
                  Resp_Obj: udata?.data?.response,
                };
                dispatch(setLoginOtpAPIData(tempObj));
              }
            }
          } else {
            setpopupError(udata?.data?.message);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
          }
        } catch (e) {}
        validUserApi.mutate();
      },
      onError: (error, variables, context) => {
        validUserApi.mutate();
      },
    }
  );

  const custProfileDataPWD = useMutation(
    req =>
      callQueryapi({
        queryKey: ['', 'customerprofile/get', params_cp],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          if (udata?.data?.status === '0') {
            if (udata?.data?.response != null) {
              const msisdn = udata?.data?.response?.Msisdn;

              const mobileNo = GetMobileNo(msisdn);

              setItem(SELECTED_MSISDN, mobileNo);

              UpdateProfileInfo(udata?.data?.response);
            }
          } else {
            setpopupError(udata?.data?.message);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
          }
        } catch (e) {}
        validUserApi.mutate();
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const onOTPChangeValue = async text => {
    const clipboard = await Clipboard.getString();
    const regexp = new RegExp(`^\\d{${4}}$`);

    if (clipboard && regexp.test(clipboard)) {
      setOtpValue(clipboard);
      await Clipboard.setString('');
      return;
    } else {
      if (otpValue.length > 1) {
        setOtperror(false);
      }
      otpValRef.current = text;
      setOtpValue(text);
    }
  };

  const resetField = (data = '') => {
    otpValRef.current = '';
    setOtpValue(data);
  };
  const otpHandler = message => {
    try {
      if (message != null && message != undefined && message.length > 10) {
        const otp = /(\d{4})/g.exec(message)[1];

        setOtpValue(otp);
      }
    } catch (e) {}
  };

  const fetchAPI = (email, socialtype, socoialid) => {
    showloader.current = true;
    setShowloaderindicator(true);
    let params = {
      loginid: email == null ? '' : email,
      loginmode: 'email',
      socialmediatype: socialtype,
      pwd: '',
      socialid: socoialid,
      RM: '1',
      msisdn: '965' + mobileNo,
    };
    socialLogin({
      key: 'SOCIAL_LOGIN',
      params: params,
    })
      .then(response => {
        setShowloaderindicator(false);
        showloader.current = false;
        if (response != null) {
          if (response.status === '0') {
            updateToken({tokenId: response.response.tokenid});
            setItem(TOKEN_ID, response.response.tokenid);
            global.tokenid = response.response.tokenid;
            const currTimeInMS = Date.now();
            global.UniqueToken = 't' + currTimeInMS + 'm';
            global.UniqueTokenProfile = 't' + currTimeInMS + 'm';
            setItem(LOGIN_TYPE, socialtype);
            setItem(SOCIAL_ID_KEY, socoialid);
            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
            }, 100);
            setTimeout(() => {
              authvalidUserApi.mutate();
            }, 300);
          } else {
            setpopupError(response.message);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
          }
        }
      })
      .catch(err => {
        setShowloaderindicator(false);
        showloader.current = false;
      });
  };

  //Apple Sign Method
  const appleLogin = async () => {
    // Start the sign-in request

    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    // Ensure Apple returned a user identityToken
    if (!appleAuthRequestResponse.user) {
      throw 'Apple Sign-In failed - no identify token returned';
    } else {
      setselectedType('apple');
      setselectedEmail(appleAuthRequestResponse.email);
      setselectedUID(appleAuthRequestResponse.user);
      fetchAPI(
        appleAuthRequestResponse.email,
        'appleid',
        appleAuthRequestResponse.user
      );
    }

    // Create a Firebase credential from the response
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce
    );

    // Sign the user in with the credential
    return auth().signInWithCredential(appleCredential);
  };

  const appleButtonclick = () => {
    appleLogin();
  };

  useEffect(() => {
    if (Platform.OS === 'android' && navigation.isFocused()) {
      try {
        RNOtpVerify.getOtp()
          .then(p => RNOtpVerify.addListener(otpHandler))
          .catch(p => consoleLog(p));
      } catch (e) {}
    }
    return () => {
      if (Platform.OS === 'android' && navigation.isFocused()) {
        try {
          RNOtpVerify.removeListener();
        } catch (e) {}
      }
    };
  }, []);
  useEffect(() => {
    RecordScreenEvent('LoginOTP');
    startResendOtpTimer();
    if (navigation.isFocused() && Platform.OS === 'android') {
    }
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
      if (Platform.OS === 'android' && navigation.isFocused()) {
      }
    };
  }, [resendButtonDisabledTime, startResendOtpTimer]);

  const startResendOtpTimer = useCallback(() => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      if (resendButtonDisabledTime <= 0) {
        clearInterval(resendOtpTimerInterval);
      } else {
        setResendButtonDisabledTime(resendButtonDisabledTime - 1);
      }
    }, 1000);
  }, [resendButtonDisabledTime]);

  const submitButtonclick = useCallback(() => {
    setTimeout(() => {}, 1000);
    if (ispasswordLogin) {
      clickEvent();
    } else {
      if (!isotpentered.current) {
        setOtperror(true);
      } else {
        if (showloader.current) {
          return;
        } /// To stop processing multiple clicks
        if (
          global.transid != null &&
          global.transid != undefined &&
          global.transid != ''
        ) {
          setTransId(global.transid);
          transidRef.current = global.transid;
        }

        setTimeout(() => {
          if (submitHitted) {
            validate(transid);
          }
        }, 1000);
      }
    }
  }, [validate, ispasswordLogin, password, otpValue, submitHitted]);

  const clickBottomAutupopup = useCallback(() => {
    setshowValidAuth(false);
    setTimeout(() => {
      setbottomAuthpopUp(true);
      removeItem(MOBILEID_TIMER_STATUS);
      global.modaltransfercredit = true;
      global.authType = 'deviceauth';
    }, 1000);
  }, [bottomAuthpopUp]);

  const otpScreen = useCallback(() => {
    setOtpValue('');
    setpopupError('');
    setshowModal(false);
    setshowValidAuth(false);
    setbottomAuthpopUp(false);
    sendOTPAPIDeviceDetect();
  }, [showValidAuth, bottomAuthpopUp, showModal, popupError]);

  const validUserApi = useMutation(
    req =>
      callQueryapi({
        queryKey: ['', DEVICE_AUTH_API, {dlogintype: logintypAuth}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        showloader.current = false;
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            setTransId(transid);

            global.transid = transid || transidRef.current;
            global.otpvalue = otpValue || otpValRef.current;
            let isauthenticate = udata?.data?.response?.isauthenticate;
            if (isauthenticate === 'F') {
              global.minimizetimebeforeLogin = new Date();
              setshowValidAuth(true);
              setbottomAuthDescription(udata?.data?.response?.Alert?.desc);
              setotpButtontext(udata?.data?.response?.Alert?.otpbuttontext);
              setpaciButtontext(udata?.data?.response?.Alert?.pacibuttontext);
              setButtonTexttitle(udata?.data?.response?.Alert?.title);
            } else {
              homepagepm.mutate();
              global.loginEventCalled = 'yes';
              setItem(STORE_EMAIL_MOBILE, mobilenumberRef.current);
              setItem(LOGGEDIN_MSISDN, mobileNo);
              setItem(SELECTED_MSISDN, mobileNo);
              dispatch(setLoggedInUser(true));
              isBiometricSensorAvailable(dispatch, reduxState, navigation);
            }
          } else {
            if (udata?.data?.code === '2324005') {
              Toast.show(i18n.t(udata?.data?.message), 5000);
              setTimeout(() => {
                RNExitApp.exitApp();
              }, 3000);
            }
          }
        } else {
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const authvalidUserApi = useMutation(
    req =>
      callQueryapi({
        queryKey: ['', DEVICE_AUTH_API, {dlogintype: logintypAuth}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        showloader.current = false;
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            let isauthenticate = udata?.data?.response?.isauthenticate;
            if (isauthenticate === 'F') {
              global.minimizetimebeforeLogin = new Date();
              setshowValidAuth(true);
              setbottomAuthDescription(udata?.data?.response?.Alert?.desc);
              setotpButtontext(udata?.data?.response?.Alert?.otpbuttontext);
              setpaciButtontext(udata?.data?.response?.Alert?.pacibuttontext);
              setButtonTexttitle(udata?.data?.response?.Alert?.title);
            } else {
              setTimeout(() => {
                if (global.navigationTabState) {
                  setItem(SHOP_CART_ID, '');
                  setItem(SHOP_ITEM_ID, '');
                  setItem(SHOP_ACCOUNT_ID, '');
                  navigation.dispatch(
                    StackActions.replace(ScreenName.tabStack, {
                      screen: global.navigationTabState,
                    })
                  );
                } else {
                  setTimeout(() => {
                    loginTypeValue();
                  }, 1000);
                  // navigation.dispatch(
                  //   StackActions.replace(ScreenName.tabStack, {
                  //     screen: ScreenName.homeStack,
                  //   })
                  // );
                  global.loginEventCalled = 'yes';
                  dispatch(setLoggedInUser(true));
                  isBiometricSensorAvailable(dispatch, reduxState, navigation);
                }
              }, 1000);
            }
          } else {
            if (udata?.data?.code === '2324005') {
              Toast.show(i18n.t(udata?.data?.message), 5000);
              setTimeout(() => {
                RNExitApp.exitApp();
              }, 3000);
            }
          }
        } else {
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId:
        '855845452411-plcri9q9e8or6480fo6l025l30oce20m.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }

  const googleLogin = async () => {
    configureGoogleSign();
    await GoogleSignin.hasPlayServices();
    const googleUserInfo = await GoogleSignin.signIn();
    return googleUserInfo;
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (err) {}
  };

  const googleButtonclick = () => {
    signOut();
    GoogleSignin.configure({
      iosClientId:
        '855845452411-gd91iov0i929gihk77d9sifdq850hgai.apps.googleusercontent.com',
    });

    googleLogin()
      .then(googleUserInfo => {
        try {
          setItem(
            SOCIAL_PROFILE_PIC,
            googleUserInfo.photo.replace('s96-c', 's400-c')
          );
        } catch (e) {}

        setError('');
        setselectedType('gmail');
        setselectedEmail(googleUserInfo.user.email);
        setselectedUID(googleUserInfo.user.id);
        fetchAPI(googleUserInfo.user.email, 'gmail', googleUserInfo.user.id);
      })
      .catch(googleError => {});
  };

  const clickEvent = () => {
    if (password != null && password != undefined && password != '') {
      loginAPI(mobileNumber, password);
    } else {
      setpwdError(true);
      setError(EMPTY_PASS_ERROR);
    }
  };

  const loginAPI = (phone, pswd) => {
    showloader.current = true;
    setShowloaderindicator(true);
    let encPwd = doFunct(pswd);
    let params = {
      loginid: '965' + phone,
      loginmode: 'msisdnpwd',
      pwd: encPwd,
      socialid: '',
      RM: '1',
    };
    socialLogin({
      key: 'SOCIAL_LOGIN',
      params: params,
    })
      .then(response => {
        setShowloaderindicator(false);
        if (response != null) {
          if (response.status === '0') {
            if (
              global.oldtokenid == '' ||
              global.oldtokenid == null ||
              global.oldtokenid == undefined
            ) {
              global.oldtokenid = global.tokenid;
            }
            global.loginEventCalled = 'yes';
            mobilenumberRef.current = phone;
            updateToken({tokenId: response.response.tokenid});
            setItem(TOKEN_ID, response.response.tokenid);
            global.tokenid = response.response.tokenid;
            global.loginDeviceType = 'password';
            setItem(LOGIN_TYPE, 'password');
            setTimeout(() => {
              loginTypeValue();
            }, 1000);
            // // Need to check smart login enabled or not
            // homepagepm.refetch();
            setTimeout(() => {
              loginTypeValue();
            }, 2000);
            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
              custProfileDataPWD.mutate();
            }, 1000);
          } else {
            showloader.current = false;
            setpwdError(true);
            setError(response.message);
          }
        } else {
          showloader.current = false;
        }
      })
      .catch(err => {
        setShowloaderindicator(false);
        showloader.current = false;
      });
  };

  const FBLogout = () => {
    var current_access_token = '';
    AccessToken.getCurrentAccessToken()
      .then(data => {
        current_access_token = data.accessToken.toString();
      })
      .then(() => {
        let logout = new GraphRequest(
          'me/permissions/',
          {
            accessToken: current_access_token,
            httpMethod: 'DELETE',
          },
          (err, result) => {
            if (err) {
              fbLogin();
            } else {
              LoginManager.logOut();
              fbLogin();
            }
          }
        );
        new GraphRequestManager().addRequest(logout).start();
      })
      .catch(err => {
        fbLogin();
      });
  };

  //Facebook Login
  const facebookButtonclick = () => {
    FBLogout();
  };

  const fbLogin = () => {
    LoginManager.logInWithPermissions([
      'public_profile',
      'email',
      'user_friends',
    ])
      .then(result => {
        if (result.isCancelled) {
        }
        return AccessToken.getCurrentAccessToken();
      })
      .then(data => {
        const credential = auth.FacebookAuthProvider.credential(
          data.accessToken
        );
        auth()
          .signInWithCredential(credential)
          .then(result => {
            setselectedType('facebook');
            setselectedEmail(result.user.email);
            setselectedUID(result.user.uid);
            try {
              setItem(
                SOCIAL_PROFILE_PIC,
                'https://graph.facebook.com/' +
                  result.user.uid +
                  '/picture?type=large'
              );
            } catch (e) {}

            fetchAPI(result.user.email, 'Facebook', result.user.uid);
          })
          .catch(err => {
            if (err.code === 'auth/account-exists-with-different-credential') {
              const currProfile = Profile.getCurrentProfile().then(function (
                currentProfile
              ) {
                if (currentProfile) {
                  setselectedType('facebook');
                  setselectedEmail(currentProfile.email);
                  setselectedUID(currentProfile.userID);
                  setItem(
                    SOCIAL_PROFILE_PIC,
                    'https://graph.facebook.com/' +
                      currentProfile.userID +
                      '/picture?type=large'
                  );
                  fetchAPI(
                    currentProfile.email,
                    'Facebook',
                    currentProfile.userID
                  );
                  return;
                }
                if (data) {
                  setselectedType('facebook');
                  setselectedEmail(data.email);
                  setselectedUID(data.userID);
                  fetchAPI(data.email, 'Facebook', data.userID);
                  return;
                }
              });
            }
          });
      })
      .catch(err => {});
  };

  const validate = useCallback(() => {
    if (
      global.transid == null ||
      global.transid === undefined ||
      global.transid === '' ||
      transidRef.current == null ||
      transidRef.current === undefined ||
      transidRef.current === '' ||
      otpValRef.current === null ||
      otpValRef.current === undefined ||
      otpValRef.current === ''
    ) {
      return;
    }
    showloader.current = true;
    validateOTP({
      key: 'VALIDATE_OTP',
      params: {
        transid: transid || transidRef.current,
        otp: otpValue ? otpValue : otpValRef.current,
      },
    })
      .then(response => {
        if (response != null) {
          if (response.status === '0') {
            if (
              global.oldtokenid == '' ||
              global.oldtokenid == null ||
              global.oldtokenid == undefined
            ) {
              global.oldtokenid = global.tokenid;
            }
            global.loginEventCalled = 'yes';
            mobilenumberRef.current = mobileNumber;
            updateToken({tokenId: response.response.tokenid});
            setItem(TOKEN_ID, response.response.tokenid);
            global.tokenid = response.response.tokenid;
            global.transid = transid || transidRef.current;
            global.otpvalue = otpValue || otpValRef.current;
            setsubmitHitted(false);
            setItem(LOGIN_TYPE, 'otp');
            global.loginDeviceType = 'otp';
            setTimeout(() => {
              loginTypeValue();
            }, 1000);
            otpValRef.current = otpValue;
            setOtpValue(otpValue);
            // homepagepm.refetch();
            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
              custProfileDataPWD.mutate();
            }, 1000);
          } else {
            showloader.current = false;
            resetField();
            setOtperror(true);
            setErrorMessage(response.message);
            setResendButtonDisabledTime(resendButtonDisabledTime);
            startResendOtpTimer();
          }
        } else {
          showloader.current = false;
        }
      })
      .catch(err => {
        showloader.current = false;
      });
  }, [data1, dispatch, data, otpValue, transid, updateToken, validateOTP]);

  const resendotpclick = async () => {
    await sendOTPAPI();
  };

  const forgotsendOTPAPI = () => {
    showloader.current = true;
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileNo, action: 'auth'},
    })
      .then(response => {
        showloader.current = false;

        if (response != null) {
          if (response.status === '0') {
            navigation.navigate(ScreenName.forgotPasswordScreen, {
              trans_id: response.response.transid,
              email: '965' + mobileNo,
              id_type: response.response.idtype,
              loginmode: 'msisdn',
            });
          } else {
            setError(response.message);
          }
        }
      })
      .catch(err => {
        showloader.current = false;
      });
  };

  const sendOTPAPIDeviceDetect = () => {
    showloader.current = true;
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileNo, action: 'authotp'},
    })
      .then(response => {
        showloader.current = false;
        if (response != null) {
          if (response.status === '0') {
            setispasswordLogin(false);
            setisotpLogin(true);
            setisSocialLogin(false);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
            if (response.response) {
              transID = response?.response?.transid;
              transidRef.current = response?.response?.transid;
              setTransId(response.response.transid);
              navigation.navigate(ScreenName.loginAuthOTPScreen, {
                trans_id: response?.response?.transid,
                mobileNo: mobileNo,
                loginType: global.logintype || global.loginDeviceType,
              });
            }
          } else {
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
            setpopupError(response.message);
          }
        }
      })
      .catch(err => {
        showloader.current = false;
      });
  };

  const sendOTPAPI = () => {
    showloader.current = true;
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileNo, action: 'auth'},
    })
      .then(response => {
        showloader.current = false;
        if (response != null) {
          if (response.status === '0') {
            setispasswordLogin(false);
            setisotpLogin(true);
            setisSocialLogin(false);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
            if (response?.response != null) {
              transID = response?.response?.transid;
              global.transid = response?.response?.transid;
              transidRef.current = response?.response?.transid;
              setTransId(response?.response?.transid);
            }
            setpopupError(response.message);
            //*thing after receiving the otp*//

            if (Platform.OS === 'android') {
              isotpentered.current = false;

              setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);

              startResendOtpTimer();

              resetField();
            } else {
              setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
              startResendOtpTimer();
            }
          } else {
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
            setpopupError(response.message);
          }
        }
      })
      .catch(err => {
        showloader.current = false;
      });
  };

  useEffect(() => {
    if (ispasswordLogin) {
      isotpentered.current = true;
    } else {
      if (otpValue.length === 4 || otpValRef.current.length === 4) {
        isotpentered.current = true;
        setOtpValue(otpValue);
        otpValRef.current = otpValue;
        clearInterval(resendOtpTimerInterval);
        if (!submitHitted) {
          setTimeout(() => {
            validate(transid);
          }, 2000);
        }
      } else {
        isotpentered.current = false;
      }
    }
  }, [otpValue, submitButtonclick]);

  const containerheight = () => {
    if (
      userlogindetail?.data?.sfa === 'T' &&
      userlogindetail?.data?.sga === 'T' &&
      userlogindetail?.data?.saa === 'T' &&
      userlogindetail?.data?.epd === 'T' &&
      Platform.OS === 'ios' &&
      isDeviceVersionMoreThan13
    ) {
      return VERTICAL_SCALE_40;
    } else if (
      (userlogindetail?.data?.sfa === 'T' ||
        userlogindetail?.data?.sga === 'T' ||
        userlogindetail?.data?.saa === 'T') &&
      Platform.OS === 'android' &&
      !ispasswordLogin &&
      !isotpLogin
    ) {
      return isSmallHeight() ? VERTICAL_SCALE_60 : VERTICAL_SCALE_120;
    } else if (
      (userlogindetail?.data?.sfa === 'T' ||
        userlogindetail?.data?.sga === 'T' ||
        userlogindetail?.data?.saa === 'T') &&
      Platform.OS === 'ios' &&
      !ispasswordLogin &&
      !isotpLogin
    ) {
      return isSmallHeight() ? VERTICAL_SCALE_80 : VERTICAL_SCALE_120;
    } else if (
      (userlogindetail?.data?.sfa === 'T' ||
        userlogindetail?.data?.sga === 'T' ||
        userlogindetail?.data?.saa === 'T') &&
      (ispasswordLogin || isotpLogin)
    ) {
      return isSmallHeight() ? VERTICAL_SCALE_40 : VERTICAL_SCALE_60;
    } else if (
      userlogindetail?.data?.sfa === 'F' &&
      userlogindetail?.data?.sga === 'F' &&
      userlogindetail?.data?.saa === 'F' &&
      userlogindetail?.data?.epd === 'T'
    ) {
      return VERTICAL_SCALE_40;
    } else {
      return SCREEN_HEIGHT * 0.25;
    }
  };

  // header items
  function renderRightIcon() {
    return (
      <TouchableOpacity
        onPress={() => {
          global.assistParentID = 0;
          // navigation.navigate(ScreenName.OAssist);
          navigation.navigate(ScreenName.SupportHome);
        }}
        activeOpacity={0.7}>
        <Image
          source={
            I18nManager.isRTL
              ? require('../../assets/assist_icon_ar.png')
              : require('../../assets/assist_icon.png')
          }
          style={styles.rightImage}
          resizeMode={'contain'}
        />
      </TouchableOpacity>
    );
  }

  const debounceOnChange = React.useCallback(
    debounce(() => {
      if (
        global.oldtokenid != null &&
        global.oldtokenid != undefined &&
        global.oldtokenid != ''
      ) {
        global.tokenid = global.oldtokenid;
        updateToken({tokenId: global.tokenid});
        setItem(TOKEN_ID, global.tokenid);
      }
      navigation.goBack();
    }, 400),
    []
  );

  function renderLeftIcon() {
    return (
      <TouchableOpacity
        {...UnitTestProps('loginotp', 'touchableopacity', 'backicontouch')}
        onPress={debounceOnChange}>
        <Image
          {...UnitTestProps('loginotp', 'image', 'backiconimage')}
          source={require('../../assets/backicon.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
    );
  }
  if (!isFocused) {
    return <View />;
  }
  return (
    <TouchableWithoutFeedback
      {...UnitTestProps(
        'loginotp',
        'touchablewithoutfeedback',
        'keyboardtouch'
      )}
      onPress={Keyboard.dismiss}>
      <ImageBackground
        {...UnitTestProps('loginotp', 'imagebackground', 'bgimage')}
        source={require('../../assets/bg.png')}
        style={styles.bgImage}
        imageStyle={styles.bgImageStyle}>
        <View
          {...UnitTestProps('loginotp', 'view', 'headerview')}
          style={{height: HEADER_HEIGHT}}
        />
        <ScreenHeader
          {...UnitTestProps('loginotp', 'screenheader', 'screenloginheader')}
          title={t('login')}
          titleStyle={styles.headerTitle}
          left={renderLeftIcon}
        />
        <View
          {...UnitTestProps('loginotp', 'view', 'viewscroll')}
          style={styles.topContainer}>
          <ScrollView
            {...UnitTestProps('loginotp', 'scrollview', 'mainscrollview')}
            alwaysBounceHorizontal={false}
            alwaysBounceVertical={false}
            bounces={false}
            contentContainerStyle={[
              styles.scrollContainer,
              {flex: !checkSocial() ? 1 : 0},
            ]}
            keyboardShouldPersistTaps={'handled'}>
            <KeyboardAvoidingView
              {...UnitTestProps(
                'loginotp',
                'keyboardavoidingview',
                'keyboardavoid'
              )}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
              style={styles.otpContainer}>
              <View
                {...UnitTestProps('loginotp', 'view', 'mobilecontainerview')}
                style={[
                  styles.mobileNoContainer,
                  {marginTop: containerheight()},
                ]}>
                <Text
                  {...UnitTestProps('loginotp', 'text', 'mobilenumbertext67')}
                  style={styles.mobileNumberTextContainer}>
                  {t('mnea')}
                </Text>
                <Textinput
                  {...UnitTestProps('loginotp', 'textinput', 'msidn')}
                  value={mobileNumber}
                  maxLength={8}
                  editable={false}
                  fontStyle={
                    I18nManager.isRTL
                      ? {color: colors.LIGHT_GREY}
                      : {color: colors.LIGHT_GREY}
                  }
                  onChangeText={text => setMobileNumber(text)}
                />
                {/* OTP boxes */}

                {userlogindetail?.data?.epd === 'T' || checkSocial() ? (
                  <View
                    {...UnitTestProps(
                      'loginotp',
                      'view',
                      'otptextcontainerview'
                    )}
                    style={{}}>
                    {ispasswordLogin && (
                      <View
                        {...UnitTestProps('loginotp', 'view', 'mainotpview')}>
                        <Text
                          {...UnitTestProps('loginotp', 'text', 'passwordtext')}
                          style={styles.otpTextContainer}>
                          {t('password')}
                        </Text>
                        <Textinput
                          {...UnitTestProps(
                            'loginotp',
                            'textinput',
                            'password'
                          )}
                          additionalStyle={{
                            borderColor: pwderror
                              ? colors.RED
                              : colors.LIGHT_BLACK,
                          }}
                          // fontStyle={
                          //   I18nManager.isRTL
                          //     ? {lineHeight: secureTextEntry ? FONT_24 : null}
                          //     : {}
                          // }
                          value={password}
                          maxLength={20}
                          imageSource={require('../../assets/eyeoff.png')}
                          onChangeText={text => {
                            setPassword(regexPasswordTest(text));
                            if (regexPasswordTest(text).length > 1) {
                              setpwdError(false);
                            }
                          }}
                          onFocus={() => setpwdError(false)}
                          isFieldPassword
                          iconStyle={{
                            color: password ? colors.BLACK : colors.LIGHT_GREY,
                          }}
                          secureTextEntry={secureTextEntry}
                          onPressIcon={() => {
                            if (password) {
                              setSecureTextEntry(prevState => !prevState);
                            }
                          }}
                        />
                        {pwderror ? (
                          <Text
                            {...UnitTestProps(
                              'loginotp',
                              'text',
                              'passworderror'
                            )}
                            style={styles.errorPassword}>
                            {error}
                          </Text>
                        ) : null}

                        <Text
                          {...UnitTestProps('loginotp', 'text', 'forgettext')}
                          style={styles.forgetTextContainer}
                          onPress={forgotsendOTPAPI}>
                          {t('forgotpassword')}
                        </Text>
                      </View>
                    )}
                    {isotpLogin && (
                      <View {...UnitTestProps('loginotp', 'view', 'otpview32')}>
                        <Text
                          {...UnitTestProps('loginotp', 'text', 'otpmaintext')}
                          style={styles.otpTextContainer}>
                          {t('otp')}
                        </Text>

                        <Textinput
                          {...UnitTestProps(
                            'loginotp',
                            'textinput',
                            'otptextinput'
                          )}
                          value={otpValue}
                          additionalStyle={{
                            borderColor: otperror
                              ? colors.RED
                              : colors.LIGHT_BLACK,
                          }}
                          // fontStyle={
                          //   // I18nManager.isRTL ? {lineHeight: FONT_24} : {}
                          // }
                          onFocus={() => setOtperror(false)}
                          secureTextEntry={true}
                          maxLength={4}
                          keyboardType={'numeric'}
                          onChangeText={text => {
                            setOtpValue(regexNumberTest(text));
                            onOTPChangeValue(regexNumberTest(text));
                            if (regexNumberTest(text).length > 1) {
                              setOtperror(false);
                            }
                          }}
                        />

                        {otperror ? (
                          <Text
                            {...UnitTestProps('loginotp', 'text', 'otperror')}
                            style={styles.otperrortext}>
                            {errorMessage}
                          </Text>
                        ) : null}

                        {/* Resend otp button */}
                        <View
                          {...UnitTestProps('loginotp', 'view', 'resendview')}
                          style={styles.resendOTPViewContainer}>
                          <Text
                            {...UnitTestProps(
                              'loginotp',
                              'text',
                              'resendtext56'
                            )}
                            onPress={() => {
                              if (resendButtonDisabledTime === 0) {
                                resendotpclick();
                              }
                            }}
                            style={[
                              styles.resendOTPTextContainer,
                              {
                                color:
                                  resendButtonDisabledTime > 0
                                    ? colors.WHITE_GREY
                                    : colors.OOREDOO_RED,
                              },
                            ]}>
                            {t('rotp')}
                          </Text>

                          {resendButtonDisabledTime > 0 && (
                            <Text
                              {...UnitTestProps(
                                'loginotp',
                                'text',
                                'timertext'
                              )}
                              style={[
                                styles.resendOTPTextTimerContainer,
                                {
                                  color:
                                    resendButtonDisabledTime > 0
                                      ? colors.OOREDOO_RED
                                      : colors.WHITE_GREY,
                                },
                              ]}>
                              {`0:${resendButtonDisabledTime}s`}
                            </Text>
                          )}
                        </View>
                      </View>
                    )}

                    {issocialLogin && (
                      <View
                        {...UnitTestProps('loginotp', 'view', 'socialview')}
                        style={styles.socialviewContainer}>
                        {Platform.OS === 'android' &&
                        userlogindetail?.data?.saa === 'T' ? (
                          <Text
                            {...UnitTestProps('loginotp', 'text', 'appletext')}
                            style={styles.socialtitletext}>
                            {t('AppleSocialDetact')}
                          </Text>
                        ) : (
                          <Text
                            {...UnitTestProps(
                              'loginotp',
                              'text',
                              'socialmessagetext'
                            )}
                            style={styles.socialtitletext}>
                            {t('socialMessage')}
                          </Text>
                        )}
                        <View
                          {...UnitTestProps('loginotp', 'view', 'appleview')}>
                          {userlogindetail?.data?.saa === 'T' ? (
                            Platform.OS === 'ios' &&
                            isDeviceVersionMoreThan13 ? (
                              <TouchableOpacity
                                {...UnitTestProps(
                                  'loginotp',
                                  'touchableopacity',
                                  'applebuttontouch'
                                )}
                                onPress={appleButtonclick}
                                activeOpacity={0.8}
                                style={styles.apple}>
                                <Image
                                  {...UnitTestProps(
                                    'loginotp',
                                    'image',
                                    'applebuttonimage'
                                  )}
                                  style={styles.image}
                                  source={require('../../assets/apple-logo.png')}
                                  resizeMode={'contain'}
                                />
                                <Text
                                  {...UnitTestProps(
                                    'loginotp',
                                    'text',
                                    'applesubtext57'
                                  )}
                                  style={styles.appleText}>
                                  {t('cwa')}
                                </Text>
                              </TouchableOpacity>
                            ) : null
                          ) : null}

                          {userlogindetail?.data?.sga === 'T' ? (
                            isDeviceHuawei && !output?.hasGms ? null : (
                              <TouchableOpacity
                                {...UnitTestProps(
                                  'loginotp',
                                  'touchableopacity',
                                  'googlebuttontouch'
                                )}
                                activeOpacity={0.8}
                                onPress={googleButtonclick}
                                style={styles.google}>
                                <Image
                                  {...UnitTestProps(
                                    'loginotp',
                                    'image',
                                    'googleimage'
                                  )}
                                  style={styles.image}
                                  source={require('../../assets/gmail-logo.png')}
                                  resizeMode={'contain'}
                                />
                                <Text
                                  {...UnitTestProps(
                                    'loginotp',
                                    'text',
                                    'textgoogle43'
                                  )}
                                  style={styles.googleText}>
                                  {t('cwg')}
                                </Text>
                              </TouchableOpacity>
                            )
                          ) : null}
                          {userlogindetail?.data?.sfa === 'T' ? (
                            <TouchableOpacity
                              {...UnitTestProps(
                                'loginotp',
                                'touchableopacity',
                                'enterpwdbutton'
                              )}
                              activeOpacity={0.8}
                              onPress={facebookButtonclick}
                              style={styles.facebook}>
                              <Image
                                {...UnitTestProps(
                                  'loginotp',
                                  'image',
                                  'facebookimage65'
                                )}
                                style={styles.image}
                                source={require('../../assets/facebook-logo.png')}
                                resizeMode={'contain'}
                              />
                              <Text
                                {...UnitTestProps(
                                  'loginotp',
                                  'text',
                                  'fbtextimage'
                                )}
                                style={styles.fbText}>
                                {t('cwf')}
                              </Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View {...UnitTestProps('loginotp', 'view', 'otptextview')}>
                    <Text
                      {...UnitTestProps('loginotp', 'text', 'otpsubtext67')}
                      style={styles.otpTextContainer}>
                      {t('otp')}
                    </Text>

                    <Textinput
                      {...UnitTestProps('loginotp', 'textinput', 'otp')}
                      value={otpValue}
                      additionalStyle={{
                        borderColor: otperror ? colors.RED : colors.LIGHT_BLACK,
                      }}
                      onFocus={() => setOtperror(false)}
                      secureTextEntry={true}
                      maxLength={4}
                      keyboardType={'numeric'}
                      // fontStyle={I18nManager.isRTL ? {lineHeight: FONT_24} : {}}
                      onChangeText={text => {
                        setOtpValue(regexNumberTest(text));
                        onOTPChangeValue(regexNumberTest(text));
                        if (regexNumberTest(text).length > 1) {
                          setOtperror(false);
                        }
                      }}
                    />

                    {otperror ? (
                      <Text
                        {...UnitTestProps('loginotp', 'text', 'otperror')}
                        style={styles.otperrortext}>
                        {errorMessage}
                      </Text>
                    ) : null}

                    {/* Resend otp button */}
                    <View
                      {...UnitTestProps('loginotp', 'view', 'resendotpview98')}
                      style={styles.resendOTPViewContainer}>
                      <Text
                        {...UnitTestProps('loginotp', 'text', 'btnpwdmainview')}
                        onPress={() => {
                          if (resendButtonDisabledTime === 0) {
                            resendotpclick();
                          }
                        }}
                        style={[
                          styles.resendOTPTextContainer,
                          {
                            color:
                              resendButtonDisabledTime > 0
                                ? colors.WHITE_GREY
                                : colors.OOREDOO_RED,
                          },
                        ]}>
                        {t('rotp')}
                      </Text>

                      {resendButtonDisabledTime > 0 && (
                        <Text
                          style={[
                            styles.resendOTPTextTimerContainer,
                            {
                              color:
                                resendButtonDisabledTime > 0
                                  ? colors.OOREDOO_RED
                                  : colors.WHITE_GREY,
                            },
                          ]}>
                          {`0:${resendButtonDisabledTime}s`}
                        </Text>
                      )}
                    </View>
                  </View>
                )}

                {userlogindetail?.data?.epd === 'T' || checkSocial() ? (
                  <View
                    {...UnitTestProps('loginotp', 'view', 'lineorview')}
                    style={styles.lineorview}>
                    <Text
                      {...UnitTestProps(
                        'loginotp',
                        'text',
                        'linecontainertext'
                      )}
                      style={styles.lineContainer}
                    />
                    <Text
                      {...UnitTestProps('loginotp', 'text', 'linedetailstext6')}
                      style={styles.lineDetailsContainer}>
                      {t('or')}
                    </Text>
                    <Text
                      {...UnitTestProps('loginotp', 'text', 'lastlinetext')}
                      style={styles.lastlineContainer}
                    />
                  </View>
                ) : null}

                {checkSocial() && userlogindetail?.data?.epd === 'T' ? (
                  <View
                    {...UnitTestProps('loginotp', 'view', 'btnpwdmainview')}
                    style={{flex: 0.2}}>
                    {issocialLogin ? (
                      <View
                        {...UnitTestProps('loginotp', 'view', 'btnpwdview')}>
                        <LandingPageButton
                          {...UnitTestProps(
                            'loginotp',
                            'landingpagebutton',
                            'enterpwdbutton'
                          )}
                          title={t('enterpwd').toUpperCase()}
                          onPress={() => {
                            setispasswordLogin(true);
                            setisSocialLogin(false);
                          }}
                          customStyle={styles.optionBtnContainer}
                          customTextStyle={styles.optionBtnText}
                        />
                        <LandingPageButton
                          {...UnitTestProps(
                            'loginotp',
                            'landingpagebutton',
                            'optionbutton'
                          )}
                          title={
                            t('use').toUpperCase() +
                            ' ' +
                            t('otp').toUpperCase()
                          }
                          onPress={() => {
                            setisotpLogin(true);
                            setisSocialLogin(false);
                            sendOTPAPI();
                          }}
                          customStyle={styles.optionBtnContainer}
                          customTextStyle={styles.optionBtnText}
                        />
                      </View>
                    ) : ispasswordLogin ? (
                      <View
                        {...UnitTestProps(
                          'loginotp',
                          'view',
                          'mainviewoflanding'
                        )}>
                        <LandingPageButton
                          {...UnitTestProps(
                            'loginotp',
                            'landingpagebutton',
                            'optnbuttonlanding'
                          )}
                          title={
                            t('use').toUpperCase() +
                            ' ' +
                            t('otp').toUpperCase()
                          }
                          onPress={() => {
                            setisotpLogin(true);
                            setispasswordLogin(false);
                            sendOTPAPI();
                          }}
                          customStyle={styles.optionBtnContainer}
                          customTextStyle={styles.optionBtnText}
                        />
                      </View>
                    ) : isotpLogin ? (
                      <View
                        {...UnitTestProps(
                          'loginotp',
                          'view',
                          'optionbtnsubview'
                        )}>
                        <LandingPageButton
                          {...UnitTestProps(
                            'loginotp',
                            'landingpagebutton',
                            'optionlanding'
                          )}
                          title={t('enterpwd').toUpperCase()}
                          onPress={() => {
                            setispasswordLogin(true);
                            setisotpLogin(false);
                          }}
                          customStyle={styles.optionBtnContainer}
                          customTextStyle={styles.optionBtnText}
                        />
                      </View>
                    ) : null}
                  </View>
                ) : !issocialLogin && userlogindetail?.data?.epd === 'T' ? (
                  ispasswordLogin ? (
                    <LandingPageButton
                      {...UnitTestProps(
                        'loginotp',
                        'landingpagebutton',
                        'option6landing'
                      )}
                      title={
                        t('use').toUpperCase() + ' ' + t('otp').toUpperCase()
                      }
                      onPress={() => {
                        sendOTPAPI();
                      }}
                      customStyle={styles.optionBtnContainer}
                      customTextStyle={styles.optionBtnText}
                    />
                  ) : isotpLogin ? (
                    <LandingPageButton
                      {...UnitTestProps(
                        'loginotp',
                        'landingpagebutton',
                        'enterpwdlanding'
                      )}
                      title={t('enterpwd').toUpperCase()}
                      onPress={() => {
                        setispasswordLogin(true);
                        setisotpLogin(false);
                      }}
                      customStyle={styles.optionBtnContainer}
                      customTextStyle={styles.optionBtnText}
                    />
                  ) : null
                ) : checkSocial() && userlogindetail?.data?.epd === 'F' ? (
                  issocialLogin ? (
                    <LandingPageButton
                      {...UnitTestProps(
                        'loginotp',
                        'landingpagebutton',
                        'option8btn'
                      )}
                      title={
                        t('use').toUpperCase() + ' ' + t('otp').toUpperCase()
                      }
                      onPress={() => {
                        setisSocialLogin(false);
                        setisotpLogin(true);
                        sendOTPAPI();
                      }}
                      customStyle={styles.optionBtnContainer}
                      customTextStyle={styles.optionBtnText}
                    />
                  ) : null
                ) : (
                  !checkSocial() && userlogindetail?.data?.epd === 'F' && null
                )}

                {!issocialLogin && checkSocial() && (
                  <View
                    {...UnitTestProps('loginotp', 'view', 'socialview6')}
                    style={styles.socialviewContainer}>
                    {Platform.OS === 'android' &&
                    userlogindetail?.data?.saa === 'T' ? (
                      <Text
                        {...UnitTestProps(
                          'loginotp',
                          'text',
                          'applesocialtext66'
                        )}
                        style={styles.socialtitletext}>
                        {t('AppleSocialDetact')}
                      </Text>
                    ) : (
                      <Text
                        {...UnitTestProps(
                          'loginotp',
                          'text',
                          'socialmessagetext'
                        )}
                        style={styles.socialtitletext}>
                        {t('socialMessage')}
                      </Text>
                    )}
                    <View
                      {...UnitTestProps('loginotp', 'view', 'applemainview88')}>
                      {userlogindetail?.data?.saa === 'T' ? (
                        Platform.OS === 'ios' && isDeviceVersionMoreThan13 ? (
                          <TouchableOpacity
                            {...UnitTestProps(
                              'loginotp',
                              'touchableopacity',
                              'applebuttontouch22'
                            )}
                            onPress={appleButtonclick}
                            activeOpacity={0.8}
                            style={styles.apple}>
                            <Image
                              {...UnitTestProps(
                                'loginotp',
                                'image',
                                'applelogoimage90'
                              )}
                              style={styles.image}
                              source={require('../../assets/apple-logo.png')}
                              resizeMode={'contain'}
                            />
                            <Text
                              {...UnitTestProps(
                                'loginotp',
                                'text',
                                'appletext68'
                              )}
                              style={styles.appleText}>
                              {t('cwa')}
                            </Text>
                          </TouchableOpacity>
                        ) : null
                      ) : null}

                      {userlogindetail?.data?.sga === 'T' ? (
                        isDeviceHuawei && !output?.hasGms ? null : (
                          <TouchableOpacity
                            {...UnitTestProps(
                              'loginotp',
                              'touchableopacity',
                              'googlebuttontouch'
                            )}
                            activeOpacity={0.8}
                            onPress={googleButtonclick}
                            style={styles.google}>
                            <Image
                              {...UnitTestProps(
                                'loginotp',
                                'image',
                                'gmailimage'
                              )}
                              style={styles.image}
                              source={require('../../assets/gmail-logo.png')}
                              resizeMode={'contain'}
                            />
                            <Text
                              {...UnitTestProps(
                                'loginotp',
                                'text',
                                'googletext65'
                              )}
                              style={styles.googleText}>
                              {t('cwg')}
                            </Text>
                          </TouchableOpacity>
                        )
                      ) : null}
                      {userlogindetail?.data?.sfa === 'T' ? (
                        <TouchableOpacity
                          {...UnitTestProps(
                            'loginotp',
                            'touchableopacity',
                            'facebookbtntouch'
                          )}
                          activeOpacity={0.8}
                          onPress={facebookButtonclick}
                          style={styles.facebook}>
                          <Image
                            {...UnitTestProps(
                              'loginotp',
                              'image',
                              'facebooklogoimage'
                            )}
                            style={styles.image}
                            source={require('../../assets/facebook-logo.png')}
                            resizeMode={'contain'}
                          />
                          <Text
                            {...UnitTestProps('loginotp', 'text', 'fbtextsub')}
                            style={styles.fbText}>
                            {t('cwf')}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                )}

                {(showloader.current || showloaderindicator) && (
                  <View
                    {...UnitTestProps('loginotp', 'view', 'loadingmainview31')}
                    style={styles.loading}>
                    <LoadingIndicator
                      {...UnitTestProps(
                        'loginotp',
                        'loadingindicator',
                        'loadingsubview43'
                      )}
                      shouldDismissManual
                      isVisible={showloader || showloaderindicator}
                    />
                  </View>
                )}
              </View>
            </KeyboardAvoidingView>
          </ScrollView>
          {issocialLogin ? null : (
            <View
              {...UnitTestProps('loginotp', 'view', 'continuemainview')}
              style={[
                styles.continueViewContainer,
                {
                  marginBottom:
                    isSmallHeight && Platform.OS === 'android'
                      ? VERTICAL_SCALE_20
                      : 0,
                },
              ]}>
              <ModalPageButton
                {...UnitTestProps('loginotp', 'modalpagebutton', 'modalbtn')}
                title={t('continue')}
                onPress={submitButtonclick}
                customStyle={styles.continueBtnContainer}
                customTextStyle={styles.continueBtnText}
                disabled={
                  !showValidAuth
                    ? false
                    : ispasswordLogin
                    ? !ispasswordLogin
                    : !isotpentered.current
                }
              />
            </View>
          )}
        </View>
        {showValidAuth ? (
          <BottomPoppup
            {...UnitTestProps(
              'loginotp',
              'bottompopup',
              'bottomauthdescription'
            )}
            type={'validuser'}
            title={ButtonTexttitle}
            visible={showValidAuth}
            message={bottomAuthDescription}
            hideBtnName={
              global.isB2BCPR !== '' &&
              global.isB2BCPR != null &&
              global.isB2BCPR !== undefined &&
              global.isB2BCPR === 'B2BCPR' &&
              getGlobalSettingValue('enableb2bcprvalidation') != null &&
              getGlobalSettingValue('enableb2bcprvalidation') != undefined &&
              getGlobalSettingValue('enableb2bcprvalidation') != '' &&
              getGlobalSettingValue('enableb2bcprvalidation') === 'T'
                ? true
                : false
            }
            onClose={() => {
              setOtpValue(otpValue);
              setsubmitHitted(true);
              global.transid = transid;
              setshowValidAuth(false);

              var d = new Date();
              const diffIndays = Math.abs(d - global.minimizetimebeforeLogin);
              var diffTimer = Math.round(diffIndays / 1000);
              if (diffTimer > resendButtonDisabledTime) {
                setResendButtonDisabledTime(0);
              } else {
                setResendButtonDisabledTime(
                  resendButtonDisabledTime - diffTimer
                );
              }

              resetField();

              setTransId(transid);
            }}
            tryagainClick={clickBottomAutupopup}
            btnName={otpButtontext}
            noBtnName={paciButtontext}
            designmode={2}
            height={264}
            showInfoIcon={true}
            otpScreen={() => {
              otpScreen();
            }}
          />
        ) : null}

        {!showValidAuth && bottomAuthpopUp ? (
          <BottomAuthenticationLoginPopup
            {...UnitTestProps(
              'loginotp',
              'BottomAuthenticationLoginPopup',
              'bottompopupmain'
            )}
            visible={bottomAuthpopUp}
            type={'deviceauth'}
            onClose={() => {
              setbottomAuthpopUp(false);
            }}
            height={heightPixel(380)}
          />
        ) : null}
        {showModal && popupError != '' ? (
          <CustomDialogue
            {...UnitTestProps(
              'loginotp',
              'customdialogue',
              'customdialoguemain87'
            )}
            visible={showModal}
            message={popupError}
            onClose={() => setshowModal(false)}
          />
        ) : null}
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const mapDispatchToProps = {
  ...actions,
};
export default connect(null, mapDispatchToProps)(LoginOTP);

const commonSocialTextStyle = {
  textAlign: 'center',
  fontSize: FONT_14,
  lineHeight: FONT_24,
  flex: 1,
  fontFamily: NOTOSANS_REGULAR_FONT,
};
const commonSocialContainer = {
  flexDirection: 'row',
  borderRadius: SCALE_SIZE_30,
  width: FULL_WIDTH_PERCENTAGE,
  paddingHorizontal: HORIZONTAL_SCALE_15,
  paddingVertical: VERTICAL_SCALE_8,
  borderWidth: 1,
  alignItems: 'center',
};

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    marginHorizontal: APPLY_TABLET_OR_DEVICE_MARGIN,
  },
  rightImage: {
    height: HEIGHT_30,
    width: WIDTH_30,
    marginTop: isTablet ? VERTICAL_30 : VERTICAL_15,
    marginRight: isTablet ? HORIZONTAL_5 : -widthPixel(0.478),
    // top: heightPixel(2),
    // left: -widthPixel(0.478),
    paddingBottom: HORIZONTAL_15,
  },
  otpBoxContainer: {marginTop: 10, marginStart: -3},
  otpBox: {
    borderColor: colors.BLACK,
    borderRadius: 5,
    height: HEIGHT_80,
    width: WIDTH_50,
  },
  mobileNoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginTop: VERTICAL_SCALE_40,
  },
  otpContainer: {
    flex: 0.9,
  },
  titleText: {
    flex: 0.2,
    justifyContent: 'center',
    marginTop: VERTICAL_SCALE_25,
  },
  scrollContainer: {
    flex: 0,
    paddingHorizontal: HORIZONTAL_SCALE_25,
    paddingBottom: VERTICAL_SCALE_20,
  },
  continueViewContainer: {
    marginHorizontal: HORIZONTAL_SCALE_25,
    justifyContent: 'flex-end',
  },
  bgImage: {width: '100%', height: height - HEADER_HEIGHT},
  otperrortext: {
    marginTop: VERTICAL_SCALE_5,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.OOREDOO_RED,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
  },
  bgImageStyle: {
    position: 'absolute',
    width: FULL_WIDTH_PERCENTAGE,
    height: height - HEADER_HEIGHT,
  },
  headerTitle: {
    fontSize: FONT_14,
    lineHeight: FONT_24,
    fontFamily: OOREDOO_HEAVY_FONT,
    color: colors.BLACK,
  },
  backButton: {
    width: WIDTH_30,
    height: HEIGHT_40,
    marginTop: isTablet ? VERTICAL_30 : VERTICAL_15,
    marginLeft: isTablet ? HORIZONTAL_5 : -widthPixel(0.478),
    // top: heightPixel(2),
    // left: -widthPixel(0.478),
    paddingBottom: HORIZONTAL_15,
    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  continueBtnContainer: {
    marginBottom: VERTICAL_SCALE_20,
    padding: SCALE_SIZE_8,
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: SCALE_SIZE_25,
  },
  continueBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,
    marginVertical: VERTICAL_SCALE_5,
  },

  headingContainer: {
    letterSpacing: 1,
    fontSize: FONT_20,
    lineHeight: FONT_28,
    color: colors.LIGHT_BLACK,
    textAlign: 'left',
    fontFamily: NOTOSANS_REGULAR_FONT,
  },
  mobileNumberTextContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.LIGHT_BLACK,
    textAlign: 'left',
    marginBottom: VERTICAL_SCALE_10,
  },
  otpTextContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    marginTop: VERTICAL_SCALE_30,
    color: colors.LIGHT_BLACK,
    textAlign: 'left',
    marginBottom: VERTICAL_SCALE_10,
  },
  resendOTPViewContainer: {
    flexDirection: 'row',
    marginTop: VERTICAL_SCALE_30,
    justifyContent: 'space-between',
  },
  resendOTPTextContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    marginTop: 0,
    marginLeft: 0,
    fontSize: FONT_14,
    lineHeight: FONT_24,
  },
  resendOTPTextTimerContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lineDetailsContainer: {
    textAlign: 'center',
    color: colors.BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    justifyContent: 'center',
    fontSize: FONT_16,
    lineHeight: FONT_28,
    marginHorizontal: HORIZONTAL_20,
  },
  lineContainer: {
    backgroundColor: colors.GREY,
    height: WIDTH_1,
    width: WIDTH_110,
    opacity: 0.2,
  },
  lastlineContainer: {
    backgroundColor: colors.GREY,
    height: WIDTH_1,
    width: WIDTH_110,
    opacity: 0.2,
  },
  lineorview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: VERTICAL_SCALE_15,
  },

  optionBtnContainer: {
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    borderRadius: SCALE_SIZE_25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
    marginTop: VERTICAL_15,
    padding: SCALE_SIZE_8,
  },
  optionBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    color: colors.OOREDOO_RED,
    lineHeight: FONT_20,
  },
  forgetTextContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    color: colors.OOREDOO_RED,
    marginTop: VERTICAL_SCALE_20,
    textAlign: 'right',
    fontSize: FONT_12,
    lineHeight: FONT_20,
    width: WIDTH_150,
    alignSelf: 'flex-end',
  },
  errorPassword: {
    marginTop: VERTICAL_SCALE_5,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.RED,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
  },

  socialviewContainer: {
    marginTop: VERTICAL_SCALE_20,
    marginBottom: VERTICAL_SCALE_10,
  },
  socialtitletext: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_12,
    color: colors.LIGHT_GREY,
    textAlign: 'left',
    marginBottom: VERTICAL_SCALE_5,
  },

  apple: {
    backgroundColor: colors.BLACK,
    ...commonSocialContainer,
  },
  appleText: {
    color: colors.WHITE,
    ...commonSocialTextStyle,
  },
  image: {width: 25, height: 25},
  fbText: {
    color: colors.FB_BLUE,
    ...commonSocialTextStyle,
  },
  facebook: {
    borderColor: colors.FB_BLUE,
    ...commonSocialContainer,
  },
  googleText: {
    color: colors.BLACK,
    ...commonSocialTextStyle,
  },
  google: {
    borderColor: colors.LIGHT_GREY,
    marginVertical: 15,
    ...commonSocialContainer,
  },
});
