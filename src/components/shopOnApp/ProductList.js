import React, {useEffect, useRef, useState} from 'react';
import {
  DeviceEventEmitter,
  FlatList,
  I18nManager,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Text} from 'react-native-paper';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_4,
  FONT_10,
  FONT_12,
  FONT_13,
  FONT_15,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_24,
  FONT_28,
  FONT_30,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_14,
  HEIGHT_147,
  HEIGHT_16,
  HEIGHT_19,
  HEIGHT_2,
  HEIGHT_20,
  HEIGHT_22,
  HEIGHT_24,
  HORIZONTAL_20,
  VERTICAL_10,
  VERTICAL_30,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_12,
  WIDTH_260,
  WIDTH_40,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {LandingPageButton} from '../../commonHelper/Button';
import {SCALE_SIZE_25} from '../../commonHelper/Constants';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {ORDER_NOW} from '../../resources/route/endpoints';
import AutoHeightWebView from 'react-native-autoheight-webview';
import WhyBuyOnline from './WhyBuyOnline';
import WhyOoredoo from './WhyOoredoo';
import Faqs from './Faqs';
import BottomPopUp from './BottomPopUp';
import {useNavigation} from '@react-navigation/native';
import DashedLine from 'react-native-dashed-line';
import {TouchableOpacity} from 'react-native';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {RecordlogEvents} from '../../analytics/RecordEvents';
import ImageComponent from '../../models/basic/ImageComponent';
import {getGlobalSettingValue} from '../../services/CommonUtils';

