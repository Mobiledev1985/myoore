import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  I18nManager,
  Keyboard,
  Modal,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
  Button,
} from 'react-native-paper';

import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import NewSimNumberSlider from './NewSimNumberSlider';
import {
  BORDER_RADIUS_15,
  BORDER_RADIUS_1,
  BORDER_RADIUS_3,
  FONT_12,
  FONT_13,
  FONT_15,
  FONT_20,
  FONT_21,
  FONT_22,
  HEIGHT_110,
  HEIGHT_30,
  HEIGHT_31,
  HORIZONTAL_10,
  HORIZONTAL_13,
  HORIZONTAL_30,
  HORIZONTAL_5,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_17,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_30,
  VERTICAL_40,
  WIDTH_110,
  WIDTH_4,
  BORDER_RADIUS_10,
  HEIGHT_19,
  HEIGHT_28,
  FONT_24,
  FONT_14,
  HORIZONTAL_12,
  FONT_16,
  FONT_28,
  FONT_18,
  FONT_25,
  HORIZONTAL_3,
  VERTICAL_5,
  WIDTH_15,
  HORIZONTAL_15,
  HORIZONTAL_20,
  FONT_30,
  FONT_37,
  FONT_11,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
  RUBIK_REGULAR_FONT,
} from '../../resources/styles/fonts';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {
  SHOP_GETAVAILABLENUMBERS,
  SHOP_SEARCHNUMBERS,
  SHOP_SENDOTP_API,
} from '../../resources/route/endpoints';
import {useTranslation} from 'react-i18next';
import ErrorComponent from '../../models/basic/ErrorComponent';
import NewSimMigrationOtpVerify from '../../models/shopOnApp/NewSimMigrationOtpVerify';
import AmountSummery from '../../components/shopOnApp/AmountSummery';
import {NavigateByName} from '../../services/NavigationService';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import ImageComponent from '../../models/basic/ImageComponent';
import {RecordlogEvents} from '../../analytics/RecordEvents';

