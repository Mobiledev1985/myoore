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
  FONT_34,
  HAS_NOTCH,
  HEIGHT_100,
  HEIGHT_20,
  HEIGHT_30,
  HEIGHT_40,
  HORIZONTAL_10,
  HORIZONTAL_2,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_3,
  VERTICAL_30,
  VERTICAL_35,
  VERTICAL_4,
  WIDTH_20,
  WIDTH_25,
  WIDTH_30,
  WIDTH_40,
} from '../../resources/styles/responsive';
import {
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
  Profile,
} from 'react-native-fbsdk-next';
import {
  ActivityIndicator,
  I18nManager,
  Image,
  ImageBackground,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  FULL_HEIGHT_PERCENTAGE,
  FULL_WIDTH_PERCENTAGE,
  HORIZONTAL_SCALE_10,
  HORIZONTAL_SCALE_15,
  HORIZONTAL_SCALE_25,
  LOGIN_TYPE,
  SCALE_SIZE_12,
  SCALE_SIZE_14,
  SCALE_SIZE_16,
  SCALE_SIZE_25,
  SCALE_SIZE_30,
  SCALE_SIZE_8,
  SOCIAL_ID_KEY,
  SOCIAL_PROFILE_PIC,
  TOKEN_ID,
  VERTICAL_SCALE_10,
  VERTICAL_SCALE_20,
  VERTICAL_SCALE_30,
  VERTICAL_SCALE_40,
  VERTICAL_SCALE_5,
  VERTICAL_SCALE_8,
  isDeviceHuawei,
  isDeviceVersionMoreThan13,
  STORE_EMAIL_MOBILE,
  MOBILEID_TIMER_STATUS,
  SCALE_SIZE_5,
  CHILDMSISDN,
  SHOP_CART_ID,
  SHOP_ITEM_ID,
  SHOP_ACCOUNT_ID,
  LOGGEDIN_MSISDN,
  SELECTED_MSISDN,
} from '../../commonHelper/Constants';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
} from '../../resources/styles/fonts';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  SCREEN_HEIGHT,
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
} from '../../resources/styles/normalizedimension';
import {
  UnitTestProps,
  consoleLog,
  debounce,
  setItem,
  validateEmail,
  getItem,
  removeItem,
} from '../../commonHelper/utils';
import {connect, useDispatch} from 'react-redux';

import AsyncStorage from '@react-native-community/async-storage';
import BottomPoppup from '../../commonHelper/BottomPopup';
import ContainerView from './ContainerView';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {LandingPageButton} from '../../commonHelper/Button';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import ScreenHeader from '../../commonHelper/ScreenHeader';
import ScreenName from '../../navigator/ScreenName';
import {ScrollView} from 'react-native-gesture-handler';
import {StackActions} from '@react-navigation/native';
import Textinput from '../../models/basic/Textinput';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import auth from '@react-native-firebase/auth';
import colors from '../../resources/styles/colors';
import {
  getGlobalSettingValue,
  loginTypeValue,
} from '../../services/CommonUtils';
import {output} from '../../commonHelper/ApiHeaders';
import {setLoggedInUser} from '../home/actions';
import {useFocusEffect} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';
import {useQuery, useMutation} from 'react-query';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import BottomAuthenticationLoginPopup from '../../commonHelper/BottomAuthenticationLoginPopup';
import {
  callQueryapi,
  getImageHeaders,
} from '../../commonHelper/middleware/callapi';
import {DEVICE_AUTH_API} from '../../resources/route/endpoints';
import ImageComponent from '../../models/basic/ImageComponent';
import RNExitApp from 'react-native-exit-app';
import Toast from 'react-native-simple-toast';

