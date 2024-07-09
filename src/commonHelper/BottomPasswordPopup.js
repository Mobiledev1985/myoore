import {
  ActivityIndicator,
  Dimensions,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_15,
  BORDER_RADIUS_20,
  BORDER_RADIUS_25,
  FONT_12,
  FONT_20,
  FONT_28,
  HORIZONTAL_20,
  VERTICAL_10,
  VERTICAL_35,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_150,
  WIDTH_40,
  WIDTH_8,
} from '../resources/styles/responsive';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../resources/styles/fonts';
import React, {useEffect, useState} from 'react';
import {
  heightPixel,
  tabletMargin,
  widthPixel,
} from '../resources/styles/normalizedimension';

import CustomDialogue from './CustomDialogue';
import {FULL_WIDTH_PERCENTAGE} from './Constants';
import {LandingPageButton} from './Button';
import {RN_SENDOTP_API} from '../resources/route/endpoints';
import ScreenName from '../navigator/ScreenName';
import Textinput from '../models/basic/Textinput';
import {WINDOW_WIDTH} from '../commonHelper/utils';
import {callQueryapi} from './middleware/callapi';
import colors from '../resources/styles/colors';
import {regexPasswordTest} from '../services/CommonUtils';
import {sendOTP} from '../components/login/actions';
import {useMutation} from 'react-query';
import {useNavigation} from '@react-navigation/core';
import {useTranslation} from 'react-i18next';

const {width} = Dimensions.get('window');
// const [mobileNo, setMobileNo] = useState('');
// const [errorMobMsg, setErrorMobMsg] = useState('');
// const [validMobileNo, setValidMobileNo] = useState(false);

