import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_25,
  BORDER_RADIUS_4,
  FONT_13,
  FONT_14,
  FONT_15,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_34,
  HEIGHT_30,
  HEIGHT_36,
  HEIGHT_4,
  HEIGHT_72,
  HORIZONTAL_18,
  HORIZONTAL_3,
  VERTICAL_1,
  VERTICAL_10,
  VERTICAL_100,
  VERTICAL_110,
  VERTICAL_120,
  VERTICAL_16,
  VERTICAL_20,
  VERTICAL_25,
  VERTICAL_30,
  VERTICAL_5,
  VERTICAL_50,
  WIDTH_172,
  WIDTH_30,
  WIDTH_50,
  WIDTH_8,
} from '../../resources/styles/responsive';
import {
  StyleSheet,
  View,
  Modal,
  Animated,
  I18nManager,
  AppState,
  Platform,
  Linking,
} from 'react-native';
import {
  SCREEN_WIDTH,
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import colors from '../../resources/styles/colors';
import {useTranslation} from 'react-i18next';
import TextComponent from '../basic/TextComponent';
import {useMutation, useQuery} from 'react-query';
import {
  SHOP_PACIAUTHENTICATIONSTATUS,
  SHOP_PACIHASMOBILEID,
} from '../../resources/route/endpoints';
import {GetCacheKey} from '../../services/CacheUtil';
import {
  OOREDOO_HEAVY_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {TouchableOpacity} from 'react-native';
import ImageComponent from '../basic/ImageComponent';
import {LandingPageButton} from '../../commonHelper/Button';
import LottieView from 'lottie-react-native';
import {verticalScale} from '../../commonHelper/scalingUtils';
import {useFocusEffect} from '@react-navigation/native';
import {getItem, setItem} from '../../commonHelper/utils';
import {MOBILEID_TIMER_STATUS} from '../../commonHelper/Constants';
import {getGlobalSettingValue} from '../../services/CommonUtils';
import {callQueryapi} from '../../commonHelper/middleware/callapi.ios';
import BottomSheet from '../basic/BottomSheet';
import BottomEmailVerifyDialog from '../basic/BottomEmailVerifyDialog';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {RecordlogEvents} from '../../analytics/RecordEvents';

const ShopPaciAutentication = ({
  popupText,
  onDismiss,
  visible,
  titleMsg,
  isFrom,
  buttonName,
  onTryAgainClick,
  type = '',
  mobileidRes,
  civilid,
  transid,
  onRefreshTransid,
  selectedNumberType,
}) => {
  const {t} = useTranslation();
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);
  // const [type, setType] = useState('mobileidavailable');
  const appState = useRef(AppState.currentState);
  const modelShow = useRef(false);
  const [timerText, setTimerText] = useState('0');
  const [enableTimer, setEnableTimer] = useState(false);
  const enableStatusApiTimer = useRef(false);
  const [mobileidretrycount, setmobileidretrycount] = useState(0);
  const [mobileidstatusapiinterval, setmobileidstatusapiinterval] = useState(0);
  const [transactionid, settransactionid] = useState('');
  const [declinedata, setdeclineData] = useState(null);
  const [selectedType, setSelectedType] = useState(type);
  const [openSheet, setopenSheet] = useState(false);
  const isButtonClicked = useRef(false);

  const VerifyPACICTEvent = (VerifyType, Status, statusdescription) => {
    try {
      RecordlogEvents('Verify PACI', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        VerifyType: VerifyType,
        Status: Status,
        statusdescription: statusdescription,
      });
    } catch (e) {}
  };

  const mobileIdAuthenticationStatusApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, SHOP_PACIAUTHENTICATIONSTATUS, {transid: transactionid}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          if (udata?.data?.status === '0') {
            VerifyPACICTEvent('paci', 'Success', udata?.data?.message);
            enableStatusApiTimer.current = false;
            getvalue(udata?.data?.response);
            onTryAgainClick();
            cancelButtonClick();
            setEnableTimer(false);
          } else {
            if (udata?.data?.code === '83709') {
              VerifyPACICTEvent('paci', 'Failure', udata?.data?.message);
              setdeclineData(udata?.data);
              enableStatusApiTimer.current = false;
              global.minAuthValue = 0;
              global.secAuthValue = 0;
              setEnableTimer(false);
              setSelectedType('mobileiddecline');
              global.selectedpaciType = 'mobileiddecline';
            }
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const mobileIdStatusApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_PACIHASMOBILEID,
          {
            civilid: civilid,
            otransid: transid,
            source: selectedNumberType,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        isButtonClicked.current = false;
        global.isContinueDisabled = false;
        try {
          if (udata?.data?.status === '0') {
            setSelectedType('mobileidavailable');
            global.selectedpaciType = 'mobileidavailable';
            setTimeout(() => {
              setEnableTimer(true);
            }, 1000);
            settransactionid(udata?.data?.response?.transid);
            onRefreshTransid(udata?.data?.response?.transid);
            global.EnableStatusApiTimer = true;
            enableStatusApiTimer.current = true;
            timerEnableMethod();
          } else {
            VerifyPACICTEvent('paci', 'Failure', udata?.data?.message);
            if (udata?.data?.code === '914143') {
              setSelectedType('mobileiduninstall');
              global.selectedpaciType = 'mobileiduninstall';
            } else if (udata?.data?.code === '914141') {
              setSelectedType('mobileidlow');
              global.selectedpaciType = 'mobileidlow';
            } else {
            }
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        isButtonClicked.current = false;
      },
    }
  );

  // useEffect(() => {
  //   mobileIdStatusApi.mutate();
  //   // setItem(MOBILEID_TIMER_STATUS, '');
  //   // setType('mobileidavailable');
  //   // setTimeout(() => {
  //   //   setEnableTimer(true);
  //   // }, 1000);
  //   // global.EnableStatusApiTimer = true;
  //   // setEnableStatusApiTimer(true);
  //   // timerEnableMethod();
  // }, []);
  useEffect(() => {
    Animated.sequence([
      Animated.timing(bounceValue, {
        toValue: -animationHeight.current,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(bounceValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
    if (type === 'mobileidavailable') {
      setTimeout(() => {
        setEnableTimer(true);
      }, 1000);
      settransactionid(mobileidRes?.response?.transid);
      global.EnableStatusApiTimer = true;
      enableStatusApiTimer.current = true;
      timerEnableMethod();
    }
  }, [bounceValue]);

  useFocusEffect(
    React.useCallback(() => {
      setmobileidstatusapiinterval(mobileidRes?.timeinterval);
      secondsToHms(mobileidRes?.timer);
      setmobileidretrycount(mobileidRes?.retrycount);
      global.mobileIdRetryCount = mobileidRes?.retrycount;
      // if (visible == true) {
      //   if (global.logintype === 'HE' || global.logintype === 'paci') {
      //     navigationMethod();
      //   } else {
      //     getItem('loginType').then(val => {
      //       if (val === 'he' || val === 'paci') {
      //         navigationMethod();
      //       } else {
      //         global.EnableStatusApiTimer = false;
      //         setEnablePopup(false);
      //         setEnableStatusApiTimer(false);
      //         setmobileidstatusapiinterval(
      //           getGlobalSettingValue('mobileidstatusapiinterval')
      //         );
      //         secondsToHms(getGlobalSettingValue('mobileidshowtimerlimit'));
      //         setmobileidretrycount(
      //           getGlobalSettingValue('mobileidretrycount')
      //         );
      //         setisLoader(true);
      //         userprofile.refetch();
      //       }
      //     });
      //   }
      // }
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (global.selectedpaciType === 'mobileidavailable') {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            var d = new Date();
            const diffIndays = Math.abs(d - global.minimizetime);
            var diffTimer = Math.round(diffIndays / 1000);
            if (diffTimer > global.currenttimer) {
              global.minAuthValue = 0;
              global.secAuthValue = 0;
              enableStatusApiTimer.current = false;
              setEnableTimer(false);
              // type = 'mobileidrequestagain';
              getItem(MOBILEID_TIMER_STATUS).then(val => {
                var myInt = parseInt(val);
                if (myInt <= global.mobileIdRetryCount) {
                  setSelectedType('mobileidtimeout');
                  VerifyPACICTEvent('paci', 'Failure', 'timeout');
                  global.selectedpaciType = 'mobileidtimeout';
                  // setbuttonText(
                  //   getGlobalSettingValue('approvalrequestagainbtntext')
                  // );
                  // setmessage(
                  //   getGlobalSettingValue('approvalrequestagainmsg').replace(
                  //     '!MIN!',
                  //     global.limitMin + ':' + global.limitSec
                  //   )
                  // );
                } else {
                  setSelectedType('maximumexceded');
                  global.selectedpaciType = 'maximumexceded';
                  // setmessage(getGlobalSettingValue('mobileidmaxretrymsg'));
                  // setbuttonText(t('okuper'));
                }
                // setmessage(
                //   getGlobalSettingValue('approvalrequestagainmsg').replace(
                //     '!MIN!',
                //     global.limitMin + ':' + global.limitSec
                //   )
                // );
              });
              // settitle(getGlobalSettingValue('approvalrequestagaintitle'));
              // setimagepath(getGlobalSettingValue('approvalrequestagainicon'));
              // setbuttonText(getGlobalSettingValue('approvalrequestagainbtntext'));
            } else {
              var replaceTimer = global.currenttimer - diffTimer;
              replaceTimer = Number(replaceTimer);
              // var h = Math.floor(d / 3600);
              var m = Math.floor((replaceTimer % 3600) / 60);
              var s = Math.floor((replaceTimer % 3600) % 60);

              global.minAuthValue = m;
              if (s === 0) {
                global.secAuthValue = '0' + s.toString();
              } else {
                global.secAuthValue = s;
              }
              if (isNaN(m)) {
                secondsToHms(mobileidRes?.timer);
                setTimeout(() => {
                  setTimerText(global.limitMin + ':' + global.limitSec);
                }, 1000);
              } else {
                setTimerText(m + ':' + s);
              }
            }
          } else {
            appState.current = nextAppState;
            global.minimizetime = new Date();
            var seconds = Number(global.secAuthValue);
            global.currenttimer = global.minAuthValue * 60 + seconds;
          }
        }
      });
    }, [visible])
  );

  function secondsToHms(d) {
    d = Number(d);
    // var h = Math.floor(d / 3600);
    var m = Math.floor((d % 3600) / 60);
    var s = Math.floor((d % 3600) % 60);

    global.limitMin = m;
    if (s === 0) {
      global.limitSec = 0 + s.toString();
    } else {
      global.limitSec = s;
    }
  }

  const getvalue = metaData => {
    try {
      if (metaData != null && metaData != undefined) {
        if (global.userlanguage != 'en') {
          let firstNameValue = metaData?.Meta.filter(
            x => x?.key === 'FirstNameEn'
          );
          let lastNameValue = metaData?.Meta.filter(
            x => x?.key === 'LastNameEn'
          );
          let governorateValue = metaData?.Meta.filter(
            x => x?.key === 'Governate'
          );
          let areaValue = metaData?.Meta.filter(x => x?.key === 'Area');
          let nationalityValue = metaData?.Meta.filter(
            x => x?.key === 'NationalityEn'
          );
          let streetValue = metaData?.Meta.filter(x => x?.key === 'StreetName');
          // global.ShopOnAPPAddressObj['firstName'] = firstNameValue[0]?.value;
          // global.ShopOnAPPAddressObj['lastName'] = lastNameValue[0]?.value;
          // global.ShopOnAPPAddressObj['governorate'] = '';
          // global.ShopOnAPPAddressObj['area'] = '';
          // global.ShopOnAPPAddressObj['nationality'] =
          //   nationalityValue[0]?.value;
          // global.ShopOnAPPAddressObj['street'] = '';
          global.ShopOnAPPAddressObj = {
            ...global.ShopOnAPPAddressObj,
            firstName: firstNameValue[0]?.value || '',
            lastName: lastNameValue[0]?.value || '',
            nationality: nationalityValue[0]?.value || '',
          };
        } else {
          let firstNameValue = metaData?.Meta.filter(
            x => x?.key === 'FirstNameEn'
          );
          let lastNameValue = metaData?.Meta.filter(
            x => x?.key === 'LastNameEn'
          );
          let governorateValue = metaData?.Meta.filter(
            x => x?.key === 'Governate'
          );
          let areaValue = metaData?.Meta.filter(x => x?.key === 'Area');
          let nationalityValue = metaData?.Meta.filter(
            x => x?.key === 'NationalityEn'
          );
          let streetValue = metaData?.Meta.filter(x => x?.key === 'StreetName');
          global.ShopOnAPPAddressObj = {
            ...global.ShopOnAPPAddressObj,
            firstName: firstNameValue[0]?.value || '',
            lastName: lastNameValue[0]?.value || '',
            nationality: nationalityValue[0]?.value || '',
          };
          // global.ShopOnAPPAddressObj['firstName'] = firstNameValue[0]?.value;
          // global.ShopOnAPPAddressObj['lastName'] = lastNameValue[0]?.value;
          // global.ShopOnAPPAddressObj['governorate'] = '';
          // global.ShopOnAPPAddressObj['area'] = '';
          // global.ShopOnAPPAddressObj['nationality'] =
          //   nationalityValue[0]?.value;
          // global.ShopOnAPPAddressObj['street'] = '';
        }
      }
    } catch (error) {}
  };

  const timerEnableMethod = () => {
    getItem(MOBILEID_TIMER_STATUS).then(val => {
      var myInt = parseInt(val);
      if (val == null || val == undefined || val == '' || myInt == 1) {
        const num = 2; //> type number 123
        const str = num.toString();
        setItem(MOBILEID_TIMER_STATUS, str);
        global.minAuthValue = global.limitMin;
        global.secAuthValue = global.limitSec;
        if (isNaN(global.limitMin)) {
          secondsToHms(mobileidRes?.timer);
          setTimeout(() => {
            setTimerText(global.limitMin + ':' + global.limitSec);
          }, 1000);
        } else {
          setTimerText(global.limitMin + ':' + global.limitSec);
        }
      } else if (myInt <= mobileidretrycount) {
        const num = myInt + 1; //> type number 123
        const str = num.toString();
        setItem(MOBILEID_TIMER_STATUS, str);
        global.minAuthValue = global.limitMin;
        global.secAuthValue = global.limitSec;
        if (isNaN(global.limitMin)) {
          secondsToHms(mobileidRes?.timer);
          setTimeout(() => {
            setTimerText(global.limitMin + ':' + global.limitSec);
          }, 1000);
        } else {
          setTimerText(global.limitMin + ':' + global.limitSec);
        }
      } else {
        setEnableTimer(false);
        cancelButtonClick();
      }
    });
  };

  React.useEffect(() => {
    try {
      if (enableTimer === true) {
        const timerId = setInterval(() => {
          if (global.secAuthValue == 0) {
            if (
              global.minAuthValue == 0 &&
              (global.secAuthValue === '00' || global.secAuthValue == 0)
            ) {
              enableStatusApiTimer.current = false;
              global.minAuthValue = 0;
              global.secAuthValue = 0;
              setEnableTimer(false);
              // setType('mobileidrequestagain');
              getItem(MOBILEID_TIMER_STATUS).then(val => {
                var myInt = parseInt(val);
                if (myInt <= mobileidretrycount) {
                  VerifyPACICTEvent('paci', 'Failure', 'timeout');
                  setSelectedType('mobileidtimeout');
                  global.selectedpaciType = 'mobileidtimeout';
                  // setbuttonText(
                  //   getGlobalSettingValue('approvalrequestagainbtntext')
                  // );
                  // setmessage(
                  //   getGlobalSettingValue('approvalrequestagainmsg').replace(
                  //     '!MIN!',
                  //     global.limitMin + ':' + global.limitSec
                  //   )
                  // );
                } else {
                  setSelectedType('maximumexceded');
                  global.selectedpaciType = 'maximumexceded';
                  // setmessage(getGlobalSettingValue('mobileidmaxretrymsg'));
                  // setbuttonText(t('okuper'));
                }
              });
              // settitle(getGlobalSettingValue('approvalrequestagaintitle'));
              // setimagepath(getGlobalSettingValue('approvalrequestagainicon'));
            } else {
              global.minAuthValue = global.minAuthValue - 1;
              global.secAuthValue = 59;
            }
          } else {
            if (global.secAuthValue < 1) {
              global.secAuthValue = 0;
            } else if (global.secAuthValue < 11) {
              global.secAuthValue = '0' + (global.secAuthValue - 1).toString();
            } else {
              global.secAuthValue = global.secAuthValue - 1;
            }
          }
          if (isNaN(global.minAuthValue)) {
            secondsToHms(mobileidRes?.timer);
            setTimeout(() => {
              setTimerText(global.limitMin + ':' + global.limitSec);
            }, 1000);
          } else {
            var title = global.minAuthValue + ':' + global.secAuthValue;
            setTimerText(title);
          }
        }, 1000);
        return () => {
          clearInterval(timerId);
        };
      }
    } catch (error) {}
  }, [timerText, enableTimer]);

  React.useEffect(() => {
    try {
      if (enableStatusApiTimer.current === true) {
        const timerId = setInterval(() => {
          mobileIdAuthenticationStatusApi.mutate();
        }, mobileidstatusapiinterval * 1000);
        return () => {
          clearInterval(timerId);
        };
      }
    } catch (error) {}
  }, [enableStatusApiTimer.current]);
  const navigationMethod = () => {};

  const continueButtonClick = () => {
    if (
      (selectedType === 'mobileidtimeout' && isButtonClicked.current == true) ||
      selectedType === 'mobileiddecline'
    ) {
      mobileIdStatusApi.mutate();
    } else {
      if (Platform.OS === 'android') {
        Linking.openURL(
          'https://play.google.com/store/apps/details?id=kw.gov.paci.PACIMobileID'
        );
      } else {
        Linking.openURL('https://itunes.apple.com/app/id1449712307');
      }
    }
  };

  const cancelButtonClick = () => {
    try {
      onDismiss();
    } catch (error) {}
  };

  const closePopup = () => {
    setopenSheet(false);
  };

  return (
    <Modal visible={true} transparent>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          // onDismiss();
        }}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity as needed
        }}>
        <View style={styles.modal}>
          {/* <TouchableWithoutFeedback> */}
          <Animated.View
            style={{
              marginBottom: -animationHeight.current - heightPixel(30),
              transform: [{translateY: bounceValue}],
            }}>
            <>
              <TouchableOpacity
                activeOpacity={1}
                style={
                  selectedType === 'mobileidavailable' ||
                  selectedType === 'mobileidtimeout'
                    ? [
                        styles.modalInner,
                        {
                          maxHeight: I18nManager.isRTL
                            ? heightPixel(490)
                            : heightPixel(450),
                          flex: 1,
                        },
                      ]
                    : styles.modalDeclineInner
                }>
                <View style={styles.topView}>
                  <View style={styles.lineView} />
                </View>
                {selectedType === 'mobileidavailable' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIConnectArabic.json')
                          : require('../../../src/assets/PACIConnect.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={mobileidRes?.message}
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={mobileidRes?.infomsg}
                      lines={3}
                      type="text"
                    />
                    <View style={styles.timerView}>
                      <ImageComponent
                        type="image"
                        iwidth={widthPixel(15)}
                        iheight={widthPixel(15)}
                        source={mobileidRes?.timericon}
                        resizeMode={'contain'}
                        style={{right: HORIZONTAL_3, bottom: VERTICAL_1}}
                      />
                      <TextComponent
                        style={styles.timerText}
                        data={timerText}
                        lines={1}
                        type="text"
                      />
                      <TextComponent
                        style={styles.leftText}
                        data={' ' + mobileidRes?.timerlefttext + ' '}
                        lines={1}
                        type="text"
                      />
                    </View>
                    <View style={styles.cancelButtonView}>
                      <LandingPageButton
                        title={mobileidRes?.buttontext}
                        onPress={() => {
                          continueButtonClick();
                        }}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                    <View
                      style={{
                        top: VERTICAL_120,
                      }}>
                      <LandingPageButton
                        title={mobileidRes?.canceltext}
                        onPress={cancelButtonClick}
                        customStyle={styles.cancelBtnContainerside}
                        customTextStyle={styles.cancelButtonText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : selectedType === 'mobileidtimeout' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIErrorArabic.json')
                          : require('../../../src/assets/PACIError.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={mobileidRes?.timeoutpopup?.title}
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={mobileidRes?.timeoutpopup?.desc}
                      lines={3}
                      type="text"
                    />
                    <View style={styles.timeoutTimerView}>
                      <ImageComponent
                        type="image"
                        iwidth={widthPixel(15)}
                        iheight={widthPixel(15)}
                        source={mobileidRes?.timeoutpopup?.url}
                        resizeMode={'contain'}
                        style={{right: HORIZONTAL_3, bottom: VERTICAL_1}}
                      />
                      <TextComponent
                        style={styles.timerText}
                        data={mobileidRes?.timeoutpopup?.timeouttext}
                        lines={1}
                        type="text"
                      />
                    </View>
                    <View style={styles.cancelButtonView}>
                      <LandingPageButton
                        title={mobileidRes?.timeoutpopup?.buttontext}
                        onPress={() => {
                          isButtonClicked.current = true;
                          continueButtonClick();
                        }}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                    <View
                      style={{
                        top: VERTICAL_120,
                      }}>
                      <LandingPageButton
                        title={mobileidRes?.timeoutpopup?.canceltext}
                        onPress={cancelButtonClick}
                        customStyle={styles.cancelBtnContainerside}
                        customTextStyle={styles.cancelButtonText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : selectedType === 'mobileiddecline' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIErrorArabic.json')
                          : require('../../../src/assets/PACIError.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={declinedata?.message}
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={declinedata?.infomsg}
                      lines={3}
                      type="text"
                    />
                    <View
                      style={{
                        top: verticalScale(60),
                      }}>
                      <LandingPageButton
                        title={declinedata?.buttontext}
                        onPress={() => {
                          continueButtonClick();
                        }}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                    <View style={styles.cancelButtonView}>
                      <LandingPageButton
                        title={declinedata?.canceltext}
                        onPress={cancelButtonClick}
                        customStyle={styles.cancelBtnContainerside}
                        customTextStyle={styles.cancelButtonText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : selectedType === 'maximumexceded' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIErrorArabic.json')
                          : require('../../../src/assets/PACIError.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={
                        mobileidRes?.maxexceded?.title ||
                        getGlobalSettingValue('approvalrequestagaintitle')
                      }
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={
                        mobileidRes?.maxexceded?.desc ||
                        getGlobalSettingValue('mobileidmaxretrymsg')
                      }
                      lines={3}
                      type="text"
                    />
                    <View
                      style={[
                        styles.cancelButtonView,
                        {
                          top: verticalScale(60),
                        },
                      ]}>
                      <LandingPageButton
                        title={
                          mobileidRes?.maxexceded?.canceltext || t('okuper')
                        }
                        onPress={cancelButtonClick}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : selectedType === 'mobileiduninstall' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIErrorArabic.json')
                          : require('../../../src/assets/PACIError.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={mobileidRes?.message}
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={mobileidRes?.infomsg}
                      lines={3}
                      type="text"
                    />
                    <View
                      style={{
                        top: verticalScale(60),
                      }}>
                      <LandingPageButton
                        title={mobileidRes?.buttontext}
                        onPress={() => {
                          continueButtonClick();
                        }}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                    <View style={styles.cancelButtonView}>
                      <LandingPageButton
                        title={mobileidRes?.canceltext}
                        onPress={cancelButtonClick}
                        customStyle={styles.cancelBtnContainerside}
                        customTextStyle={styles.cancelButtonText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : selectedType === 'mobileidlow' ? (
                  <View style={styles.subView}>
                    <LottieView
                      source={
                        I18nManager.isRTL
                          ? require('../../../src/assets/PACIErrorArabic.json')
                          : require('../../../src/assets/PACIError.json')
                      }
                      autoPlay
                      loop
                      style={styles.lottieView}
                    />
                    <TextComponent
                      style={styles.title}
                      data={mobileidRes?.message}
                      lines={2}
                      type="text"
                    />
                    <TextComponent
                      style={styles.desc}
                      data={mobileidRes?.infomsg}
                      lines={3}
                      type="text"
                    />
                    <View
                      style={{
                        top: verticalScale(60),
                      }}>
                      <LandingPageButton
                        title={mobileidRes?.buttontext}
                        onPress={() => {
                          continueButtonClick();
                        }}
                        customStyle={styles.tryagainBtnContainerside}
                        customTextStyle={styles.tryagainBtnText}
                        numberOfLines={1}
                      />
                    </View>
                    <View style={styles.cancelButtonView}>
                      <LandingPageButton
                        title={mobileidRes?.canceltext}
                        onPress={cancelButtonClick}
                        customStyle={styles.cancelBtnContainerside}
                        customTextStyle={styles.cancelButtonText}
                        numberOfLines={1}
                      />
                    </View>
                  </View>
                ) : (
                  <></>
                )}
              </TouchableOpacity>
              <View
                style={{
                  height: animationHeight.current,
                  backgroundColor: colors.WHITE,
                }}
              />
            </>
            <BottomSheet
              enableTouchDismiss
              isOpen={openSheet}
              onClose={closePopup}
              openFlex={1}>
              <BottomEmailVerifyDialog
                message={''}
                title={t('verification_successful')}
                btnName={''}
                bottonclosetext={''}
                deactivate_icon={null}
                designmode={2}
                tryagainClick={() => {}}
                onClose={closePopup}
              />
            </BottomSheet>
          </Animated.View>
          {/* </TouchableWithoutFeedback> */}
        </View>
        {mobileIdStatusApi.isLoading && (
          <LoadingIndicator
            shouldDismissManual
            isVisible={mobileIdStatusApi.isLoading}
          />
        )}
      </TouchableOpacity>
    </Modal>
  );
};
export default React.memo(ShopPaciAutentication);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInner: {
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    shadowRadius: 6,
    width: SCREEN_WIDTH,
    elevation: 4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: I18nManager.isRTL ? heightPixel(394) : heightPixel(384),
    paddingBottom: HEIGHT_30,
  },
  modalDeclineInner: {
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    shadowRadius: 6,
    width: SCREEN_WIDTH,
    elevation: 4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    maxHeight: I18nManager.isRTL ? heightPixel(420) : heightPixel(400),
    flex: 1,
    paddingBottom: HEIGHT_30,
  },
  topView: {height: HEIGHT_36, alignItems: 'center'},
  lineView: {
    width: WIDTH_50,
    borderRadius: BORDER_RADIUS_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    height: HEIGHT_4,
    top: VERTICAL_16,
  },
  loading: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    borderTopLeftRadius: BORDER_RADIUS_10,
    borderTopRightRadius: BORDER_RADIUS_10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  title: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    lineHeight: I18nManager.isRTL ? FONT_34 : FONT_24,
    textAlign: 'center',
    top: VERTICAL_10,
  },
  desc: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_15,
    textAlign: 'center',
    top: VERTICAL_25,
  },
  timerText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_15,
  },
  leftText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_15,
  },
  tryagainBtnContainerside: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    width: SCREEN_WIDTH - WIDTH_30,
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
  },
  tryagainBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_22,
    color: colors.WHITE,
    marginVertical: VERTICAL_5,
  },
  cancelBtnContainerside: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SCREEN_WIDTH - WIDTH_30,
  },
  cancelButtonText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_22,
    color: colors.LIGHT_GREY,
    marginVertical: VERTICAL_5,
    textDecorationLine: 'underline',
  },
  lottieView: {
    alignSelf: 'center',
    height: HEIGHT_72,
    width: WIDTH_172,
    // transform: [{rotateY: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  timerView: {
    backgroundColor: colors.LIGHT_BACK_YELLOW,
    top: VERTICAL_50,
    flexDirection: 'row',
    width: widthPixel(132),
    height: heightPixel(37),
    alignSelf: 'center',
    borderRadius: heightPixel(41),
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeoutTimerView: {
    backgroundColor: colors.LIGHT_PINK,
    top: VERTICAL_50,
    flexDirection: 'row',
    width: widthPixel(132),
    height: heightPixel(37),
    alignSelf: 'center',
    borderRadius: heightPixel(41),
    alignItems: 'center',
    justifyContent: 'center',
  },
  subView: {
    marginHorizontal: HORIZONTAL_18,
  },
  cancelButtonView: {
    top: verticalScale(80),
  },
});
