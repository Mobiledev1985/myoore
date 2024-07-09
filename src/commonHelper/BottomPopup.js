import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  AppState,
  TouchableOpacity,
} from 'react-native';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_15,
  BORDER_RADIUS_20,
  BORDER_RADIUS_25,
  BORDER_RADIUS_30,
  DESC_TEXT_WIDTH_200,
  FONT_12,
  FONT_14,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_26,
  FONT_28,
  FONT_30,
  FONT_32,
  FONT_35,
  FONT_38,
  HEIGHT_100,
  HEIGHT_35,
  HORIZONTAL_10,
  HORIZONTAL_15,
  HORIZONTAL_16,
  HORIZONTAL_20,
  HORIZONTAL_23,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_35,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_150,
  WIDTH_160,
  WIDTH_30,
  WIDTH_300,
  WIDTH_40,
  WIDTH_6,
  WIDTH_60,
  WIDTH_70,
  WIDTH_8,
} from '../resources/styles/responsive';
import {LandingPageButton, ModalPageButton} from './Button';
import {
  NOTOSANS_BOLD_FONT,
  NOTOSANS_LIGHT_FONT,
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../resources/styles/fonts';

import {FULL_WIDTH_PERCENTAGE, HORIZONTAL_SCALE_35} from './Constants';
import {GET_COMPATIBLE_DEVICES} from '../resources/route/endpoints';
import Icon from 'react-native-vector-icons/Entypo';
import {UnitTestProps, WINDOW_WIDTH} from '../commonHelper/utils';
import {callQueryapi} from './middleware/callapi';
import colors from '../resources/styles/colors';
import {
  SCREEN_WIDTH,
  heightPixel,
  widthPixel,
} from '../resources/styles/normalizedimension';
import {useMutation} from 'react-query';
import {useTranslation} from 'react-i18next';
import IconBox from 'react-native-vector-icons/Ionicons';
import Iconcheckedbox from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch} from 'react-redux';
import LottieView from 'lottie-react-native';

const {width} = Dimensions.get('window');

