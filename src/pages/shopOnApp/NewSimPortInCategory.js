import React, {useRef, useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  I18nManager,
  Keyboard,
  Modal,
  Image,
  TouchableHighlight,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
  Button,
} from 'react-native-paper';
import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';

import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import NewSimNumberSlider from './NewSimNumberSlider';
import {
  BORDER_RADIUS_14,
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
  VERTICAL_3,
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
  VERTICAL_12,
  WIDTH_16,
  HEIGHT_8,
  HEIGHT_20,
  HEIGHT_16,
  HORIZONTAL_15,
  WIDTH_7,
  WIDTH_12,
  WIDTH_15,
  WIDTH_22,
  HEIGHT_15,
  FONT_19,
  FONT_23,
  FONT_29,
  WIDTH_2,
  FONT_30,
  FONT_37,
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
  GET_TERMS_AND_CONDITIONS,
} from '../../resources/route/endpoints';
import {useTranslation} from 'react-i18next';
import LinearGradient from 'react-native-linear-gradient';
import IconFA from 'react-native-vector-icons/FontAwesome';
import ErrorComponent from '../../models/basic/ErrorComponent';
import NewSimMigrationOtpVerify from '../../models/shopOnApp/NewSimMigrationOtpVerify';
import AmountSummery from '../../components/shopOnApp/AmountSummery';
import {NavigateByName} from '../../services/NavigationService';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import TermsAndConditionModal from '../../components/shopOnApp/TermsAndConditionModal';
import {RecordlogEvents} from '../../analytics/RecordEvents';

const UNSELECT_SIM_BUTTON = require('../../assets/newsimbutton.png');
const SELECT_SIM_BUTTON = require('../../assets/o2.png');
const ARROW_DOWN_UP = require('../../assets/down.png');
const ARROW_DOWN_DOWN = require('../../assets/up.png');

