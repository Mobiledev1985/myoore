import React, {useEffect, useRef, useState} from 'react';
import {
  Animated,
  Dimensions,
  I18nManager,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import {View} from 'react-native';
import colors from '../../resources/styles/colors';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_25,
  FONT_13,
  FONT_14,
  FONT_20,
  FONT_34,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_15,
  HEIGHT_18,
  HEIGHT_19,
  HEIGHT_20,
  HEIGHT_21,
  HEIGHT_22,
  HEIGHT_3,
  HEIGHT_30,
  HEIGHT_300,
  HEIGHT_32,
  HEIGHT_36,
  HEIGHT_4,
  HEIGHT_40,
  HEIGHT_46,
  HEIGHT_57,
  HEIGHT_6,
  WIDTH_22,
  WIDTH_27,
  WIDTH_28,
  WIDTH_29,
  WIDTH_326,
  WIDTH_4,
  WIDTH_50,
  WIDTH_57,
  WIDTH_70,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {FlatList} from 'react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import {useTranslation} from 'react-i18next';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {decode} from 'html-entities';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {getGlobalSettingValue} from '../../services/CommonUtils';

const BottomPopUp = ({
  visible,
  onClose,
  isFrom,
  response,
  productInfo,
  onContinue,
  selectedCommit,
}) => {
  const {t} = useTranslation();
  const [selected, setSelected] = useState('');
  const [isDefaultItemSelected, setDefaultItemSelected] = useState(false);
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);
  const [webViewHeight, setWebViewHeight] = useState(null);
  const [webData, setWebData] = useState(null);
  const [contentRendered, setContentRendered] = useState(false);
  const [showloader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!showloader) {
      setTimeout(
        () => {
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
        },
        isFrom === 'ViewDetail' ? 50 : 50
      );
    }
  }, [visible, bounceValue, showloader]);

  useEffect(() => {
    if (isFrom == 'ViewDetail') {
      setWebData(decode(productInfo?.longdesc, {mode: 'nonAsciiPrintable'}));
    }
  }, [productInfo?.longdesc]);

  const renderItem = ({item, index}) => {
    if (!isDefaultItemSelected && index == 0) {
      selectedCommit(item);
      setSelected(index);
      setDefaultItemSelected(true);
    }

    return (
      <TouchableOpacity
        style={[
          styles.itemView,
          {
            borderColor:
              index === selected ? colors.OOREDOO_RED : colors.INACTIVEDOT,
          },
        ]}
        activeOpacity={1}
        onPress={() => {
          selectedCommit(item);
          setSelected(index);
        }}>
        <View style={styles.itemInnerView}>
          <View style={{width: widthPixel(240)}}>
            <View style={styles.itemContainer1}>
              <View>
                <Text style={styles.itemTitleText}>
                  {item?.commitmentlabel}
                </Text>
              </View>

              <View style={styles.itemDescView}>
                <Text style={styles.itemDescText}>{item?.label}</Text>
              </View>
            </View>

            <View style={styles.itemPriceView}>
              <Text style={styles.itemPriceText}>{item?.pricelabel}</Text>
            </View>

            <View style={styles.itemLabelView}>
              <Text style={styles.itemLabelText}>{item?.savelabel}</Text>
            </View>
          </View>
          <View style={styles.itemDiscountView}>
            <View
              style={[
                styles.itemDiscountCircle,
                {
                  backgroundColor: item?.discountlabelbgcolor,
                },
              ]}>
              <View
                style={{
                  width: HEIGHT_32,
                }}>
                <Text
                  style={[
                    styles.itemDescText,
                    {
                      color: item?.discountlabeltextcolor,
                      textAlign: 'center',
                      lineHeight: I18nManager.isRTL
                        ? isTablet
                          ? FONT_34
                          : FONT_20
                        : null,
                    },
                  ]}>
                  {item?.discountlabel}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      statusBarTranslucent
      //animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        style={[
          styles.mainView,
          {
            backgroundColor:
              isFrom === 'ViewDetail'
                ? contentRendered
                  ? colors.BLACK_TRANS_BG
                  : 'transparent'
                : colors.BLACK_TRANS_BG,
          },
        ]}
        onPress={() => {
          onClose();
        }}
        activeOpacity={1}>
        <Animated.View
          style={{
            // backgroundColor: 'white',
            marginBottom: -animationHeight.current,
            transform: [{translateY: bounceValue}],
            width: SCREEN_WIDTH,
            opacity: isFrom == 'ViewDetail' ? (contentRendered ? 1 : 0) : 1,
          }}>
          <View>
            <TouchableOpacity style={styles.InnerView} activeOpacity={1}>
              <TouchableOpacity
                activeOpacity={0.5}
                style={styles.lineView}
                onPress={() => onClose()}
              />

              <View style={styles.textView}>
                <Text style={styles.titleText}>
                  {isFrom == 'ViewDetail'
                    ? productInfo?.productname
                    : response?.choosecommitmenttext}
                </Text>
              </View>
              {isFrom == 'ViewDetail' || webViewHeight ? (
                <>
                  <View
                    style={[
                      styles.webView,
                      {
                        height:
                          webViewHeight == null ||
                          webViewHeight == undefined ||
                          webViewHeight == 0
                            ? heightPixel(10)
                            : webViewHeight,
                      },
                    ]}>
                    <AutoHeightWebView
                      onLoad={() => {}}
                      scrollEnabled={true}
                      source={{
                        html:
                          Platform.OS !== 'ios'
                            ? productInfo?.longdesc
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
                            : productInfo?.longdesc
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
                                  getGlobalSettingValue(
                                    'notokufiarabicsemibold'
                                  )
                                )
                                .replace(
                                  '$NOTOKUFI_REGULAR$',
                                  getGlobalSettingValue('notokufiarabicregular')
                                ),
                      }}
                      onSizeUpdated={size => {
                        if (!contentRendered) {
                          setWebViewHeight(size.height);
                          setTimeout(() => {
                            setShowLoader(false);
                            setContentRendered(true);
                          }, 1000);
                        }
                      }}
                      style={{
                        width: SCREEN_WIDTH - widthPixel(65),
                      }}
                    />
                  </View>
                </>
              ) : (
                <View style={styles.listView}>
                  <FlatList
                    bounces={false}
                    data={response?.commitments}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                  />
                </View>
              )}

              <View style={styles.btnView}>
                <LandingPageButton
                  title={t('capcontinue')}
                  onPress={() =>
                    onContinue(selected || selected == 0 ? selected : '')
                  }
                  customStyle={styles.btnContainer}
                  customTextStyle={styles.btnText}
                  numberOfLines={1}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: animationHeight.current,
                backgroundColor: 'white',
              }}
            />
          </View>
        </Animated.View>
        {showloader && isFrom == 'ViewDetail' ? (
          <LoadingIndicator shouldDismissManual isVisible={showloader} />
        ) : null}
      </TouchableOpacity>
    </Modal>
  );
};

