import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../../../selfcarern/src/resources/styles/fonts';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_15,
  BORDER_RADIUS_20,
  BORDER_RADIUS_31,
  BORDER_RADIUS_5,
  BORDER_RADIUS_6,
  FONT_13,
  FONT_16,
  FONT_12,
  HORIZONTAL_12,
  HORIZONTAL_10,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_26,
  WIDTH_304,
  FONT_11,
  WIDTH_26,
  HEIGHT_26,
  HORIZONTAL_13,
  HEIGHT_136,
  WIDTH_16,
  HEIGHT_16,
  VERTICAL_80,
  HEIGHT_195,
  FONT_20,
  HEIGHT_150,
  HORIZONTAL_25,
  VERTICAL_15,
  VERTICAL_12,
  FONT_14,
  FONT_32,
  FONT_22,
  HEIGHT_7,
  FONT_24,
} from '../../../../selfcarern/src/resources/styles/responsive';
import BottomContactDetails from '../../models/shopOnApp/BottomContactDetails';
import colors from '../../resources/styles/colors';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import ImageComponent from '../basic/ImageComponent';

const MyComponent = ({
  ContactDetailsData,
  contactInfoFunc,
  continueButtonDisableBtn,
  contacterror,
  datacompleted,
  setdatacompleted,
  contactinfoNumber,
  contactinfoEmail,
}) => {
  const [text, setText] = React.useState('');
  const {t} = useTranslation();
  const [bottomPlanVisible, setBottomPlanVisible] = useState(false);
  const inputRef = useRef(null);
  const [contactNumber, setContactNumber] = useState('');
  const [whatsappCheck, setwhatsappCheck] = useState(false);
  const [mobileError, setmobileError] = useState('');

  useEffect(() => {
    if (contacterror != '' && contactinfoNumber != '') {
      setmobileError(contacterror);
    } else {
      setmobileError('');
      //setContactNumber('');
    }

    // if (inputRef.current) {
    //   // inputRef.current.focus();
    // }
  }, [contacterror, mobileError]);

  const handleContactNumberChange = useCallback(
    (value, email, whatsapp) => {
      if (value === '') {
        setdatacompleted(prevState => ({
          ...prevState,
          contactdetail: false,
        }));
        setmobileError(t('peavmn')); // Assuming 't' is a translation function available in your scope
      } else {
        contactInfoFunc(value, email, whatsapp);
        if (value?.length > 6) {
          setdatacompleted(prevState => ({
            ...prevState,
            contactdetail: true,
          }));
        } else {
          setdatacompleted(prevState => ({
            ...prevState,
            contactdetail: false,
          }));
        }

        setwhatsappCheck(whatsapp);
        setContactNumber(value);
        setText(value);
        continueButtonDisableBtn(false); // Assuming this function is defined elsewhere
      }
    },
    [
      setdatacompleted,
      setmobileError,
      contactInfoFunc,
      continueButtonDisableBtn,
    ]
  );

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.OOREDDO_GREY,
      text: colors.BLACK,
      borderRadius: 1,
      backgroundColor: colors.WHITE,
      error: '#B00020',
      fontSize: FONT_13,
    },
  };

  const openBottomPlanModal = () => {
    setBottomPlanVisible(true);
  };

  const closeBottomPlanModal = () => {
    setBottomPlanVisible(false);
  };

  const containerStyle =
    Platform.OS === 'ios' ? styles.containerIOS : styles.containerAndroid;

  return (
    // <KeyboardAvoidingView>
    // <View style={containerStyle}>
    <PaperProvider theme={theme}>
      <View style={[containerStyle, {}]}>
        <View style={styles.subContainer}>
          <BottomContactDetails
            BottomContactDetailsData={ContactDetailsData}
            visible={bottomPlanVisible}
            onClose={closeBottomPlanModal}
            onContactNumberChange={handleContactNumberChange}
            contactNumber={contactNumber}
            contactinfoNumber={contactinfoNumber}
            contactinfoEmail={contactinfoEmail}
          />
        </View>

        <TouchableWithoutFeedback onPress={openBottomPlanModal}>
          <View
            style={[
              styles.flatListShadow,
              {
                height:
                  (contactNumber.length >= 7 ||
                    (global.contactNumber != null &&
                      global.contactNumber != undefined &&
                      global.contactNumber.length >= 7)) &&
                  (whatsappCheck ||
                    (global.contactwhatsapp != null &&
                      global.contactwhatsapp != undefined &&
                      global.contactwhatsapp == true))
                    ? HEIGHT_195
                    : mobileError
                    ? HEIGHT_150
                    : HEIGHT_136,
              },
            ]}>
            <View style={styles.contactText}>
              <Text style={styles.textLabel}>
                {ContactDetailsData?.enter_your_contact_details}
              </Text>
              {(contactNumber.length >= 7 ||
                (global.contactNumber != null &&
                  global.contactNumber != undefined &&
                  global.contactNumber.length >= 7)) && (
                <Image
                  source={require('../../assets/done_right.png')}
                  resizeMode={'contain'}
                  style={styles.vectorIconUp}
                />
              )}
            </View>
            <TextInput
              ref={inputRef}
              label={
                <Text
                  style={{
                    fontFamily: RUBIK_LIGHT_FONT,
                    fontWeight: '300',
                    fontSize: FONT_13,
                  }}>
                  {ContactDetailsData?.enter_your_contact_number}
                </Text>
              }
              mode="outlined"
              editable={false}
              //disabled={true}
              pointerEvents="none"
              theme={{
                colors: {
                  text: colors.BLACK,
                },
                fonts: {
                  regular: {
                    fontFamily: RUBIK_REGULAR_FONT,
                    fontSize: FONT_16,
                    fontWeight: '400',
                  },
                },
              }}
              // onFocus={() => {
              //   openBottomPlanModal()
              // }}
              // error={contactNumber.length !== 8}
              // helperText={
              //   contactNumber.length !== 8
              //     ? 'Contact number must be 8 digits'
              //     : ''
              // }
              textAlignVertical="center"
              value={contactNumber || global.contactNumber}
              onChangeText={value => setText(value)}
              style={styles.input}
            />
            {mobileError ? (
              <Text style={styles.errorMesssage}>{mobileError}</Text>
            ) : null}

            {(contactNumber.length >= 7 ||
              (global.contactNumber != null &&
                global.contactNumber != undefined &&
                global.contactNumber.length >= 7)) &&
              (whatsappCheck ||
                (global.contactwhatsapp != null &&
                  global.contactwhatsapp != undefined &&
                  global.contactwhatsapp == true)) && (
                <View
                  style={[
                    styles.bottomView,
                    {
                      backgroundColor:
                        ContactDetailsData?.contact_number_tooltip_bgcolor,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.bottomText,
                      {
                        color:
                          ContactDetailsData?.contact_number_tooltip_textcolor,
                      },
                    ]}
                    numberOfLines={1}>
                    {ContactDetailsData?.contact_number_tooltip}
                  </Text>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_16}
                    iheight={HEIGHT_16}
                    source={ContactDetailsData?.contact_number_whatsapp_icon}
                    resizeMode={'contain'}
                  />
                  {/* <Image
                    source={require('../../assets/whatsapp.png')}
                    resizeMode={'contain'}
                    style={styles.whatsapp}
                  /> */}
                </View>
              )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </PaperProvider>
    //  </View>
    // </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subContainer: {
    // flex: 1,
  },
  contactText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: BORDER_RADIUS_10,
  },
  bottomText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_12,
    //color: colors.BLACK,
    width: isTablet ? tabletMargin() + widthPixel(200) : widthPixel(290),
    // marginStart: HORIZONTAL_10,
    textAlign: 'center',
  },
  bottomView: {
    // backgroundColor: '#B4F6EB',
    borderRadius: BORDER_RADIUS_31,
    width: widthPixel(324),
    height: heightPixel(28),
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: FONT_12,
    // paddingVertical: HEIGHT_7,
  },
  // whatsapp: {
  //   height: HEIGHT_26,
  //   width: WIDTH_26,
  //   // marginEnd: 10
  // },
  containerAndroid: {
    // flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // elevation: 10,
    // marginTop: VERTICAL_20,
    // marginHorizontal: HORIZONTAL_13,
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // shadowColor: colors.BLACK,

    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.BG_COLOR_WHITE,
    borderRadius: BORDER_RADIUS_10,
    // borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 4,
    marginHorizontal: isTablet
      ? Platform.OS == 'android'
        ? HORIZONTAL_25
        : 0
      : HORIZONTAL_13,
    shadowOpacity: 0.25,
    // shadowColor: colors.GREY,
    shadowRadius: BORDER_RADIUS_10,
    marginTop: VERTICAL_20,
  },
  vectorIconUp: {
    width: widthPixel(22),
    height: heightPixel(22),
    marginTop: BORDER_RADIUS_20,
  },
  containerIOS: {
    //flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // shadowColor: colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.25,
    // shadowRadius: 3.84,
    // marginTop: VERTICAL_20,
    // marginHorizontal: HORIZONTAL_13,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: colors.BG_COLOR_WHITE,
    borderRadius: BORDER_RADIUS_10,
    // borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 4,
    marginHorizontal: isTablet ? 0 : HORIZONTAL_13,
    shadowOpacity: 0.25,
    // shadowColor: colors.GREY,
    shadowRadius: BORDER_RADIUS_10,
    marginTop: VERTICAL_20,
  },
  textLabel: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginStart: HORIZONTAL_5,
    // fontWeight: '600',
    fontSize: FONT_16,
    marginTop: BORDER_RADIUS_20,
  },
  input: {
    width: isTablet ? SCREEN_WIDTH / 1.22 - widthPixel(50) : widthPixel(323),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_15,
    backgroundColor: colors.WHITE,
    marginTop: VERTICAL_12,
    bottom: I18nManager.isRTL ? VERTICAL_10 : 0,
    lineHeight: I18nManager.isRTL ? FONT_32 : FONT_24,
  },
  flatListShadow: {
    width: isTablet ? SCREEN_WIDTH / 1.22 - widthPixel(25) : widthPixel(350),
    // height: heightPixel(190),
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_10,
    borderColor: colors.SILVER,
    borderWidth: 0.5,
    elevation: 4,
    right: isTablet ? widthPixel(8) : 0,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    marginHorizontal: HORIZONTAL_13,
    // bottom: VERTICAL_10,
    //marginTop: VERTICAL_5,
  },
});

export default MyComponent;