const NewSimMigrationCategory = ({
  parentProduct,
  childProduct,
  datacompleted,
  setdatacompleted,
  verificationCompleted,
  setIsDataFilled,
  focusedFun,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [existingSimNumber, setExistingSimNumber] = useState('');
  const [textError, setTextError] = useState(false);
  const [textErrorMsg, setTextErrorMsg] = useState('');
  const [visible, setVisible] = useState(false);
  const [validationType, setValidationType] = useState('');
  const [showLoader, setShowLoader] = useState(false);
  const transidVal = useRef('');
  const [validationResp, setvalidationResp] = useState(null);

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

  const SelectNumberCTevent = eligiblestatus => {
    try {
      RecordlogEvents('Select Number', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Selection type': 'existing',
        Number: '965' + existingSimNumber,
        Migration: eligiblestatus,
        Operator: '',
      });
    } catch (e) {}
  };

  const getSendOTP = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_SENDOTP_API,
          {
            msisdn: '965' + existingSimNumber,
            action: 'rnmigration',
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setShowLoader(false);
        if (data?.data?.status === '0') {
          transidVal.current = data?.data?.response?.transid;
          global.timerInt = null;
          setVisible(true);
        } else {
          setTextError(true);
          setTextErrorMsg(data?.data?.message);
        }
      },
      onError: (error, variables, context) => {
        setShowLoader(false);
      },
    }
  );

  const verifiedOTPResponse = data => {
    verificationCompleted({
      transaction: true,
      res: data,
      type: 'migration',
      enteredNumber: existingSimNumber,
    });
    console.log('Data here---------', data);
    setvalidationResp(data);
    if (data?.status === '0' && data?.iseligible === '') {
      SelectNumberCTevent('eligible');
      setValidationType('success');
      setdatacompleted(prevState => ({
        ...prevState,
        selectnumber: true,
        choosesim: true,
      }));
    } else if (data?.status === '-1' && data?.iseligible === 'F') {
      SelectNumberCTevent('not eligible');
      setValidationType('failure');
      setdatacompleted(prevState => ({
        ...prevState,
        selectnumber: false,
        choosesim: false,
      }));
    }
    setVisible(false);
  };

  const onClose = () => setVisible(false);

  return (
    <View style={styles.containerView}>
      <PaperProvider theme={theme}>
        <TextInput
          label={
            <Text
              style={{
                fontFamily: RUBIK_LIGHT_FONT,
                fontWeight: '300',
                fontSize: FONT_13,
              }}>
              {
                global?.shopOnAppSettings?.productdetailsconfigurations
                  ?.enter_mobile_number
              }
            </Text>
          }
          mode="outlined"
          value={existingSimNumber}
          error={textError}
          maxLength={11}
          keyboardType="numeric"
          returnKeyType="done"
          onFocus={() => {
            focusedFun('migration');
          }}
          onChangeText={text => {
            setdatacompleted(prevState => ({
              ...prevState,
              selectnumber: false,
              choosesim: false,
            }));
            verificationCompleted({
              transaction: false,
              res: {},
              type: 'migration',
            });
            setValidationType('');
            setTextErrorMsg('');
            const sanitizedEmail = text.replace(
              /[`a-zA-Z@~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:.,'"<>٫\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]+/g,
              ''
            );
            const normalizedEmail = sanitizedEmail.replace(/\.+/g, '.');
            const spaceRemove = normalizedEmail.replace(' ', '');
            setExistingSimNumber(spaceRemove);
            setTextError(spaceRemove.length > 0 && spaceRemove.length < 8);
            setIsDataFilled(spaceRemove.length > 0);
          }}
          style={[styles.inputText]}
          textAlignVertical="center"
          // theme={{
          //   colors: {
          //     ...theme.colors,
          //     placeholder:
          //       validationType === 'success' || validationType === 'failure'
          //         ? colors.SKYLIGHT_BLUE
          //         : colors.OOREDDO_GREY,
          //     primary:
          //       validationType === 'success' || validationType === 'failure'
          //         ? colors.SKYLIGHT_BLUE
          //         : colors.OOREDDO_GREY,
          //   },
          // }}
          outlineColor={
            validationType === 'success' || validationType === 'failure'
              ? colors.SKYLIGHT_BLUE
              : colors.OOREDDO_GREY
          }
          theme={{
            fonts: {
              regular: {
                fontFamily: RUBIK_REGULAR_FONT,
                fontSize: FONT_16,
                fontWeight: '400',
              },
            },
          }}
        />
        {textError &&
        (existingSimNumber.length <= 8 ||
          textErrorMsg != null ||
          textErrorMsg != undefined ||
          textErrorMsg != '') ? (
          <Text style={styles.errorMesssage}>
            {textErrorMsg || t('peavmn')}
          </Text>
        ) : null}
        {existingSimNumber.length >= 8 && (
          <>
            <View style={styles.otpButtonView} />
            <TouchableOpacity
              disabled={
                validationType === 'success' || validationType === 'failure'
                  ? true
                  : false
              }
              style={
                validationType === 'success' || validationType === 'failure'
                  ? styles.otpButtonSuccess
                  : styles.otpButton
              }
              onPress={() => {
                setTextErrorMsg('');
                setShowLoader(true);
                getSendOTP.mutate();
                // setVisible(true);
              }}>
              <Text
                style={
                  validationType === 'success' || validationType === 'failure'
                    ? styles.otpButtonTextSuccess
                    : styles.otpButtonText
                }>
                {validationType === 'success' || validationType === 'failure'
                  ? global?.shopOnAppSettings?.productdetailsconfigurations
                      ?.verified_btn_text
                  : global?.shopOnAppSettings?.productdetailsconfigurations
                      ?.send_otp}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {validationType === 'success' ? (
          <View>
            <AmountSummery
              type={'migration'}
              data={global?.shopOnAppSettings?.productdetailsconfigurations}
              // item={item}
              parentProduct={parentProduct}
              childProduct={childProduct}
              numderObj={validationResp}
              // grandTotall={promoData}
              // addcartresponse={addcartresponse}
              onpayMonthlyPress={() => {
                // setPayMntPressed(true);
              }}
              onpayAdvancePressed={() => {
                // setPayAdvcPressed(true);
              }}
            />
            <View
              style={[
                styles.migrationToolTipView,
                {
                  backgroundColor:
                    validationResp?.rateplantype === 'POSTPAID'
                      ? global?.shopOnAppSettings?.productdetailsconfigurations
                          ?.outstanding_balance_tool_tip_bg_color
                      : global?.shopOnAppSettings?.productdetailsconfigurations
                          ?.outstanding_balance_tool_tip_bg_color_prepaid,
                },
              ]}>
              <ImageComponent
                type="image"
                iwidth={WIDTH_15}
                iheight={WIDTH_15}
                source={
                  validationResp?.rateplantype === 'POSTPAID'
                    ? global?.shopOnAppSettings?.productdetailsconfigurations
                        ?.outstanding_balance_tool_tip_icon
                    : global?.shopOnAppSettings?.productdetailsconfigurations
                        ?.outstanding_balance_tool_tip_icon_prepaid
                }
                resizeMode={'contain'}
              />
              <Text
                style={[
                  styles.migrationToolTipText,
                  {
                    color:
                      validationResp?.rateplantype === 'POSTPAID'
                        ? global?.shopOnAppSettings
                            ?.productdetailsconfigurations
                            ?.outstanding_balance_tool_tip_text_color
                        : global?.shopOnAppSettings
                            ?.productdetailsconfigurations
                            ?.outstanding_balance_tool_tip_text_color_prepaid,
                  },
                ]}
                numberOfLines={1}>
                {validationResp?.rateplantype === 'POSTPAID'
                  ? global?.shopOnAppSettings?.productdetailsconfigurations
                      ?.outstanding_balance_tool_tip
                  : global?.shopOnAppSettings?.productdetailsconfigurations
                      ?.outstanding_balance_tool_tip_prepaid}
              </Text>
            </View>
          </View>
        ) : validationType === 'failure' ? (
          <View
            style={[
              styles.migrationFailureView,
              {backgroundColor: validationResp?.response?.bgocolor},
            ]}>
            <Text style={styles.migrationEligibleText}>
              {validationResp?.response?.title}
            </Text>
            <Text style={styles.migrationFailuredesc}>
              {validationResp?.response?.description}
            </Text>
            <View style={styles.migrationFailureContactView}>
              <Text
                style={styles.migrationFailureContactText}
                numberOfLines={1}>
                {validationResp?.response?.contacttext}
              </Text>
              <Text
                style={styles.migrationFailureChatText}
                numberOfLines={1}
                onPress={() => {
                  NavigateByName(
                    navigation,
                    validationResp?.response?.contactsupporturl,
                    null,
                    null,
                    null,
                    null,
                    null,
                    'T'
                  );
                }}>
                {validationResp?.response?.contactsupporttext}
              </Text>
            </View>
          </View>
        ) : (
          <></>
        )}
        <NewSimMigrationOtpVerify
          visible={visible}
          onClose={onClose}
          transid={transidVal.current}
          onContactNumberChange={() => {}}
          setdatacompleted={setdatacompleted}
          existingSimNumber={existingSimNumber}
          lineType={childProduct?.linetype || parentProduct?.linetype || ''}
          verifiedOTPResponse={verifiedOTPResponse}
          type={'rnmigration'}
          isanaplan={childProduct?.isanaplan || parentProduct?.isanaplan || '0'}
        />
        <Modal
          animationType="none"
          transparent={true}
          visible={showLoader}
          statusBarTranslucent
          presentationStyle="overFullScreen">
          <LoadingIndicator
            style={{
              flex: 1,
              justifyContent: 'center',
            }}
            shouldDismissManual
            isVisible={showLoader}
          />
        </Modal>
      </PaperProvider>
    </View>
  );
};

const styles = StyleSheet.create({
  containerView: {
    margin: HORIZONTAL_13,
    width: widthPixel(323),
  },
  inputText: {
    height: heightPixel(50),
    backgroundColor: colors.WHITE,
    marginBottom: VERTICAL_15,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    bottom: VERTICAL_10,
  },
  otpButtonView: {
    position: 'absolute',
    top: heightPixel(10),
    left: widthPixel(201),
    height: heightPixel(50),
    width: widthPixel(120),
    zIndex: 999,
  },
  otpButton: {
    position: 'absolute',
    top: isTablet ? heightPixel(14) : heightPixel(17),
    left: widthPixel(201),
    height: heightPixel(30),
    width: widthPixel(110),
    borderRadius: BORDER_RADIUS_15,
    backgroundColor: colors.OOREDOO_RED,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  otpButtonText: {
    color: colors.WHITE,
    marginTop: I18nManager.isRTL ? VERTICAL_5 : 0,
    fontSize: FONT_13,
    lineHeight: FONT_20,
    fontFamily: RUBIK_SEMIBOLD_FONT,
  },
  otpButtonSuccess: {
    position: 'absolute',
    top: isTablet ? heightPixel(14) : heightPixel(17),
    left: widthPixel(201),
    height: heightPixel(30),
    width: widthPixel(110),
    borderRadius: BORDER_RADIUS_15,
    backgroundColor: colors.SKYLIGHT_BLUE,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  otpButtonTextSuccess: {
    color: colors.BLACK,
    marginTop: I18nManager.isRTL ? VERTICAL_5 : 0,
    fontSize: FONT_13,
    lineHeight: FONT_20,
    fontFamily: RUBIK_SEMIBOLD_FONT,
  },
  responseContainer: {
    height: heightPixel(210),
    backgroundColor: colors.TOO_LIGHT_GREY,
    borderRadius: BORDER_RADIUS_10,
    alignItems: 'center',
  },
  successHeader: {
    height: HEIGHT_19,
    width: widthPixel(139),
    backgroundColor: 'green',
  },
  migrationToolTipView: {
    marginTop: VERTICAL_30,
    marginBottom: VERTICAL_20,
    height: HEIGHT_28,
    borderRadius: HEIGHT_28 / 2,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    paddingHorizontal: HORIZONTAL_20,
  },
  migrationToolTipText: {
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_11,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_14,
    marginHorizontal: HORIZONTAL_3,
  },
  migrationFailureView: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  migrationEligibleText: {
    marginHorizontal: HORIZONTAL_12,
    marginTop: VERTICAL_15,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    lineHeight: I18nManager.isRTL ? FONT_28 : FONT_18,
    textAlign: 'center',
    paddingTop: VERTICAL_5,
  },
  migrationFailuredesc: {
    marginHorizontal: HORIZONTAL_12,
    marginTop: VERTICAL_10,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_25 : FONT_15,
    textAlign: 'center',
  },
  migrationFailureContactView: {
    flexDirection: 'row',
    marginHorizontal: HORIZONTAL_12,
    marginVertical: VERTICAL_15,
    maxWidth: SCREEN_WIDTH - widthPixel(80),
  },
  migrationFailureContactText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_14,
    lineHeight: I18nManager.isRTL ? FONT_25 : FONT_16,
    textAlign: 'center',
    maxWidth: SCREEN_WIDTH - widthPixel(200),
  },
  migrationFailureChatText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    lineHeight: I18nManager.isRTL ? FONT_25 : FONT_16,
    paddingLeft: HORIZONTAL_3,
    textAlign: 'center',
    textDecorationLine: 'underline',
    maxWidth: widthPixel(120),
  },
});

export default NewSimMigrationCategory;
