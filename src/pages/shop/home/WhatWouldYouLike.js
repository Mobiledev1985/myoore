import React, {useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  I18nManager,
  Platform,
  Linking,
} from 'react-native';
import ScreenName from '../../../navigator/ScreenName';
import {NavigateByName} from '../../../services/NavigationService';
import colors from '../../../resources/styles/colors';

import {
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../../resources/styles/fonts';

import {
  heightPixel,
  SCREEN_WIDTH,
  tabletMargin,
  widthPixel,
  isTablet,
} from '../../../resources/styles/normalizedimension';
import {
  borderRadius,
  BORDER_RADIUS_10,
  CARD_WIDTH,
  FONT_12,
  FONT_16,
  HORIZONTAL_10,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_5,
  VERTICAL_2,
  FONT_20,
  FONT_22,
  FONT_35,
  FONT_10,
  VERTICAL_4,
  HORIZONTAL_2,
  VERTICAL_1,
  WIDTH_1,
  VERTICAL_20,
  VERTICAL_15,
  VERTICAL_18,
  VERTICAL_21,
  VERTICAL_8,
  VERTICAL_12,
  VERTICAL_40,
  HORIZONTAL_15,
  HORIZONTAL_12,
  VERTICAL_22,
  VERTICAL_7,
} from '../../../resources/styles/responsive';
import CommonCarousel from '../../../UIComponent/custom/CommonCarousel';
import {useMutation, useQuery} from 'react-query';
import ImageComponent from '../../../models/basic/ImageComponent';

import {useNavigation} from '@react-navigation/native';
import {color} from 'react-native-reanimated';
import {consoleLog, isLinkExternal} from '../../../commonHelper/utils';
import {callQueryapi} from '../../../commonHelper/middleware/callapi.ios';
const WhatWouldYouLike = ({pmsitem}) => {
  const isCarousel = React.useRef(null);
  const navigation = useNavigation();
  const [data, setdata] = useState();

  const WhatWouldYouLikeApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, JSON.parse(pmsitem.sourceid)],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          setdata(udata?.data);
        } catch (error) {}
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  React.useEffect(() => {
    try {
      WhatWouldYouLikeApi.mutate();
    } catch (r) {}
  }, []);

  // const {
  //   data: {data} = {},
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useQuery(['', pmsitem.method, JSON.parse(pmsitem.sourceid), {}], {
  //   retry: false,
  //   retryOnMount: false,
  //   cacheTime: 0,
  //   staleTime: 0,
  // });

  const itemClick = item => {
    if (
      item?.metadata != null &&
      item?.metadata != undefined &&
      item?.metadata != ''
    ) {
      let external = item?.metadata.filter(x => {
        if (x.meta_key === 'external') {
          return x;
        } else {
          return null;
        }
      });
      if (external != null && external != undefined && external.length > 0) {
        if (global.userlanguage != 'en') {
          external = external[0]?.meta_value_arabic;
        } else {
          external = external[0]?.meta_value_english;
        }
      }
      let url = item?.metadata.filter(x => {
        if (x.meta_key === 'redirecturl') {
          return x;
        } else {
          return null;
        }
      });

      if (url != null && url != undefined && url.length > 0) {
        if (global.userlanguage != 'en') {
          url = url[0]?.meta_value_arabic;
        } else {
          url = url[0]?.meta_value_english;
        }
      }

      if (isLinkExternal(external)) {
        try {
          Linking.openURL(url);
        } catch (error) {}
      } else {
        NavigateByName(navigation, url, item, null);
      }
    } else {
      NavigateByName(
        navigation,
        item?.redirecturl,
        {type: 'shop'},
        item,
        null,
        null,
        null
      );
    }
  };

  const renderCarouselItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          // style={styles.itemtouch}
          style={{
            flex: 1,
            // width:SCREEN_WIDTH/3,
            // justifyContent: 'center',
            alignItems: 'center',
            // paddingLeft:10
          }}
          disabled={
            item?.metadata != null &&
            item?.metadata != undefined &&
            item?.metadata != ''
              ? false
              : item?.redirecturl === 'na'
              ? true
              : false
          }
          onPress={() => itemClick(item)}
          // onPress={() => {
          //   //     let external = item?.metadata.filter(x => {
          //   //       if (x.meta_key === 'external') {
          //   //         return x;
          //   //       } else {
          //   //         return null;
          //   //       }
          //   //     });
          //   //     if (external != null && external != undefined && external.length > 0) {
          //   //       if (global.userlanguage != 'en') {
          //   //         external = external[0].meta_value_arabic;
          //   //       } else {
          //   //         external = external[0].meta_value_english;
          //   //       }
          //   //       let url = item?.metadata.filter(x => {
          //   //         if (x.meta_key === 'url') {
          //   //           return x;
          //   //         } else {
          //   //           return null;
          //   //         }
          //   //       });
          //   //       if (url != null && url != undefined && url.length > 0) {
          //   //         if (global.userlanguage != 'en') {
          //   //           url = url[0].meta_value_arabic;
          //   //         } else {
          //   //           url = url[0].meta_value_english;
          //   //         }
          //   //         if (isLinkExternal(external)) {
          //   //           try {
          //   //             Linking.openURL(url);
          //   //           } catch (error) {}
          //   //         } else {
          //   //           NavigateByName(navigation, url, params, null);
          //   //         }
          //   //       }
          //   //     }
          //   //   }
          //   // if (item?.redirecturl === 'na') {
          //   //   return;
          //   // }
          //   // NavigateByName(
          //   //   navigation,
          //   //   item?.redirecturl,
          //   //   {type: 'shop'},
          //   //   item,
          //   //   null,
          //   //   null,
          //   //   null
          //   // );
          //   // NavigateByName(
          //   //   navigation,
          //   //   'shoponapp',
          //   //   {type: 'shop'},
          //   //   item,
          //   //   null,
          //   //   null,
          //   //   null
          //   // );
          // }}
        >
          <View style={styles.itemrenderView}>
            <ImageComponent
              type="image"
              iwidth={widthPixel(50)}
              iheight={heightPixel(50)}
              source={item?.imageurl}
              style={{
                alignSelf: 'center',
                marginTop: VERTICAL_22,
              }}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.titileView}>
            <Text numberOfLines={2} style={[styles.linktitleContainer]}>
              {item?.displaytext}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  // data?.response?.dynamictypes[0]?.cards.splice(0,6).length>5?

  const BindLinksLikeView = () => {
    return (
      <View>
        <View style={styles.mainContainer}>
          {/* <View
            style={{backgroundColor: colors.WHITE}}> */}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
            }}>
            <View
              style={{
                marginTop: VERTICAL_8,
                height: heightPixel(3),
                width: widthPixel(40),
                backgroundColor: colors.SILVER,
                borderRadius: widthPixel(25),
              }}
            />
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              top: VERTICAL_8,
            }}>
            <Text style={styles.wouldlikeText}>
              {pmsitem?.elementmeta?.title}
            </Text>
          </View>
          {data?.response?.dynamictypes[0]?.cards?.length > 5 ? (
            <FlatList
              data={
                I18nManager.isRTL
                  ? data?.response?.dynamictypes[0]?.cards
                  : data?.response?.dynamictypes[0]?.cards
              }
              // inverted={
              //   // Platform.OS === 'android' &&
              //   I18nManager.isRTL ? true : false
              // }
              renderItem={renderCarouselItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              bounces={true}
            />
          ) : (
            <FlatList
              data={
                I18nManager.isRTL
                  ? data?.response?.dynamictypes[0]?.cards?.slice().reverse()
                  : data?.response?.dynamictypes[0]?.cards
                // .splice(0,3)
              }
              inverted={
                // Platform.OS === 'android' &&
                I18nManager.isRTL ? true : false
              }
              renderItem={renderCarouselItem}
              showsHorizontalScrollIndicator={false}
              horizontal
              bounces={true}
              contentContainerStyle={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            />
          )}
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
            }}>
            <Text
              style={{
                marginTop: VERTICAL_5,
                height: VERTICAL_1,
                width: isTablet ? widthPixel(350) : widthPixel(350),
                borderWidth: isTablet ? WIDTH_1 : 0.4,
                borderColor: '#00000027',
              }}
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        // marginBottom: heightPixel(10),
        marginTop: heightPixel(10),
        marginHorizontal: isTablet ? tabletMargin() : 0,
      }}>
      <View>{BindLinksLikeView()}</View>
    </View>
  );
};
export default WhatWouldYouLike;

