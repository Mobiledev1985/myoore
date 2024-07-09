import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import {Modal, View} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FULL_WIDTH_PERCENTAGE,
  SCALE_SIZE_25,
} from '../../commonHelper/Constants';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_25,
  BORDER_RADIUS_8,
  FONT_13,
  FONT_14,
  FONT_20,
  FONT_24,
  FONT_28,
  FONT_35,
  FONT_38,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_14,
  HEIGHT_19,
  HEIGHT_25,
  HEIGHT_30,
  HEIGHT_36,
  HEIGHT_39,
  HEIGHT_4,
  HEIGHT_40,
  HEIGHT_46,
  HEIGHT_50,
  HEIGHT_54,
  HEIGHT_700,
  HEIGHT_8,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_12,
  WIDTH_14,
  WIDTH_15,
  WIDTH_18,
  WIDTH_20,
  WIDTH_22,
  WIDTH_26,
  WIDTH_27,
  WIDTH_28,
  WIDTH_3,
  WIDTH_326,
  WIDTH_38,
  WIDTH_4,
  WIDTH_50,
} from '../../resources/styles/responsive';
import {
  GOOGLEPAY_FONT,
  NOTOSANS_BOLD_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {Text} from 'react-native';
import {FlatList} from 'react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import {Image} from 'react-native';
import ImageComponent from '../../models/basic/ImageComponent';
import {ScrollView} from 'react-native-gesture-handler';
import {I18nManager} from 'react-native';
import {useTranslation} from 'react-i18next';
import {
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';

const PaySelectionModal = ({
  visible,
  onClose,
  paymentList,
  selectedMethod,
  selectedIndex,
  onAddCardPress,
  data,
}) => {
  const [selected, setSelected] = useState(selectedIndex ? selectedIndex : '');
  const [selMethod, setSelMethod] = useState('');
  const {t} = useTranslation();

  useEffect(() => {
    setSelected(selectedIndex);
    if (paymentList) {
      setSelMethod(paymentList[selectedIndex]);
    }
  }, [selectedIndex]);

  const renderItem = ({item, index}) => {
    return (
      <>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => {
            setSelected(index);
            setSelMethod(item);
          }}>
          {item?.optiontype?.toUpperCase() === 'APPLE PAY' ||
          item?.optiontype?.toUpperCase() === 'APPLEPAY' ? (
            <View
              style={[
                styles.payAppleselected,
                {
                  borderWidth: 1.5,
                  borderColor:
                    index === selected ? colors.RED_COLOR : colors.BLACK,
                  backgroundColor: item?.disabled
                    ? colors.SNOW_GREY
                    : colors.OOREDOO_BLACK,
                },
              ]}>
              {I18nManager.isRTL ? (
                <>
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.applepaymodetextArabic,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                          marginHorizontal: HORIZONTAL_5,
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.applepaymodetext,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                        },
                      ]}>
                      {t('applepay')}
                    </Text>
                  </View>
                  <View style={styles.applepayimgsec}>
                    <ImageComponent
                      iwidth={WIDTH_18}
                      iheight={WIDTH_18}
                      type="image"
                      source={item.iconpath}
                      resizeMode={'contain'}
                      style={[
                        item?.disabled ? styles.payimgdisable : styles.payimg,
                        {
                          tintColor: colors.WHITE,
                        },
                      ]}
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.applepaymodetext,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                          marginHorizontal: HORIZONTAL_5,
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View>
                  <View style={styles.applepayimgsec}>
                    <ImageComponent
                      iwidth={WIDTH_18}
                      iheight={WIDTH_18}
                      type="image"
                      source={item.iconpath}
                      resizeMode={'contain'}
                      style={[
                        item?.disabled ? styles.payimgdisable : styles.payimg,
                        {
                          tintColor: colors.WHITE,
                        },
                      ]}
                    />
                  </View>
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.applepaymodetext,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                          marginLeft: WIDTH_3,
                        },
                      ]}>
                      {t('applepay')}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ) : item?.optiontype?.toUpperCase() === 'GOOGLE PAY' ||
            item?.optiontype?.toUpperCase() === 'GOOGLEPAY' ? (
            <View
              style={[
                styles.payAppleselected,
                {
                  //borderWidth: 1.4,
                  borderColor:
                    index === selected ? colors.RED_COLOR : '#DADCE0',
                  minHeight: HEIGHT_54,
                  backgroundColor: colors.WHITE,
                  // elevation: paymentCode.current != null &&
                  // paymentCode.current == item?.optiontype &&
                  // position != null &&
                  // position == item?.index  ? 0 : 1.2,
                  // shadowColor: '#000',
                  borderWidth: 1.5,
                  // borderColor: colors.SILVER,
                  borderRadius: HEIGHT_8,
                  // backgroundColor: item?.disabled
                  //   ? colors.SNOW_GREY
                  //   : colors.OOREDOO_BLACK,
                  // borderRadius: HEIGHT_25,
                },
              ]}>
              {I18nManager.isRTL ? (
                <>
                  {/* <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.googlepaymodetextArabic,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                          marginHorizontal: HORIZONTAL_5,
                          fontFamily: OOREDOO_HEAVY_FONT,
                          fontSize: FONT_14,
                          lineHeight: FONT_24,
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View> */}
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.googlepaymodeEndtext,
                        {
                          color: item?.disabled ? colors.GREY : '#5E6164',
                          // lineHeight: FONT_38,
                          fontFamily: GOOGLEPAY_FONT,
                          fontSize: 20,
                          lineHeight: FONT_35,
                        },
                      ]}>
                      {t('applepay')}
                    </Text>
                  </View>
                  <View
                    style={[styles.applepayimgsec, {marginLeft: HORIZONTAL_5}]}>
                    <ImageComponent
                      iwidth={WIDTH_18}
                      iheight={WIDTH_18}
                      type="image"
                      source={item.iconpath}
                      resizeMode={'contain'}
                      style={
                        item?.disabled ? styles.payimgdisable : styles.payimg
                      }
                    />
                  </View>
                </>
              ) : (
                <>
                  {/* <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.googlepaymodetext,
                        {
                          color: item?.disabled ? colors.GREY : colors.WHITE,
                          marginHorizontal: HORIZONTAL_5,
                          fontFamily: GOOGLEPAY_FONT,
                          fontSize: 18,
                          lineHeight: FONT_24,
                        },
                      ]}>
                      {item.title}
                    </Text>
                  </View> */}
                  <View style={styles.applepayimgsec}>
                    <ImageComponent
                      iwidth={WIDTH_18}
                      iheight={WIDTH_18}
                      type="image"
                      source={item.iconpath}
                      resizeMode={'contain'}
                      style={
                        item?.disabled ? styles.payimgdisable : styles.payimg
                      }
                    />
                  </View>
                  <View style={styles.applepaymodetextview}>
                    <Text
                      style={[
                        styles.googlepaymodeEndtext,
                        {
                          color: item?.disabled ? colors.GREY : '#5E6164',
                          paddingLeft: 3,
                          fontFamily: GOOGLEPAY_FONT,
                          fontSize: 20,
                          lineHeight: FONT_24,
                        },
                      ]}>
                      {t('applepay')}
                    </Text>
                  </View>
                </>
              )}
            </View>
          ) : (
            <View
              style={[
                styles.itemContainer,
                {
                  borderColor:
                    index === selected ? colors.RED_COLOR : colors.INACTIVEDOT,
                  marginTop: index == 0 ? 0 : HEIGHT_14,
                },
              ]}>
              <ImageComponent
                type="image"
                iwidth={WIDTH_38}
                iheight={HEIGHT_25}
                source={item?.iconpath}
                resizeMode={'contain'}
              />

              <Text style={styles.itemTitle}>{item?.title}</Text>

              <View style={styles.itemContainer1}>
                <View style={styles.itemContainer2}>
                  {index === selected ? (
                    <View style={styles.itemOutercircle}>
                      <View style={styles.itemInnerCircle} />
                    </View>
                  ) : (
                    <View style={styles.itemOuterGrey}></View>
                  )}
                </View>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </>
    );
  };

  return (
    <Modal
      statusBarTranslucent
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        style={styles.mainView}
        onPress={() => {
          onClose();
        }}
        activeOpacity={1}>
        <TouchableOpacity style={styles.innerView} activeOpacity={1}>
          <View style={styles.lineView}></View>

          <View style={styles.titleView}>
            <Text style={styles.titleText}>
              {data?.popup_select_payment_method}
            </Text>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={true}
            bounces={true}
            style={styles.scrollView}>
            <FlatList
              bounces={false}
              data={paymentList}
              renderItem={renderItem}
              showsVerticalScrollIndicator={false}
            />
          </ScrollView>

          <View style={styles.btnView}>
            {!global.logintype ||
            global.ssoProfileStatus === null ||
            global.ssoProfileStatus === undefined ||
            global.ssoProfileStatus === '' ||
            global.ssoProfileStatus !== '0' ? null : (
              <LandingPageButton
                numberOfLines={1}
                title={data?.add_cart_btn + ' +'}
                onPress={() => {
                  onAddCardPress();
                }}
                customStyle={styles.btnContainer1}
                customTextStyle={styles.btnText1}
              />
            )}
            <LandingPageButton
              title={data?.select_btn}
              numberOfLines={1}
              disabled={
                selMethod != null && selMethod != undefined && selMethod != ''
                  ? false
                  : true
              }
              onPress={() => {
                selectedMethod(selMethod, selected);
                onClose();
              }}
              customStyle={[
                styles.btnContainer2,
                {
                  backgroundColor:
                    selMethod != null &&
                    selMethod != undefined &&
                    selMethod != ''
                      ? colors.OOREDOO_RED
                      : colors.LIGHT_GREY,
                },
              ]}
              customTextStyle={styles.btnText2}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default PaySelectionModal;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },

  innerView: {
    height: 'auto',
    maxHeight: HEIGHT_700,
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
  },
  lineView: {
    width: WIDTH_50,
    height: HEIGHT_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    alignSelf: 'center',
    marginTop: HEIGHT_10,
    borderRadius: 4,
  },
  titleView: {
    marginTop: HEIGHT_36,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    marginLeft: WIDTH_27,
    textAlign: 'left',
  },
  scrollView: {
    marginTop: HEIGHT_39,
    marginHorizontal: WIDTH_20,
  },
  btnView: {
    marginTop: HEIGHT_40,
    marginBottom: HEIGHT_30,
    alignSelf: 'center',
  },
  btnContainer1: {
    width: isTablet ? SCREEN_WIDTH - widthPixel(45) : WIDTH_326,
    height: HEIGHT_46,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS_25,
    marginLeft: WIDTH_22,
    marginRight: WIDTH_28,
  },
  btnText1: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.OOREDOO_RED,
  },
  btnContainer2: {
    width: isTablet ? SCREEN_WIDTH - widthPixel(45) : WIDTH_326,
    height: HEIGHT_46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: SCALE_SIZE_25,
    marginLeft: WIDTH_22,
    marginRight: WIDTH_28,
    marginTop: HEIGHT_12,
    left: isTablet ? WIDTH_4 : 0,
  },
  btnText2: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.WHITE,
  },
  itemContainer: {
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: colors.BG_COLOR_WHITE,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    // shadowColor: colors.BLACK,
    shadowOpacity: 0.3,
    paddingBottom: HEIGHT_19,
    flexDirection: 'row',
    padding: 15,
    elevation: 1,
    alignItems: 'center',
    margin: VERTICAL_5,
  },
  itemTitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    alignText: 'left',
    marginLeft: WIDTH_15,
  },
  itemContainer1: {
    position: 'absolute',
    right: WIDTH_14,
  },
  itemContainer2: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  itemOutercircle: {
    width: WIDTH_20,
    height: WIDTH_20,
    borderRadius: WIDTH_20 / 2,
    backgroundColor: colors.OOREDOO_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInnerCircle: {
    width: WIDTH_12,
    height: WIDTH_12,
    borderRadius: BORDER_RADIUS_8,
    backgroundColor: colors.WHITE,
  },
  itemOuterGrey: {
    width: WIDTH_20,
    height: WIDTH_20,
    borderRadius: WIDTH_20 / 2,
    borderWidth: 1,
    borderColor: colors.OOREDDO_LIGHT_GREY,
  },
  payAppleselected: {
    flex: 1,
    minHeight: HEIGHT_50,
    paddingHorizontal: WIDTH_10,
    marginVertical: VERTICAL_10,
    borderRadius: HEIGHT_8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    margin: VERTICAL_5,
  },
  applepayimgsec: {
    justifyContent: 'center',
  },
  applepaymodetextview: {},
  applepaymodetextArabic: {
    fontFamily: NOTOSANS_BOLD_FONT,
    fontSize: FONT_20,
    lineHeight: FONT_38,
    color: colors.OOREDOO_BLACK,
  },
  applepaymodetext: {
    fontFamily: NOTOSANS_BOLD_FONT,
    fontSize: FONT_20,
    lineHeight: FONT_28,
    color: colors.OOREDOO_BLACK,
  },
  googlepaymodetext: {
    // fontFamily: NOTOSANS_REGULAR_FONT,
    // fontSize: FONT_16,
    // lineHeight: FONT_28,
    color: colors.OOREDOO_BLACK,
  },
  googlepaymodeEndtext: {
    // fontFamily: NOTOSANS_REGULAR_FONT,
    // fontSize: FONT_20,
    // lineHeight: FONT_28,
    color: colors.OOREDOO_BLACK,
  },
});
