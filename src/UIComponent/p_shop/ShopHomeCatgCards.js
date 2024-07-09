import {useNavigation} from '@react-navigation/core';
import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {I18nManager, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {Surface} from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useMutation, useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import {
  UnitTestProps,
  consoleLog,
  findObjectByKey,
} from '../../commonHelper/utils';
import ImageComponent from '../../models/basic/ImageComponent';
import LoadingComponent from '../../models/basic/LoadingComponent';
import TextComponent from '../../models/basic/TextComponent';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../../resources/styles/fonts';
import {
  heightPixel,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_15,
  FONT_12,
  FONT_14,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_28,
  FONT_30,
  FONT_32,
  FONT_34,
  FONT_35,
  FONT_37,
  FONT_38,
  HEIGHT_10,
  HEIGHT_107,
  HEIGHT_144,
  HEIGHT_20,
  HEIGHT_250,
  HEIGHT_310,
  HEIGHT_45,
  HEIGHT_50,
  HEIGHT_53,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_3,
  VERTICAL_5,
  VERTICAL_8,
  WIDTH_10,
  WIDTH_110,
  WIDTH_186,
  WIDTH_20,
  WIDTH_250,
  WIDTH_330,
  WIDTH_5,
  WIDTH_8,
} from '../../resources/styles/responsive';
import {GetCacheKey} from '../../services/CacheUtil';
import {GetMessagelength} from '../../services/CommonUtils';
import {NavigateByName, NavigateCards} from '../../services/NavigationService';
import CommonCarousel from '../custom/CommonCarousel';
import {callQueryapi} from '../../commonHelper/middleware/callapi.ios';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';

const ShopHomeCatgCards = ({pmsitem}) => {
  const {t, i18n} = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const state = useSelector(stateObj => stateObj.userData);
  const key = GetCacheKey('ShopHomeCatgCards' + `${pmsitem.uniqueid}`);
  const [isDescription, setIsDescription] = useState(false);
  const [data, setdata] = useState();
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );

  const shopCatgApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, JSON.parse(pmsitem.sourceid)],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
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
        } catch (error) {}
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  React.useEffect(() => {
    try {
      if (cachedAPIData && cachedAPIData?.length > 0) {
        const foundObj = findObjectByKey(cachedAPIData, 'Key', key);
        if (foundObj != null && foundObj != undefined && foundObj) {
          setdata(foundObj?.Resp_Obj);
        } else {
          shopCatgApi.mutate();
        }
      } else {
        shopCatgApi.mutate();
      }
    } catch (r) {}
  }, []);

  useEffect(() => {
    consoleLog('data fetched', data?.status);
    if (data?.status === '0') {
      consoleLog('data fetched', data);
      if (data?.response == null || data?.response.length == 0) {
        setIsDescription(false);
      } else {
        data?.response?.map(item => {
          let desc = item?.description;
          consoleLog('desc', desc.length);
          if (
            desc.length > 0 &&
            desc != null &&
            desc != undefined &&
            desc != ''
          ) {
            consoleLog('desc', desc);
            setIsDescription(true);
            return;
          }
        });
      }
    }
  }, [data, isDescription]);

  // const {data: {data} = {}, isLoading, error, isFetching} = useQuery(
  //   [key, pmsitem.method, pmsitem.sourceid, {}],
  //   {
  //     retry: false,
  //     cacheTime: 300000,
  //     staleTime: 300000,
  //   }
  // );
  if (shopCatgApi?.isLoading || shopCatgApi?.isFetching) {
    return (
      <View style={styles.parentview}>
        <View style={{minHeight: HEIGHT_250}} />
      </View>
    );
  }
  if (
    !shopCatgApi?.isLoading &&
    !shopCatgApi?.isFetching &&
    (shopCatgApi?.error ||
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
        item.amount != '0' &&
        item?.discount == '1'
      ) {
        let _txt = t('kd') + ' ' + item.amount;
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
    return <Text> </Text>;
  };
  const GetPrice = item => {
    try {
      if (item.amount != null && item.amount != '') {
        let _txt = t('kd') + ' ' + item.amount;

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
        }
        if (
          item?.validity != null &&
          item?.validity != undefined &&
          item.validity != '' &&
          item.validity != '0'
        ) {
          _txt += ' / ' + item.validity;
        }
        return (
          <View style={styles.moreview}>
            <View
              style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
              }}>
              <Text style={styles.moreText}>{_txt}</Text>
              <Icon
                name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                size={FONT_12}
                color={colors.OOREDOO_RED}
                style={{
                  paddingHorizontal: WIDTH_5,
                  alignSelf: 'center',
                  justifyContent: 'center',
                  lineHeight: I18nManager.isRTL ? FONT_16 : FONT_14,
                  marginBottom: I18nManager.isRTL ? VERTICAL_3 : 0,
                }}
              />
            </View>
          </View>
        );
      }
    } catch (e) {}
    return null;
  };

  const BindCards = ({item, idx}) => {
    try {
      return (
        <Surface style={styles.shadowView}>
          <View style={styles.viewContainercard}>
            <TouchableOpacity
              onPress={() => {
                //https://github.com/react-navigation/react-navigation/issues/7038
                setTimeout(() => {
                  NavigateCards(
                    navigation,
                    item,
                    null,
                    null,
                    {
                      type: 'shop',
                      statusbarcolor: colors.OOREDOO_RED,
                    },
                    'T'
                  );
                }, 200);
              }}>
              <View style={{padding: WIDTH_5}}>
                <ImageComponent
                  type="image"
                  iwidth={widthPixel(170)}
                  iheight={heightPixel(135)}
                  source={item.imagepath}
                  style={{
                    borderTopLeftRadius: BORDER_RADIUS_15,
                    borderTopRightRadius: BORDER_RADIUS_15,
                  }}
                  resizeMode={'contain'}
                />
              </View>
              <View style={styles.textview}>
                <TextComponent
                  style={[styles.headerText]}
                  data={item.title}
                  lines={2}
                  type="text"
                />
                <TextComponent
                  style={[styles.descText]}
                  data={item.description}
                  lines={3}
                  type="text"
                />
              </View>

              <View style={{alignContent: 'center', alignItems: 'center'}}>
                {BindDiscount(item)}
                {GetPrice(item)}
              </View>
            </TouchableOpacity>
          </View>
        </Surface>
      );
    } catch (e) {}
    return <View />;
  };

  const SearchRedirect = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem.elementmeta != null &&
        pmsitem.elementmeta.more_url != null
      ) {
        NavigateByName(
          navigation,
          pmsitem.elementmeta.more_url,
          {
            type: 'shop',
            showcenterlogo: 'true',
            statusbarcolor: colors.OOREDOO_RED,
          },
          null,
          null,
          'T'
        );
      }
    } catch (e) {}
  };
  const BindViewall = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta?.hidemore != null &&
        pmsitem?.elementmeta?.hidemore == 'T'
      ) {
        return null;
      }
      if (
        pmsitem != null &&
        pmsitem.elementmeta != null &&
        pmsitem.elementmeta.more_url != null
      ) {
        return (
          <View style={styles.viewall}>
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => SearchRedirect()}>
              <Text style={styles.viewmore}>{t('viewall')}</Text>
              <Icon
                name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
                size={FONT_16}
                style={{lineHeight: FONT_20}}
                color={colors.OOREDOO_RED}
              />
            </TouchableOpacity>
          </View>
        );
      }
    } catch (e) {}
    return null;
  };
  const BindTitle = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta?.hidetitle != null &&
        pmsitem?.elementmeta?.hidetitle == 'T'
      ) {
        return null;
      }
      return (
        <View>
          <Text style={styles.sectitle} numberOfLines={1}>
            {data?.catname}
          </Text>
        </View>
      );
    } catch (e) {}
    return null;
  };
  return (
    <View style={styles.viewContainer}>
      <View
        {...UnitTestProps('shophomecatgcards', 'view', 'card')}
        style={styles.innerview}>
        <View
          {...UnitTestProps('shophomecatgcards', 'view', 'cardsub')}
          style={styles.cardtitle}>
          {BindTitle()}
          {BindViewall()}
        </View>
        <View
          {...UnitTestProps('shophomecatgcards', 'view', 'cardsub2')}
          style={{marginRight: WIDTH_5}}>
          <CommonCarousel
            {...UnitTestProps(
              'shophomecatgcards',
              'commoncarousel',
              'cardcommon'
            )}
            carouseldata={data?.response}
            RenderCarousel={BindCards}
            cardtype={2}
          />
        </View>
      </View>
    </View>
  );
};

