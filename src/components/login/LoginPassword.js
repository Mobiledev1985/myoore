import * as actions from './actions';

import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  FONT_12,
  FONT_14,
  FONT_16,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_26,
  FONT_30,
  HEIGHT_30,
  HEIGHT_40,
  HORIZONTAL_10,
  HORIZONTAL_15,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_30,
  WIDTH_150,
  WIDTH_30,
  WIDTH_40,
} from '../../resources/styles/responsive';
import {
  BackHandler,
  Dimensions,
  I18nManager,
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  DEVICE_AUTH_API,
  EndPointUserDetails,
  HOME_PAGE_URL,
  RN_SENDOTP_API,
} from '../../resources/route/endpoints';
import {
  FULL_HEIGHT_PERCENTAGE,
  FULL_WIDTH_PERCENTAGE,
  HORIZONTAL_SCALE_25,
  LOGIN_TYPE,
  MOBILEID_TIMER_STATUS,
  SCALE_SIZE_12,
  SCALE_SIZE_14,
  SCALE_SIZE_16,
  SCALE_SIZE_25,
  SCALE_SIZE_8,
  STORE_EMAIL_MOBILE,
  TOKEN_ID,
  VERTICAL_SCALE_10,
  VERTICAL_SCALE_20,
  VERTICAL_SCALE_5,
} from '../../commonHelper/Constants';
import {GetCacheKey, GetCacheKeyProfile} from '../../services/CacheUtil';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../../resources/styles/fonts';
import React, {useCallback, useEffect, useState, useRef} from 'react';
import {
  UpdateProfileInfo,
  isB2CNumber,
  regexPasswordTest,
  loginTypeValue,
  getGlobalSettingValue,
} from '../../services/CommonUtils';
import {connect, useDispatch, useSelector} from 'react-redux';
import {
  consoleLog,
  debounce,
  doFunct,
  getItem,
  isBiometricSensorAvailable,
  removeItem,
  setItem,
  UnitTestProps,
} from '../../commonHelper/utils';

