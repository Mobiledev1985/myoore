import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
  Animated,
  TouchableHighlight,
} from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {LandingPageButton} from '../../commonHelper/Button';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_REGULAR_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_LIGHT_FONT,
} from '../../resources/styles/fonts';
import {
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_22,
  BORDER_RADIUS_25,
  BORDER_RADIUS_5,
  BORDER_RADIUS_2,
  FONT_13,
  FONT_14,
  FONT_20,
  HEIGHT_30,
  HORIZONTAL_10,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_30,
  WIDTH_1,
  WIDTH_2,
  WIDTH_15,
  WIDTH_20,
  HEIGHT_15,
  HEIGHT_20,
  FONT_10,
  WIDTH_18,
  HEIGHT_18,
  FONT_12,
  VERTICAL_5,
  VERTICAL_200,
  FONT_30,
  WIDTH_10,
  HORIZONTAL_30,
  HORIZONTAL_5,
  HORIZONTAL_25,
  HORIZONTAL_2,
  VERTICAL_2,
  FONT_16,
  HORIZONTAL_12,
  FONT_32,
  WIDTH_3,
  FONT_24,
  FONT_37,
  WIDTH_6,
  FONT_28,
  FONT_11,
  FONT_8,
} from '../../resources/styles/responsive';
import ImageComponent from '../basic/ImageComponent';
import {GetMobileNo} from '../../services/CommonUtils';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {RecordlogEvents} from '../../analytics/RecordEvents';