const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 40;
const Login = ({
  navigation,
  socialLogin,
  sendOTP,
  userValidate,
  updateToken,
}) => {
  const {t, i18n} = useTranslation();
  const WRONG_EMAIL_TEXT = t('yedlr');
  const FIELD_REQUIRED_TEXT = t('tfr');

  const [mobileEmailAddress, setMobileEmailAddress] = useState('');
  const [error, setError] = useState('');

  const [initializing, setInitializing] = useState(true);
  const [isprefilledDataAvailable, setisprefilledDataAvailable] =
    useState('false');

  const [user, setUser] = useState();
  const [onclickTxt, setonclickTxt] = useState('');
  const [popupError, setpopupError] = useState();
  const [checkscroll, setcheckscroll] = useState(false);
  const [scrollpos, setscrollpos] = useState(0);
  const [showModal, setshowModal] = useState(false);
  const [showloader, setShowLoader] = useState(false);
  const [selectedType, setselectedType] = useState('');
  const [selectedEmail, setselectedEmail] = useState('');
  const [selectedUID, setselectedUID] = useState('');
  const [btnname, setbtnname] = useState(null);
  const [showValidAuth, setshowValidAuth] = useState(false);
  const [bottomAuthpopUp, setbottomAuthpopUp] = useState(false);
  const [bottomAuthDescription, setbottomAuthDescription] = useState(null);
  const [otpButtontext, setotpButtontext] = useState(null);
  const [paciButtontext, setpaciButtontext] = useState(null);
  const [ButtonTexttitle, setButtonTexttitle] = useState(null);
  const transidRef = useRef('');
  const isClicked = useRef(false);
  const isToNavigate = useRef(false);
  const MobileEmailAddressValue = useRef(null);

  const [logintypAuth, setlogintypAuth] = useState(''); //login type auth check

  const dispatch = useDispatch();
  const _scrollLogin = useRef();
  useFocusEffect(
    React.useCallback(() => {
      try {
        getItem(STORE_EMAIL_MOBILE).then(val => {
          if (val != null && val != undefined) {
            let isValidEmail = validateEmail(val);
            let isValidMsisdn = isValidNumeric(val);
            if (isValidEmail || isValidMsisdn) {
              setisprefilledDataAvailable('true');
              setMobileEmailAddress(val);
            } else {
              setisprefilledDataAvailable('false');
              setMobileEmailAddress('');
            }
          }
        });
        setcheckscroll(false);
        setscrollpos(0);
        setError('');
        if (
          _scrollLogin?.current?.scrollTo != null &&
          _scrollLogin?.current?.scrollTo != undefined
        ) {
          try {
            _scrollLogin.current.scrollTo({
              y: 10,
              animated: true,
            });
          } catch (error) {}
        }
      } catch (r) {}
    }, [])
  );
  useEffect(() => {
    try {
      if (
        _scrollLogin?.current?.scrollTo != null &&
        _scrollLogin?.current?.scrollTo != undefined
      ) {
        try {
          _scrollLogin.current.scrollTo({
            y: scrollpos + HEIGHT_100,
            animated: true,
          });
        } catch (error) {}
      }
    } catch (e) {}
  }, [onclickTxt]);

  const isValidNumeric = value => {
    // Regular expression for numeric validation with a length of 8 to 11 characters
    const numericRegex = /^[0-9]{8,11}$/;

    // Return true if the value matches the numeric regex, otherwise return false
    return numericRegex.test(value);
  };

  const setOnclickTextFocus = () => {
    try {
      setcheckscroll(true);
      // setError('');
      setTimeout(() => {
        _scrollLogin.current.scrollTo({
          y: heightPixel(200),
          animated: true,
        });
      }, 300);
    } catch (e) {}
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

  const clickBottomAutupopup = useCallback(() => {
    setshowValidAuth(false);
    setbottomAuthpopUp(true);
    removeItem(MOBILEID_TIMER_STATUS);
    global.modaltransfercredit = true;
    global.authType = 'deviceauth';
  }, [bottomAuthpopUp]);

  const otpScreen = useCallback(() => {
    setpopupError('');
    setshowModal(false);
    setshowValidAuth(false);
    setbottomAuthpopUp(false);
    SocialSendOtpScreen();
  }, [
    mobileEmailAddress,
    popupError,
    showModal,
    showValidAuth,
    bottomAuthpopUp,
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
              setshowValidAuth(true);
              setbottomAuthDescription(udata?.data?.response?.Alert?.desc);
              setotpButtontext(udata?.data?.response?.Alert?.otpbuttontext);
              setpaciButtontext(udata?.data?.response?.Alert?.pacibuttontext);
              setButtonTexttitle(udata?.data?.response?.Alert?.title);
            } else {
              dispatch(setLoggedInUser(true));
              global.logintype = global.loginDeviceType;
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
                  // setItem(LOGIN_TYPE, socialtype);
                  setTimeout(() => {
                    loginTypeValue();
                  }, 1000);
                  //setItem(SOCIAL_ID_KEY, socoialid);
                  navigation.dispatch(
                    StackActions.replace(ScreenName.tabStack, {
                      screen: ScreenName.homeStack,
                    })
                  );
                }
              }, 1000);
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

  const appleButtonclick = () => {
    appleLogin();
  };

  //Google Sign in
  // Handle user state changes
  const onAuthStateChanged = useCallback(
    data => {
      setUser(data);
      if (initializing) {
        setInitializing(false);
      }
    },
    [initializing]
  );

  useEffect(() => {
    RecordScreenEvent('Login');
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber;
  }, [onAuthStateChanged]);

  useEffect(() => {
    isClicked.current = false;
  });

  function configureGoogleSign() {
    GoogleSignin.configure({
      webClientId:
        '855845452411-plcri9q9e8or6480fo6l025l30oce20m.apps.googleusercontent.com',
      offlineAccess: false,
    });
  }

  const googleButtonclick = () => {
    signOut();
    GoogleSignin.configure({
      iosClientId:
        '855845452411-gd91iov0i929gihk77d9sifdq850hgai.apps.googleusercontent.com',
    });

    googleLogin()
      .then(googleUserInfo => {
        consoleLog('Google user', googleUserInfo.user);
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

  const googleLogin = async () => {
    configureGoogleSign();
    await GoogleSignin.hasPlayServices();
    const googleUserInfo = await GoogleSignin.signIn();
    return googleUserInfo;
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
    } catch (err) {
      consoleLog('Google signout Error: ', err);
    }
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
    // onFacebookButtonPress();
    FBLogout();
  };

  const fbLogin = () => {
    LoginManager.logInWithPermissions(['public_profile', 'email'])
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
                  consoleLog(
                    'log',
                    'The current logged user is: ' +
                      currentProfile.name +
                      '. His profile id is: ' +
                      currentProfile.userID +
                      'dat is ' +
                      JSON.stringify(currentProfile)
                  );
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
      .catch(err => {
        consoleLog('Error FB:', err);
      });
  };

  const continueButtonclick = () => {
    // if(isToNavigate.current){
    //   return;
    // }
    isClicked.current = true;

    if (mobileEmailAddress) {
      let isnum = /^\d+$/.test(mobileEmailAddress);
      let isValidEmail = validateEmail(mobileEmailAddress);
      if (isnum) {
        if (!mobileEmailAddress.trim()) {
          setError(t('pemn'));
          isClicked.current = false;
          return;
        } else {
          if (mobileEmailAddress.length < 8) {
            setError(t('peavmn'));
            isClicked.current = false;
            return;
          }
          setError('');
        }

        valUserMobile();
      } else if (!isValidEmail) {
        setError(WRONG_EMAIL_TEXT);
        isClicked.current = false;
      } else {
        valUser();
      }
    } else {
      setError(FIELD_REQUIRED_TEXT);
      isClicked.current = false;
    }
  };

  const validateTextInput = value => {
    setisprefilledDataAvailable('false');
    setMobileEmailAddress(value);
    if (value) {
      let isnum = /^\d+$/.test(value);
      let isValidEmail = validateEmail(value);
      if (isnum) {
        if (!value.trim()) {
          setError(t('pemn'));
          return;
        } else {
          if (value.length > 5 && value.length < 8) {
            setError(t('peavmn'));
            return;
          }
          setError('');
        }
      } else if (!isValidEmail) {
        if (value.length > 10) {
          setError(WRONG_EMAIL_TEXT);
        }
      } else {
        setError(false);
      }
    } else {
      setError(FIELD_REQUIRED_TEXT);
    }
  };

  function renderRightIcon() {
    return (
      <TouchableOpacity
        {...UnitTestProps('homeindex', 'touchableopacity', 'righttouchable')}
        onPress={() => {
          global.assistParentID = 0;
          //navigation.navigate(ScreenName.OAssist);
          navigation.navigate(ScreenName.SupportHome);
        }}
        activeOpacity={0.7}>
        <Image
          {...UnitTestProps('homeindex', 'image', 'rightimage')}
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
      if (!navigation.canGoBack()) {
        navigation.dispatch(StackActions.replace(ScreenName.landingScreen));
      } else {
        if (global.networkType != null && global.networkType != undefined) {
          if (global.networkType == 'wifi' || global.networkType == 'he') {
            navigation.navigate(ScreenName.authStack, {
              screen: ScreenName.landingScreen,
            });
            return;
          }
        }
        navigation.goBack();
      }
    }, 400),
    []
  );

  function renderLeftIcon() {
    return (
      <TouchableOpacity
        {...UnitTestProps('homeindex', 'touchableopacity', 'lefttouchable')}
        onPress={debounceOnChange}>
        <Image
          {...UnitTestProps('homeindex', 'image', 'leftimage')}
          source={require('../../assets/backicon.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
    );
  }

  const SocialSendOtpScreen = () => {
    setShowLoader(true);
    sendOTP({
      key: 'SEND_OTP',
      params: {
        type: 'sms',
        msisdn: '965' + MobileEmailAddressValue.current,
        action: 'auth',
      },
    })
      .then(response => {
        setShowLoader(false);
        if (response != null) {
          if (response.status === '0') {
            navigation.navigate(ScreenName.loginAuthOTPScreen, {
              trans_id: response?.response?.transid,
              mobileNo: MobileEmailAddressValue.current,
              loginType: logintypAuth,
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

  const sendOTPAPI = () => {
    setShowLoader(true);
    sendOTP({
      key: 'SEND_OTP',
      params: {type: 'sms', msisdn: '965' + mobileEmailAddress, action: 'auth'},
    })
      .then(response => {
        setShowLoader(false);
        isClicked.current = false;
        if (response != null) {
          if (response.status === '0') {
            global.transid = response.response.transid;
            navigation.navigate(ScreenName.loginOTPScreen, {
              trans_id: response.response.transid,
              mobileNo: mobileEmailAddress,
              response: {data: response.response},
            });
          } else {
            setError(response.message);
            isClicked.current = false;
          }
        }
      })
      .catch(err => {
        setShowLoader(false);
        isClicked.current = false;
      });
  };

  const valUserMobile = () => {
    setShowLoader(true);
    userValidate({
      key: 'USER_VALIDATE',
      params: {loginid: '965' + mobileEmailAddress, loginmode: 'msisdn'},
    })
      .then(response => {
        setShowLoader(false);
        isClicked.current = false;
        if (response != null) {
          if (response.status === '0') {
            if (
              response?.response?.epd === 'T' ||
              response?.response?.sfa === 'T' ||
              response?.response?.sga === 'T' ||
              response?.response?.saa === 'T'
            ) {
              navigation.navigate(ScreenName.loginOTPScreen, {
                trans_id: response.transid,
                mobileNo: mobileEmailAddress,
                response: {data: response.response},
              });
            } else {
              sendOTPAPI();
            }
          } else {
            sendOTPAPI();
          }
        } else {
          sendOTPAPI();
        }
      })
      .catch(err => {
        setShowLoader(false);
        isClicked.current = false;
      });
  };

  const fetchAPI = (email, socialtype, socoialid) => {
    setShowLoader(true);
    let params = {
      loginid: email == null ? '' : email,
      loginmode: 'email',
      socialmediatype: socialtype,
      pwd: '',
      socialid: socoialid,
      RM: '1',
    };
    socialLogin({
      key: 'SOCIAL_LOGIN',
      params: params,
    })
      .then(response => {
        setShowLoader(false);
        if (response != null) {
          if (response.status === '0') {
            consoleLog('social token id', response.response.tokenid);
            updateToken({tokenId: response.response.tokenid});
            if (response?.msisdn !== null && response?.msisdn !== undefined) {
              setMobileEmailAddress('');
              MobileEmailAddressValue.current = response?.msisdn.slice(3);
            }
            setItem(TOKEN_ID, response.response.tokenid);
            transidRef.current = response?.transid;
            global.tokenid = response.response.tokenid;
            const currTimeInMS = Date.now();
            global.UniqueToken = 't' + currTimeInMS + 'm';
            global.UniqueTokenProfile = 't' + currTimeInMS + 'm';
            setItem(LOGIN_TYPE, socialtype);
            global.authpopupdmode = socialtype;
            global.loginDeviceType = socialtype;
            setItem(SOCIAL_ID_KEY, socoialid);
            setItem(LOGGEDIN_MSISDN, response?.msisdn?.slice(3));
            setItem(SELECTED_MSISDN, response?.msisdn?.slice(3));
            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
            }, 100);
            setTimeout(() => {
              getItem(CHILDMSISDN).then(value => {
                if (value == null || value === undefined || value === '') {
                  validUserApi.mutate();
                }
              });
            }, 300);
          } else {
            setbtnname(t('supnow'));
            setpopupError(response.message);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
          }
        }
      })
      .catch(err => {
        setShowLoader(false);
      });
  };

  const valUser = () => {
    setShowLoader(true);
    userValidate({
      key: 'USER_VALIDATE',
      params: {loginid: mobileEmailAddress, loginmode: 'email'},
    })
      .then(response => {
        setShowLoader(false);
        if (response != null) {
          if (response.status === '0') {
            global.transid = response?.transid;
            navigation.navigate(ScreenName.loginPasswordScreen, {
              mobileEmailAddress,
            });
          } else {
            setbtnname(t('supnow'));
            setpopupError(response.message);
            setTimeout(() => {
              setshowModal(true);
            }, 1000);
          }
        }
      })
      .catch(err => {
        setShowLoader(false);
      });
  };

  const onDialogClose = () => {
    setshowModal(false);
    setbtnname(null);
  };

  const onTryAgainClick = () => {
    setshowModal(false);
    setbtnname(null);

    navigation.reset({
      index: 0,
      routes: [{name: ScreenName.signupScreen}],
    });
  };

  // issue with deviceinfo library
  // has notch might/might not works as many devices not in list in library
  const scrollViewBottomHeight = HAS_NOTCH ? 0 : 44;

  return (
    <ImageBackground
      {...UnitTestProps('homeindex', 'imagebackground', 'backgroundimage')}
      source={require('../../assets/bg.png')}
      style={styles.bgImage}
      imageStyle={styles.bgContainer}>
      <View
        {...UnitTestProps('homeindex', 'view', 'statusbarview')}
        style={{height: STATUS_BAR_HEIGHT}}
      />
      <ScreenHeader
        {...UnitTestProps('homeindex', 'screenheader', 'renderleftrighticon')}
        title={t('login')}
        titleStyle={styles.titleText}
        right={renderRightIcon}
        left={renderLeftIcon}
      />
      <ContainerView
        {...UnitTestProps('homeindex', 'containerview', 'maincontainerview')}>
        <ScrollView
          {...UnitTestProps('homeindex', 'scrollview', 'mainscrollview')}
          ref={_scrollLogin}
          keyboardShouldPersistTaps={'handled'}
          alwaysBounceHorizontal={false}
          alwaysBounceVertical={false}
          bounces={false}
          showsVerticalScrollIndicator={false}
          onScroll={event => {
            const scrolling = event.nativeEvent.contentOffset.y;
            if (error == '' && checkscroll) {
              setscrollpos(scrolling);
            }
          }}
          contentContainerStyle={[
            {
              height:
                SCREEN_HEIGHT -
                scrollViewBottomHeight -
                STATUS_BAR_HEIGHT * (Platform.OS === 'ios' ? 2 : 1),
            },
            styles.topContainer,
          ]}>
          <View
            {...UnitTestProps('homeindex', 'view', 'subview1')}
            style={styles.subContainer}>
            <View
              {...UnitTestProps('homeindex', 'view', 'subview2')}
              style={styles.socialLoginContainer}>
              {Platform.OS === 'ios' && isDeviceVersionMoreThan13 ? (
                <TouchableOpacity
                  {...UnitTestProps(
                    'homeindex',
                    'touchableopacity',
                    'applebuttoncicktouch'
                  )}
                  onPress={appleButtonclick}
                  activeOpacity={0.8}
                  style={styles.apple}>
                  <Image
                    {...UnitTestProps('homeindex', 'image', 'applelogoimage')}
                    style={styles.image}
                    source={require('../../assets/apple-logo.png')}
                    resizeMode={'contain'}
                  />
                  <Text
                    {...UnitTestProps('homeindex', 'text', 'appletext')}
                    style={styles.appleText}>
                    {t('cwa')}
                  </Text>
                </TouchableOpacity>
              ) : null}
              {isDeviceHuawei && !output?.hasGms ? null : (
                <TouchableOpacity
                  {...UnitTestProps(
                    'homeindex',
                    'touchableopacity',
                    'googlebutton'
                  )}
                  activeOpacity={0.8}
                  onPress={googleButtonclick}
                  style={styles.google}>
                  <Image
                    {...UnitTestProps('homeindex', 'image', 'gmaillogoimage')}
                    style={styles.image}
                    source={require('../../assets/gmail-logo.png')}
                    resizeMode={'contain'}
                  />
                  <Text
                    {...UnitTestProps('homeindex', 'text', 'googletext')}
                    style={styles.googleText}>
                    {t('cwg')}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                {...UnitTestProps(
                  'homeindex',
                  'touchableopacity',
                  'facebookbutton'
                )}
                activeOpacity={0.8}
                onPress={facebookButtonclick}
                style={styles.facebook}>
                <Image
                  {...UnitTestProps('homeindex', 'image', 'facebooklogoimage')}
                  style={styles.image}
                  source={require('../../assets/facebook-logo.png')}
                  resizeMode={'contain'}
                />
                <Text
                  {...UnitTestProps('homeindex', 'text', 'facebooktext')}
                  style={styles.fbText}>
                  {t('cwf')}
                </Text>
              </TouchableOpacity>

              {/* ========separator====== */}
              <View
                {...UnitTestProps('homeindex', 'view', 'subview3')}
                style={styles.orViewContainer}>
                <View
                  {...UnitTestProps('homeindex', 'view', 'subview4')}
                  style={styles.lineTextContainer}
                />
                <Text
                  {...UnitTestProps('homeindex', 'text', 'ortext')}
                  style={styles.orTextContainer}>
                  {t('or')}
                </Text>
                <View
                  {...UnitTestProps(
                    'homeindex',
                    'view',
                    'mobilenumberemailtextview'
                  )}
                  style={styles.lineTextContainer}
                />
              </View>

              {/* ========email textinput====== */}
              <Text
                {...UnitTestProps(
                  'homeindex',
                  'view',
                  'mobilenumberemailmaintext'
                )}
                style={styles.mobileNumberEmailTextContainer}>
                {t('mnea')}
              </Text>
              <Textinput
                {...UnitTestProps('login', 'textbox', 'loginid')}
                additionalStyle={{
                  borderColor: error ? colors.RED : colors.LIGHT_BLACK,
                }}
                autoCorrect={false}
                value={mobileEmailAddress}
                maxLength={50}
                error={error}
                imageSource={require('../../assets/warning.png')}
                onChangeText={text =>
                  validateTextInput(text.replace(/\s/g, ''))
                }
                onFocus={() => {
                  setOnclickTextFocus();
                }}
                // fontStyle={I18nManager.isRTL ? {lineHeight: FONT_30} : {}}
                onSubmitEditing={continueButtonclick}
              />
              {isprefilledDataAvailable == 'true' ? (
                <TouchableOpacity
                  {...UnitTestProps(
                    'homeindex',
                    'touchableopacity',
                    'closebuttontouch'
                  )}
                  style={styles.closeButton}
                  onPress={() => {
                    setisprefilledDataAvailable('false');
                    setMobileEmailAddress('');
                  }}>
                  <Image
                    {...UnitTestProps('homeindex', 'image', 'searchcloseimage')}
                    source={require('../../assets/searchClose.png')}
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              ) : null}
              {error ? (
                <Text
                  {...UnitTestProps('login', 'text', 'iderror')}
                  style={styles.apiError}>
                  {error}
                </Text>
              ) : null}
            </View>

            <View
              {...UnitTestProps('homeindex', 'view', 'continuebuttonview')}
              style={styles.continueViewContainer}>
              <LandingPageButton
                {...UnitTestProps('login', 'button', 'continue')}
                title={t('continue')}
                onPress={continueButtonclick}
                customStyle={styles.continueBtnContainer}
                customTextStyle={styles.continueBtnText}
              />
            </View>
          </View>
          {getGlobalSettingValue('showpacilogin') === 'T' ? (
            <View {...UnitTestProps('homeindex', 'view', 'mainviewofpaci')}>
              <View
                {...UnitTestProps('homeindex', 'view', 'subviewofpaci')}
                style={styles.text1Container}>
                <Text
                  {...UnitTestProps(
                    'homeindex',
                    'text',
                    'donthaveanaccounttext'
                  )}
                  style={styles.text4}>
                  {getGlobalSettingValue('pacirememberyournumbertext')}
                </Text>
              </View>
              <View
                {...UnitTestProps(
                  'homeindex',
                  'view',
                  'pacivalidationpagetouch'
                )}
                style={styles.text2Container}>
                <TouchableOpacity
                  {...UnitTestProps(
                    'homeindex',
                    'touchableopacity',
                    'paciisclickedtouch'
                  )}
                  style={{flexDirection: 'row', top: VERTICAL_10}}
                  onPress={() => {
                    consoleLog('PaciisClicked.current', isClicked.current);
                    consoleLog('isToNavigate.current', isToNavigate.current);
                    if (isClicked.current) {
                      return;
                    }
                    //  isToNavigate.current=true;
                    navigation.navigate(ScreenName.authStack, {
                      screen: ScreenName.PaciValidation,
                    });
                  }}>
                  <View
                    {...UnitTestProps('homeindex', 'view', 'viewofpaciimage')}
                    style={{
                      marginEnd: SCALE_SIZE_5,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image
                      {...UnitTestProps('homeindex', 'image', 'paciimageview')}
                      source={{
                        uri: getGlobalSettingValue('paciloginnumbericon'),
                      }}
                      resizeMode={'contain'}
                      style={styles.pngButton}></Image>
                  </View>
                  <View
                    {...UnitTestProps(
                      'homeindex',
                      'view',
                      'paciloginmobileidview'
                    )}
                    style={{justifyContent: 'center', alignItems: 'center'}}>
                    <Text
                      {...UnitTestProps(
                        'homeindex',
                        'text',
                        'paciloginmobileidtext'
                      )}
                      style={styles.text3}>
                      {getGlobalSettingValue('paciloginmobileidtext')}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          ) : null}
          <View
            {...UnitTestProps('homeindex', 'view', 'donthaveanaccounttextview')}
            style={[
              styles.donthaveaccViewContainer,
              {
                bottom: HAS_NOTCH
                  ? VERTICAL_30
                  : error
                  ? -VERTICAL_4
                  : VERTICAL_3,
              },
            ]}>
            <Text
              {...UnitTestProps('homeindex', 'text', 'donthaveanaaccounttext')}
              style={styles.donthaveaccTextContainer}>
              {t('dhaa')}
            </Text>
            <Text
              {...UnitTestProps('homeindex', 'text', 'donthaveanaccounttext2')}
              style={styles.donthaveaccText}
              onPress={() => {
                navigation.reset({
                  index: 0,
                  routes: [{name: ScreenName.signupScreen}],
                });
              }}>
              {t('signup').toUpperCase()}
            </Text>
          </View>
          {showloader && (
            <View
              {...UnitTestProps('homeindex', 'view', 'loadingview')}
              style={styles.loading}>
              <LoadingIndicator shouldDismissManual isVisible={showloader} />
            </View>
          )}
        </ScrollView>
      </ContainerView>
      <BottomPoppup
        {...UnitTestProps('homeindex', 'bottompopup', 'bottompopupmain')}
        type={'validuser'}
        title={ButtonTexttitle}
        visible={showValidAuth}
        message={bottomAuthDescription}
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
          {...UnitTestProps(
            'homeindex',
            'bottomauthenticationloginpopup',
            'bottomauthenticationloginpopupmain'
          )}
          visible={bottomAuthpopUp}
          type={'deviceauth'}
          onClose={() => {
            setbottomAuthpopUp(false);
          }}
          height={heightPixel(380)}
        />
      ) : null}
      <BottomPoppup
        {...UnitTestProps('homeindex', 'bottompopup', 'subbottompopup')}
        btnName={btnname}
        visible={showModal}
        message={popupError}
        onClose={onDialogClose}
        tryagainClick={onTryAgainClick}
      />
    </ImageBackground>
  );
};
const mapDispatchToProps = {
  ...actions,
};
export default connect(null, mapDispatchToProps)(Login);

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
  subContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    paddingHorizontal: APPLY_TABLET_OR_DEVICE_MARGIN,
    justifyContent: 'center',
  },
  continueViewContainer: {
    marginHorizontal: HORIZONTAL_SCALE_25,
    alignSelf: 'stretch',
  },
  titleText: {
    fontSize: FONT_14,
    lineHeight: FONT_34,
    fontFamily: OOREDOO_HEAVY_FONT,
    color: colors.BLACK,
  },
  bgContainer: {
    position: 'absolute',
    height: FULL_HEIGHT_PERCENTAGE,
    width: FULL_WIDTH_PERCENTAGE,
  },
  rightImage: {
    height: HEIGHT_30,
    width: WIDTH_30,
    // top: heightPixel(2),
    // left: -widthPixel(0.478),
    marginTop: isTablet ? VERTICAL_30 : VERTICAL_35,
    marginRight: isTablet ? HORIZONTAL_5 : -widthPixel(0.478),
  },
  backButton: {
    width: WIDTH_30,
    height: HEIGHT_40,
    marginTop: isTablet ? VERTICAL_30 : VERTICAL_35,
    marginRight: isTablet ? HORIZONTAL_5 : -widthPixel(0.478),

    // paddingTop: VERTICAL_10,
    // paddingLeft: HORIZONTAL_10,
    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  bgImage: {width: FULL_WIDTH_PERCENTAGE, height: FULL_HEIGHT_PERCENTAGE},
  socialLoginContainer: {
    marginHorizontal: HORIZONTAL_SCALE_25,
    overflow: 'hidden',
  },
  apiError: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: NOTOSANS_REGULAR_FONT,
    marginTop: VERTICAL_SCALE_5,
    color: colors.RED,
    textAlign: 'left',
  },
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
  appleText: {
    color: colors.WHITE,
    ...commonSocialTextStyle,
  },
  apple: {
    backgroundColor: colors.BLACK,
    ...commonSocialContainer,
  },
  orViewContainer: {
    flexDirection: 'row',
    marginTop: VERTICAL_SCALE_40,
    marginBottom: VERTICAL_SCALE_30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lineTextContainer: {
    backgroundColor: colors.WHITE_GREY,
    height: 0.5,
    flex: 0.45,
  },
  text1Container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2Container: {
    justifyContent: 'center',
    alignItems: 'center',
    // marginLeft: HORIZONTAL_2,
  },
  text3: {
    color: 'red',
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
  },
  text4: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_12,
    color: colors.BLACK,
  },
  pngButton: {
    width: WIDTH_25,
    height: WIDTH_25,
    paddingTop: VERTICAL_10,
    // paddingLeft: HORIZONTAL_10,
    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  orTextContainer: {
    marginHorizontal: HORIZONTAL_SCALE_10,
    textAlign: 'center',
    flex: 0.1,
    color: colors.BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    justifyContent: 'center',
    fontSize: FONT_14,
    lineHeight: FONT_24,
  },
  mobileNumberEmailTextContainer: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: OOREDOO_HEAVY_FONT,
    alignSelf: 'flex-start',
    marginBottom: VERTICAL_SCALE_10,
    color: colors.BLACK,
  },
  continueBtnContainer: {
    padding: SCALE_SIZE_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    marginVertical: VERTICAL_SCALE_20,
    borderRadius: SCALE_SIZE_25,
  },
  continueBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,
    marginVertical: VERTICAL_SCALE_5,
  },
  donthaveaccViewContainer: {
    flexDirection: 'row',
    alignSelf: 'center',
    position: 'absolute',
  },
  donthaveaccTextContainer: {
    fontSize: FONT_16,
    lineHeight: FONT_26,
    fontFamily: NOTOSANS_REGULAR_FONT,
    color: colors.BLACK,
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
  donthaveaccText: {
    color: 'red',
    fontSize: FONT_16,
    lineHeight: FONT_26,
    fontFamily: OOREDOO_HEAVY_FONT,
    paddingHorizontal: HORIZONTAL_SCALE_10,
  },
  image: {width: 25, height: 25},
  closeButton: {
    alignSelf: 'flex-end',
    bottom: heightPixel(33),
    right: widthPixel(10),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