const ProductList = ({
  productList,
  category,
  products,
  index,
  ordernowbtn,
  viewdetailsbtn,
  viewdetailspopupbtn,
  orderNowButtonClick,
  buyOnlinebuttonClicked,
  whyOordeoobuttonClicked,
}) => {
  const navigation = useNavigation();
  const [openModal, setOpenModal] = useState(false);
  const [openOrderModal, setOpenOrderModal] = useState(false);
  const [productItem, setProductItem] = useState('');
  const [orderNowData, setOrderNowData] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(false);
  const [webViewHeight, setWebViewHeight] = useState(null);
  const [cashbackwebViewHeight, setCashbackWebViewHeight] = useState(null);
  const [contentRendered, setContentRendered] = useState(false);
  const [cashbackRendered, setCashbackRendered] = useState(false);
  const [whybuyOnline, setwhybuyOnline] = useState(null);
  const [renderWebView, setRenderWebView] = useState(false);
  const [viewHeight, setViewHeight] = useState();
  const counter = useRef(0);

  const scrollViewRef = useRef(null);

  useEffect(() => {
    try {
      var item = {
        title: category?.jsondata?.whybuyonline?.title,
        data:
          Platform.OS === 'android' &&
          (I18nManager.isRTL || global.userlanguage != 'en')
            ? category?.jsondata?.whybuyonline?.data.reverse()
            : category?.jsondata?.whybuyonline?.data,
      };
      setwhybuyOnline(item);
    } catch (error) {}
  }, []);

  useEffect(() => {
    const popUpListener = DeviceEventEmitter.addListener(
      'closeTimerModal',
      () => {
        setOpenModal(false);
        setOpenOrderModal(false);
      }
    );
    return () => {
      popUpListener.remove();
    };
  }, []);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setRenderWebView(true);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // ProductView clevertap event
  const productViewed = _data => {
    try {
      RecordlogEvents('ProductViewed', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'product title': _data?.productname,
        price: _data?.price,
        category:
          category != null && category != undefined && category != ''
            ? category?.name
            : '',
        subcategory: _data?.linesubtype,
        Status: 'Success',
        'Status Description': 'Success',
      });
    } catch (e) {}
  };

  const selectedPlanCTEvent = (_data, item) => {
    try {
      RecordlogEvents('Selected Plan', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Product title': item?.productname,
        commitment:
          _data?.commitmentlabel && _data?.label
            ? _data?.commitmentlabel + ' ' + _data?.label
            : 'No',
        price: _data?.price || '0',
      });
    } catch (e) {}
  };

  const orderNow = useMutation(
    productID =>
      callQueryapi({
        queryKey: [{}, ORDER_NOW, {productid: productID}, {}],
      }),

    {
      onSuccess: udata => {
        if (udata != null && udata != undefined && udata?.data != null) {
          if (udata?.data?.status === '0') {
            try {
              if (udata?.data?.response?.type == 'configurable') {
                setOrderNowData(udata?.data?.response);
                setTimeout(() => {
                  setLoading(false);
                  setOpenOrderModal(true);
                }, 2000);
              } else {
                setLoading(false);
                selectedPlanCTEvent(selectedItem, udata?.data?.response);
                var finalItem = {
                  parentProduct:
                    orderNowData && orderNowData != ''
                      ? orderNowData
                      : udata?.data?.response,
                  childProduct:
                    orderNowData && orderNowData != ''
                      ? udata?.data?.response
                      : '',
                };
                setOrderNowData('');
                global.NewSimNumberSliderItem = null;
                orderNowButtonClick(finalItem);
              }
            } catch (error) {
              setLoading(false);
            }
          } else {
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      },
      onError: (uerror, variables, context) => {
        setLoading(false);
      },
    }
  );

  const renderItem = ({item, index, productList, category}) => {
    return (
      <>
        {item != null && item ? (
          <View
            style={{
              marginRight: WIDTH_12,
              marginLeft: index == 0 ? WIDTH_12 : null,
            }}>
            <View
              style={{
                width: widthPixel(261),
                height:
                  webViewHeight == null ||
                  webViewHeight == undefined ||
                  webViewHeight == 0
                    ? heightPixel(452)
                    : webViewHeight + heightPixel(295),
                borderWidth: 0.5,
                backgroundColor: colors.BG_COLOR_WHITE,
                borderColor: colors.INACTIVEDOT,
                borderRadius: BORDER_RADIUS_10,
                shadowOffset: {
                  height: 1,
                  width: 0,
                },
                shadowColor: colors.BLACK,
                shadowOpacity: 0.1,
                marginTop: HEIGHT_12,
              }}>
              <View>
                <View>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_260}
                    iheight={HEIGHT_147}
                    source={item?.image}
                    resizeMode={'center'}
                    style={{
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}
                  />
                  {/* <Image
                    source={{uri: item?.image}}
                    style={{
                      height: HEIGHT_147,
                      width: WIDTH_260,
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    }}></Image> */}
                  <View
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: 0,
                      height: 40,
                      borderStyle: 'solid',
                      borderRightWidth: widthPixel(261),
                      borderBottomWidth: isTablet ? 75 : 60,
                      borderRightColor: 'transparent',
                      borderBottomColor: 'white',
                    }}></View>
                  <View
                    style={{
                      position: 'absolute',
                      top: heightPixel(135),
                      left: heightPixel(12),
                    }}>
                    <Text
                      numberOfLines={2}
                      style={{
                        fontFamily: RUBIK_SEMIBOLD_FONT,
                        fontSize: FONT_16,
                        width: widthPixel(175),
                        textAlign: 'left',
                        lineHeight: I18nManager.isRTL ? FONT_30 : FONT_24,
                        fontWeight: 600,
                      }}>
                      {item?.productname}
                    </Text>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: RUBIK_REGULAR_FONT,
                        fontSize: FONT_13,
                        marginTop: HEIGHT_2,
                        textAlign: 'left',
                        lineHeight: I18nManager.isRTL ? FONT_20 : FONT_15,
                      }}>
                      {item?.validity != '' &&
                      item?.validity != null &&
                      item?.validity
                        ? `${item?.price} ${item?.currency}/ ${item?.validity}`
                        : `${item?.price} ${item?.currency}`}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    marginTop: I18nManager.isRTL
                      ? heightPixel(80)
                      : heightPixel(60),
                    paddingRight: 1,
                  }}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={0.5}
                    dashGap={2}
                    dashColor={colors.OOREDDO_LIGHT_GREY}
                  />
                </View>
                {(webViewHeight || !webViewHeight) && (
                  <View
                    style={{
                      height:
                        webViewHeight == null ||
                        webViewHeight == undefined ||
                        webViewHeight == 0
                          ? heightPixel(182)
                          : webViewHeight + heightPixel(26),
                      paddingBottom: heightPixel(9),
                      paddingTop: heightPixel(17),
                    }}>
                    {renderWebView && (
                      <AutoHeightWebView
                        zoomable={false}
                        scrollableWhenZoomin={false}
                        scrollEnabled={false}
                        nestedScrollEnabled={false}
                        source={{
                          html:
                            Platform.OS !== 'ios'
                              ? item?.shortdesc
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
                              : item?.shortdesc
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
                                    getGlobalSettingValue(
                                      'notokufiarabicregular'
                                    )
                                  ),
                        }}
                        onSizeUpdated={size => {
                          try {
                            if (size.height > webViewHeight) {
                              if (!contentRendered) {
                                if (counter.current <= 8) {
                                  setWebViewHeight(size.height);
                                  if (size.height > webViewHeight) {
                                    counter.current = counter.current + 1;
                                  }
                                  setTimeout(() => {
                                    setContentRendered(true);
                                  }, 3500);
                                }
                              }
                            }
                          } catch (error) {}
                        }}
                        style={{
                          width: isTablet
                            ? SCREEN_WIDTH - widthPixel(250)
                            : SCREEN_WIDTH - widthPixel(150),
                          marginLeft: HORIZONTAL_20,
                        }}
                      />
                    )}
                  </View>
                )}
                <View
                  style={{
                    paddingRight: 1,
                  }}>
                  <DashedLine
                    dashLength={5}
                    dashThickness={0.5}
                    dashGap={2}
                    dashColor={colors.OOREDDO_LIGHT_GREY}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: HEIGHT_14,
                    marginBottom: HEIGHT_22,
                  }}>
                  <LandingPageButton
                    title={ordernowbtn}
                    onPress={() => {
                      setLoading(true);
                      productViewed(item);
                      orderNow.mutate(item?.productid);
                    }}
                    customStyle={{
                      width: widthPixel(103),
                      height: heightPixel(30),
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.OOREDOO_RED,
                      borderRadius: SCALE_SIZE_25,
                      marginLeft: widthPixel(11),
                    }}
                    customTextStyle={{
                      fontFamily: RUBIK_SEMIBOLD_FONT,
                      fontSize: FONT_13,
                      color: colors.WHITE,
                      fontWeight: 600,
                    }}
                    numberOfLines={1}
                  />
                  <TouchableOpacity
                    style={{
                      position: 'absolute',
                      right: 10,
                      padding: 5,
                    }}
                    onPress={() => {
                      setOpenModal(true);
                      setProductItem(item);
                    }}>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontFamily: RUBIK_SEMIBOLD_FONT,
                        fontSize: FONT_12,
                        alignText: 'right',
                        textDecorationLine: 'underline',
                        fontWeight: 600,
                      }}>
                      {viewdetailsbtn}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              {item?.productlabel && (
                <View
                  style={{
                    width: widthPixel(136),
                    height: heightPixel(21),
                    borderRadius: BORDER_RADIUS_4,
                    backgroundColor: colors.OOREDOO_RED,
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'absolute',
                    right: 11,
                    top: -12,
                  }}>
                  <Text
                    numberOfLines={1}
                    style={{
                      fontFamily: RUBIK_SEMIBOLD_FONT,
                      fontSize: FONT_10,
                      color: colors.BG_COLOR_WHITE,
                    }}>
                    {item?.productlabel}
                  </Text>
                </View>
              )}
            </View>
          </View>
        ) : null}
      </>
    );
  };
  return (
    <View>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        scrollToOverflowEnabled={true}
        contentContainerStyle={styles.ScrollView}
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        bounces={true}>
        <View>
          {products ? (
            <View style={styles.listView}>
              <FlatList
                bounces={true}
                data={products[0]?.products}
                renderItem={(item, index) => renderItem(item, index)}
                horizontal
                showsHorizontalScrollIndicator={false}
              />
            </View>
          ) : null}

          {category?.categoryoffertitle || cashbackwebViewHeight ? (
            <View
              style={[
                styles.globalDiscMainView,
                {
                  backgroundColor: category?.discountlabelcolor,
                },
              ]}>
              <View
                style={[
                  styles.globalDiscInnerView,
                  {
                    height:
                      cashbackwebViewHeight == null ||
                      cashbackwebViewHeight == undefined ||
                      cashbackwebViewHeight == 0
                        ? heightPixel(35)
                        : cashbackwebViewHeight,
                  },
                ]}>
                {renderWebView && (
                  <AutoHeightWebView
                    source={{
                      html:
                        Platform.OS !== 'ios'
                          ? category?.categoryoffertitle
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
                          : category?.categoryoffertitle
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
                      if (size.height !== 0) {
                        setCashbackWebViewHeight(size.height);
                      }
                    }}
                    style={styles.globalWebView}
                  />
                )}
              </View>
            </View>
          ) : null}

          {category?.jsondata?.whybuyonline?.data?.length > 0 ? (
            <WhyBuyOnline
              data={whybuyOnline}
              buyOnlinebuttonClicked={buyOnlinebuttonClicked}
            />
          ) : null}

          {category?.jsondata?.whyooredoo?.data?.length > 0 ? (
            <View
              style={{
                marginBottom: category?.faqs?.length == 0 ? VERTICAL_30 : 0,
              }}>
              <WhyOoredoo
                data={category?.jsondata?.whyooredoo}
                whyOordeoobuttonClicked={whyOordeoobuttonClicked}
              />
            </View>
          ) : null}

          {category?.faqs?.length > 0 ? (
            <View
              onLayout={event => {
                const {y} = event?.nativeEvent?.layout;
                setViewHeight(y);
              }}>
              <Faqs
                ref={scrollViewRef}
                title={category?.faq_list_name}
                listData={category?.faqs}
                onItemPress={index => {
                  scrollViewRef.current?.scrollTo({
                    y: viewHeight + index * (Platform.OS === 'ios' ? 10 : 10),
                    // category?.faqs?.length === 1
                    //   ? SCREEN_HEIGHT < 700
                    //     ? viewHeight - 230
                    //     : viewHeight - 380
                    //   : viewHeight - 200,
                    animated: true,
                  });
                }}
              />
            </View>
          ) : null}
          {openModal && (
            <BottomPopUp
              visible={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              isFrom={'ViewDetail'}
              response={''}
              onContinue={() => {
                setOpenModal(false);
              }}
              productInfo={productItem}
            />
          )}
          {openOrderModal && (
            <BottomPopUp
              visible={openOrderModal}
              onClose={() => {
                setOpenOrderModal(false);
              }}
              isFrom={''}
              response={orderNowData}
              productInfo={''}
              onContinue={index => {
                if (index !== '') {
                  if (index || index == 0) {
                    setLoading(true);
                    setOpenOrderModal(false);
                    orderNow.mutate(selectedItem?.productid);
                  }
                }
              }}
              selectedCommit={item => {
                setSelectedItem(item);
              }}
            />
          )}
        </View>
      </ScrollView>
      {loading && (
        <View style={styles.loading}>
          <LoadingIndicator shouldDismissManual isVisible={loading} />
        </View>
      )}
    </View>
  );
};