const BottomContactDetails = ({
  visible,
  onClose,
  isFrom,
  response,
  productInfo,
  onContactNumberChange,
  BottomContactDetailsData,
  contactNumber,
  contactinfoNumber,
  contactinfoEmail,
}) => {
  const {t} = useTranslation();
  const [text, setText] = React.useState(
    GetMobileNo(global.userdetails?.msisdn) ||
      GetMobileNo(global.customerprofile?.Msisdn) ||
      ''
  );
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [textEmail, setTextEmail] = React.useState(
    global.userdetails?.email || ''
  );
  const emailInputRef = useRef(null);
  const [emailError, setEmailError] = useState('');
  const [iconName, setIconName] = useState('check-square');
  const [checked, setChecked] = useState(false);
  const [textError, setTextError] = useState(false);
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [emailExistConfirm, setemailExistConfirm] = useState(false);
  const [keyboardShow, setKeyboardShow] = React.useState();
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);
  const isFocused = useIsFocused();
  const contact_details_points =
    BottomContactDetailsData?.contact_details_points != null &&
    BottomContactDetailsData?.contact_details_points != undefined &&
    BottomContactDetailsData?.contact_details_points != '' &&
    BottomContactDetailsData?.contact_details_points.split(',');

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.OOREDDO_GREY,
      text: colors.BLACK,
      // borderRadius: 1,
      backgroundColor: colors.WHITE,
      // error: '#B00020',
      fontSize: FONT_13,
      validBorder: 'green',
    },
  };

  const toggleDetails = () => {
    setIsDetailsVisible(!isDetailsVisible);
  };

  React.useEffect(() => {
    if (
      global.contactwhatsapp != null &&
      global.contactwhatsapp != undefined &&
      global.contactwhatsapp == true
    ) {
      try {
        selectedCheck();
      } catch (e) {}
    }
  }, []);

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
  React.useEffect(() => {
    try {
      setText(
        global.contactdetailsAutoPopuplate != null &&
          global.contactdetailsAutoPopuplate != undefined &&
          global.contactdetailsAutoPopuplate == 'true'
          ? contactinfoNumber
          : contactinfoNumber ||
              global.contactNumber ||
              GetMobileNo(global.userdetails?.msisdn) ||
              GetMobileNo(global.customerprofile?.Msisdn) ||
              ''
      );
      setTextEmail(
        global.contactdetailsAutoPopuplate != null &&
          global.contactdetailsAutoPopuplate != undefined &&
          global.contactdetailsAutoPopuplate == 'true'
          ? contactinfoEmail
          : contactinfoEmail ||
              global.userdetails?.email ||
              global.contactinfoEmail ||
              ''
      );
    } catch (error) {}
  }, [visible]);

  const validateEmail = text => {
    setTextEmail(text);
    if (text != '') {
      if (emailRegex.test(text)) {
        setEmailError('');
      } else {
        setEmailError(t('peve'));
      }
    } else {
      setEmailError('');
    }
  };

  const contactDetailsCTEvent = (contactnumber, email, whatsappstatus) => {
    try {
      RecordlogEvents('Contact details', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Contact Number': contactnumber,
        'Contact Email': email,
        'Optin whatsApp': whatsappstatus ? 'Yes' : 'No',
      });
    } catch (e) {}
  };

  const handleContinue = () => {
    if (text.length < 8 || (text.length > 8 && text.length < 11)) {
      setTextError(true);
    }
    // else if (!checked) {
    //   Alert.alert(
    //     'Alert',
    //     'Please click the checkbox to agree',
    //     [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
    //     { cancelable: false }
    //   );
    // }
    else {
      if (!emailError) {
        if (textEmail != '') {
          global.emailExistConfirm = textEmail;
          setemailExistConfirm(true);
        }
        onContactNumberChange(text, textEmail, checked);
        global.contactdetailsAutoPopuplate = 'true';
        contactDetailsCTEvent(text, textEmail, checked);
        onClose();
      }
    }
  };

  const selectedCheck = () => {
    if (
      global.contactwhatsapp != null &&
      global.contactwhatsapp != undefined &&
      global.contactwhatsapp == true
    ) {
      setChecked(global.contactwhatsapp);
    } else {
      setChecked(!checked);
    }
  };

  const checkboxBackgroundStyle = {
    width: WIDTH_15,
    height: WIDTH_15,
    borderRadius: 2,
    borderWidth: WIDTH_2,
    borderColor: checked ? colors.OOREDDO_CHECKBOX_BLUE : colors.OOREDDO_GREY,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: checked ? colors.OOREDDO_CHECKBOX_BLUE : 'transparent', // Background color based on the checked state
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        // onClose();
      }}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <TouchableOpacity
          style={[styles.modalOverlay]}
          activeOpacity={1}
          onPress={() => {
            if (emailError) {
              setTextEmail('');
              global.contactinfoEmail = null;
            }
            if (
              emailInputRef.current &&
              !emailExistConfirm &&
              (global.emailExistConfirm == null ||
                global.emailExistConfirm == undefined ||
                global.emailExistConfirm == '')
            ) {
              setTextEmail('');
            } else {
              setTextEmail(global.emailExistConfirm);
            }
            if (textError) {
              setText('');
            }
            if (contactNumber == '') {
              setTextEmail('');
              setText('');
            }
            setEmailError('');
            // setText('');
            setTextError('');
            // onContactNumberChange(text, textEmail, checked);
            onClose();
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
                <View style={styles.innerContainer}>
                  <View>
                    <TouchableOpacity
                      activeOpacity={0.5}
                      style={styles.borderImageContainer}
                      onPress={() => {
                        onClose();
                      }}>
                      <Image
                        source={require('../../assets/line_border.png')}
                        resizeMode={'contain'}
                        style={styles.borderImage}
                      />
                    </TouchableOpacity>

                    <Text style={styles.headerText}>
                      {BottomContactDetailsData?.contact_details}
                    </Text>

                    <View style={{marginHorizontal: HORIZONTAL_12}}>
                      <TextInput
                        label={
                          <Text
                            style={{
                              fontFamily: RUBIK_LIGHT_FONT,
                              fontWeight: '300',
                              fontSize: FONT_13,
                            }}>
                            {BottomContactDetailsData?.contact_details}
                          </Text>
                        }
                        mode="outlined"
                        value={text}
                        error={textError}
                        maxLength={11}
                        // helperText={
                        //   textError
                        //     ? 'Contact number must be 8 digits'
                        //     : 'Please Enter Valid 8 digit number'
                        // }
                        // error={text.length !== 8}
                        // helperText={text.length !== 8 ? 'Contact number must be 8 digits' : ''}
                        keyboardType="numeric"
                        onChangeText={text => {
                          // const sanitizedEmail = text.replace(
                          //   /[`a-zA-Z@~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'"<>\{\}\[\]\\\/]+/g,
                          //   ''
                          // ); // Remove special characters
                          // const normalizedEmail = sanitizedEmail.replace(
                          //   /\.+/g,
                          //   '.'
                          // );
                          // const spaceRemove = normalizedEmail.replace(' ', '');
                          // setText(spaceRemove);
                          // setTextError(text.length > 0 && text.length < 8);
                          const sanitizedInput = text.replace(/[^\d]+/g, ''); // Remove non-numeric characters
                          setText(sanitizedInput);
                          if (
                            sanitizedInput.length < 8 ||
                            (sanitizedInput.length > 8 &&
                              sanitizedInput.length < 11)
                          ) {
                            setTextError(true);
                          } else setTextError(false);
                        }}
                        style={[
                          styles.textInput,
                          // text.length < 11 && styles.validTextInput,
                        ]}
                        outlineColor={
                          text.length >= 8
                            ? colors.SKYLIGHT_BLUE
                            : colors.OOREDDO_GREY
                        }
                        theme={{
                          colors: {
                            ...theme.colors,
                            // placeholder:
                            //   text.length >= 8
                            //     ? colors.SKYLIGHT_BLUE
                            //     : colors.OOREDDO_GREY,
                            // primary:
                            //   text.length >= 8
                            //     ? colors.SKYLIGHT_BLUE
                            //     : colors.OOREDDO_GREY,
                            error: textError
                              ? theme.colors.error
                              : 'transparent',
                          },
                          fonts: {
                            regular: {
                              fontFamily: RUBIK_REGULAR_FONT,
                              fontSize: FONT_16,
                              fontWeight: '400',
                            },
                          },
                        }}
                        textAlignVertical="center"
                        // onChangeText={text => setText(text)}
                        // style={styles.textInput}
                      />
                      {textError && (text.length < 8 || text.length > 8) ? (
                        <Text style={styles.errorMesssage}>{t('peavmn')}</Text>
                      ) : null}
                      <TextInput
                        label={
                          <Text
                            style={{
                              fontFamily: RUBIK_LIGHT_FONT,
                              fontWeight: '300',
                              fontSize: FONT_13,
                            }}>
                            {BottomContactDetailsData?.enter_email}
                          </Text>
                        }
                        mode="outlined"
                        ref={emailInputRef}
                        value={textEmail}
                        numberOfLines={3}
                        maxLength={50}
                        error={!!emailError}
                        onChangeText={text => {
                          //global.emailExistConfirm = null;
                          const sanitizedEmail = text.replace(
                            /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'"<>\{\}\[\]\\\/]+/g,
                            ''
                          ); // Remove special characters
                          const normalizedEmail = sanitizedEmail.replace(
                            /\.+/g,
                            '.'
                          );
                          const spaceRemove = normalizedEmail.replace(' ', '');
                          validateEmail(spaceRemove);
                        }}
                        theme={{
                          fonts: {
                            regular: {
                              fontFamily: RUBIK_REGULAR_FONT,
                              fontSize: FONT_16,
                              fontWeight: '400',
                            },
                          },
                        }}
                        style={styles.textInput}
                      />

                      <Text style={styles.errorMesssage}>{emailError}</Text>
                    </View>

                    <View style={styles.whatsappContainer}>
                      <View
                        style={{
                          flexDirection: 'row',
                          width: '50%',
                          alignItems: 'center',
                        }}>
                        <TouchableHighlight
                          style={styles.checkBoxTouchEffect}
                          underlayColor={colors.OOREDDO_CHECKBOX_BLUE_UNDERLEY}
                          onPress={() => selectedCheck()}>
                          <View
                            style={[
                              // styles.checkboxBackground,
                              checkboxBackgroundStyle,
                            ]}>
                            {checked && (
                              <IconFA
                                name="check"
                                size={isTablet ? 18 : 12}
                                color={colors.WHITE}
                              />
                            )}
                          </View>
                        </TouchableHighlight>
                        <Text style={styles.whatsappText} numberOfLines={1}>
                          {BottomContactDetailsData?.whatsapp_confirm_text}
                        </Text>
                        <Image
                          source={require('../../assets/group_whatsapp.png')}
                          resizeMode={'contain'}
                          style={styles.whatsappIcon}
                        />
                      </View>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          position: 'absolute',
                          right: WIDTH_10,
                        }}>
                        <TouchableOpacity onPress={toggleDetails}>
                          <Text style={styles.viewDetailsText}>
                            {BottomContactDetailsData?.viewdetails_text}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      {/* <TouchableOpacity
                      style={styles.checkboxContainer}
                      onPress={() => setChecked(!checked)}>
                      <View
                        style={[
                          styles.checkboxBackground,
                          checkboxBackgroundStyle,
                        ]}>
                        {checked && (
                          <IconFA
                            name="check"
                            size={isTablet ? 20 : 12}
                            color={colors.WHITE}
                          />
                        )}
                      </View>
                    </TouchableOpacity> */}

                      {/* <View
                      style={{
                        flexDirection: 'row',
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      <Text style={styles.whatsappText}>
                        {BottomContactDetailsData?.whatsapp_confirm_text}
                      </Text>
                      <ImageComponent
                        type="image"
                        iwidth={WIDTH_18}
                        iheight={HEIGHT_18}
                        source={
                          BottomContactDetailsData?.contact_number_whatsapp_icon
                        }
                        resizeMode={'contain'}
                        style={styles.whatsappIcon}
                      />
                    </View> */}
                    </View>
                    {isDetailsVisible &&
                      contact_details_points != null &&
                      contact_details_points != undefined &&
                      contact_details_points != '' && (
                        <View style={styles.demoView}>
                          {contact_details_points?.map((item, index) => (
                            <Text style={styles.text}>
                              <Text style={{fontFamily: RUBIK_LIGHT_FONT}}>
                                &#8226;{' '}
                              </Text>{' '}
                              {item}
                            </Text>
                          ))}
                        </View>
                      )}
                  </View>
                </View>

                <LandingPageButton
                  title={BottomContactDetailsData?.confirm_btn}
                  disabled={text.length >= 8 && !textError ? false : true}
                  onPress={handleContinue}
                  customStyle={[
                    styles.continueButton,
                    {
                      backgroundColor:
                        text.length >= 8 && !textError
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
  contactNumberSim: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
  },
  validTextInput: {
    borderColor: 'green',
  },
  demoView: {
    // alignItems: 'flex-end',
    //marginRight: 200,
    marginBottom: VERTICAL_20,
    marginHorizontal: HORIZONTAL_25,
  },
  checkboxContainer: {
    alignItems: 'flex-start',
  },
  demoText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_10,
    color: colors.BLACK,
    textAlign: 'left',
  },
  viewDot: {
    flexDirection: 'row',
    // justifyContent: 'center',
    alignItems: 'flex-start',
  },

  checkedCheckbox: {
    backgroundColor: colors.OOREDOO_RED,
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
  },
  innerContainer: {
    flexDirection: 'row',
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
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_20,
  },
  textInput: {
    width: widthPixel(323),
    height: heightPixel(50),
    backgroundColor: colors.WHITE,
    marginBottom: VERTICAL_15,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  whatsappContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // alignItems: 'flex-start',
    // justifyContent: 'space-around',
    // marginHorizontal: 20,
    marginBottom: VERTICAL_20,
    marginLeft: WIDTH_6,
  },
  whatsappContainerDemo: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    marginBottom: VERTICAL_10,
    marginHorizontal: HORIZONTAL_5,
  },
  checkBoxTouchEffect: {
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: I18nManager.isRTL ? VERTICAL_5 : 0,
  },
  whatsappText: {
    //textAlign: 'center',
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: I18nManager.isRTL ? FONT_8 : FONT_10,
    color: colors.BLACK,
    // width: '50%', // Adjust width as needed
    marginLeft: -HORIZONTAL_5,
    marginRight: HORIZONTAL_5,
    lineHeight: isTablet ? FONT_30 : FONT_20,
  },
  demoContainer: {
    alignItems: 'flex-start',
  },
  dot: {
    fontSize: FONT_10,
    color: colors.BLACK,
  },
  whatsappIcon: {
    height: HEIGHT_18,
    width: WIDTH_18,
    marginLeft: WIDTH_3,
  },
  viewDetailsText: {
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    // fontWeight: '600',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    marginTop: Platform.OS === 'ios' ? 0 : 0,
    marginHorizontal: HORIZONTAL_2,
  },
  continueButton: {
    width: widthPixel(326),
    height: heightPixel(46),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    marginLeft: widthPixel(22),
    marginRight: widthPixel(28),
  },
  continueButtonText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    // fontWeight: '600',
    color: colors.WHITE,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    bottom: VERTICAL_10,
    //marginTop: VERTICAL_5,
  },
  text: {
    textAlign: 'left',
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_10,
  },
});

export default BottomContactDetails;