const BottomPasswordPopup = ({
  visible,
  message,
  onClose,
  tryagainClick,
  btnName,
  showIcon = true,
  designmode = 1,
  height = 450,
  showInfoIcon = false,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const buttonName = btnName || t('transfer');
  const [newpassError, setNewpassError] = useState('');
  const [error, setError] = useState('');
  const [showErrorModal, setshowErrorModal] = useState(false);
  const [updateLoader, setUpdateLoader] = useState(false);
  const [msg, setMsg] = useState('');

  const [newpass, setNewpass] = useState('');
  const [secureTextEntryPassword, setSecureTextEntryPassword] = useState(true);
  const cancelButtonclick = () => {
    setNewpass('');
    setError('');
    onClose();
  };

  const tryagainButtonclick = () => {
    setNewpass('');
    setTimeout(() => {
      tryagainClick(newpass);
    }, 300);
  };

  const valdatePwdText = value => {
    if (value.includes(' ')) {
      setNewpass(value.trim());
    } else {
      setNewpass(value);
      if (!value) {
        setError(t('fieldRequired'));
      } else if (value.length < 8) {
        setError(t('pmbcl'));
      } else {
        setError('');
      }
    }
  };

  const closeErrorModal = () => {
    setshowErrorModal(false);
  };
  // call sendotp api to fetch transid
  const {mutate} = useMutation(_ =>
    callQueryapi({
      queryKey: [
        'rn_sendotp',
        RN_SENDOTP_API,
        {type: 'email', email: global.emailAddress, action: 'forgotpwd'},
      ],
    })
  );

  const onForgotPassPressed = () => {
    setUpdateLoader(true);
    mutate(null, {
      onSuccess: resp => {
        setUpdateLoader(false);
        if (resp?.data?.status == '0') {
          onClose();
          navigation.navigate(ScreenName.authStack, {
            screen: ScreenName.forgotPasswordScreen,
            params: {
              trans_id: resp?.data?.response?.transid,
              email: resp?.data?.response?.email,
              id_type: resp?.data?.response?.idtype,
              fromScreen: 'profile',
            },
          });
        } else {
          setMsg(resp?.data?.message);
          setshowErrorModal(true);
        }
      },
      onError: errorRes => {
        onClose();
      },
    });
  };

  return (
    <View>
      <Modal
        transparent={true}
        visible={visible}
        animationType="slide"
        statusBarTranslucent>
        <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
          <View style={styles.backgroundViewContainer}>
            <TouchableWithoutFeedback onPress={onClose}>
              <View style={styles.container} />
            </TouchableWithoutFeedback>
            <View
              style={[styles.topViewContainer, {height: heightPixel(height)}]}>
              <View style={styles.iconContainer}>
                <Text style={styles.textContainer} ellipsizeMode={'tail'}>
                  {t('Verify')}
                </Text>
              </View>
              <View style={styles.msgContainer}>
                <Text
                  style={styles.enterPassTextContainer}
                  ellipsizeMode={'tail'}>
                  {t('enterpwd')}
                </Text>
                <Textinput
                  additionalStyle={{
                    borderColor: newpassError ? colors.RED : colors.LIGHT_BLACK,
                    // marginTop: VERTICAL_10,
                  }}
                  type="bottompassword"
                  value={newpass}
                  maxLength={20}
                  onChangeText={text => valdatePwdText(regexPasswordTest(text))}
                  onFocus={() => setNewpassError('')}
                  isFieldPassword
                  iconStyle={{
                    color: newpass ? colors.BLACK : colors.LIGHT_GREY,
                  }}
                  secureTextEntry={secureTextEntryPassword}
                  onPressIcon={() => {
                    if (newpass) {
                      setSecureTextEntryPassword(prevState => !prevState);
                    }
                  }}
                />
                {error ? (
                  <Text style={styles.errorPassword}>{error}</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.cancelButtonStyle}
                  underlayColor={colors.WHITE}
                  onPress={onForgotPassPressed}>
                  <Text style={styles.cancelButtonTxt}>
                    {t('forgotpassword')}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.buttonsViewContainerside}>
                <LandingPageButton
                  title={t('cancel')}
                  onPress={cancelButtonclick}
                  customStyle={styles.cancelBtnContainerside}
                  customTextStyle={styles.cancelBtnText}
                />
                <LandingPageButton
                  title={buttonName}
                  onPress={tryagainButtonclick}
                  customStyle={styles.tryagainBtnContainerside}
                  customTextStyle={styles.tryagainBtnText}
                />
              </View>
              <CustomDialogue
                message={msg}
                visible={showErrorModal}
                onClose={closeErrorModal}
              />
              {updateLoader === true ? (
                <View style={styles.loading}>
                  <ActivityIndicator size="large" color={colors.OOREDOO_RED} />
                </View>
              ) : null}
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
};

export default BottomPasswordPopup;

// These are user defined styles
const styles = StyleSheet.create({
  iconContainer: {
    // flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: FULL_WIDTH_PERCENTAGE,
  },
  msgContainer: {
    marginHorizontal: HORIZONTAL_20 + tabletMargin(),
    // flex: 1,
    // borderWidth: 1,
  },
  backgroundViewContainer: {
    // justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000aa',
  },
  topViewContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    height: heightPixel(500),
    backgroundColor: colors.WHITE,
    // alignItems: 'center',
    // justifyContent: 'flex-end',
    borderTopLeftRadius: BORDER_RADIUS_15,
    borderTopRightRadius: BORDER_RADIUS_15,
    // alignSelf: 'flex-end',
  },
  imageContainer: {
    width: WIDTH_40,
    height: WIDTH_40,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_20,
    lineHeight: FONT_28,
    fontFamily: OOREDOO_HEAVY_FONT,
    marginTop: VERTICAL_35,
    marginBottom: WIDTH_10,
  },
  enterPassTextContainer: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: OOREDOO_HEAVY_FONT,
    marginVertical: heightPixel(30),
    // marginBottom: WIDTH_10,
    // flex: 1,
    textAlign: 'left',
  },
  tryagainBtnContainer: {
    padding: WIDTH_10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_20,
    width: '90%',
  },
  tryagainBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,
    marginVertical: VERTICAL_5,
  },
  cancelBtnContainer: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_20,
    width: '90%',
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    // marginTop: 20,
  },
  cancelBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.OOREDOO_RED,
    marginVertical: VERTICAL_5,
  },
  buttonsViewContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    flex: 1,
  },
  buttonsViewContainerside: {
    width: WINDOW_WIDTH,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tryagainBtnContainerside: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    width: WIDTH_150,
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
  },
  cancelBtnContainerside: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_25,
    width: WIDTH_150,
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
  },
  mobileNumberTextInput: {
    // width: WIDTH_180,
    // borderColor: '#ffffff',
    // height: HEIGHT_40,
  },
  errorMesssage: {
    flexDirection: 'row',
    textAlign: 'left',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: NOTOSANS_REGULAR_FONT,
  },
  cancelButtonTxt: {
    color: colors.OOREDOO_RED,
    textAlign: 'right',
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: OOREDOO_HEAVY_FONT,
  },
  cancelButtonStyle: {
    justifyContent: 'flex-end',
    marginTop: VERTICAL_10,
  },
  errorPassword: {
    marginTop: VERTICAL_5,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.RED,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
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
});
