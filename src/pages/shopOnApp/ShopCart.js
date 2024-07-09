import React, {useEffect, useRef, useState} from 'react';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import ScreenName from '../../navigator/ScreenName';
import {
  TouchableOpacity,
  Image,
  View,
  I18nManager,
  Text,
  StyleSheet,
  Animated,
  Platform,
  BackHandler,
} from 'react-native';
import {Provider as PaperProvider, DefaultTheme} from 'react-native-paper';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_10,
  FONT_13,
  FONT_16,
  FONT_19,
  FONT_20,
  FONT_24,
  FONT_28,
  FONT_34,
  HORIZONTAL_10,
  HORIZONTAL_12,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_45,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_3,
  VERTICAL_30,
  VERTICAL_40,
  VERTICAL_5,
  VERTICAL_50,
  VERTICAL_6,
  WIDTH_40,
} from '../../resources/styles/responsive';
import ImageComponent from '../../models/basic/ImageComponent';
import TextComponent from '../../models/basic/TextComponent';
import {
  OOREDOO_HEAVY_FONT,
  OOREDOO_MEDIUM_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {useMutation, useQuery} from 'react-query';
import {
  SHOPCART_API,
  SHOPDELETECART_API,
  UNRESERVE_API,
} from '../../resources/route/endpoints';
import {useTranslation} from 'react-i18next';
import colors from '../../resources/styles/colors';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {getItem, setItem} from '../../commonHelper/utils';
import {
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
  SHOP_PROGRESS_TIME,
} from '../../commonHelper/Constants';
import {callQueryapi} from '../../commonHelper/middleware/callapi.android';
import SupportedCountryModal from '../../models/templates/SupportedCountryModal';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {NavigateByName} from '../../services/NavigationService';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import BottomButton from '../../components/shopOnApp/BottomButton';
import {getCurrentDate} from '../../services/CommonUtils';

const ShopCart = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const cartID = useRef('');
  const itemID = useRef('');
  const accountID = useRef('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [cartDeleted, setcartDeleted] = useState(false);
  const [isLoader, setisLoader] = useState(false);
  const [errorTitle, seterrorTitle] = useState('');
  const [msg, setmsg] = useState('');
  const {t} = useTranslation();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#ED1C24',
      text: '#000000',
    },
  };

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.ShopCart,
    show: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          if (cartDeleted) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: ScreenName.tabStack,
                  state: {routes: [{name: ScreenName.ShopStack}]},
                },
              ],
            });
          } else {
            navigation.goBack();
          }
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isFocused])
  );

  const cartlistapi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOPCART_API,
          {
            quoteid: cartID.current,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setisLoader(false);
        if (data?.data?.status === '0') {
        } else {
        }
      },
      onError: (error, variables, context) => {
        setisLoader(false);
      },
    }
  );

  const deletecartapi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOPDELETECART_API,
          {
            quoteid: cartID.current,
            itemid: itemID.current,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setisLoader(false);
        if (data?.data?.status === '0') {
          setcartDeleted(true);
          setItem(SHOP_CART_ID, '');
          setItem(SHOP_ITEM_ID, '');
          setItem(SHOP_ACCOUNT_ID, '');
          cartID.current = '';
          itemID.current = '';
          accountID.current = '';
          cartlistapi.mutate();
          // navigation.reset({
          //   index: 0,
          //   routes: [
          //     {
          //       name: ScreenName.tabStack,
          //       state: {routes: [{name: ScreenName.ShopStack}]},
          //     },
          //   ],
          // });
        } else {
          setShowErrorModal(true);
          seterrorTitle(data?.data?.infomsg ? data?.data?.infomsg : t('oops'));
          setmsg(
            data?.data?.message ? data?.data?.message : t('somethingwentwrong')
          );
        }
      },
      onError: (error, variables, context) => {
        setisLoader(false);
      },
    }
  );

  const unReserveNumberApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          UNRESERVE_API,
          {
            unreserve_msisdn:
              cartlistapi?.data?.data?.response?.product?.number,
            doremovecart: 'T', //T or F
            cartid: cartID.current || '', //cartid from add to cart api
            itemid: itemID.current || '', //itemid from add to cart api
            accountid: accountID.current || '',
            type: cartlistapi?.data?.data?.response?.product?.action,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setisLoader(false);
        try {
          setItem(SHOP_CART_ID, '');
          setItem(SHOP_ITEM_ID, '');
          setItem(SHOP_ACCOUNT_ID, '');
          cartID.current = '';
          itemID.current = '';
          var finalItem = {
            parentProduct:
              cartlistapi?.data?.data?.response?.parentproductdetails != null &&
              cartlistapi?.data?.data?.response?.parentproductdetails !=
                undefined &&
              cartlistapi?.data?.data?.response?.parentproductdetails != ''
                ? cartlistapi?.data?.data?.response?.parentproductdetails
                : cartlistapi?.data?.data?.response?.childproductdetails,
            childProduct:
              cartlistapi?.data?.data?.response?.childproductdetails != null &&
              cartlistapi?.data?.data?.response?.childproductdetails !=
                undefined &&
              cartlistapi?.data?.data?.response?.childproductdetails != ''
                ? cartlistapi?.data?.data?.response?.childproductdetails
                : '',
          };
          global.NewSimNumberSliderItem = null;
          global.contactNumber = null;
          navigation.reset({
            index: 1,
            routes: [
              {name: navigation.navigate(ScreenName.PayStack)},
              {
                name: navigation.navigate(ScreenName.ShopOnAppLandingPage),
              },
            ],
          });

          NavigateByName(
            navigation,
            ScreenName.OrderNewSimScreen,
            finalItem,
            null
          );
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        setisLoader(false);
      },
    }
  );

  useEffect(() => {
    RecordScreenEvent('Shop Cart');
    const val = getCurrentDate();
    if (val === null || val === undefined || val == '') {
      setItem(SHOP_CART_ID, '');
      setItem(SHOP_ITEM_ID, '');
      setItem(SHOP_ACCOUNT_ID, '');
      setItem(SHOP_CART_TIME, '');
      cartlistapi.mutate();
    } else {
      getItem(SHOP_PROGRESS_TIME).then(valtime => {
        if (valtime == null || valtime === undefined || valtime == '') {
          setItem(SHOP_CART_ID, '');
          setItem(SHOP_ITEM_ID, '');
          setItem(SHOP_ACCOUNT_ID, '');
          setItem(SHOP_CART_TIME, '');
          cartlistapi.mutate();
        } else {
          var d = new Date();
          const diffIndays = Math.abs(d - val?._j);
          var diffTimer = Math.round(diffIndays / 1000);
          var progressTime = valtime * 60;
          console.log('diffTimer 21', diffTimer, progressTime);
          if (progressTime <= diffTimer) {
            setItem(SHOP_CART_ID, '');
            setItem(SHOP_ITEM_ID, '');
            setItem(SHOP_ACCOUNT_ID, '');
            setItem(SHOP_CART_TIME, '');
            cartlistapi.mutate();
          } else {
            getItem(SHOP_CART_ID).then(val => {
              if (val == null || val === undefined || val == '') {
                setisLoader(true);
                cartID.current = '';
                cartlistapi.mutate();
              } else {
                setisLoader(true);
                cartID.current = val;
                cartlistapi.mutate();
              }
            });
            getItem(SHOP_ITEM_ID).then(val => {
              if (val == null || val === undefined || val == '') {
                itemID.current = '';
              } else {
                itemID.current = val;
              }
            });
            getItem(SHOP_ACCOUNT_ID).then(val => {
              if (val == null || val === undefined || val == '') {
                accountID.current = '';
              } else {
                accountID.current = val;
              }
            });
          }
        }
      });
    }
  }, []);

  //   useEffect(() => {
  //     try {
  //       slideIn();
  //     } catch (error) {}
  //   }, []);

  //   const slideIn = () => {
  //     Animated.timing(slideAnimation, {
  //       toValue: 1,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start();
  //   };

  //   const slideOut = () => {
  //     Animated.timing(slideAnimation, {
  //       toValue: 0,
  //       duration: 500,
  //       useNativeDriver: true,
  //     }).start(navigation.goBack());
  //   };

  return (
    <Animated.View
      style={[
        styles.container,
        // {
        //   transform: [
        //     {
        //       translateY: slideAnimation.interpolate({
        //         inputRange: [0, 1],
        //         outputRange: [600, 0],
        //       }),
        //     },
        //   ],
        // },
      ]}>
      <TouchableOpacity
        style={{
          top: VERTICAL_50,
          left: HORIZONTAL_12,
          position: 'absolute',
        }}
        onPress={() => {
          if (cartDeleted) {
            navigation.reset({
              index: 0,
              routes: [
                {
                  name: ScreenName.tabStack,
                  state: {routes: [{name: ScreenName.ShopStack}]},
                },
              ],
            });
          } else {
            navigation.goBack();
          }
        }}>
        <Image
          source={require('../../assets/close.png')}
          resizeMode={'contain'}
          style={{width: WIDTH_40, height: WIDTH_40}}
        />
      </TouchableOpacity>
      {cartlistapi?.data?.data?.status == '-1' ? (
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            flex: 1,
            marginHorizontal: HORIZONTAL_45 + tabletMargin(),
          }}>
          <ImageComponent
            type="image"
            iwidth={widthPixel(100)}
            iheight={heightPixel(130)}
            source={cartlistapi?.data?.data?.response?.icon}
            resizeMode={'contain'}
          />
          <TextComponent
            data={cartlistapi?.data?.data?.response?.title}
            type="text"
            style={styles.titleStyle}
            lines={1}
          />
          <TextComponent
            data={cartlistapi?.data?.data?.response?.desc}
            type="text"
            style={styles.descStyle}
            lines={4}
          />
        </View>
      ) : cartlistapi?.data?.data?.status == '0' ? (
        <View style={styles.gradientContainer}>
          <TouchableOpacity
            style={styles.cartcontainer}
            activeOpacity={1}
            onPress={() => {
              setisLoader(true);
              unReserveNumberApi.mutate();
            }}>
            <View>
              <View style={styles.contentContainer}>
                <PaperProvider theme={theme}>
                  <View style={styles.cardView}>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={
                          Platform.OS === 'ios'
                            ? {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }
                            : {
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginEnd: I18nManager.isRTL ? 5 : 20,
                              }
                        }>
                        <View style={{flexDirection: 'column'}}>
                          <View
                            style={{
                              justifyContent: 'space-between',
                              flexDirection: 'row',
                              marginHorizontal: HORIZONTAL_5,
                            }}>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Image
                                source={require('../../assets/select_sim.png')}
                                style={{
                                  width: widthPixel(69),
                                  height: heightPixel(49),
                                  resizeMode: 'stretch',
                                }}
                              />
                              <View>
                                <Text style={styles.textLeft}>
                                  {
                                    cartlistapi?.data?.data?.response?.product
                                      ?.name
                                  }
                                </Text>
                              </View>
                            </View>
                            <TouchableOpacity
                              style={{height: heightPixel(20)}}
                              onPress={() => {
                                setisLoader(true);
                                deletecartapi.mutate();
                              }}>
                              <ImageComponent
                                type="image"
                                iwidth={widthPixel(13)}
                                iheight={heightPixel(17)}
                                source={
                                  cartlistapi?.data?.data?.response?.deleteicon
                                }
                                resizeMode={'contain'}
                                style={{right: HORIZONTAL_5}}
                              />
                            </TouchableOpacity>
                          </View>
                          <Image
                            source={require('../../assets/line_dotted.png')}
                            style={{
                              width: widthPixel(349),
                              height: heightPixel(1),
                              marginTop: VERTICAL_20,
                            }}
                          />
                        </View>
                      </View>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        top: VERTICAL_5,
                      }}>
                      <View
                        style={{
                          flexDirection: 'column',
                          //   top: VERTICAL_5,
                        }}>
                        <Text
                          style={{
                            fontSize: FONT_13,
                            fontFamily: RUBIK_SEMIBOLD_FONT,
                            textAlign: 'left',
                            // marginTop: Platform.OS === 'ios' ? -7 : 0,
                          }}>
                          {
                            cartlistapi?.data?.data?.response?.product
                              ?.numberselectedtext
                          }
                        </Text>
                        <Text
                          style={{
                            fontSize: FONT_13,
                            fontFamily: OOREDOO_REGULAR_FONT,
                            textAlign: 'left',
                            top: I18nManager.isRTL ? -VERTICAL_3 : VERTICAL_3,
                          }}>
                          {cartlistapi?.data?.data?.response?.product?.number !=
                            null &&
                            cartlistapi?.data?.data?.response?.product
                              ?.number != undefined &&
                            cartlistapi?.data?.data?.response?.product
                              ?.number != '' &&
                            cartlistapi?.data?.data?.response?.product?.number.replace(
                              '965',
                              ''
                            )}
                        </Text>
                      </View>
                      <Text style={styles.textRight}>
                        {cartlistapi?.data?.data?.response?.product?.kdtext}{' '}
                        {
                          cartlistapi?.data?.data?.response?.product
                            ?.productprice
                        }
                        {cartlistapi?.data?.data?.response?.product?.validity !=
                          null &&
                        cartlistapi?.data?.data?.response?.product?.validity !=
                          undefined &&
                        cartlistapi?.data?.data?.response?.product?.validity !=
                          ''
                          ? '/' +
                            cartlistapi?.data?.data?.response?.product?.validity
                          : ''}
                      </Text>
                    </View>
                  </View>
                </PaperProvider>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      ) : (
        <></>
      )}
      {cartlistapi.isLoading || cartlistapi.isFetching ? (
        <View style={styles.loading}>
          <LoadingIndicator
            shouldDismissManual
            isVisible={cartlistapi.isLoading || cartlistapi.isFetching}
          />
        </View>
      ) : null}

      {showErrorModal ? (
        <SupportedCountryModal
          popupText={msg}
          onDismiss={data => {
            setShowErrorModal(false);
          }}
          titleMsg={errorTitle ? errorTitle : ''}
          isFrom={'passwordManagement'}
        />
      ) : null}
      {isLoader && (
        <View style={styles.loading}>
          <LoadingIndicator shouldDismissManual={true} isVisible={isLoader} />
        </View>
      )}
      {cartlistapi?.data?.data?.response?.continueshoppingbtn != null &&
        cartlistapi?.data?.data?.response?.continueshoppingbtn != undefined &&
        cartlistapi?.data?.data?.response?.continueshoppingbtn != '' && (
          <BottomButton
            text={cartlistapi?.data?.data?.response?.continueshoppingbtn}
            onPress={() => {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenName.tabStack,
                    state: {
                      routes: [{name: ScreenName.ShopStack}],
                    },
                  },
                ],
              });

              // navigation.goBack();
              // NavigateByName(navigation, 'shoponapp', null, null);
            }}
          />
        )}
    </Animated.View>
  );
};

