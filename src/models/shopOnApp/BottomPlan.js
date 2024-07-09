import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import colors from '../../resources/styles/colors';
import {
  OOREDOO_REGULAR_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_1,
  BORDER_RADIUS_10,
  BORDER_RADIUS_25,
  FONT_13,
  FONT_14,
  FONT_20,
  FONT_23,
  FONT_26,
  HEIGHT_11,
  HEIGHT_12,
  HEIGHT_13,
  HEIGHT_14,
  HEIGHT_15,
  HEIGHT_19,
  HEIGHT_30,
  HEIGHT_4,
  HEIGHT_8,
  HORIZONTAL_10,
  HORIZONTAL_12,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_25,
  HORIZONTAL_28,
  HORIZONTAL_5,
  HORIZONTAL_6,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_16,
  VERTICAL_5,
  WIDTH_11,
  WIDTH_167,
  WIDTH_27,
  WIDTH_30,
  WIDTH_50,
} from '../../resources/styles/responsive';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {
  getGlobalSettingValue,
  shopPriceCalculation,
} from '../../services/CommonUtils';
import ToolTip from './ToolTip';
import ImageComponent from '../basic/ImageComponent';
import DashedLine from 'react-native-dashed-line';

const BottomPopUp = ({
  visible,
  onClose,
  selectedPlandata,
  parentProduct,
  childProduct,
  simType,
  type,
  outstandingamount,
  numberSelected,
}) => {
  const {t} = useTranslation();
  const [webViewHeight, setWebViewHeight] = useState(null);
  const [contentRendered, setContentRendered] = useState(false);
  const [isPayMntPressed, setPayMntPressed] = useState(false);
  const [isPayAdvcPressed, setPayAdvcPressed] = useState(false);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      statusBarTranslucent
      onRequestClose={() => {
        onClose();
      }}>
      <>
        <TouchableOpacity
          style={{flex: 1, backgroundColor: colors.BLACK_TRANS_BG}}
          activeOpacity={1}
          onPress={() => {
            onClose();
          }}
        />
        <View
          style={styles.modalViewContainer}

          // activeOpacity={1}
        >
          <View
            // onPress={() => {}}
            // activeOpacity={1}
            style={styles.popupContainer}>
            <TouchableOpacity
              activeOpacity={0.5}
              style={styles.lineView}
              onPress={() => {
                onClose();
              }}
            />

            <View style={styles.titleView}>
              <Text style={styles.title}>
                {childProduct?.productname
                  ? childProduct?.productname
                  : parentProduct?.productname}
              </Text>

              {global.NewSimNumberSliderItem?.MSISDN || numberSelected ? (
                <Text style={styles.ooredooText}>
                  {global.NewSimNumberSliderItem?.MSISDN || numberSelected}
                </Text>
              ) : null}
            </View>

            <View style={styles.dashedLineView}>
              <DashedLine
                dashLength={5}
                dashThickness={0.5}
                dashGap={2}
                dashColor={colors.OOREDDO_LIGHT_GREY}
              />
            </View>

            <ScrollView
              contentContainerStyle={[styles.ScrollView]}
              showsVerticalScrollIndicator={true}
              alwaysBounceVertical={true}
              scrollEnabled={true}
              nestedScrollEnabled={true}
              bounces={true}>
              <View style={{}}>
                <View style={[styles.unlimitedView, {flex: 1}]}>
                  <AutoHeightWebView
                    scrollEnabled={true}
                    source={{
                      html:
                        Platform.OS !== 'ios'
                          ? childProduct?.planbenefits
                            ? childProduct?.planbenefits
                                .replace(
                                  '$RUBIC_SEMIBOLD$',
                                  'file:////android_asset/fonts/Rubik-SemiBold.ttf'
                                )
                                .replace(
                                  '$RUBIC_REGULAR$',
                                  'file:////android_asset/fonts/Rubik-Regular.ttf'
                                )
                                .replace(
                                  '$NOTOKUFI_SEMIBOLD$',
                                  'file:////android_asset/fonts/NotoKufiArabic-Bold.ttf'
                                )
                                .replace(
                                  '$NOTOKUFI_REGULAR$',
                                  'file:////android_asset/fonts/NotoKufiArabic-Regular.ttf'
                                )
                            : parentProduct?.planbenefits
                                .replace(
                                  '$RUBIC_SEMIBOLD$',
                                  'file:////android_asset/fonts/Rubik-SemiBold.ttf'
                                )
                                .replace(
                                  '$RUBIC_REGULAR$',
                                  'file:////android_asset/fonts/Rubik-Regular.ttf'
                                )
                                .replace(
                                  '$NOTOKUFI_SEMIBOLD$',
                                  'file:////android_asset/fonts/NotoKufiArabic-Bold.ttf'
                                )
                                .replace(
                                  '$NOTOKUFI_REGULAR$',
                                  'file:////android_asset/fonts/NotoKufiArabic-Regular.ttf'
                                )
                          : childProduct?.planbenefits
                          ? childProduct?.planbenefits
                              .replace(
                                '$RUBIC_SEMIBOLD$',
                                getGlobalSettingValue('rubiksemiboldfont')
                              )
                              .replace(
                                '$RUBIC_REGULAR$',
                                getGlobalSettingValue('rubikregularfont')
                              )
                              .replace(
                                '$NOTOKUFI_SEMIBOLD$',
                                getGlobalSettingValue('notokufiarabicsemibold')
                              )
                              .replace(
                                '$NOTOKUFI_REGULAR$',
                                getGlobalSettingValue('notokufiarabicregular')
                              )
                          : parentProduct?.planbenefits
                              .replace(
                                '$RUBIC_SEMIBOLD$',
                                getGlobalSettingValue('rubiksemiboldfont')
                              )
                              .replace(
                                '$RUBIC_REGULAR$',
                                getGlobalSettingValue('rubikregularfont')
                              )
                              .replace(
                                '$NOTOKUFI_SEMIBOLD$',
                                getGlobalSettingValue('notokufiarabicsemibold')
                              )
                              .replace(
                                '$NOTOKUFI_REGULAR$',
                                getGlobalSettingValue('notokufiarabicregular')
                              ),
                    }}
                    onSizeUpdated={size => {
                      // if (!contentRendered) {
                      //   setWebViewHeight(size.height);
                      //   setTimeout(() => {
                      //     setContentRendered(true);
                      //   }, 500);
                      // }
                      // setWebViewHeight(size.height);
                    }}
                    style={{
                      width: SCREEN_WIDTH - widthPixel(65),
                      flex: 1,
                    }}
                  />
                </View>

                {childProduct?.plancommitment ||
                parentProduct?.plancommitment ? (
                  <>
                    <View style={styles.dashedLineView}>
                      <DashedLine
                        dashLength={5}
                        dashThickness={0.5}
                        dashGap={2}
                        dashColor={colors.OOREDDO_LIGHT_GREY}
                      />
                    </View>
                    <View style={styles.commitmentContainer}>
                      <Text style={styles.commitmentText}>
                        {selectedPlandata?.commitment_popup_label}
                      </Text>

                      <Text style={styles.months}>
                        {childProduct?.plancommitment
                          ? childProduct?.plancommitment
                          : parentProduct?.plancommitment}
                      </Text>
                    </View>
                  </>
                ) : null}

                <View style={styles.secondDashedView}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={0.5}
                    dashGap={2}
                    dashColor={colors.OOREDDO_LIGHT_GREY}
                  />
                </View>

                <View style={styles.commitmentContainer}>
                  <Text style={styles.commitmentText}>
                    {selectedPlandata?.plantype_popup_label}
                  </Text>

                  <Text style={styles.months}>
                    {childProduct != '' &&
                    childProduct != null &&
                    childProduct != undefined
                      ? childProduct?.linetype
                      : parentProduct?.linetype}
                  </Text>
                </View>

                <View style={styles.secondDashedView}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={0.5}
                    dashGap={2}
                    dashColor={colors.OOREDDO_LIGHT_GREY}
                  />
                </View>

                <View
                  style={[
                    styles.commitmentContainer,
                    {justifyContent: 'space-between'},
                  ]}>
                  <Text style={styles.specialBenefitsText}>
                    {selectedPlandata?.special_benefits_popup_label}
                  </Text>
                  <View
                    style={{
                      width: WIDTH_167,
                      right: 0,
                    }}>
                    <Text style={[styles.specialBenefits]}>
                      {childProduct?.specialbenefits
                        ? childProduct?.specialbenefits
                        : parentProduct?.specialbenefits}
                    </Text>
                  </View>
                </View>

                <View style={styles.secondRow}>
                  <View style={styles.planRow}>
                    <Text style={styles.textRow}>
                      {childProduct?.productname
                        ? childProduct?.productname
                        : parentProduct?.productname}
                    </Text>

                    {childProduct != '' &&
                    childProduct != null &&
                    childProduct != undefined &&
                    childProduct?.validity != null &&
                    childProduct?.validity != undefined &&
                    childProduct.validity !== '' &&
                    childProduct.validity !== '0' ? (
                      <Text style={styles.textMonth}>
                        {childProduct?.kdtext} {childProduct?.price}/
                        {childProduct.validity}
                      </Text>
                    ) : parentProduct != '' &&
                      parentProduct != null &&
                      parentProduct != undefined &&
                      parentProduct?.validity != null &&
                      parentProduct?.validity != undefined &&
                      parentProduct.validity !== '' &&
                      parentProduct.validity !== '0' ? (
                      <Text style={styles.textMonth}>
                        {parentProduct?.kdtext} {parentProduct?.price}/
                        {parentProduct.validity}
                      </Text>
                    ) : (
                      <Text style={styles.textMonth}>
                        {parentProduct?.kdtext} {parentProduct?.price}
                      </Text>
                    )}
                  </View>
                  {(outstandingamount == null ||
                    outstandingamount == undefined ||
                    outstandingamount == '') &&
                  type === 'migration' ? (
                    <></>
                  ) : (
                    <>
                      {type !== 'portin' && (
                        <View style={styles.numberView}>
                          <Text style={styles.numberText}>
                            {type === 'migration'
                              ? selectedPlandata?.outstanding_amount
                              : selectedPlandata?.number_price_popup_label}
                          </Text>

                          <Text style={styles.textK0}>
                            {t('kd')}{' '}
                            {type === 'migration'
                              ? outstandingamount || 0
                              : global.NewSimNumberSliderItem != null &&
                                global.NewSimNumberSliderItem != undefined &&
                                global.NewSimNumberSliderItem != ''
                              ? global.NewSimNumberSliderItem.Price
                              : '0'}
                          </Text>
                        </View>
                      )}
                    </>
                  )}

                  <View
                    style={{
                      marginTop: HEIGHT_13,
                      paddingRight: 5,
                      width: SCREEN_WIDTH - WIDTH_30,
                    }}>
                    <DashedLine
                      dashLength={5}
                      dashThickness={0.5}
                      dashGap={1.5}
                      dashColor={colors.OOREDDO_LIGHT_GREY}
                    />
                  </View>

                  {childProduct == null ||
                  parentProduct == null ||
                  childProduct == '' ||
                  parentProduct == '' ||
                  childProduct?.linetype == 'Prepaid' ||
                  parentProduct?.linetype == 'Prepaid' ? null : (
                    <>
                      {childProduct != '' &&
                      childProduct != null &&
                      childProduct != undefined &&
                      (childProduct?.linetype == 'Postpaid' ||
                        childProduct?.linetype == 'POSTPAID') ? (
                        <>
                          <View style={styles.viewMonthly}>
                            <View style={styles.yourMonthly}>
                              <Text style={styles.textMonthly}>
                                {selectedPlandata?.you_pay_monthly_popup_label}
                              </Text>
                              <TouchableOpacity
                                style={{padding: 5, marginTop: VERTICAL_10}}
                                onPress={() => {
                                  setPayMntPressed(true);
                                }}>
                                <ImageComponent
                                  type="image"
                                  iwidth={WIDTH_11}
                                  iheight={HEIGHT_11}
                                  source={
                                    global?.shopOnAppSettings
                                      ?.summarypageconfigurations
                                      ?.paymonthadvance_tooltip_icon
                                  }
                                  resizeMode={'contain'}
                                  style={{
                                    marginTop: VERTICAL_5,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.kdMonth}>
                              {childProduct?.kdtext} {childProduct?.price}/
                              {childProduct.validity}
                            </Text>
                          </View>

                          <View style={styles.youAdvance}>
                            <View style={styles.youAdvanceTwo}>
                              <Text style={styles.youPayAdvance}>
                                {selectedPlandata?.you_pay_advance_popup_label}
                              </Text>
                              <TouchableOpacity
                                style={{
                                  padding: 5,
                                  marginTop: VERTICAL_10,
                                }}
                                onPress={() => {
                                  setPayAdvcPressed(true);
                                }}>
                                <ImageComponent
                                  type="image"
                                  iwidth={WIDTH_11}
                                  iheight={HEIGHT_11}
                                  source={
                                    global?.shopOnAppSettings
                                      ?.summarypageconfigurations
                                      ?.paymonthadvance_tooltip_icon
                                  }
                                  resizeMode={'contain'}
                                  style={{
                                    marginTop: VERTICAL_5,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.kd15}>
                              {childProduct?.kdtext} {childProduct?.duetoday}
                            </Text>
                          </View>
                          <View
                            style={{
                              marginTop: HEIGHT_13,
                              paddingRight: 5,
                              width: SCREEN_WIDTH - WIDTH_30,
                            }}>
                            <DashedLine
                              dashLength={5}
                              dashThickness={0.5}
                              dashGap={2}
                              dashColor={colors.OOREDDO_LIGHT_GREY}
                            />
                          </View>
                        </>
                      ) : parentProduct != '' &&
                        parentProduct != null &&
                        parentProduct != undefined &&
                        (parentProduct?.linetype == 'Postpaid' ||
                          parentProduct?.linetype == 'POSTPAID') ? (
                        <>
                          <View style={styles.viewMonthly}>
                            <View style={styles.yourMonthly}>
                              <Text style={styles.textMonthly}>
                                {selectedPlandata?.you_pay_monthly_popup_label}
                              </Text>
                              <TouchableOpacity
                                style={{padding: 5}}
                                onPress={() => {
                                  setPayMntPressed(true);
                                }}>
                                <ImageComponent
                                  type="image"
                                  iwidth={WIDTH_11}
                                  iheight={HEIGHT_11}
                                  source={
                                    global?.shopOnAppSettings
                                      ?.summarypageconfigurations
                                      ?.paymonthadvance_tooltip_icon
                                  }
                                  resizeMode={'contain'}
                                  style={{
                                    marginTop: VERTICAL_5,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.kdMonth}>
                              {parentProduct?.kdtext} {parentProduct?.price}/
                              {parentProduct.validity}
                            </Text>
                          </View>

                          <View style={styles.youAdvance}>
                            <View style={styles.youAdvanceTwo}>
                              <Text style={styles.youPayAdvance}>
                                {selectedPlandata?.you_pay_monthly_popup_label}
                              </Text>
                              <TouchableOpacity
                                style={{padding: 5}}
                                onPress={() => {
                                  setPayAdvcPressed(true);
                                }}>
                                <ImageComponent
                                  type="image"
                                  iwidth={WIDTH_11}
                                  iheight={HEIGHT_11}
                                  source={
                                    global?.shopOnAppSettings
                                      ?.summarypageconfigurations
                                      ?.paymonthadvance_tooltip_icon
                                  }
                                  resizeMode={'contain'}
                                  style={{
                                    marginTop: VERTICAL_5,
                                  }}
                                />
                              </TouchableOpacity>
                            </View>
                            <Text style={styles.kd15}>
                              {parentProduct?.kdtext} {parentProduct?.duetoday}
                            </Text>
                          </View>
                          <Image
                            source={require('../../assets/line_dotted.png')}
                            style={{
                              width: SCREEN_WIDTH - widthPixel(30),
                              height: heightPixel(1),
                              marginTop: VERTICAL_15,
                            }}
                          />
                        </>
                      ) : null}
                    </>
                  )}

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      marginBottom: VERTICAL_10,
                    }}>
                    <Text
                      style={{
                        color: colors.RED_COLOR,
                        fontFamily: RUBIK_SEMIBOLD_FONT,
                        fontSize: FONT_14,
                        marginTop: 10,
                        marginHorizontal: widthPixel(10),
                        // fontWeight: '600',
                      }}>
                      {selectedPlandata?.pay_now_popup_label}
                    </Text>

                    <Text
                      style={{
                        color: colors.RED_COLOR,
                        fontFamily: RUBIK_SEMIBOLD_FONT,
                        fontSize: FONT_14,
                        marginTop: VERTICAL_10,
                        marginHorizontal: widthPixel(8),
                        // fontWeight: '600',
                      }}>
                      {t('kd')}{' '}
                      {shopPriceCalculation(
                        parentProduct,
                        childProduct,
                        simType,
                        false,
                        type,
                        outstandingamount
                      ).toFixed(3)}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            <LandingPageButton
              title={selectedPlandata?.continuebtn_popup_label}
              onPress={() => {
                onClose();
              }}
              customStyle={{
                width: isTablet
                  ? tabletMargin() + widthPixel(385)
                  : widthPixel(325),
                height: heightPixel(46),
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: colors.OOREDOO_RED,
                borderRadius: BORDER_RADIUS_25,
                marginLeft: isTablet ? widthPixel(18) : widthPixel(28),
                marginRight: widthPixel(28),
              }}
              customTextStyle={{
                // fontFamily: RUBIC_LIGHT_FONT,
                fontSize: FONT_14,
                // fontWeight: '600',
                color: colors.WHITE,
                fontFamily: RUBIK_SEMIBOLD_FONT,
              }}
            />
          </View>

          {isPayMntPressed && (
            <ToolTip
              isVisible={isPayMntPressed}
              onClose={() => {
                setPayMntPressed(false);
              }}
              desc={
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.paymonthly_tooltip_text
              }
            />
          )}
          {isPayAdvcPressed && (
            <ToolTip
              isVisible={isPayAdvcPressed}
              onClose={() => {
                setPayAdvcPressed(false);
              }}
              desc={
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.payadvance_tooltip_text
              }
            />
          )}
        </View>
      </>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: colors.RED,
    justifyContent: 'flex-end',
  },
  modalViewContainer: {
    maxHeight: SCREEN_HEIGHT - heightPixel(100),
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  ScrollView: {
    backgroundColor: colors.BG_COLOR_WHITE,
    // maxHeight: heightPixel(2000),
    zIndex: 9999,
  },
  popupContainer: {
    height: 'auto',
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingBottom: HEIGHT_30,
    maxHeight: SCREEN_HEIGHT - heightPixel(100),
    zIndex: 99999,
  },
  lineView: {
    width: WIDTH_50,
    height: HEIGHT_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    alignSelf: 'center',
    marginTop: HEIGHT_14,
    borderRadius: 4,
  },
  dashedLineView: {
    marginTop: HEIGHT_15,
    marginHorizontal: WIDTH_27,
  },
  headerContainer: {
    marginTop: heightPixel(10),
    marginBottom: HEIGHT_30,
  },
  lineContain: {
    alignItems: 'center',
  },
  lineImage: {
    width: widthPixel(50),
    height: heightPixel(11),
  },
  title: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    marginLeft: widthPixel(5),
    textAlign: 'left',
    width: SCREEN_WIDTH - widthPixel(185),
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: WIDTH_27,
    marginTop: HEIGHT_8,
  },
  secondDashedView: {marginTop: HEIGHT_12, marginHorizontal: WIDTH_27},
  ooredooText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    textAlign: 'left',
    position: 'absolute',
    right: 0,
  },
  separator: {
    width: SCREEN_WIDTH - WIDTH_30,
    height: heightPixel(1),
    marginTop: VERTICAL_10,
    marginBottom: VERTICAL_10,
    //marginHorizontal: HORIZONTAL_25,
  },
  planType: {
    flexDirection: 'row',
    marginHorizontal: WIDTH_27,
    marginTop: HEIGHT_19,
  },
  Nojoom: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginTop: VERTICAL_5,
    marginLeft: HORIZONTAL_20,
  },
  eligibleFor: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginTop: VERTICAL_5,
    marginLeft: HORIZONTAL_20,
  },
  localMin: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginTop: VERTICAL_5,
    marginLeft: HORIZONTAL_20,
  },
  unlimitedOredo: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginTop: VERTICAL_5,
    marginLeft: HORIZONTAL_20,
  },
  unlimitedView: {
    marginTop: HEIGHT_15,
    marginHorizontal: HORIZONTAL_6,
  },
  internetView: {
    marginStart: HORIZONTAL_20,
    marginTop: VERTICAL_10,
    marginLeft: SCREEN_WIDTH - widthPixel(370),
  },
  youPayAdvance: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  youAdvanceTwo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: HORIZONTAL_10,
    marginStart: HORIZONTAL_10,
  },
  youAdvance: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  internetText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginLeft: HORIZONTAL_20,
    lineHeight: FONT_23,
  },
  internetText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginLeft: HORIZONTAL_20,
    lineHeight: FONT_23,
  },
  planBenefitsView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_12,
  },
  planBenefits: {
    marginHorizontal: HORIZONTAL_12,
  },
  planBenefitText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    textAlign: 'left',
    marginLeft: HORIZONTAL_15,
  },
  commitmentContainer: {
    flexDirection: 'row',
    marginHorizontal: WIDTH_27,
    marginTop: HEIGHT_19,
  },
  commitmentText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
    color: colors.BLACK,
    lineHeight: I18nManager.isRTL ? FONT_26 : VERTICAL_16,
  },
  months: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    textAlign: 'right',
    position: 'absolute',
    right: 0,
  },

  specialOfferContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_25,
    marginStart: HORIZONTAL_28,
  },
  specialOfferText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
  },
  Noview: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
  },
  planTypeContainer: {
    marginHorizontal: HORIZONTAL_25,
    marginStart: HORIZONTAL_28,
  },
  planTypeText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    // fontWeight: '600',
    textAlign: 'left',
  },
  kdMonth: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    marginHorizontal: widthPixel(8),
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  kd15: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    marginHorizontal: widthPixel(8),
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  infoImage: {
    width: widthPixel(11),
    height: heightPixel(11),
    resizeMode: 'contain',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: VERTICAL_10,
    marginStart: HORIZONTAL_5,
  },
  textMonthly: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  yourMonthly: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: HORIZONTAL_10,
    marginStart: HORIZONTAL_10,
  },
  viewMonthly: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textK0: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  numberText: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    marginTop: VERTICAL_10,
    textAlign: 'left',
  },
  numberView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_10,
    marginStart: HORIZONTAL_10,
  },
  textMonth: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  textRow: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    width: '60%',
  },
  planRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_10,
    marginStart: HORIZONTAL_10,
    top: I18nManager.isRTL ? VERTICAL_10 : 0,
    marginTop: VERTICAL_10,
  },
  secondRow: {
    marginTop: HEIGHT_19,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS_10,
    width: SCREEN_WIDTH - widthPixel(30),
    maxHeight: heightPixel(195),
    borderWidth: BORDER_RADIUS_1,
    borderColor: '#F4F4F4',
    marginBottom: HEIGHT_19,
  },
  specialBenefitsContainer: {
    flexDirection: 'row',
    marginHorizontal: HORIZONTAL_25,
    marginStart: HORIZONTAL_28,
  },
  specialBenefits: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    textAlign: 'right',
  },
  specialBenefitsText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
    color: colors.BLACK,
  },
  planDetailsContainer: {
    marginTop: VERTICAL_15,
    backgroundColor: '#F4F4F4',
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: BORDER_RADIUS_10,
    width: SCREEN_WIDTH - widthPixel(30),
    height: heightPixel(195),
    borderWidth: BORDER_RADIUS_1,
    borderColor: '#F4F4F4',
    marginBottom: VERTICAL_15,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postPaid: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    // fontWeight: '600',
    textAlign: 'left',
  },
  planText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
  },
  priceText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
    textAlign: 'left',
  },
  payNowText: {
    color: colors.RED_COLOR,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    marginTop: VERTICAL_10,
    marginHorizontal: widthPixel(10),
    // fontWeight: '600',
  },
});

export default BottomPopUp;