export default ProductList;

const styles = StyleSheet.create({
  listView: {
    paddingTop: HEIGHT_19,
    backgroundColor: colors.BG_PINK,
    paddingBottom: HEIGHT_24,
  },
  globalDiscMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: HEIGHT_16,
    borderRadius: 41,
    marginTop: HEIGHT_20,
    marginHorizontal: HEIGHT_12,
  },
  globalDiscInnerView: {
    width: isTablet
      ? Platform.OS == 'android'
        ? SCREEN_WIDTH - widthPixel(160)
        : I18nManager.isRTL
        ? SCREEN_WIDTH - widthPixel(100)
        : SCREEN_WIDTH - widthPixel(300)
      : SCREEN_WIDTH - widthPixel(40),
    flexDirection: 'row',
    alignItems: 'center',
  },
  ScrollView: {
    // paddingBottom: HEIGHT_20,
    backgroundColor: colors.BG_COLOR_WHITE,
    maxHeight: heightPixel(20000),
  },
  globalDiscView: {
    marginLeft: I18nManager.isRTL ? 0 : WIDTH_10,
    right: I18nManager.isRTL ? WIDTH_10 : 0,
    marginTop: isTablet
      ? Platform.OS == 'android'
        ? VERTICAL_10
        : VERTICAL_5
      : VERTICAL_5,
  },
  globalWebView: {
    width: isTablet ? SCREEN_WIDTH / 1.2 - WIDTH_40 : SCREEN_WIDTH - WIDTH_40,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