const BottomPoppup = ({
  visible,
  message,
  onClose,
  tryagainClick,
  btnName,
  showIcon = true,
  designmode = 1,
  height = 450,
  showInfoIcon = false,
  type,
  title,
  confirmText,
  doNotShow,
  doNotFlag,
  noBtnName,
  onHide,
  otpScreen,
  hideBtnName = false,
}) => {
  const {t} = useTranslation();
  const buttonName = btnName || t('tryagain');
  const noButtonName = noBtnName || t('cancel');
  const cancelButtonclick = () => {
    onClose();
  };

  const otpScreenClick = () => {
    otpScreen();
  };

  const tryagainButtonclick = () => {
    try {
      if (doNotShow != null && doNotShow != undefined) {
        doNotShow(checked);
      }
    } catch (e) {}
    try {
      tryagainClick(checked);
    } catch (e) {}
  };

  const [compatibleDevices, setCompatibleDevices] = useState([]);
  const [compatibleDevHeading, setCompatibleDevHeading] = useState(null);
  const [iconName, setIconName] = useState('circle-o');
  const [checked, setCheckBox] = useState(false);

  const key_getcompatibledevices = `${global.UniqueToken}_GET_COMPATIBLE_DEVICES`;
  const howToActivateArray = [
    t('download'),
    t('settingWay'),
    t('TapOn'),
    t('useHandset'),
    'Please make sure you are connected to a WiFi network',
    t('willActivate'),
  ];

  useEffect(() => {
    if (designmode === 3) {
      // calling api for specific bottom popup ie. designmode = 3
      getCompatibleDevices.mutate();
    }
  }, [doNotFlag]);

  const getCompatibleDevices = useMutation(
    req =>
      callQueryapi({
        queryKey: [key_getcompatibledevices, GET_COMPATIBLE_DEVICES, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setCompatibleDevices(udata?.data?.response?.devices);
        setCompatibleDevHeading(udata?.data?.response?.heading);
      },
      onError: (uerror, variables, context) => {},
    }
  );
  const donotshow = () => {
    setCheckBox(!checked);
  };
  const onCloseFun = () => {
    setCheckBox(false);
    onClose();
  };
  return (
    <View {...UnitTestProps('bottompopup', 'view', '1')}>
      <Modal
        {...UnitTestProps('bottompopup', 'modal', '1')}
        transparent={visible}
        visible={visible}
        animationType="slide"
        statusBarTranslucent>
        <View
          {...UnitTestProps('bottompopup', 'view', '2')}
          style={styles.backgroundViewContainer}>
          <TouchableWithoutFeedback
            {...UnitTestProps(
              'bottompopup',
              'touchablewithoutfeedback',
              'onhide'
            )}
            onPress={() => (type === 'rating' ? onHide() : onCloseFun())}>
            <View
              {...UnitTestProps('bottompopup', 'view', '3')}
              style={styles.container}
            />
          </TouchableWithoutFeedback>
          <View
            {...UnitTestProps('bottompopup', 'view', '4')}
            style={[
              styles.topViewContainer,
              {
                height:
                  type === 'smartpay'
                    ? heightPixel(height)
                    : type === 'esimcode'
                    ? heightPixel(490)
                    : type === 'eSIMCompatibleDevices'
                    ? heightPixel(400)
                    : heightPixel(300),
              },
            ]}>
            {showIcon ? (
              <View
                {...UnitTestProps('bottompopup', 'view', '5')}
                style={styles.iconContainer}>
                {type === 'smartpay' ? (
                  <Image
                    {...UnitTestProps('bottompopup', 'image', 'smartenable')}
                    source={require('../../src/assets/smartenable.png')}
                    style={styles.imageSmartContainer}
                    resizeMode={'contain'}
                  />
                ) : type === 'rating' ? (
                  <Image
                    {...UnitTestProps('bottompopup', 'image', 'thumbsup')}
                    source={require('../../src/assets/thumbsup.png')}
                    style={styles.imageSmartContainer}
                    resizeMode={'contain'}
                  />
                ) : type === 'wifi' ? (
                  <LottieView
                    source={require('../../src/assets/wifitakeovernew.json')}
                    autoPlay
                    loop
                    style={{
                      height: HEIGHT_100,
                      width: HEIGHT_100,
                      marginTop: VERTICAL_35,
                    }}
                  />
                ) : type === 'validuser' ? (
                  <Image
                    {...UnitTestProps('bottompopup', 'image', 'deviceicon')}
                    source={require('../../src/assets/deviceicon.png')}
                    style={styles.imageContainer}
                    resizeMode={'contain'}
                  />
                ) : (
                  <Image
                    {...UnitTestProps('bottompopup', 'image', 'infoicon')}
                    source={
                      showInfoIcon
                        ? require('../../src/assets/infoicon.png')
                        : require('../../src/assets/emoji.png')
                    }
                    style={styles.imageContainer}
                    resizeMode={'contain'}
                  />
                )}
              </View>
            ) : null}

            {type === 'wifi' && (
              <TouchableOpacity
                onPress={() => onCloseFun()}
                style={styles.wifiCloseIconView}>
                <Image
                  {...UnitTestProps('bottompopup', 'image', 'deviceicon')}
                  source={require('../../src/assets/close.png')}
                  style={styles.wifiCloseImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
            )}

            {designmode != 6 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '6')}
                style={
                  designmode === 3 || designmode === 5
                    ? styles.msgContainerWithoutFlex
                    : styles.msgContainer
                }>
                {type === 'smartpay' ||
                type === 'rating' ||
                type === 'validuser' ? (
                  <Text
                    {...UnitTestProps('bottompopup', 'text', 'title')}
                    style={styles.textTitleContainer}
                    numberOfLines={5}
                    ellipsizeMode={'tail'}>
                    {title}
                  </Text>
                ) : null}

                {type === 'wifi' ? (
                  <Text
                    {...UnitTestProps('bottompopup', 'text', 'title')}
                    style={styles.wifiTitleText}
                    numberOfLines={5}
                    ellipsizeMode={'tail'}>
                    {title}
                  </Text>
                ) : null}

                <Text
                  {...UnitTestProps('bottompopup', 'text', 'message')}
                  style={
                    type === 'wifi'
                      ? styles.wifitakeovermsg
                      : designmode === 3 || designmode === 5
                      ? styles.boldTextContainer
                      : styles.textContainer
                  }
                  numberOfLines={7}
                  ellipsizeMode={'tail'}>
                  {compatibleDevHeading || message}
                </Text>
              </View>
            )}
            {designmode == 1 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '7')}
                style={styles.buttonsViewContainer}>
                <ModalPageButton
                  {...UnitTestProps('bottompopup', 'modalpagebutton', '1')}
                  title={buttonName}
                  onPress={tryagainButtonclick}
                  customStyle={
                    type === 'smartpay'
                      ? styles.tryagainSmartBtnContainer
                      : styles.tryagainBtnContainer
                  }
                  customTextStyle={
                    type === 'smartpay'
                      ? styles.tryagainSmartBtnText
                      : type !== 'rating'
                      ? [styles.tryagainBtnText, {textTransform: 'uppercase'}]
                      : styles.tryagainBtnText
                  }
                />
                {type === 'smartpay' ? (
                  <ModalPageButton
                    {...UnitTestProps('bottompopup', 'modalpagebutton', '2')}
                    title={type === 'smartpay' ? t('Cancel') : t('cancel')}
                    onPress={cancelButtonclick}
                    customStyle={
                      type === 'smartpay'
                        ? styles.cancelSmartBtnContainer
                        : styles.cancelBtnContainer
                    }
                    customTextStyle={
                      type === 'smartpay'
                        ? styles.cancelSmartBtnText
                        : styles.cancelBtnText
                    }
                  />
                ) : null}
              </View>
            )}

            {designmode == 2 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '8')}
                style={styles.buttonsViewContainerside}>
                <ModalPageButton
                  {...UnitTestProps('bottompopup', 'modalpagebutton', '3')}
                  title={
                    type === 'rating'
                      ? t('home')
                      : noBtnName
                      ? noBtnName
                      : t('cancel')
                  }
                  onPress={
                    type === 'validuser' ? otpScreenClick : cancelButtonclick
                  }
                  customStyle={[
                    styles.cancelBtnContainerside,
                    type === 'validuser' && hideBtnName
                      ? {width: SCREEN_WIDTH - WIDTH_30}
                      : type === 'wifi'
                      ? {padding: WIDTH_6}
                      : {},
                  ]}
                  customTextStyle={styles.cancelBtnText}
                />
                {!hideBtnName && (
                  <ModalPageButton
                    {...UnitTestProps('bottompopup', 'modalpagebutton', '4')}
                    numberOfLines={1}
                    title={buttonName}
                    onPress={tryagainButtonclick}
                    customStyle={
                      type === 'validuser'
                        ? [
                            styles.tryagainBtnContainerside,
                            {
                              width: I18nManager.isRTL ? WIDTH_160 : WIDTH_160,
                              padding: I18nManager.isRTL ? WIDTH_8 : WIDTH_8,
                            },
                          ]
                        : type === 'wifi'
                        ? [styles.tryagainBtnContainerside, {padding: WIDTH_6}]
                        : styles.tryagainBtnContainerside
                    }
                    customTextStyle={
                      type !== 'rating'
                        ? [
                            styles.tryagainBtnText,
                            {
                              textTransform: 'uppercase',
                              textAlign: I18nManager.isRTL ? 'left' : 'center',
                            },
                          ]
                        : styles.tryagainBtnText
                    }
                  />
                )}
              </View>
            )}

            {designmode == 3 && (
              <>
                {getCompatibleDevices.isLoading && (
                  <View
                    {...UnitTestProps('bottompopup', 'view', '9')}
                    style={styles.loading}>
                    <ActivityIndicator
                      size="large"
                      color={colors.OOREDOO_RED}
                    />
                  </View>
                )}

                <ScrollView style={styles.scrollContainer} bounces={true}>
                  {compatibleDevices &&
                    compatibleDevices.map((v, k) => {
                      return (
                        <View
                          {...UnitTestProps('bottompopup', 'view', '10')}
                          key={k}
                          style={styles.compatibleDeviceContainer}>
                          <Text
                            {...UnitTestProps('bottompopup', 'text', 'device')}
                            style={styles.brandName}>
                            {v.device}
                          </Text>
                          <Text
                            {...UnitTestProps('bottompopup', 'text', 'model')}
                            style={styles.modelName}>
                            {`${t('Model')}: ${v.model}`}
                          </Text>
                        </View>
                      );
                    })}
                </ScrollView>

                <View
                  {...UnitTestProps('bottompopup', 'view', '12')}
                  style={{marginVertical: 25}}>
                  <ModalPageButton
                    {...UnitTestProps('bottompopup', 'modalpagebutton', '5')}
                    title={t('close')}
                    onPress={cancelButtonclick}
                    customStyle={styles.tryagainBtnContainerside}
                    customTextStyle={
                      type !== 'rating'
                        ? [styles.tryagainBtnText, {textTransform: 'uppercase'}]
                        : styles.tryagainBtnText
                    }
                  />
                </View>
              </>
            )}

            {designmode == 4 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '11')}
                style={[
                  styles.buttonsViewContainerside,
                  {
                    paddingHorizontal: HORIZONTAL_16,
                    paddingBottom: HORIZONTAL_16,
                  },
                ]}>
                <LandingPageButton
                  title={buttonName}
                  onPress={tryagainButtonclick}
                  customStyle={styles.fullWidthFillBtn}
                  customTextStyle={
                    type !== 'rating'
                      ? [styles.tryagainBtnText, {textTransform: 'uppercase'}]
                      : styles.tryagainBtnText
                  }
                />
              </View>
            )}

            {designmode == 5 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '13')}
                style={{marginBottom: VERTICAL_10}}>
                <ScrollView
                  bounces={false}
                  style={{maxHeight: heightPixel(320)}}
                  showsHorizontalScrollIndicator={false}
                  showsVerticalScrollIndicator={false}
                  horizontal={false}>
                  <View
                    {...UnitTestProps('bottompopup', 'view', '14')}
                    style={{flex: 1}}>
                    {howToActivateArray.map((item, index) => {
                      return (
                        <View
                          {...UnitTestProps('bottompopup', 'view', '15')}
                          style={{
                            flexDirection: 'row',
                            marginVertical: VERTICAL_10,
                          }}>
                          <View
                            {...UnitTestProps('bottompopup', 'view', '16')}
                            style={{}}>
                            <Icon
                              name="dot-single"
                              size={FONT_28}
                              color={colors.RED}
                            />
                          </View>
                          <View
                            {...UnitTestProps('bottompopup', 'view', '17')}
                            style={{
                              paddingRight: HORIZONTAL_23,
                              justifyContent: 'center',
                            }}>
                            {index === 4 ? (
                              <Text
                                {...UnitTestProps(
                                  'bottompopup',
                                  'text',
                                  'Please make sure you are connected to a WiFi network'
                                )}
                                numberOfLines={2}
                                style={{
                                  fontFamily: NOTOSANS_REGULAR_FONT,
                                  color: colors.OOREDOO_BLACK,
                                  fontSize: FONT_14,
                                  lineHeight: FONT_24,
                                  textAlign: 'left',
                                }}>
                                {I18nManager.isRTL
                                  ? '\u062a\u0623\u0643\u062f \u0645\u0646 \u0627\u0646\u0643 \u0645\u062a\u0635\u0644 \u0628\u0634\u0628\u0643\u0629 \u0627\u0644\u0627\u0646\u062a\u0631\u0646\u062a \u0057\u0049\u0046\u0049 '
                                  : 'Please make sure you are connected to a WiFi network'}
                              </Text>
                            ) : (
                              <Text
                                {...UnitTestProps('bottompopup', 'text', item)}
                                style={{
                                  fontFamily: NOTOSANS_REGULAR_FONT,
                                  color: colors.OOREDOO_BLACK,
                                  fontSize: FONT_14,
                                  lineHeight: FONT_24,
                                }}>
                                {item}
                              </Text>
                            )}
                          </View>
                        </View>
                      );
                    })}
                  </View>
                </ScrollView>
                <View
                  {...UnitTestProps('bottompopup', 'view', '18')}
                  style={{
                    marginVertical: VERTICAL_10,
                    alignSelf: 'center',
                  }}>
                  <LandingPageButton
                    title={t('close')}
                    onPress={cancelButtonclick}
                    customStyle={styles.tryagainBtnContainerside}
                    customTextStyle={
                      type !== 'rating'
                        ? [styles.tryagainBtnText, {textTransform: 'uppercase'}]
                        : styles.tryagainBtnText
                    }
                  />
                </View>
              </View>
            )}

            {designmode == 6 && (
              <View
                {...UnitTestProps('bottompopup', 'view', '19')}
                style={{
                  marginHorizontal: 5,
                  alignItems: 'center',
                  backgroundColor: 'white',
                  alignSelf: 'center',
                  flex: 1,
                }}>
                <View
                  {...UnitTestProps('bottompopup', 'view', '20')}
                  style={{flex: 0.5}}>
                  <Text
                    {...UnitTestProps('bottompopup', 'text', message)}
                    style={{
                      fontFamily: NOTOSANS_REGULAR_FONT,
                      fontSize: FONT_18,
                      textAlign: 'center',
                    }}>
                    {message}
                  </Text>
                </View>

                <View {...UnitTestProps('bottompopup', 'view', '21')} />
                <View
                  {...UnitTestProps('bottompopup', 'view', '22')}
                  style={{
                    flex: 0.2,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  {!checked ? (
                    <Iconcheckedbox
                      {...UnitTestProps('bottompopup', 'iconbox', '1')}
                      name={'checkbox-blank-outline'}
                      size={25}
                      style={styles.icon}
                      color={colors.LIGHT_GREY}
                      background={colors.WHITE}
                      checked={false}
                      onPress={() => donotshow()}
                    />
                  ) : (
                    <Iconcheckedbox
                      {...UnitTestProps('bottompopup', 'iconbox', '2')}
                      name={'checkbox-marked'}
                      size={25}
                      style={styles.icon}
                      color={colors.BLACK}
                      background={colors.WHITE}
                      checked={false}
                      onPress={() => donotshow()}
                    />
                  )}

                  <Text
                    {...UnitTestProps('bottompopup', 'text', confirmText)}
                    style={{
                      fontFamily: NOTOSANS_REGULAR_FONT,
                      fontSize: FONT_18,
                      color: colors.BLACK,
                      textAlign: 'center',
                    }}>
                    {confirmText}
                  </Text>
                </View>
                <View
                  {...UnitTestProps('bottompopup', 'view', '23')}
                  style={{
                    marginVertical: VERTICAL_15,
                    background: 'grey',
                    flex: 0.3,
                  }}>
                  <ModalPageButton
                    {...UnitTestProps('bottompopup', 'modalpagebutton', '6')}
                    title={buttonName}
                    onPress={tryagainButtonclick}
                    customStyle={[
                      styles.cancelBtnContainerside,
                      {
                        width: WIDTH_300,
                        backgroundColor: colors.OOREDOO_RED,
                        borderColor: colors.OOREDOO_RED,
                      },
                    ]}
                    customTextStyle={[
                      styles.cancelBtnText,
                      {color: colors.WHITE},
                    ]}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BottomPoppup;

// These are user defined styles
const styles = StyleSheet.create({
  iconContainer: {
    flex: 0.3,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    width: FULL_WIDTH_PERCENTAGE,
  },
  msgContainer: {
    marginHorizontal: 20,
    flex: 0.7,
    justifyContent: 'center',
  },
  msgContainerWithoutFlex: {
    marginHorizontal: 20,
    marginVertical: 30,
    justifyContent: 'center',
  },
  backgroundViewContainer: {
    // justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#000000aa',
  },
  topViewContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    height: heightPixel(400),
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    // justifyContent: 'flex-end',
    borderTopLeftRadius: BORDER_RADIUS_15,
    borderTopRightRadius: BORDER_RADIUS_15,
    alignSelf: 'flex-end',
  },
  imageSmartContainer: {
    width: WIDTH_70,
    height: WIDTH_70,
    marginTop: VERTICAL_35,
  },
  imageContainer: {
    width: WIDTH_40,
    height: WIDTH_40,
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_18,
    lineHeight: FONT_30,
    fontFamily: NOTOSANS_REGULAR_FONT,
  },
  textTitleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_20,
    lineHeight: FONT_38,
    fontFamily: NOTOSANS_BOLD_FONT,
  },
  wifiTitleText: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_20,
    lineHeight: FONT_30,
    fontWeight: '500',
    color: colors.BLACK,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginTop: VERTICAL_35,
  },
  wifiCloseIconView: {
    height: HEIGHT_35,
    width: HEIGHT_35,
    position: 'absolute',
    right: 10,
    top: 5,
  },
  wifiCloseImage: {height: HEIGHT_35, width: HEIGHT_35},
  boldTextContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_24,
    lineHeight: FONT_32,
    fontFamily: OOREDOO_HEAVY_FONT,
  },
  wifitakeovermsg: {
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    fontSize: FONT_16,
    lineHeight: FONT_26,
    fontFamily: NOTOSANS_LIGHT_FONT,
    maxWidth: widthPixel(296),
    marginTop: VERTICAL_10,
  },
  tryagainSmartBtnContainer: {
    padding: WIDTH_10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_30,
    width: '50%',
  },
  tryagainBtnContainer: {
    padding: WIDTH_10,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_20,
    width: '90%',
    marginTop: 15,
  },
  tryagainSmartBtnText: {
    fontFamily: NOTOSANS_BOLD_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_26,
    color: colors.WHITE,
    marginVertical: VERTICAL_5,
    textTransform: 'capitalize',
  },
  tryagainBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,
    marginVertical: VERTICAL_5,
  },
  cancelSmartBtnContainer: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_20,
    width: '50%',
    marginTop: 20,
  },
  cancelBtnContainer: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_20,
    width: '90%',
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    marginTop: 20,
  },
  cancelSmartBtnText: {
    fontFamily: NOTOSANS_BOLD_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_26,
    color: colors.OOREDOO_RED,
    marginVertical: VERTICAL_5,
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
    alignSelf: 'center',
    flex: 0.6,
  },
  buttonsViewContainerside: {
    width: WINDOW_WIDTH,
    backgroundColor: colors.WHITE,
    alignItems: 'center',
    flex: 0.5,
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

  scrollContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    // borderWidth: 1,
    // height:heightPixel(300)
  },
  compatibleDeviceContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    backgroundColor: colors.WHITE,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  brandName: {
    fontSize: FONT_16,
    lineHeight: FONT_26,
    fontFamily: OOREDOO_HEAVY_FONT,
    minHeight: heightPixel(16),
    textAlign: 'left',
  },
  modelName: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: NOTOSANS_REGULAR_FONT,
    minHeight: heightPixel(12),
    textAlign: 'left',
    color: colors.SKY_BLUE,
  },
  fullWidthFillBtn: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    width: FULL_WIDTH_PERCENTAGE,
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
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
  checkbox: {
    marginHorizontal: HORIZONTAL_SCALE_35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
