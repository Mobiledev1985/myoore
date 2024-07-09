import {StackActions, useNavigation} from '@react-navigation/core';
import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {setNewUserProperty} from '../../analytics/ClevetapService';
import {
  UnitTestProps,
  consoleLog,
  findObjectByKey,
} from '../../commonHelper/utils';
import ImageComponent from '../../models/basic/ImageComponent';
import LoadingComponent from '../../models/basic/LoadingComponent';
import TextComponent from '../../models/basic/TextComponent';
import colors from '../../resources/styles/colors';
import {useFocusEffect} from '@react-navigation/native';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  OOREDOO_MEDIUM_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  heightPixel,
  isTablet,
  pixelSizeHorizontal,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_15,
  CARD_WIDTH,
  FONT_10,
  FONT_11,
  FONT_12,
  FONT_13,
  FONT_14,
  FONT_15,
  FONT_16,
  FONT_17,
  FONT_18,
  FONT_20,
  FONT_22,
  FONT_28,
  FONT_30,
  HEIGHT_10,
  HEIGHT_107,
  HEIGHT_144,
  HEIGHT_20,
  HEIGHT_250,
  HEIGHT_30,
  HEIGHT_310,
  HORIZONTAL_10,
  HORIZONTAL_12,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_25,
  HORIZONTAL_3,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_18,
  VERTICAL_2,
  VERTICAL_20,
  VERTICAL_3,
  VERTICAL_4,
  VERTICAL_5,
  VERTICAL_8,
  WIDTH_10,
  WIDTH_110,
  WIDTH_15,
  WIDTH_150,
  WIDTH_155,
  WIDTH_160,
  WIDTH_186,
  WIDTH_2,
  WIDTH_20,
  WIDTH_330,
  WIDTH_435,
  WIDTH_5,
  WIDTH_60,
  WIDTH_8,
  WIDTH_14,
  WIDTH_1,
  WIDTH_3,
  HORIZONTAL_6,
  WIDTH_24,
  WIDTH_25,
  WIDTH_18,
  VERTICAL_7,
  FONT_35,
  HORIZONTAL_5,
} from '../../resources/styles/responsive';
import {GetCacheKey} from '../../services/CacheUtil';
import {
  NavigateByName,
  NavigateCards,
  navigationBeforeLogin,
} from '../../services/NavigationService';
import CommonCarousel from '../custom/CommonCarousel';
import {Dimensions} from 'react-native';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';