const styles = StyleSheet.create({
  // bgView: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },

  mainContainer: {
    backgroundColor: '#F9F9F9',
    top: -VERTICAL_18,
    // borderWidth:5,
    // borderColor:'red',
    width: SCREEN_WIDTH,
    paddingHorizontal: tabletMargin(),
    alignSelf: 'center',
    padding: 0,
    borderTopRightRadius: HORIZONTAL_12,
    borderTopLeftRadius: HORIZONTAL_12,
  },
  itemtouch: {
    alignItems: 'center',
  },

  titileView: {
    width: isTablet ? widthPixel(72) : SCREEN_WIDTH / 5,
    paddingTop: VERTICAL_15,
    marginTop: VERTICAL_7,
  },
  wouldlikeText: {
    textAlign: 'center',
    marginTop: VERTICAL_5,

    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    lineHeight: FONT_35,
  },
  innertext: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    color: colors.WHITE,
  },
  linktitleContainer: {
    textAlign: 'center',
    fontSize: FONT_12,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    alignSelf: 'center',
    paddingBottom: VERTICAL_5,
    paddingTop: VERTICAL_2,
    lineHeight: FONT_22,
    height: heightPixel(55),
  },
  imageStyle: {
    height: widthPixel(55),
    width: widthPixel(55),
    alignSelf: 'center',
    marginTop: VERTICAL_10,
  },
  parentview: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    borderTopLeftRadius: borderRadius(10),
    borderTopRightRadius: borderRadius(10),
    backgroundColor: colors.WHITE,
  },
});