import AsyncStorage from '@react-native-community/async-storage';
import BottomPoppup from '../../commonHelper/BottomPopup';
import {LandingPageButton} from '../../commonHelper/Button';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import PageLoader from '../../commonHelper/PageLoader';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import ScreenHeader from '../../commonHelper/ScreenHeader';
import ScreenName from '../../navigator/ScreenName';
import Textinput from '../../models/basic/Textinput';
import colors from '../../resources/styles/colors';
import {logoutAPP} from '../../services/logout';
import {setLoggedInUser} from '../home/actions';
import {useTranslation} from 'react-i18next';
import {useQuery, useMutation} from 'react-query';
import {
  StackActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import BottomAuthenticationLoginPopup from '../../commonHelper/BottomAuthenticationLoginPopup';
import {
  callQueryapi,
  getImageHeaders,
} from '../../commonHelper/middleware/callapi';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-simple-toast';
import {isTablet} from 'react-native-device-info';
import {setLoginPasswordData} from '../../reducers/actions/cacheAction';

const {width, height} = Dimensions.get('window');

const HEADER_HEIGHT = StatusBar.currentHeight || 40;

const LoginPassword = ({
  navigation,
  route,
  socialLogin,
  sendOTP,
  updateToken,
}) => {
  const {t, i18n} = useTranslation();
  const EMPTY_PASS_ERROR = t('pepwd');
  const isFocused = useIsFocused();

  const {mobileEmailAddress} = route.params;
  const [emailAddress, setEmailAddress] = useState(mobileEmailAddress);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errors, setErrors] = useState({});
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [showValidAuth, setshowValidAuth] = useState(false);
  const [bottomAuthpopUp, setbottomAuthpopUp] = useState(false);
  const [bottomAuthDescription, setbottomAuthDescription] = useState(null);
  const [otpButtontext, setotpButtontext] = useState(null);
  const [paciButtontext, setpaciButtontext] = useState(null);
  const [ButtonTexttitle, setButtonTexttitle] = useState(null);
  const [popupError, setpopupError] = useState();
  const [showloader, setShowLoader] = useState(false);
  const [emailmobileNumber, setemailmobileNumber] = useState(null);
  const storeMsisdn = useRef(null);
  const dispatch = useDispatch();
  const reduxState = useSelector(state => state);
  const [logintypAuth, setlogintypAuth] = useState('');
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.LoginPassword_Obj
  );

  const params_cp = '{"source":"homepage","sec":"splash"}';

  const [data, setdata] = useState();

  // React.useEffect(() => {
  //   try {
  //     // if (
  //     //   cachedAPIData != null &&
  //     //   cachedAPIData != undefined &&
  //     //   cachedAPIData?.response
  //     // ) {
  //     //   setdata(cachedAPIData);
  //     // } else homepagepm.mutate();

  //     userprofile.mutate();
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
          dispatch(setLoginPasswordData(udata?.data));
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

  // const userprofile = useQuery(
  //   [GetCacheKey('userprofile_get'), EndPointUserDetails.url, {}, {}],
  //   {
  //     retry: false,
  //     retryOnMount: false,
  //     enabled: false,
  //     onSuccess: (udata, variables, context) => {
  //       if (udata.data != null && udata.data.response != null) {
  //         if (udata?.data?.response?.msisdn) {
  //           global.userdetails = udata.data.response;
  //           setTimeout(() => {
  //             custProfileDataPWD.mutate();
  //           }, 3000);
  //         } else {
  //           navigation.navigate(ScreenName.NoNumbExist);
  //         }
  //       }
  //     },
  //     onError: (uerror, variables, context) => {},
  //   }
  // );

  const userprofile = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, EndPointUserDetails.url, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata.data != null && udata.data.response != null) {
          if (udata?.data?.response?.msisdn) {
            global.userdetails = udata.data.response;
            setTimeout(() => {
              custProfileDataPWD.mutate();
            }, 3000);
          } else {
            navigation.navigate(ScreenName.NoNumbExist);
          }
        }
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
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
          if (udata?.data?.status == '-1') {
            if (udata?.data?.code === '22708') {
              // navigation.dispatch(
              //   StackActions.replace(ScreenName.tabStack, {
              //     screen: ScreenName.AuthStack,
              //     params: {
              //       screen: ScreenName.NoNumbExist,
              //     },
              //   })
              // );
              navigation.navigate(ScreenName.NoNumbExist);
            } else {
              logoutAPP(dispatch, reduxState, navigation);
            }
            return;
          } else if (udata?.data?.response != null) {
            UpdateProfileInfo(udata?.data?.response);
            if (
              udata?.data?.response?.Msisdn != null &&
              udata?.data?.response?.Msisdn != undefined
            ) {
              storeMsisdn.current = udata?.data?.response?.Msisdn;
              validUserApi.mutate();
            }
            // validUserApi.mutate();
            // isBiometricSensorAvailable(navigation);
          } else {
            logoutAPP(dispatch, reduxState, navigation);
            return;
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        validUserApi.mutate();
        setShowLoader(false);
      },
    }
  );

  const otpScreen = useCallback(() => {
    setshowModal(false);
    setpopupError('');
    setshowValidAuth(false);
    setbottomAuthpopUp(false);
    setPassword('');
    setShowLoader(false);
    setTimeout(() => {
      otpSendtoEmail.mutate();
    }, 1000);
  }, [
    emailmobileNumber,
    showModal,
    popupError,
    showValidAuth,
    bottomAuthpopUp,
    showloader,
  ]);

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
            let isauthenticate = udata?.data?.response?.isauthenticate;
            if (isauthenticate === 'F') {
              setShowLoader(false);
              setshowValidAuth(true);
              setbottomAuthDescription(udata?.data?.response?.Alert?.desc);
              setotpButtontext(udata?.data?.response?.Alert?.otpbuttontext);
              setpaciButtontext(udata?.data?.response?.Alert?.pacibuttontext);
              setButtonTexttitle(udata?.data?.response?.Alert?.title);
            } else {
              setItem(STORE_EMAIL_MOBILE, emailmobileNumber);
              global.loginEventCalled = 'yes';
              dispatch(setLoggedInUser(true));
              isBiometricSensorAvailable(dispatch, reduxState, navigation);
            }
          } else {
            if (udata?.data?.code === '2324005') {
              Toast.show(i18n.t(udata?.data?.message), 5000);
              setTimeout(() => {
                RNExitApp.exitApp();
              }, 3000);
              return;
            }
          }
        } else {
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const otpSendtoEmail = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          'rn_sendotp',
          RN_SENDOTP_API,
          {type: 'sms', msisdn: storeMsisdn.current, action: 'authotp'},
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        showloader.current = false;
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            navigation.navigate(ScreenName.loginAuthOTPScreen, {
              trans_id: udata?.data?.response.transid,
              mobileNo: emailmobileNumber,
              loginType: global.logintype,
            });
          } else {
            setError(udata?.data.message);
          }
        } else {
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const clickEvent = () => {
    if (password) {
      loginAPI(emailAddress, password);
    } else {
      setError(EMPTY_PASS_ERROR);
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
    RecordScreenEvent('LoginPassword');
  }, []);

  const sendOTPAPI = () => {
    setShowLoader(true);
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'email', email: mobileEmailAddress, action: 'forgotpwd'},
    })
      .then(response => {
        setShowLoader(false);

        if (response != null) {
          if (response.status === '0') {
            navigation.navigate(ScreenName.forgotPasswordScreen, {
              trans_id: response.response.transid,
              email: mobileEmailAddress,
              id_type: response.response.idtype,
            });
          } else {
            setError(response.message);
          }
        }
      })
      .catch(err => {
        setShowLoader(false);
      });
  };

  const loginAPI = (email, pwd) => {
    setShowLoader(true);
    let encPwd = doFunct(pwd);
    let params = {
      loginid: email,
      loginmode: 'email',
      pwd: encPwd,
      socialid: '',
      RM: '1',
    };
    socialLogin({
      key: 'SOCIAL_LOGIN',
      params: params,
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
            if (response?.msisdn != null && response?.msisdn != undefined) {
              setemailmobileNumber(email);
            }
            updateToken({tokenId: response.response.tokenid});
            setItem(TOKEN_ID, response.response.tokenid);
            global.tokenid = response.response.tokenid;
            setItem(LOGIN_TYPE, 'email');
            global.loginDeviceType = 'email';
            setTimeout(() => {
              loginTypeValue();
            }, 1000);
            // Need to check smart login enabled or not
            if (
              cachedAPIData != null &&
              cachedAPIData != undefined &&
              cachedAPIData?.response
            ) {
              setdata(cachedAPIData);
            } else homepagepm.mutate();

            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
              userprofile.mutate();
            }, 100);
          } else {
            setShowLoader(false);
            setError(response.message);
          }
        } else {
          setShowLoader(false);
        }
      })
      .catch(err => {
        setShowLoader(false);
      });
  };

  const clickBottomAutupopup = useCallback(() => {
    setshowValidAuth(false);
    setbottomAuthpopUp(true);
    removeItem(MOBILEID_TIMER_STATUS);
    global.modaltransfercredit = true;
    global.authType = 'deviceauth';
  }, [bottomAuthpopUp, showValidAuth]);

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

  function renderLeftIcon() {
    return (
      <TouchableOpacity onPress={debounceOnChange}>
        <Image
          source={require('../../assets/backicon.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
    );
  }

  const onTryAgainClick = () => {
    setshowModal(false);
    loginAPI(emailAddress, password);
  };

  if (!isFocused) {
    return <View />;
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ImageBackground
        source={require('../../assets/bg.png')}
        style={styles.bgImage}
        imageStyle={styles.bgImageStyle}>
        <View style={{height: HEADER_HEIGHT}} />
        <ScreenHeader
          title={t('login')}
          titleStyle={styles.headerTitle}
          left={renderLeftIcon}
        />
        <View style={styles.topContainer}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : -200}>
            <ScrollView
              contentContainerStyle={styles.container}
              alwaysBounceHorizontal={false}
              alwaysBounceVertical={false}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyboardShouldPersistTaps={'handled'}
              enabled>
              <View style={styles.viewContainer}>
                <Text style={styles.mobileNumberTextContainer}>
                  {t('mnea')}
                </Text>
                <Textinput
                  {...UnitTestProps('loginpassword', 'textbox', 'loginid')}
                  value={emailAddress}
                  maxLength={50}
                  editable={false}
                  fontStyle={
                    I18nManager.isRTL
                      ? {color: colors.LIGHT_GREY}
                      : {color: colors.LIGHT_GREY}
                  }
                />
                {errors.emailAddress && (
                  <Text style={styles.errorEmail}>{errors.emailAddress}</Text>
                )}

                <Text style={styles.otpTextContainer}>{t('password')}</Text>
                <Textinput
                  {...UnitTestProps('loginpassword', 'textbox', 'password')}
                  additionalStyle={{
                    borderColor: error ? colors.RED : colors.LIGHT_BLACK,
                  }}
                  value={password}
                  maxLength={20}
                  imageSource={require('../../assets/eyeoff.png')}
                  onChangeText={text => setPassword(regexPasswordTest(text))}
                  onFocus={() => setError('')}
                  isFieldPassword
                  iconStyle={{
                    color: password ? colors.BLACK : colors.LIGHT_GREY,
                  }}
                  // fontStyle={I18nManager.isRTL ? {lineHeight: FONT_24} : {}}
                  secureTextEntry={secureTextEntry}
                  onPressIcon={() => {
                    if (password) {
                      setSecureTextEntry(prevState => !prevState);
                    }
                  }}
                  onSubmitEditing={clickEvent}
                />
                {error ? (
                  <Text
                    {...UnitTestProps('loginpassword', 'text', 'passworderror')}
                    style={styles.errorPassword}>
                    {error}
                  </Text>
                ) : null}

                <Text
                  style={styles.resendOTPTextTimerContainer}
                  onPress={sendOTPAPI}>
                  {t('forgotpassword')}
                </Text>

                {showloader && (
                  <View style={styles.loading}>
                    <LoadingIndicator
                      shouldDismissManual
                      isVisible={showloader}
                    />
                  </View>
                )}
              </View>
              <LandingPageButton
                {...UnitTestProps('loginpassword', 'button', 'continue')}
                title={t('continue')}
                onPress={clickEvent}
                customStyle={styles.continueBtnContainer}
                customTextStyle={styles.continueBtnText}
              />
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
        <BottomPoppup
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
            setshowValidAuth(false);
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
        {!showValidAuth && bottomAuthpopUp ? (
          <BottomAuthenticationLoginPopup
            visible={bottomAuthpopUp}
            type={'deviceauth'}
            onClose={() => {
              setbottomAuthpopUp(false);
            }}
            height={heightPixel(380)}
          />
        ) : null}
        <BottomPoppup
          visible={showModal}
          message={popupError}
          onClose={() => setshowModal(false)}
          tryagainClick={onTryAgainClick}
        />
      </ImageBackground>
    </TouchableWithoutFeedback>
  );
};

