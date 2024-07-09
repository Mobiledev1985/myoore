import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  KeyboardAvoidingView,
  AppState,
  Animated,
} from 'react-native';
import {Provider as PaperProvider, TextInput} from 'react-native-paper';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {LandingPageButton} from '../../commonHelper/Button';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import colors from '../../resources/styles/colors';
import Toast from 'react-native-simple-toast';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
  RUBIK_REGULAR_FONT,
} from '../../resources/styles/fonts';
import {
  heightPixel,
  widthPixel,
  isTablet,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_25,
  FONT_13,
  FONT_14,
  FONT_20,
  HEIGHT_30,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_30,
  FONT_12,
  FONT_16,
  VERTICAL_40,
} from '../../resources/styles/responsive';
import {
  SHOP_SENDOTP_API,
  SHOP_VERIFYOTP_API,
} from '../../resources/route/endpoints';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {useFocusEffect} from '@react-navigation/native';

let resendOtpTimerInterval = null;
const NewSimMigrationOtpVerify = ({
  visible,
  onClose,
  transid,
  setdatacompleted,
  existingSimNumber,
  lineType,
  verifiedOTPResponse,
  type = '',
  isanaplan,
}) => {
  const [otpValue, setOtpValue] = useState('');
  const appState = useRef(AppState.currentState);
  const RESEND_OTP_TIME_LIMIT = 50; // 10 secs
  const transidValInVerify = useRef('');
  const {t} = useTranslation();
  const [textError, setTextError] = useState(false);
  const [showLoader, setshowLoader] = useState(false);
  const [textErrorMsgInVerify, setTextErrorMsgInVerify] = useState('');
  const [resendButtonDisabledTime, setResendButtonDisabledTime] = useState(
    RESEND_OTP_TIME_LIMIT
  );
  const componentGlobalData =
    global.shopOnAppSettings?.productdetailsconfigurations;
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);

  useFocusEffect(
    React.useCallback(() => {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active' &&
          global.valueReturned
        ) {
          var d = new Date();
          const diffIndays = Math.abs(d - global.minimizetime);
          var diffTimer = Math.round(diffIndays / 1000);
          if (diffTimer > global.timerInt) {
            setResendButtonDisabledTime(0);
            global.timerInt = null;
            clearInterval(resendOtpTimerInterval);
          } else {
            global.timerInt = global.timerInt - diffTimer;
            console.log('diffTimer', diffTimer);
            console.log('global.timerInt', global.timerInt);
            global.valueReturned = false;
            // global.timerInt = replaceTimer;
          }
        } else {
          appState.current = nextAppState;
          global.minimizetime = new Date();
          global.valueReturned = true;
        }
      });
    }, [visible])
  );

  useEffect(() => {
    if (visible) {
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
    } else {
      bounceValue.setValue(0);
    }
  }, [visible, bounceValue]);

  useEffect(() => {
    if (visible) {
      startResendOtpTimer();
      transidValInVerify.current = transid;
    }
    return () => {
      if (resendOtpTimerInterval) {
        clearInterval(resendOtpTimerInterval);
      }
      setOtpValue('');
      setTextError(false);
      setTextErrorMsgInVerify('');
      global.timerInt = null;
      setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    };
  }, [visible]);

  useEffect(() => {
    clearInterval(resendOtpTimerInterval);
  }, [resendButtonDisabledTime <= 0]);

  const startResendOtpTimer = () => {
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
    resendOtpTimerInterval = setInterval(() => {
      global.timerInt =
        global.timerInt != null &&
        global.timerInt != undefined &&
        global.timerInt != ''
          ? global.timerInt - 1
          : RESEND_OTP_TIME_LIMIT;
      setResendButtonDisabledTime(global.timerInt);
    }, 1000);
  };

  const handleContinue = () => {
    if (otpValue.length < 4) {
      setTextError(true);
    } else {
      setshowLoader(true);
      verifyOTP.mutate();
    }
  };

  const resendotpclick = () => {
    setOtpValue('');
    setTextError(false);
    setTextErrorMsgInVerify('');
    global.timerInt = null;
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    reSendOTP.mutate();
  };

  const modalCloseRequest = () => {
    onClose();
    setOtpValue('');
    setTextError(false);
    setTextErrorMsgInVerify('');
    global.timerInt = null;
    setResendButtonDisabledTime(RESEND_OTP_TIME_LIMIT);
    if (resendOtpTimerInterval) {
      clearInterval(resendOtpTimerInterval);
    }
  };

  const reSendOTP = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_SENDOTP_API,
          {
            msisdn: '965' + existingSimNumber,
            action: type,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setshowLoader(false);
        if (data?.data?.status === '0') {
          Toast.show(data?.data?.message);
          transidValInVerify.current = data?.data?.response?.transid;
          global.timerInt = null;
          startResendOtpTimer();
        } else {
          setTextError(true);
          setTextErrorMsgInVerify(data?.data?.message);
        }
      },
      onError: (error, variables, context) => {
        setshowLoader(false);
        console.log('Error here----', error);
      },
    }
  );

  const verifyOTP = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_VERIFYOTP_API,
          {
            transid: transidValInVerify.current,
            otp: otpValue,
            action: type,
            productlinetype: lineType,
            isanaplan: isanaplan,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setshowLoader(false);
        if (data?.data?.status === '-1' && data?.data?.iseligible === '') {
          setTextError(true);
          setTextErrorMsgInVerify(data?.data?.message);
        } else if (
          data?.data?.status === '-1' &&
          data?.data?.iseligible === 'F'
        ) {
          verifiedOTPResponse(data?.data);
        } else if (data?.data?.status === '0') {
          verifiedOTPResponse(data?.data);
        }
      },
      onError: (error, variables, context) => {
        setshowLoader(false);
        console.log('Error here----', error);
      },
    }
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        modalCloseRequest();
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          style={[styles.modalOverlay]}
          activeOpacity={1}
          onPress={() => {
            modalCloseRequest();
          }}>
          <Animated.View
            style={{
              marginBottom: -animationHeight.current,
              transform: [{translateY: bounceValue}],
            }}>
            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={1}
              style={styles.modalContent}>
              <View style={styles.topContainer}>
                <View style={{width: widthPixel(323)}}>
                  <View style={styles.borderImageContainer}>
                    <Image
                      source={require('../../assets/line_border.png')}
                      resizeMode={'contain'}
                      style={styles.borderImage}
                    />
                  </View>

                  <Text style={styles.headerText}>
                    {componentGlobalData?.sendotp_popup_title}
                  </Text>
                  <View style={styles.descriptionContainer}>
                    <Text style={styles.descriptionText}>
                      {componentGlobalData?.sendotp_popup_desc}
                    </Text>
                  </View>
                  <TextInput
                    label={''}
                    value={otpValue}
                    error={textError}
                    autoCorrect={false}
                    maxLength={4}
                    // secureTextEntry={true}
                    keyboardType="numeric"
                    onChangeText={text => {
                      const sanitizedEmail = text.replace(
                        /[`a-zA-Z@~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:.,'"<>٫\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]+/g,
                        ''
                      ); // Remove special characters
                      const normalizedEmail = sanitizedEmail.replace(
                        /\.+/g,
                        '.'
                      );
                      const spaceRemove = normalizedEmail.replace(' ', '');
                      setOtpValue(spaceRemove);
                      setTextError(
                        spaceRemove.length == 0 || spaceRemove.length == 4
                          ? false
                          : true
                      );
                      setTextErrorMsgInVerify('');
                    }}
                    style={[styles.textInput]}
                    textAlignVertical="center"
                  />
                  {(textError && otpValue.length <= 3) ||
                  (textError && textErrorMsgInVerify.length > 0) ? (
                    <Text style={styles.errorMesssage}>
                      {textErrorMsgInVerify || t('please_enter_valid_otp')}
                    </Text>
                  ) : null}
                  <View style={styles.bottomOptionView}>
                    <TouchableOpacity
                      onPress={() => {
                        setshowLoader(true);
                        resendotpclick();
                      }}
                      disabled={resendButtonDisabledTime > 0}>
                      <Text
                        style={[
                          styles.resendOtpText,
                          {
                            color:
                              resendButtonDisabledTime > 0
                                ? colors.WHITE_GREY
                                : colors.OOREDOO_RED,
                          },
                        ]}>
                        {componentGlobalData?.resend_otp}
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={[
                        styles.timerText,
                        {
                          color:
                            resendButtonDisabledTime > 0
                              ? colors.OOREDOO_RED
                              : colors.WHITE_GREY,
                        },
                      ]}>
                      {`0:${resendButtonDisabledTime} S`}
                    </Text>
                  </View>
                </View>
                <LandingPageButton
                  title={componentGlobalData?.confirm_btn}
                  disabled={otpValue.length > 3 && !textError ? false : true}
                  onPress={handleContinue}
                  customStyle={[
                    styles.continueButton,
                    {
                      backgroundColor:
                        otpValue.length > 3 && !textError
                          ? colors.OOREDOO_RED
                          : colors.OOREDDO_LIGHT_GREY,
                    },
                  ]}
                  customTextStyle={styles.continueButtonText}
                />
              </View>
              <View
                style={{
                  height: animationHeight.current,
                  backgroundColor: 'white',
                }}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
        {showLoader && (
          <Modal statusBarTranslucent transparent visible={showLoader}>
            <LoadingIndicator shouldDismissManual isVisible={showLoader} />
          </Modal>
        )}
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: 'auto',
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    alignItems: 'center',
  },
  topContainer: {
    marginTop: heightPixel(8),
    marginBottom: HEIGHT_30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  borderImageContainer: {
    alignItems: 'center',
  },
  borderImage: {
    width: widthPixel(50),
    height: heightPixel(11),
    alignItems: 'center',
  },
  headerText: {
    textAlign: 'center',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    fontWeight: '600',
    marginTop: VERTICAL_30,
  },
  textInput: {
    width: widthPixel(323),
    height: heightPixel(50),
    backgroundColor: colors.LINE_LIGHT_GRAY,
    marginBottom: VERTICAL_15,
    lineHeight: FONT_20,
    textAlign: 'center',
  },
  continueButton: {
    width: widthPixel(326),
    height: heightPixel(46),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_25,
    marginLeft: widthPixel(22),
    marginRight: widthPixel(28),
  },
  continueButtonText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_14,
    fontWeight: '600',
    color: colors.WHITE,
    fontFamily: RUBIK_SEMIBOLD_FONT,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    bottom: VERTICAL_10,
  },
  descriptionContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: VERTICAL_20,
  },
  descriptionText: {
    textAlign: 'center',
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_16,
    fontWeight: '300',
    width: widthPixel(300),
  },
  bottomOptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: VERTICAL_40,
    marginTop: VERTICAL_10,
  },
  resendOtpText: {
    textAlign: 'center',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    fontWeight: '600',
  },
  timerText: {
    textAlign: 'center',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    fontWeight: '600',
  },
});

export default NewSimMigrationOtpVerify;