const SummerNewCollections = ({pmsitem}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useSelector(stateObj => stateObj.userData);
  const key = GetCacheKey('SummerNewCollections' + `${pmsitem.uniqueid}`);
  const [newDescription, setNewDescription] = useState(false);
  const [addedbanner, setAddedBanner] = useState(null);
  const [itemsAry, setitemsAry] = useState();
  const deviceWidth = Dimensions.get('window').width;
  const containerWidth = CARD_WIDTH;
  const aspectRatio = 393 / 240; // Image's original aspect ratio
  const imageWidth = Math.min(containerWidth, deviceWidth);
  const imageHeight = imageWidth / aspectRatio;
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );
  // useEffect(() => {
  //   if (data?.status === '0') {
  //     if (data?.response == null || data?.response.length == 0) {
  //       isDescription.current = false;
  //     } else {
  //       data?.response?.map(item => {
  //         let desc = item?.description;
  //         if (
  //           desc.length > 0 &&
  //           desc != null &&
  //           desc != undefined &&
  //           desc != ''
  //         ) {
  //           if (!desc.includes('<html')) {
  //             isDescription.current = true;
  //             return;
  //           }
  //         }
  //       });
  //     }
  //   }
  // }, [data]);

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      if (cachedAPIData && cachedAPIData?.length > 0) {
        const foundObj = findObjectByKey(cachedAPIData, 'Key', key);
        if (foundObj != null && foundObj != undefined && foundObj) {
          setdata(foundObj?.Resp_Obj);
        } else {
          summerCollection.mutate();
        }
      } else {
        summerCollection.mutate();
      }
    } catch (r) {}
  }, []);

  const summerCollection = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, pmsitem.sourceid],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
          if (cachedAPIData && cachedAPIData?.length > 0) {
            const foundObj = findObjectByKey(cachedAPIData, 'Key', key);
            if (foundObj) {
            } else {
              let tempObj = {
                Key: key,
                Resp_Obj: udata?.data,
              };
              dispatch(setCommonAPIData(tempObj));
            }
          } else {
            let tempObj = {
              Key: key,
              Resp_Obj: udata?.data,
            };
            dispatch(setCommonAPIData(tempObj));
          }
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  // const {
  //   data: {data} = {},
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useQuery([key, pmsitem.method, pmsitem.sourceid, {}], {
  //   retry: false,
  //   cacheTime: 300000,
  //   staleTime: 300000,
  // });

  useEffect(() => {
    if (data?.status === '0') {
      if (data?.response == null || data?.response.length == 0) {
        setNewDescription(false);
      } else {
        let ary = [];
        data?.response?.map(item => {
          let descriptivedata = item?.description;

          if (
            descriptivedata.length > 0 &&
            descriptivedata != null &&
            descriptivedata != undefined &&
            descriptivedata != ''
          ) {
            setNewDescription(true);
            // return;
          }
          if (item.showbanner == 'T') {
            setAddedBanner(item);
          } else {
            ary.push(item);
          }
        });
        if (I18nManager.isRTL) {
          setitemsAry(ary);
        } else {
          setitemsAry(ary);
        }
      }
    }
  }, [data, newDescription]);
  if (summerCollection?.isLoading || summerCollection?.isFetching) {
    return (
      <View style={styles.parentview}>
        <View style={{minHeight: HEIGHT_250}} />
      </View>
    );
  }
  if (
    !summerCollection?.isLoading &&
    !summerCollection?.isFetching &&
    (summerCollection?.error ||
      data == null ||
      data.response === null ||
      data.response === undefined ||
      data?.response.length == 0)
  ) {
    return <View />;
  }
  const BindDiscount = item => {
    try {
      if (
        item.discountprice != null &&
        item.discountprice != '' &&
        item.discountprice != '0' &&
        item.amount != null &&
        item.amount != '' &&
        item.amount != '0'
      ) {
        let _txt = t('kd') + ' ' + item.discountprice;
        if (
          item?.validity != null &&
          item?.validity != undefined &&
          item.validity != '' &&
          item.validity != '0'
        ) {
          _txt += ' / ' + item.validity;
        }
        return <Text style={styles.descdiscountText}>{_txt}</Text>;
      }
    } catch (e) {}
    return <Text style={styles.descdiscountTextu}> </Text>;
  };
  const GetPrice = item => {
    try {
      if (item.amount != null && item.amount != '') {
        let _txt = t('kd') + ' ' + item.amount;
        let _valtxt = '';
        let _distxt = '';

        if (
          item.discountprice != null &&
          item.discountprice != '' &&
          item.discountprice != '0' &&
          item.amount != null &&
          item.amount != '' &&
          item.amount != '0' &&
          item?.discount == '1'
        ) {
          _txt = t('kd') + ' ' + item.discountprice;
          _distxt = t('kd') + ' ' + item.amount;
        }
        if (
          item?.validity != null &&
          item?.validity != undefined &&
          item.validity != '' &&
          item.validity != '0'
        ) {
          _valtxt = '/' + item.validity;
        }
        return (
          <View style={styles.moreview}>
            <View
              {...UnitTestProps('ooredooadd', 'view', 'mainview')}
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                marginTop: Platform.OS == 'android' ? 5 : 0,
              }}>
              <Text style={styles.moreText}>
                {_txt}
                <Text style={styles.morevalText}>{_valtxt + '' + ' '}</Text>
                <Text style={styles.descdiscountText}>{_distxt}</Text>
              </Text>
              {/* <Icon
                {...UnitTestProps('ooredooadd', 'icon', 'lefticon')}
                name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                size={FONT_10}
                color={colors.WHITE}
                style={{
                  paddingHorizontal: WIDTH_5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  lineHeight: I18nManager.isRTL ? FONT_16 : FONT_14,
                  marginBottom: I18nManager.isRTL ? VERTICAL_3 : 0,
                }}
              /> */}
            </View>
          </View>
        );
      }
    } catch (e) {}
    return null;
  };

  const BindCards = ({item, index}) => {
    try {
      return (
        <View
          style={{
            marginLeft:
              index == 0
                ? I18nManager.isRTL
                  ? Platform.OS == 'ios'
                    ? HORIZONTAL_12
                    : HORIZONTAL_12
                  : HORIZONTAL_12
                : 0,
          }}>
          <Surface
            style={[
              styles.shadowView,
              {
                marginTop:
                  item?.ribbonenable != 'T' ? VERTICAL_10 : VERTICAL_10,
              },
            ]}>
            <View style={styles.viewContainercard}>
              <TouchableOpacity
                disabled={
                  item?.buyurl != null &&
                  item?.buyurl != '' &&
                  item?.buyurl != undefined
                    ? false
                    : true
                }
                onPress={() => {
                  setTimeout(() => {
                    NavigateByName(
                      navigation,
                      item?.buyurl,
                      {type: 'shop'},
                      item,
                      null,
                      'T',
                      null
                    );
                  }, 200);
                }}>
                <View style={{padding: WIDTH_5}}>
                  <ImageComponent
                    type="image"
                    iwidth={widthPixel(148)}
                    iheight={heightPixel(115)}
                    source={item.imagepath}
                    style={
                      {
                        // top: -widthPixel(5),
                        // borderTopLeftRadius: BORDER_RADIUS_15,
                        // borderTopRightRadius: BORDER_RADIUS_15,
                      }
                    }
                    resizeMode={'contain'}
                  />
                </View>
                <View style={styles.textview}>
                  <TextComponent
                    style={styles.headerText}
                    data={item?.title}
                    lines={2}
                    type="text"
                  />
                  {!item?.description.includes('<html') ? (
                    <TextComponent
                      style={[styles.descText]}
                      data={item?.description}
                      lines={3}
                      type="text"
                    />
                  ) : null}
                </View>
              </TouchableOpacity>
              <View style={styles.priceView}>{GetPrice(item)}</View>
            </View>
            {item?.ribbonenable == 'T' ? (
              <View
                style={[
                  styles.ribbonView,
                  {
                    backgroundColor: item?.ribbonbgcolor,
                    flex: 1,
                    position: 'absolute',
                    top: -VERTICAL_10,
                  },
                ]}>
                <Text
                  numberOfLines={1}
                  style={[styles.ribbonText, {color: item?.ribbontitlecolor}]}>
                  {item?.ribbontitle}
                </Text>
              </View>
            ) : null}
          </Surface>
        </View>
      );
    } catch (e) {}
    return <View />;
  };

  const SearchRedirect = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta?.viewall_url != null
      ) {
        if (
          global.customerprofile == null ||
          global.customerprofile == '' ||
          global.customerprofile == undefined
        ) {
          navigationBeforeLogin(
            navigation,
            StackActions,
            pmsitem?.elementmeta?.viewall_url
          );
        } else {
          NavigateByName(
            navigation,
            pmsitem?.elementmeta?.viewall_url,
            {
              type: 'shop',
              statusbarcolor: colors.OOREDOO_RED,
            },
            pmsitem?.elementmeta,
            null,
            'T',
            null
          );
        }
      }
    } catch (e) {}
  };

  const BindViewall = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta?.viewall_title != null
        // pmsitem?.elementmeta?.more_url != null &&
        // pmsitem?.elementmeta?.more_title != null &&
        // pmsitem?.elementmeta?.more_title != undefined &&
        //   pmsitem?.elementmeta?.more_title != ''
      ) {
        return (
          <View style={styles.viewall}>
            <TouchableOpacity
              style={[styles.titleContainer, {alignItems: 'center'}]}
              onPress={() => SearchRedirect()}>
              <Text style={styles.viewmore}>
                {pmsitem?.elementmeta?.viewall_title}
              </Text>
              <Icon
                name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                size={FONT_12}
                style={{
                  lineHeight: FONT_20,
                  marginTop: I18nManager.isRTL ? -VERTICAL_7 : 0,
                }}
                color={colors.OOREDOO_RED}
              />
            </TouchableOpacity>
          </View>
        );
      }
    } catch (e) {}
    return null;
  };
  // const BindViewall = () => {
  //   try {
  //     if (
  //       pmsitem != null &&
  //       pmsitem?.metadata != null &&
  //       pmsitem?.metadata?.more_url != null &&
  //       pmsitem?.metadata?.more_title != null &&
  //       pmsitem?.metadata?.more_title != undefined &&
  //       pmsitem?.metadata?.more_title != ''
  //     ) {
  //       return (
  //         <View style={styles.viewall}>
  //           <TouchableOpacity
  //             style={[styles.titleContainer, {alignItems: 'center'}]}
  //             onPress={() => SearchRedirect()}>
  //             <Text style={styles.viewmore}>
  //               {pmsitem?.metadata?.more_title}
  //             </Text>
  //             <Icon
  //               name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
  //               size={FONT_12}
  //               style={{lineHeight: FONT_20}}
  //               color={colors.OOREDOO_RED}
  //             />
  //           </TouchableOpacity>
  //         </View>
  //       );
  //     }
  //   } catch (e) {}
  //   return null;
  // };
  const BindTitle = () => {
    try {
      return (
        <View style={{flex: 1}}>
          <Text style={styles.sectitle} numberOfLines={1}>
            {data?.catname}
          </Text>
        </View>
      );
    } catch (e) {}
    return null;
  };
  return (
    <View style={[styles.viewContainer, {marginHorizontal: tabletMargin()}]}>
      <View style={styles.innerview}>
        <View style={styles.cardtitle}>
          {BindTitle()}
          {/* {BindViewall()} */}
          {pmsitem != null &&
          pmsitem?.elementmeta != null &&
          pmsitem?.elementmeta?.show_viewall != null &&
          pmsitem?.elementmeta?.show_viewall == 'T' ? (
            BindViewall()
          ) : (
            <></>
          )}
        </View>
        {addedbanner != null &&
        addedbanner != undefined &&
        addedbanner != '' ? (
          <View style={styles.bannerView}>
            <ImageComponent
              type="image"
              iwidth={imageWidth}
              iheight={imageHeight}
              source={addedbanner?.imagepath}
              resizeMode={'stretch'}
            />
          </View>
        ) : null}
        <View
        // style={{
        //   marginHorizontal: I18nManager.isRTL ? HORIZONTAL_12 : 0,
        //   right:
        //     Platform.OS == 'android' && I18nManager.isRTL
        //       ? itemsAry != null &&
        //         itemsAry != undefined &&
        //         (itemsAry.length == 2 || itemsAry.length == 1)
        //         ? 10
        //         : 0
        //       : 0,
        // }}
        >
          {itemsAry != null && itemsAry != undefined && itemsAry.length > 1 ? (
            <FlatList
              bounces={true}
              data={itemsAry}
              renderItem={BindCards}
              // renderItem={({ item, index }) => (
              //   <BindCards item={item} idx={index} />
              // )}
              // inverted={I18nManager.isRTL?true:false}
              keyExtractor={(item, index) => index.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              removeClippedSubviews={true} // Add this line
              style={{
                marginRight: I18nManager.isRTL
                  ? Platform.OS == 'android' && itemsAry.length == 2
                    ? HORIZONTAL_20
                    : 0
                  : 0,
              }}
            />
          ) : (
            <>
              {itemsAry != null && itemsAry != undefined ? (
                <View
                  style={{
                    // marginLeft:
                    //   index == 0 ? (I18nManager.isRTL ? 0 : HORIZONTAL_12) : 0,
                    //   marginRight:
                    //   index == 0 ? (I18nManager.isRTL ? HORIZONTAL_12 : 0) : 0,
                    right: I18nManager.isRTL
                      ? Platform.OS == 'ios'
                        ? -WIDTH_8
                        : -WIDTH_20
                      : 0,
                    marginHorizontal: I18nManager.isRTL ? 0 : HORIZONTAL_12,
                  }}>
                  <Surface
                    style={[
                      styles.shadowView,
                      {
                        marginTop:
                          itemsAry[0]?.ribbonenable != 'T'
                            ? VERTICAL_10
                            : VERTICAL_10,
                      },
                    ]}>
                    <View style={styles.viewContainercard}>
                      <TouchableOpacity
                        disabled={
                          itemsAry[0]?.buyurl != null &&
                          itemsAry[0]?.buyurl != '' &&
                          itemsAry[0]?.buyurl != undefined
                            ? false
                            : true
                        }
                        onPress={() => {
                          setTimeout(() => {
                            NavigateByName(
                              navigation,
                              itemsAry[0]?.buyurl,
                              {type: 'shop'},
                              itemsAry[0],
                              null,
                              'T',
                              null
                            );
                          }, 200);
                        }}>
                        <View style={{padding: WIDTH_5}}>
                          <ImageComponent
                            type="image"
                            iwidth={widthPixel(155)}
                            iheight={heightPixel(115)}
                            source={itemsAry[0].imagepath}
                            style={{
                              // top: -widthPixel(5),
                              borderTopLeftRadius: BORDER_RADIUS_15,
                              borderTopRightRadius: BORDER_RADIUS_15,
                            }}
                            resizeMode={'contain'}
                          />
                        </View>
                        <View style={styles.textview}>
                          <TextComponent
                            style={styles.headerText}
                            data={itemsAry[0]?.title}
                            lines={2}
                            type="text"
                          />
                          {!itemsAry[0]?.description.includes('<html') ? (
                            <TextComponent
                              style={[styles.descText]}
                              data={itemsAry[0]?.description}
                              lines={3}
                              type="text"
                            />
                          ) : null}
                        </View>
                      </TouchableOpacity>
                      <View style={styles.priceView}>
                        {GetPrice(itemsAry[0])}
                      </View>
                    </View>
                    {itemsAry[0]?.ribbonenable == 'T' ? (
                      <View
                        style={[
                          styles.ribbonView,
                          {
                            backgroundColor: itemsAry[0]?.ribbonbgcolor,
                            flex: 1,
                            position: 'absolute',
                            top: -VERTICAL_10,
                          },
                        ]}>
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.ribbonText,
                            {color: itemsAry[0]?.ribbontitlecolor},
                          ]}>
                          {itemsAry[0]?.ribbontitle}
                        </Text>
                      </View>
                    ) : null}
                  </Surface>
                </View>
              ) : null}
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default SummerNewCollections;
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    // backgroundColor: '#F9F9F9',
    // marginVertical: -VERTICAL_10,
    // paddingVertical: HEIGHT_20,
    marginTop: VERTICAL_20,
  },
  innerview: {
    flex: 1,
  },
  cardtitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginHorizontal: HORIZONTAL_25,
  },
  sectitle: {
    fontSize: FONT_20,
    lineHeight: FONT_35,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    marginVertical: VERTICAL_10,
    color: colors.OOREDOO_BLACK,
  },
  viewall: {
    width: WIDTH_110,
    alignItems: 'center',
    flexDirection: 'row',
  },
  titleContainer: {
    flexDirection: 'row',
    width: WIDTH_110,
    justifyContent: 'flex-end',
  },
  viewmore: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_22,
    color: colors.OOREDOO_RED,
    paddingHorizontal: WIDTH_5,
  },
  rightarrow: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 4,
  },
  shadowView:
    Platform.OS == 'ios'
      ? {
          // width: isTablet ? widthPixel(155) : widthPixel(155),
          // marginBottom: VERTICAL_20,
          // marginRight: WIDTH_15,
          // borderRadius: WIDTH_10,
          // borderWidth: 1,
          // borderColor: '#00000027',
          // shadowOffset: {width: 0, height: 0},
          // shadowOpacity: 0.2,
          // shadowRadius: 5,
          width: isTablet ? widthPixel(155) : widthPixel(155),
          marginBottom: VERTICAL_20,
          marginHorizontal: WIDTH_15,
          // elevation: 5,
          borderColor: '#00000027',
          borderRadius: WIDTH_10,
          marginLeft: WIDTH_2,
        }
      : {
          width: isTablet ? widthPixel(155) : widthPixel(155),
          marginBottom: VERTICAL_20,
          marginHorizontal: WIDTH_15,
          elevation: 5,
          borderColor: '#00000027',
          borderRadius: WIDTH_10,
          marginLeft: WIDTH_2,
        },
  textview: {
    paddingVertical: HEIGHT_10,
    alignContent: 'center',
    alignItems: 'center',
    height: heightPixel(124),
    marginHorizontal: widthPixel(20),
  },
  viewContainercard: {
    alignItems: 'center',
  },
  moreview: {
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
    marginTop: VERTICAL_4,
    // marginBottom: VERTICAL_5,
  },
  moreText: {
    color: colors.WHITE,
    fontFamily: I18nManager.isRTL ? OOREDOO_REGULAR_FONT : RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: FONT_22,
  },
  morevalText: {
    color: colors.WHITE,
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_10,
    lineHeight: FONT_18,
  },
  headerText: {
    color: colors.OOREDOO_BLACK,
    fontFamily: I18nManager.isRTL ? OOREDOO_HEAVY_FONT : OOREDOO_MEDIUM_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_20 : FONT_15,
    marginTop: VERTICAL_5,
    marginHorizontal: WIDTH_8,
    // height: I18nManager.isRTL ? heightPixel(45) : heightPixel(35),
    textAlign: 'center',
  },
  descText: {
    color: colors.OOREDOO_BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_12,
    lineHeight: I18nManager.isRTL ? FONT_18 : FONT_15,
    marginTop: VERTICAL_2,
    marginHorizontal: WIDTH_8,
    textAlign: 'center',
  },
  descdiscountText: {
    color: '#FF7B80',
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    // lineHeight: FONT_22,
    marginVertical: VERTICAL_5,
    marginHorizontal: WIDTH_8,
    textAlign: 'center',
    textDecorationLine: 'line-through',
    // borderWidth: 1,
  },

  descdiscountTextu: {
    color: colors.OOREDDO_GREY,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_12,
    // lineHeight: FONT_22,
    marginVertical: VERTICAL_5,
    marginHorizontal: WIDTH_8,
    textAlign: 'center',
    // borderWidth: 1,
  },
  ribbonView: {
    marginHorizontal: HORIZONTAL_12,
    height: heightPixel(21),
    zIndex: 9999,
    borderRadius: 3,
    justifyContent: 'center',
    minWidth: WIDTH_60,
    maxWidth: widthPixel(155),
  },
  ribbonText: {
    textAlign: 'center',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    minWidth: WIDTH_60,
    maxWidth: widthPixel(155),
  },
  priceView: {
    alignContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ED1C24',
    borderBottomLeftRadius: BORDER_RADIUS_10,
    borderBottomRightRadius: BORDER_RADIUS_10,
    height: HEIGHT_30,
    width: isTablet
      ? widthPixel(154)
      : Platform.OS == 'android'
      ? widthPixel(155)
      : widthPixel(153),
  },
  bannerView: {
    alignItems: 'center',
    top: VERTICAL_2,
    marginBottom: VERTICAL_18,
  },
});