export default ShopCart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: tabletMargin(),
  },
  titleStyle: {
    fontFamily: OOREDOO_MEDIUM_FONT,
    fontSize: FONT_20,
    lineHeight: I18nManager.isRTL ? FONT_34 : FONT_24,
    textAlign: 'center',
    top: VERTICAL_30,
  },
  descStyle: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_16,
    lineHeight: I18nManager.isRTL ? FONT_28 : FONT_19,
    textAlign: 'center',
    top: I18nManager.isRTL ? VERTICAL_30 : VERTICAL_40,
  },
  cartcontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: 10,
    // flex: 1,
  },
  viewDetails: {
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontFamily: RUBIK_SEMIBOLD_FONT,
  },
  gradientContainer: {
    width: widthPixel(375),
    height: heightPixel(184),
    top: heightPixel(70),
    marginTop: heightPixel(50),
  },
  iconTextView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? VERTICAL_10 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: I18nManager.isRTL ? 3 : 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: HORIZONTAL_12,
    marginTop: VERTICAL_10,
    marginBottom: 5,
  },
  contentContainer: {
    marginHorizontal: HORIZONTAL_5,
    marginTop: VERTICAL_6,
    marginBottom: VERTICAL_6,
  },
  cardView: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS_10,
    padding: 10,
    width: isTablet
      ? tabletMargin() - widthPixel(80)
      : SCREEN_WIDTH - widthPixel(20),
    height: I18nManager.isRTL ? heightPixel(150) : heightPixel(130),
    borderWidth: 1,
    borderColor: '#ED1C24',
    elevation: 5,
  },
  textSelectLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    fontSize: FONT_13,
  },
  textSelectRight: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'right',
    color: colors.BLACK,
    textDecorationLine: 'underline',
    fontSize: FONT_13,
  },
  textLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    width: widthPixel(164),
    textAlign: 'left',
  },
  textRight: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
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
