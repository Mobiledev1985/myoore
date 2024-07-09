import * as actions from './actions';

import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  BORDER_RADIUS_10,
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
  HORIZONTAL_25,
  HORIZONTAL_30,
  VERTICAL_10,
  VERTICAL_12,
  VERTICAL_15,
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
  SHOP_CART_ID,
  SHOP_ITEM_ID,
  SHOP_ACCOUNT_ID,
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
} from '../../services/CommonUtils';
import {connect, useDispatch, useSelector} from 'react-redux';

import Clipboard from '@react-native-community/clipboard';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import {HOME_PAGE_URL} from '../../resources/route/endpoints';
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
  SCREEN_HEIGHT,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {
  callQueryapi,
  getImageHeaders,
} from '../../commonHelper/middleware/callapi';
import {setLoginAuthPageModules} from '../../reducers/actions/cacheAction';

var transID = '';
const {height} = Dimensions.get('screen');
const RESEND_OTP_TIME_LIMIT = 50; // 10 secs
let resendOtpTimerInterval;

const LoginAuthOTP = ({
  navigation,
  route,
  sendOTP,
  validateOTP,
  updateToken,
  socialLogin,
}) => {
  const isFocused = useIsFocused();
  const userlogindetail = useSelector(state => state.userlogindetailReducer);
  const {t} = useTranslation();
  const EMPTY_PASS_ERROR = t('pepwd');
  const dispatch = useDispatch();
  const {mobileNo} = route.params;
  const {trans_id} = route.params;
  const {loginType} = route.params;
  const [transid, setTransId] = useState(null);
  const [mobileNumber, setMobileNumber] = useState(mobileNo);
  const [showModal, setshowModal] = useState(false);
  const [showValidAuth, setshowValidAuth] = useState(false);
  const [bottomAuthpopUp, setbottomAuthpopUp] = useState(false);
  const [popupError, setpopupError] = useState();
  const [ShowToast, setShowToast] = useState(false);
  const [msgToast, setmsgToast] = useState('');
  const [showloaderindicator, setShowloaderindicator] = useState(false);
  const showloader = React.useRef(false);
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.LoginAuthOtp_PageModule
  );
  // otp related states
  const isotpentered = useRef(false);
  const [otperror, setOtperror] = useState(false);
  const [errorMessage, setErrorMessage] = useState(t('peobp'));

  const [otpValue, setOtpValue] = useState('');
  const otpValRef = useRef('');
  const transidRef = useRef('');
  const reduxState = useSelector(state => state);
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
      transidRef.current = trans_id;
      setTransId(trans_id);
    } catch (error) {}
  }, [trans_id]);

  // in secs, if value is greater than 0 then button will be disabled
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const params_cp = '{"source":"homepage","sec":"splash"}';

  const [data, setdata] = useState();
  const [data1, setdata1] = useState();

  // React.useEffect(() => {
  //   try {
  //     if (
  //       cachedAPIData != undefined &&
  //       cachedAPIData != null &&
  //       cachedAPIData?.response
  //     ) {
  //       setdata(cachedAPIData);
  //     } else homepagepm.mutate();

  //     //  custProfileData.mutate();
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
          dispatch(setLoginAuthPageModules(udata?.data));
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
  //   cacheTime: 0,
  //   staleTime: 0,
  //   enabled: false,
  //   onSuccess: (udata, variables, context) => {
  //     try {
  //       if (udata?.data?.response != null) {
  //         UpdateProfileInfo(udata?.data?.response);
  //       }
  //     } catch (e) {}

  //     isBiometricSensorAvailable(dispatch, reduxState, navigation);
  //   },
  //   onError: (uerror, variables, context) => {
  //     isBiometricSensorAvailable(dispatch, reduxState, navigation);
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
          if (udata?.data?.response != null) {
            UpdateProfileInfo(udata?.data?.response);
            setdata1(udata?.data?.response);
          }
        } catch (e) {}

        isBiometricSensorAvailable(dispatch, reduxState, navigation);
      },
      onError: (error, variables, context) => {
        isBiometricSensorAvailable(dispatch, reduxState, navigation);
      },
    }
  );

  const resendotpclick = async () => {
    await sendOTPAPI();
  };

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

            dispatch(setLoggedInUser(true));
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
                setItem(LOGIN_TYPE, socialtype);
                setTimeout(() => {
                  loginTypeValue();
                }, 1000);
                setItem(SOCIAL_ID_KEY, socoialid);
                navigation.dispatch(
                  StackActions.replace(ScreenName.tabStack, {
                    screen: ScreenName.homeStack,
                  })
                );
              }
            }, 1000);
          } else {
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
    if (!isotpentered.current) {
      setOtperror(true);
    } else {
      if (showloader.current) {
        return;
      } /// To stop processing multiple clicks
      setTimeout(() => {
        validate(transid);
      }, 1000);
    }
  }, [validate, password]);

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
            global.loginEventCalled = 'yes';
            setItem(STORE_EMAIL_MOBILE, phone);

            updateToken({tokenId: response.response.tokenid});
            setItem(TOKEN_ID, response.response.tokenid);
            global.tokenid = response.response.tokenid;
            dispatch(setLoggedInUser(true));
            setItem(LOGIN_TYPE, 'otp');
            setTimeout(() => {
              loginTypeValue();
            }, 1000);
            // Need to check smart login enabled or not
            homepagepm.mutate();
            setTimeout(() => {
              custProfileData.mutate();
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

  const validate = useCallback(() => {
    if (
      transid == null ||
      transid === undefined ||
      transid === '' ||
      transidRef.current == null ||
      transidRef.current === undefined ||
      transidRef.current === ''
    ) {
      return;
    }
    showloader.current = true;
    validateOTP({
      key: 'VALIDATE_OTP',
      params: {
        transid: transid || transidRef.current,
        otp: otpValue || otpValRef.current,
        dmode: 'otp',
        dlogintype: loginType || global.logintype,
        deviceauthinfo: 'T',
      },
    })
      .then(response => {
        if (response != null) {
          if (response.status === '0') {
            global.loginEventCalled = 'yes';

            global.modaltransfercredit = false;
            dispatch(setLoggedInUser(true));
            setItem(LOGIN_TYPE, global.loginDeviceType);
            setTimeout(() => {
              loginTypeValue();
            }, 1000);
            otpValRef.current = '';

            setTimeout(() => {
              setShowToast(true);
              setmsgToast(response.message);
            }, 500);

            homepagepm.mutate();
            setTimeout(() => {
              custProfileData.mutate();
            }, 1000);

            return;
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
  }, [
    data1,
    dispatch,
    data,
    otpValue,
    trans_id,
    transid,
    updateToken,
    validateOTP,
  ]);

  const forgotsendOTPAPI = () => {
    showloader.current = true;
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileNo, action: 'authotp'},
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

  const sendOTPAPI = () => {
    showloader.current = true;
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileNo, action: 'authotp'},
    })
      .then(response => {
        showloader.current = false;
        if (response != null) {
          if (response.status === '0') {
            setisotpLogin(true);
            setisSocialLogin(false);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
            if (response.response) {
              transID = response?.response?.transid;
              transidRef.current = response?.response?.transid;
              setTransId(response.response.transid);
            }
            setpopupError(response.message);
            //*thing after receiving the otp*//

            if (Platform.OS === 'android') {
              isotpentered.current = false;

              setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);

              startResendOtpTimer();

              resetField();
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
      if (otpValue.length === 4) {
        isotpentered.current = true;
        setOtpValue(otpValue);
        otpValRef.current = otpValue;
        clearInterval(resendOtpTimerInterval);
        setTimeout(() => {
          validate(transid);
        }, 2000);
      } else {
        isotpentered.current = false;
      }
    }
  }, [otpValue, submitButtonclick]);

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
          {...UnitTestProps('loginotp', 'image', 'componentimsge')}
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
      }
      updateToken({tokenId: global.tokenid});
      setItem(TOKEN_ID, global.tokenid);
      // if (global.networkType != null && global.networkType != undefined) {
      //   if (global.networkType == 'wifi' || global.networkType == 'he') {
      navigation.navigate(ScreenName.authStack, {
        screen: ScreenName.loginScreen,
      });
      return;
      //   }
      // }
      // navigation.goBack();
    }, 400),
    []
  );

  function renderLeftIcon() {
    return (
      <TouchableOpacity
        {...UnitTestProps('loginauthotp', 'touchableopacity', 'icontouch')}
        onPress={debounceOnChange}>
        <Image
          {...UnitTestProps('loginauthotp', 'icon', 'iconimage')}
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
        'loginauthotp',
        'touchablewithoutfeedback',
        'dismisstouch'
      )}
      onPress={Keyboard.dismiss}>
      <>
        <View
          {...UnitTestProps('loginauthotp', 'view', 'headerview')}
          style={{height: HEADER_HEIGHT}}
        />
        <ScreenHeader
          {...UnitTestProps('loginauthotp', 'screenheader', 'loginheader')}
          title={t('login')}
          titleStyle={styles.headerTitle}
          left={renderLeftIcon}
        />
        {ShowToast ? (
          <View
            {...UnitTestProps('loginauthotp', 'view', 'toastview')}
            style={styles.toastMain}>
            <Text
              {...UnitTestProps('loginauthotp', 'text', 'toasttext')}
              style={styles.toastText}>
              {msgToast}
            </Text>
          </View>
        ) : null}
        <View
          {...UnitTestProps('loginauthotp', 'view', 'containerview')}
          style={styles.topContainer}>
          <ScrollView
            {...UnitTestProps('loginauthotp', 'scrollview', 'viewscroll')}
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
                'loginauthotp',
                'keyboardavoidingview',
                'keyboardview'
              )}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 20}
              style={styles.otpContainer}>
              <View
                {...UnitTestProps('loginauthotp', 'view', 'mobilenumview')}
                style={[styles.mobileNoContainer]}>
                <Text
                  {...UnitTestProps('loginauthotp', 'text', 'numbertext')}
                  style={styles.mobileNumberTextContainer}>
                  {t('mnea')}
                </Text>
                <Textinput
                  {...UnitTestProps('loginotp', 'textbox', 'msidn')}
                  value={mobileNumber}
                  maxLength={loginType === 'email' ? 50 : 8}
                  editable={false}
                  fontStyle={
                    I18nManager.isRTL
                      ? {color: colors.LIGHT_GREY}
                      : {color: colors.LIGHT_GREY}
                  }
                  onChangeText={text => setMobileNumber(text)}
                />
                {/* OTP boxes */}
                <View {...UnitTestProps('loginauthotp', 'view', 'otpviewauth')}>
                  <Text
                    {...UnitTestProps('loginauthotp', 'text', 'textotp')}
                    style={styles.otpTextContainer}>
                    {t('otp')}
                  </Text>

                  <Textinput
                    {...UnitTestProps('loginotp', 'textbox', 'otp')}
                    value={otpValue}
                    additionalStyle={{
                      borderColor: otperror ? colors.RED : colors.LIGHT_BLACK,
                    }}
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
                </View>

                {/* Resend otp button */}
                <View
                  {...UnitTestProps('loginauthotp', 'view', 'otpview')}
                  style={styles.resendOTPViewContainer}>
                  <Text
                    {...UnitTestProps('loginauthotp', 'text', 'resendtext')}
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
                      {...UnitTestProps('loginauthotp', 'text', 'resendotp')}
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

                {(showloader.current || showloaderindicator) && (
                  <View
                    {...UnitTestProps(
                      'loginauthotp',
                      'view',
                      'shadowloaderniew'
                    )}
                    style={styles.loading}>
                    <LoadingIndicator
                      {...UnitTestProps(
                        'loginauthotp',
                        'loadingindicator',
                        'loaderindicator'
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
              {...UnitTestProps('loginauthotp', 'view', 'continueview')}
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
                {...UnitTestProps(
                  'loginauthotp',
                  'modalpagebutton',
                  'continuemodal'
                )}
                title={t('continue')}
                onPress={submitButtonclick}
                customStyle={styles.continueBtnContainer}
                customTextStyle={styles.continueBtnText}
              />
            </View>
          )}
        </View>

        <CustomDialogue
          {...UnitTestProps('loginauthotp', 'customdialogue', 'modaldialogue')}
          visible={showModal}
          message={popupError}
          onClose={() => setshowModal(false)}
        />
      </>
    </TouchableWithoutFeedback>
  );
};

const mapDispatchToProps = {
  ...actions,
};
export default connect(null, mapDispatchToProps)(LoginAuthOTP);

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
    marginTop: WIDTH_50,
  },
  rightImage: {
    height: HEIGHT_30,
    width: WIDTH_30,
    top: heightPixel(2),
    left: -widthPixel(0.478),
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
  },
  otpContainer: {
    flex: 1,
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
  toastMain: {
    borderRadius: BORDER_RADIUS_10,
    borderWidth: 1,
    alignItems: 'center',
    height: WIDTH_50,
    justifyContent: 'center',
    backgroundColor: colors.TOAST_COLOR,
    marginHorizontal: HORIZONTAL_30,
  },
  toastText: {
    textAlign: 'center',
    color: colors.WHITE,
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
    paddingTop: VERTICAL_10,
    paddingLeft: HORIZONTAL_10,
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