export default BottomPopUp;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  InnerView: {
    height: 'auto',
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
    marginTop: HEIGHT_20,
    borderRadius: 4,
  },
  textView: {
    marginTop: HEIGHT_36,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    marginLeft: WIDTH_27,
    textAlign: 'left',
  },
  webView: {
    marginTop: HEIGHT_36,
    height: HEIGHT_300,
    marginLeft: WIDTH_28,
    marginRight: WIDTH_28,
  },
  listView: {
    marginTop: heightPixel(25),
  },
  btnView: {
    marginTop: HEIGHT_40,
    marginBottom: HEIGHT_30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnContainer: {
    width: isTablet ? SCREEN_WIDTH - widthPixel(50) : WIDTH_326,
    height: HEIGHT_46,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    marginLeft: WIDTH_22,
    marginRight: WIDTH_28,
  },
  itemView: {
    borderWidth: 1,
    borderRadius: 14,
    marginLeft: WIDTH_22,
    marginRight: WIDTH_29,
    marginTop: HEIGHT_12,
  },
  itemInnerView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemContainer1: {
    flexDirection: 'row',
    marginLeft: HEIGHT_21,
    marginTop: HEIGHT_15,
  },
  itemTitleText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  itemDescView: {
    marginLeft: WIDTH_4,
  },
  itemPriceView: {
    marginLeft: HEIGHT_21,
    marginTop: HEIGHT_6,
  },
  itemPriceText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    textAlign: 'left',
  },
  itemLabelView: {
    marginLeft: HEIGHT_21,
    marginTop: HEIGHT_6,
    marginBottom: HEIGHT_18,
  },
  itemLabelText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  itemDiscountView: {
    // marginTop: HEIGHT_19,
    marginRight: HEIGHT_22,
    alignSelf: 'center',
  },
  itemDiscountCircle: {
    height: I18nManager.isRTL ? WIDTH_70 : WIDTH_57,
    width: I18nManager.isRTL ? WIDTH_70 : WIDTH_57,
    borderRadius: I18nManager.isRTL ? WIDTH_70 / 2 : WIDTH_57 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemDescText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.BLACK,
    textAlign: 'left',
  },
  btnText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.WHITE,
  },
});
