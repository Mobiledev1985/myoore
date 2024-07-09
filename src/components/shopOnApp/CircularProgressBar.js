import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  Animated,
  StyleSheet,
  Modal,
} from 'react-native';
import {Circle, Svg, Circle as SvgText} from 'react-native-svg';
import {widthPixel} from '../../resources/styles/normalizedimension';
import colors from '../../resources/styles/colors';
import {
  RUBIK_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_10,
  FONT_12,
  HEIGHT_15,
  WIDTH_15,
} from '../../resources/styles/responsive';
import {useMutation} from 'react-query';
import {
  callQueryapi,
  getImageHeaders,
} from '../../commonHelper/middleware/callapi.android';
import {UNRESERVE_API} from '../../resources/route/endpoints';
import {NavigateByName} from '../../services/NavigationService';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ImageComponent from '../../models/basic/ImageComponent';
import {HORIZONTAL_10} from '../../resources/styles/responsive';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {AppState} from 'react-native';
import {setItem} from '../../commonHelper/utils';
import {
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
} from '../../commonHelper/Constants';

const CircularProgressBar = ({
  radius,
  strokeWidth,
  style,
  reverseNumber,
  cartId,
  itemId,
  accountId,
  showPopup,
  type,
}) => {
  const navigation = useNavigation();
  const [isExpand, setIsExpand] = useState(false);
  const headers = getImageHeaders(global.tokenid, global.userlanguage);
  const [isLoader, setisLoader] = useState(false);
  const appState = useRef(AppState.currentState);
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0); // Start with 0 progress
  const [remainingTime, setRemainingTime] = useState(
    global.prevTime != null &&
      global.prevTime != undefined &&
      global.prevTime != ''
      ? global.prevTime
      : Math.floor(
          global.shopOnAppSettings?.planpurchaseconfigurations
            ?.number_reservation_time_in_minutes
        ) * 60
  ); // 5 minutes in seconds
  const AnimTimer = 350;
  const earlyInitTimer = 150;
  const lateInitTimer = 850;

  const circleFadeAnim = useRef(new Animated.Value(1)).current;
  const translateXValue = useRef(new Animated.Value(0)).current;
  const widthExpandAnim = useRef(new Animated.Value(widthPixel(36))).current;
  const textFadeAnim = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    React.useCallback(() => {
      setTimeout(() => {
        if (
          global.prevTime === 0 ||
          global.prevTime === undefined ||
          global.prevTime == null ||
          global.prevTime === ''
        ) {
          setisLoader(true);
          unReserveNumberApi.mutate();
        }
      }, 2000);
    }, [])
  );

  useEffect(() => {
    Animated.parallel([
      Animated.timing(circleFadeAnim, {
        toValue: isExpand ? 0 : 1,
        duration: AnimTimer,
        useNativeDriver: true,
      }),
      Animated.timing(textFadeAnim, {
        toValue: isExpand ? 1 : 0,
        duration: isExpand ? lateInitTimer : earlyInitTimer,
        useNativeDriver: true,
      }),
      Animated.timing(translateXValue, {
        toValue: isExpand ? 0 : 0,
        duration: AnimTimer,
        useNativeDriver: false,
      }),
      Animated.timing(widthExpandAnim, {
        toValue: !isExpand ? widthPixel(36) : widthPixel(105),
        duration: AnimTimer,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isExpand]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (global.shoptransactionStatus === 'completed') {
        clearInterval(interval);
        return;
      }
      setRemainingTime(prevTime => {
        if (prevTime > 0) {
          global.prevTime = prevTime;
          if (prevTime == 0) {
            setisLoader(true);
            unReserveNumberApi.mutate();
            clearInterval(interval);
          }
          return prevTime - 1;
        } else {
          global.prevTime = 0;
          setisLoader(true);
          unReserveNumberApi.mutate();
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // setmobileidstatusapiinterval(mobileidRes?.timeinterval);
      // secondsToHms(mobileidRes?.timer);
      // setmobileidretrycount(mobileidRes?.retrycount);
      const subscription = AppState.addEventListener('change', nextAppState => {
        try {
          if (
            appState.current.match(/inactive|background/) &&
            nextAppState === 'active'
          ) {
            var d = new Date();
            const diffIndays = Math.abs(d - global.progressminimizetime);
            var diffTimer = Math.round(diffIndays / 1000);
            if (diffTimer > global.progresscurrenttimer) {
              global.progressminAuthValue = 0;
              global.progresssecAuthValue = 0;
              global.prevTime = 0;
              if (global.prevTime >= 0) {
                setRemainingTime(global.prevTime);
              }
              // enableStatusApiTimer.current = false;
              // setEnableTimer(false);
              // // type = 'mobileidrequestagain';
              // getItem(MOBILEID_TIMER_STATUS).then(val => {
              //   // setmessage(
              //   //   getGlobalSettingValue('approvalrequestagainmsg').replace(
              //   //     '!MIN!',
              //   //     global.limitMin + ':' + global.limitSec
              //   //   )
              //   // );
              // });
            } else {
              var replaceTimer = global.progresscurrenttimer - diffTimer;
              replaceTimer = Number(replaceTimer);
              // var h = Math.floor(d / 3600);
              var m = Math.floor((replaceTimer % 3600) / 60);
              var s = Math.floor((replaceTimer % 3600) % 60);

              global.progressminAuthValue = m;
              if (s === 0) {
                global.progresssecAuthValue = '0' + s.toString();
              } else {
                global.progresssecAuthValue = s;
              }
              global.prevTime = global.prevTime - diffTimer;
              if (global.prevTime >= 0) {
                setRemainingTime(global.prevTime);
              }
            }
          } else {
            appState.current = nextAppState;
            global.progressminimizetime = new Date();
            var seconds = Number(global.progresssecAuthValue);
            global.progresscurrenttimer =
              global.progressminAuthValue * 60 + seconds;
          }
        } catch (error) {}
      });
    }, [])
  );

  useEffect(() => {
    setProgress(
      (Math.floor(
        global.shopOnAppSettings?.planpurchaseconfigurations
          ?.number_reservation_time_in_minutes
      ) *
        60 -
        remainingTime) /
        (Math.floor(
          global.shopOnAppSettings?.planpurchaseconfigurations
            ?.number_reservation_time_in_minutes
        ) *
          60 *
          1.34)
    ); // Calculate progress from time
  }, [remainingTime]);

  const unReserveNumberApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          UNRESERVE_API,
          {
            unreserve_msisdn: reverseNumber,
            doremovecart: 'T', //T or F
            cartid: cartId || '', //cartid from add to cart api
            itemid: itemId || '', //itemid from add to cart api
            accountid: accountId || '',
            onboardingtype: type,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setisLoader(false);
        setItem(SHOP_CART_ID, '');
        setItem(SHOP_ITEM_ID, '');
        setItem(SHOP_ACCOUNT_ID, '');
        setItem(SHOP_CART_TIME, '');
        showPopup();
        try {
          global.prevTime = null;
          if (udata?.data?.status === '0') {
          } else {
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        setisLoader(false);
        showPopup();
      },
    }
  );

  const calculateRemainingTime = () => {
    const hours = Math.floor(remainingTime / 3600);
    const minutes = Math.floor((remainingTime % 3600) / 60);
    const seconds = Math.floor(remainingTime % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={{position: 'absolute'}}
      onPress={() => {
        setIsExpand(!isExpand);
      }}>
      <Animated.View
        style={[
          style,
          {
            transform: [{translateX: translateXValue}],
          },
          {
            width: widthExpandAnim,
            backgroundColor:
              global.shopOnAppSettings?.timersettings?.timer_background,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: (radius * 2) / 2,
            borderColor:
              global.shopOnAppSettings?.timersettings?.timer_background,
          },
        ]}>
        <Animated.View
          style={[
            styles.counterIcon,
            {
              opacity: circleFadeAnim,
            },
          ]}>
          <Svg
            width={radius * 2}
            height={radius * 2}
            viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
            <Circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              fill={global.shopOnAppSettings?.timersettings?.timer_background}
              stroke={global.shopOnAppSettings?.timersettings?.timer_color}
              strokeWidth={strokeWidth}
            />
            <Circle
              cx={radius}
              cy={radius}
              r={radius - strokeWidth / 2}
              fill={global.shopOnAppSettings?.timersettings?.timer_background}
              stroke={global.shopOnAppSettings?.timersettings?.timer_background}
              strokeWidth={strokeWidth + 0.5}
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)} // Adjust here
            />
          </Svg>
        </Animated.View>
        <View style={styles.expandedParentView}>
          <View style={{paddingHorizontal: HORIZONTAL_10}}>
            <Image
              resizeMode={'contain'}
              source={{
                uri: global.shopOnAppSettings?.timersettings?.timer_icon,
                headers: headers,
              }}
              style={styles.timerStyle}
            />

            {/* <ImageComponent
              type="image"
              iwidth={widthPixel(15)}
              iheight={widthPixel(15)}
              // source={
              //   global.shopOnAppSettings?.timersettings?.timer_icon +
              //     '?tmp=' +
              //     new Date() || ''
              // }
              source={global.shopOnAppSettings?.timersettings?.timer_icon}
              resizeMode={'contain'}
            /> */}
          </View>
          <Animated.View
            style={[
              styles.textAnimView,
              {
                opacity: textFadeAnim,
              },
            ]}>
            <Text style={styles.textBoldStyle}>{calculateRemainingTime()}</Text>
            <Text style={styles.textLightStyle}>
              {' ' +
                global.shopOnAppSettings?.timersettings?.timer_left_text +
                ' '}
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      {isLoader && (
        <Modal statusBarTranslucent transparent visible={isLoader}>
          <LoadingIndicator shouldDismissManual isVisible={isLoader} />
        </Modal>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  counterIcon: {
    position: 'absolute',
    alignSelf: 'flex-end',
    transform: [{rotate: '90deg'}, {scaleX: -1}],
  },
  expandedParentView: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
  },
  textAnimView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textBoldStyle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_12,
    right: widthPixel(8),
  },
  textLightStyle: {
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_12,
    right: widthPixel(8),
  },
  timerStyle: {
    width: WIDTH_15,
    height: HEIGHT_15,
  },
});

export default CircularProgressBar;