const mapDispatchToProps = {
  ...actions,
};
export default connect(null, mapDispatchToProps)(LoginPassword);

const styles = StyleSheet.create({
  topContainer: {flex: 1, marginHorizontal: APPLY_TABLET_OR_DEVICE_MARGIN},
  rightImage: {
    height: HEIGHT_30,
    width: WIDTH_30,
    top: heightPixel(2),
    left: -widthPixel(0.478),
    paddingBottom: HORIZONTAL_15,
  },
  container: {
    height: height - 100,
    paddingHorizontal: HORIZONTAL_SCALE_25,
  },
  backButton: {
    width: WIDTH_30,
    height: HEIGHT_40,
    // paddingTop: VERTICAL_10,
    // paddingLeft: HORIZONTAL_10,
    marginTop: isTablet ? VERTICAL_30 : VERTICAL_15,
    marginRight: isTablet ? HORIZONTAL_5 : -widthPixel(0.478),

    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  bgImage: {width: FULL_WIDTH_PERCENTAGE, height: FULL_HEIGHT_PERCENTAGE},
  bgImageStyle: {
    position: 'absolute',
    height: FULL_HEIGHT_PERCENTAGE,
    width: FULL_WIDTH_PERCENTAGE,
  },
  headerTitle: {
    fontSize: FONT_14,
    lineHeight: FONT_24,
    fontFamily: OOREDOO_HEAVY_FONT,
  },
  viewContainer: {
    overflow: 'hidden',
    flex: 1,
    justifyContent: 'center',
  },
  errorPassword: {
    marginTop: VERTICAL_SCALE_5,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.RED,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
  },
  errorEmail: {
    marginTop: VERTICAL_SCALE_10,
    fontSize: FONT_16,
    lineHeight: FONT_26,
    color: colors.RED,
    fontFamily: NOTOSANS_REGULAR_FONT,
  },
  continueBtnContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    bottom: VERTICAL_SCALE_20,
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
  mobileNumberTextContainer: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: OOREDOO_HEAVY_FONT,
    textAlign: 'left',
    marginBottom: VERTICAL_10,
  },
  otpTextContainer: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    marginTop: 30,
    marginBottom: 10,
    fontFamily: OOREDOO_HEAVY_FONT,
    textAlign: 'left',
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
  resendOTPTextTimerContainer: {
    fontFamily: OOREDOO_HEAVY_FONT,
    color: colors.OOREDOO_RED,
    marginTop: VERTICAL_SCALE_20,
    textAlign: 'right',
    fontSize: FONT_12,
    lineHeight: FONT_20,
    width: WIDTH_150,
    alignSelf: 'flex-end',
  },
});