const NewSimPortInCategory = ({
  parentProduct,
  childProduct,
  datacompleted,
  setdatacompleted,
  verificationCompleted,
  setPortInOption,
  portInOption,
  setIsTNCAccepted,
  isTNCAccepted,
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
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isTNCOpen, setIsTNCOpen] = useState(false);
  const [policyData, setPolicyData] = useState('');
  const [policyProductDetails, setPolicyProductDetails] = useState('');
  const [stepToKnow, setStepToKnow] = useState(null);
  const portInFromOption =
    global?.shopOnAppSettings?.planpurchaseconfigurations?.portin_operator_list;

  const globalData = global?.shopOnAppSettings?.productdetailsconfigurations;

  const dataParse = async () => {
    setStepToKnow(await JSON.parse(globalData?.portin_steps_json));
  };

  useEffect(() => {
    getTermsAndConditions.mutate();
    dataParse();
  }, []);

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

  const SelectNumberCTevent = (eligiblestatus, portInOption) => {
    try {
      RecordlogEvents('Select Number', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Selection type': 'switch',
        Number: '965' + existingSimNumber,
        Migration: eligiblestatus,
        Operator: portInOption,
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
            action: 'rnportin',
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

  const getTermsAndConditions = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GET_TERMS_AND_CONDITIONS,
          {
            segmentid: '5041',
            iseshop: false,
            childlineflag: false,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        if (data?.data?.status === '0') {
          setPolicyData(data?.data?.response[0]?.ProductDetails?.summary);
          setPolicyProductDetails(data?.data?.response[0]?.ProductDetails);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  const verifiedOTPResponse = data => {
    verificationCompleted({
      transaction: true,
      res: data,
      type: 'portin',
      enteredNumber: existingSimNumber,
    });
    setvalidationResp(data);
    if (data?.status === '0' && data?.iseligible === '') {
      setValidationType('success');
      setdatacompleted(prevState => ({
        ...prevState,
        selectnumber: true,
      }));
    } else if (data?.status === '-1' && data?.iseligible === 'F') {
      SelectNumberCTevent('not eligible', '');
      setValidationType('failure');
      setdatacompleted(prevState => ({
        ...prevState,
        selectnumber: false,
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
            focusedFun('portin');
          }}
          onChangeText={text => {
            setTextErrorMsg('');
            const sanitizedEmail = text.replace(
              /[`a-zA-Z@~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:.,'"<>٫\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]+/g,
              ''
            );
            const normalizedEmail = sanitizedEmail.replace(/\.+/g, '.');
            const spaceRemove = normalizedEmail.replace(' ', '');
            setExistingSimNumber(spaceRemove);
            setTextError(spaceRemove.length > 0 && spaceRemove.length < 8);
            setValidationType('');
            verificationCompleted({
              transaction: false,
              res: {},
              type: 'portin',
            });
            setPortInOption('');
            setdatacompleted(prevState => ({
              ...prevState,
              selectnumber: false,
            }));
            setIsDataFilled(spaceRemove.length > 0);
          }}
          outlineColor={
            validationType === 'success'
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
          // theme={{
          //   colors: {
          //     ...theme.colors,
          //     placeholder:
          //       validationType === 'success'
          //         ? colors.SKYLIGHT_BLUE
          //         : colors.OOREDDO_GREY,
          //     primary:
          //       validationType === 'success'
          //         ? colors.SKYLIGHT_BLUE
          //         : colors.OOREDDO_GREY,
          //   },
          // }}
          style={[styles.inputText]}
          textAlignVertical="center"
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
              style={[
                styles.otpButton,
                {
                  backgroundColor:
                    validationType === 'success'
                      ? colors.SKYLIGHT_BLUE
                      : colors.OOREDOO_RED,
                },
              ]}
              disabled={validationType === 'success'}
              onPress={() => {
                setTextErrorMsg('');
                setShowLoader(true);
                getSendOTP.mutate();
              }}>
              <Text
                style={[
                  styles.otpButtonText,
                  {
                    color:
                      validationType === 'success'
                        ? colors.BLACK
                        : colors.WHITE,
                  },
                ]}>
                {validationType === 'success'
                  ? globalData?.verified_btn_text
                  : globalData?.send_otp}
              </Text>
            </TouchableOpacity>
          </>
        )}
        {validationType === 'success' ? (
          <View>
            <View style={styles.successContainer}>
              <Text style={styles.titleText}>
                {globalData?.you_are_porting_from}
              </Text>
              <View style={styles.optionContainer}>
                {portInFromOption.map((item, index) => (
                  <TouchableOpacity
                    style={styles.portInOption}
                    onPress={() => {
                      SelectNumberCTevent('eligible', item);
                      setPortInOption(item);
                    }}>
                    <Image
                      source={
                        portInOption === item
                          ? SELECT_SIM_BUTTON
                          : UNSELECT_SIM_BUTTON
                      }
                      style={[
                        styles.radioButton,
                        {
                          marginTop: portInOption === item ? 3 : 0,
                        },
                      ]}
                      resizeMode="contain"
                    />
                    <Text style={styles.portInOptionText}>{item}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.termsAndConditionContainer}>
                <View style={styles.agreeViewContainer}>
                  <TouchableHighlight
                    style={styles.checkBoxTouchEffect}
                    underlayColor={colors.OOREDDO_CHECKBOX_BLUE_UNDERLEY}
                    onPress={() => setIsTNCAccepted(!isTNCAccepted)}>
                    <View
                      style={[
                        styles.checkboxBackgroundStyle,
                        {
                          borderColor: isTNCAccepted
                            ? colors.OOREDDO_CHECKBOX_BLUE
                            : colors.OOREDDO_GREY,
                          backgroundColor: isTNCAccepted
                            ? colors.OOREDDO_CHECKBOX_BLUE
                            : 'transparent',
                        },
                      ]}>
                      {isTNCAccepted && (
                        <IconFA
                          name="check"
                          size={isTablet ? FONT_20 : FONT_12}
                          color={colors.WHITE}
                        />
                      )}
                    </View>
                  </TouchableHighlight>
                  <Text style={styles.agreeText}>
                    {globalData?.portin_agree_text + ' '}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => setIsTNCOpen(true)}>
                  <Text style={styles.termsAndConditionText}>
                    {globalData?.portin_agree_termsandconditions}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.hintContainer,
                  {backgroundColor: globalData?.portin_tooltip_bgcolor},
                ]}>
                <Text
                  style={[
                    styles.hintText,
                    {color: globalData?.portin_tooltip_textcolor},
                  ]}>
                  {globalData?.portin_tooltip_text}
                </Text>
              </View>
            </View>
            <LinearGradient
              start={I18nManager.isRTL ? {x: 1, y: 0} : {x: 1, y: 0}}
              end={I18nManager.isRTL ? {x: 1, y: 1} : {x: 1, y: 1}}
              colors={[
                'rgba(249, 249, 255, 1)',
                isCollapsed
                  ? 'rgba(249, 249, 255, 0)'
                  : 'rgba(249, 249, 255, 1)',
              ]}
              style={[
                styles.gradientView,
                {height: isCollapsed ? heightPixel(191) : undefined},
              ]}>
              <Collapse
                style={styles.collapsibleContainer}
                touchableOpacityProps={{activeOpacity: 1}}
                isExpanded={!isCollapsed}
                onToggle={() => {
                  setIsCollapsed(!isCollapsed);
                }}>
                <CollapseHeader>
                  <View>
                    <View style={styles.collapsibleHeader}>
                      <Text style={styles.collapsibleHeaderText}>
                        {stepToKnow?.title}
                      </Text>
                      <TouchableHighlight
                        style={styles.arrowTouchEffect}
                        underlayColor={colors.OOREDDO_COLLAPSE_UNDERLEY}
                        onPress={() => {
                          setIsCollapsed(!isCollapsed);
                        }}>
                        <Image
                          source={isCollapsed ? ARROW_DOWN_DOWN : ARROW_DOWN_UP}
                          style={styles.arrowStyle}
                        />
                      </TouchableHighlight>
                    </View>
                    {stepToKnow?.steps?.map(
                      (item, index) =>
                        index < 1 && (
                          <View>
                            <View style={styles.itemTitleView}>
                              <View style={styles.circle}></View>
                              <View style={styles.itemTextView}>
                                <Text style={styles.itemTitle}>
                                  {item?.title}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.itemDescView}>
                              {index == stepToKnow?.steps?.length - 1 ? null : (
                                <View
                                  style={{
                                    width: 2,
                                    backgroundColor: colors.OOREDOO_RED,
                                  }}></View>
                              )}
                              <Text style={styles.itemDescText}>
                                {item?.description}
                              </Text>
                            </View>
                          </View>
                        )
                    )}
                  </View>
                </CollapseHeader>
                <CollapseBody>
                  <View>
                    {stepToKnow?.steps?.map(
                      (item, index) =>
                        index >= 1 && (
                          <View>
                            <View style={styles.itemTitleView}>
                              <View style={styles.circle}></View>
                              <View style={styles.itemTextView}>
                                <Text style={styles.itemTitle}>
                                  {item?.title}
                                </Text>
                              </View>
                            </View>
                            <View style={styles.itemDescView}>
                              {index == stepToKnow?.steps?.length - 1 ? null : (
                                <View
                                  style={{
                                    width: 2,
                                    backgroundColor: colors.OOREDOO_RED,
                                  }}></View>
                              )}
                              <Text style={styles.itemDescText}>
                                {item?.description}
                              </Text>
                            </View>
                          </View>
                        )
                    )}
                  </View>
                </CollapseBody>
              </Collapse>
            </LinearGradient>
            {isCollapsed && (
              <View style={styles.collapsibleCover}>
                <LinearGradient
                  start={I18nManager.isRTL ? {x: 1, y: 0} : {x: 1, y: 0}}
                  end={I18nManager.isRTL ? {x: 1, y: 1} : {x: 1, y: 1}}
                  colors={['rgba(249, 249, 255, 0)', 'rgba(249, 249, 255, 1)']}
                  style={[
                    styles.gradientView,
                    {
                      height: heightPixel(100),
                      width: '100%',
                    },
                  ]}>
                  <Text> </Text>
                </LinearGradient>
              </View>
            )}
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
          lineType={childProduct.linetype || parentProduct.linetype || ''}
          verifiedOTPResponse={verifiedOTPResponse}
          type={'rnportin'}
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
        <TermsAndConditionModal
          visible={isTNCOpen}
          onClose={() => setIsTNCOpen(false)}
          data={policyData ? policyData : ''}
          productDetails={policyProductDetails}
          shopsettings={global?.shopOnAppSettings?.productdetailsconfigurations}
        />
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
    top: heightPixel(17),
    left: widthPixel(201),
    height: heightPixel(30),
    width: widthPixel(110),
    borderRadius: BORDER_RADIUS_15,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  otpButtonText: {
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
  successContainer: {
    // height: heightPixel(153),
    backgroundColor: colors.TOO_LIGHT_GREY,
    borderRadius: BORDER_RADIUS_10,
    marginVertical: VERTICAL_10,
    alignItems: 'center',
    paddingBottom: VERTICAL_10,
  },
  titleText: {
    marginTop: VERTICAL_15,
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_18 : FONT_18,
    textAlign: 'center',
    fontWeight: '300',
  },
  optionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: VERTICAL_10,
  },
  radioButton: {
    width: WIDTH_16,
    height: HEIGHT_16,
  },
  portInOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: HORIZONTAL_12,
    marginBottom: VERTICAL_15,
  },
  portInOptionText: {
    marginLeft: HORIZONTAL_10,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_18 : FONT_18,
    textAlign: 'center',
    fontWeight: '600',
  },
  termsAndConditionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginTop: I18nManager.isRTL ? VERTICAL_5 : VERTICAL_10,
  },
  agreeViewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkBoxTouchEffect: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
  },
  checkBoxStyle: {
    width: WIDTH_15,
    height: HEIGHT_15,
  },
  agreeText: {
    marginTop: I18nManager.isRTL ? VERTICAL_5 : 0,
    marginLeft: -HORIZONTAL_5,
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '300',
  },
  termsAndConditionText: {
    marginTop: I18nManager.isRTL ? VERTICAL_5 : 0,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.OOREDOO_RED,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  hintContainer: {
    height: heightPixel(28),
    width: widthPixel(313),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: heightPixel(14),
    marginTop: VERTICAL_12,
  },
  hintText: {
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_12,
    lineHeight: I18nManager.isRTL ? FONT_28 : FONT_18,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '300',
  },
  gradientView: {
    borderRadius: BORDER_RADIUS_10,
    marginVertical: VERTICAL_10,
  },
  collapsibleContainer: {
    marginTop: VERTICAL_15,
    marginLeft: HORIZONTAL_15,
    marginRight: HORIZONTAL_5,
  },
  collapsibleCover: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: VERTICAL_15,
    zIndex: -1,
  },
  arrowStyle: {
    height: heightPixel(22),
    width: widthPixel(22),
  },
  collapsibleHeaderText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    lineHeight: I18nManager.isRTL ? FONT_29 : FONT_19,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontWeight: '600',
    width: '80%',
  },
  arrowTouchEffect: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
  },
  itemTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: colors.OOREDOO_RED,
    height: WIDTH_15,
    width: WIDTH_15,
    borderRadius: WIDTH_15 / 2,
  },
  itemTextView: {
    marginLeft: WIDTH_12,
    alignItems: 'center',
  },
  itemTitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    lineHeight: I18nManager.isRTL ? FONT_23 : FONT_13,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
    textAlignVertical: 'center',
  },
  itemDescView: {
    flexDirection: 'row',
    paddingLeft: WIDTH_7,
  },
  itemDescText: {
    fontFamily: RUBIC_LIGHT_FONT,
    lineHeight: I18nManager.isRTL ? FONT_23 : FONT_13,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
    marginLeft: WIDTH_22,
    marginTop: HEIGHT_8,
    paddingBottom: HEIGHT_20,
  },
  checkboxBackgroundStyle: {
    width: WIDTH_15,
    height: WIDTH_15,
    borderWidth: WIDTH_2,
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NewSimPortInCategory;