export default ShopHomeCatgCards;
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    paddingVertical: HEIGHT_20,
  },
  innerview: {
    flex: 1,
  },
  cardtitle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginHorizontal: WIDTH_10,
  },
  sectitle: {
    fontSize: FONT_22,
    width: WIDTH_250,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
    marginVertical: VERTICAL_20,
    color: colors.OOREDOO_BLACK,
    alignItems: 'center',
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
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    color: colors.OOREDOO_RED,
    paddingHorizontal: WIDTH_5,
  },
  rightarrow: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    paddingHorizontal: 4,
  },
  shadowView: {
    width: WIDTH_186,
    marginBottom: VERTICAL_10,
    flex: 1,
    marginRight: WIDTH_20,
    elevation: 4,
    borderRadius: WIDTH_10,
  },
  textview: {
    paddingVertical: HEIGHT_10,
    alignContent: 'center',
    alignItems: 'center',
  },
  viewContainercard: {
    alignItems: 'center',
  },
  moreview: {
    justifyContent: 'flex-end',
    alignContent: 'center',
    alignItems: 'center',
    marginBottom: VERTICAL_5,
    flex: 1,
  },
  moreText: {
    color: colors.OOREDOO_RED,
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
  },
  headerText: {
    color: colors.OOREDOO_BLACK,
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    flex: 1,
    textAlign: 'left',
    height: HEIGHT_53,
  },
  descText: {
    color: colors.OOREDOO_BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_12,
    textAlign: 'center',
    marginHorizontal: WIDTH_8,
    height: I18nManager.isRTL ? heightPixel(78) : heightPixel(55),
  },
  descdiscountText: {
    color: colors.OOREDDO_GREY,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    marginVertical: VERTICAL_5,
    marginHorizontal: WIDTH_8,
    textAlign: 'center',
    textDecorationLine: 'line-through',
  },

  descdiscountTextu: {
    color: colors.OOREDDO_GREY,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    marginVertical: VERTICAL_5,
    marginHorizontal: WIDTH_8,
    textAlign: 'center',
  },
});
