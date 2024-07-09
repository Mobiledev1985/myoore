import {useNavigation} from '@react-navigation/native';

import React, {useState, useRef, useEffect} from 'react';

import {useTranslation} from 'react-i18next';

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  I18nManager,
  Dimensions,
} from 'react-native';
import {useScreenBgColor} from '../../models/hooks/getBgColor';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';

import {
  SCREEN_WIDTH,
  tabletMargin,
  widthPixel,
  isTablet,
  SCREEN_HEIGHT,
} from '../../resources/styles/normalizedimension';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
  borderRadius,
  FONT_12,
  FONT_16,
  FONT_14,
  FONT_24,
  WIDTH_12,
  WIDTH_25,
  HORIZONTAL_20,
  HORIZONTAL_2,
  WIDTH_400,
  VERTICAL_20,
  FONT_26,
  HORIZONTAL_10,
  VERTICAL_10,
  VERTICAL_5,
  FONT_21,
  WIDTH_110,
  WIDTH_8,
  HORIZONTAL_25,
  HORIZONTAL_70,
  HORIZONTAL_5,
  WIDTH_2,
  WIDTH_18,
  VERTICAL_25,
  FONT_20,
  VERTICAL_40,
  VERTICAL_12,
  VERTICAL_2,
  CARD_WIDTH,
  FONT_30,
  FONT_22,
  WIDTH_5,
  VERTICAL_30,
  VERTICAL_3,
  VERTICAL_18,
  VERTICAL_7,
} from '../../resources/styles/responsive';
import ImageComponent from '../../models/basic/ImageComponent';
import {useQuery} from 'react-query';
import {NavigateByName} from '../../services/NavigationService';
import {consoleLog} from '../../commonHelper/utils';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
const StaticShopBanner = ({pmsitem, item}) => {
  const navigation = useNavigation();
  const deviceWidth = Dimensions.get('window').width;
  const containerWidth = CARD_WIDTH;
  const aspectRatio = 393 / 240; // Image's original aspect ratio
  const imageWidth = Math.min(containerWidth, deviceWidth);
  const imageHeight = imageWidth / aspectRatio;

  // const {data: {data} = {}, isLoading, error, isFetching} = useQuery(
  //   ['', pmsitem.method, JSON.parse(pmsitem.sourceid), {}],
  //   {
  //     retry: false,
  //     retryOnMount: false,
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      shopBanner.mutate();
    } catch (r) {}
  }, []);

  const shopBanner = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, JSON.parse(pmsitem.sourceid)],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  const showHeader = () => {
    try {
      if (
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta != undefined &&
        pmsitem?.elementmeta?.title != null &&
        pmsitem?.elementmeta?.title != undefined &&
        pmsitem?.elementmeta?.title?.length > 0
      ) {
        return (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignContent: 'center',
              paddingHorizontal: isTablet
                ? tabletMargin() + HORIZONTAL_10
                : HORIZONTAL_10,
              top: VERTICAL_10,
            }}>
            <View>
              <Text numberOfLines={1} style={styles.headertitle}>
                {/* {pmsitem?.elementmeta?.title} */}
              </Text>
            </View>
            <View
              style={{
                top: isTablet ? VERTICAL_10 : VERTICAL_12,
              }}>
              {pmsitem?.elementmeta?.show_viewall != null &&
                pmsitem?.elementmeta?.show_viewall != undefined && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      top: VERTICAL_2,
                      alignItems: 'center',
                      justifyContent: 'center',
                      right: isTablet ? -WIDTH_12 : WIDTH_18,
                    }}>
                    <Text numberOfLines={1} style={styles.viewmore}>
                      {pmsitem?.elementmeta?.viewall_title}
                    </Text>
                    <Icon
                      name={
                        I18nManager.isRTL ? 'chevron-left' : 'chevron-right'
                      }
                      size={FONT_12}
                      color={colors.OOREDOO_RED}
                      style={{
                        marginLeft: HORIZONTAL_5,

                        bottom: I18nManager.isRTL ? WIDTH_2 : 0,
                      }}
                    />
                  </TouchableOpacity>
                )}
            </View>
          </View>
        );
      }
    } catch (error) {}
    return null;
  };

  if (
    shopBanner?.isLoading ||
    shopBanner?.isFetching ||
    shopBanner?.error ||
    !data ||
    data?.status == '-1'
  ) {
    return null;
  }

  const SearchRedirect = () => {
    try {
      if (
        pmsitem != null &&
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta?.more_url != null
      ) {
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
    } catch (e) {}
  };
  const BindViewall = () => {
    try {
      if (
        pmsitem != null
        // &&
        // pmsitem?.elementmeta != null &&
        // pmsitem?.elementmeta?.viewall_title !=null
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

  const BindTitle = () => {
    try {
      if (
        pmsitem?.elementmeta != null &&
        pmsitem?.elementmeta != undefined &&
        pmsitem?.elementmeta?.title != null &&
        pmsitem?.elementmeta?.title != undefined &&
        pmsitem?.elementmeta?.title?.length > 0
      ) {
        return (
          <View style={{flex: 1}}>
            <Text style={styles.sectitle} numberOfLines={1}>
              {pmsitem?.elementmeta?.title}
            </Text>
          </View>
        );
      }
    } catch (e) {}
    return null;
  };

  return (
    <View style={styles.viewContainer}>
      <View style={styles.innerview}>
        {/* <View style={styles.cardtitle}>{showHeader()}</View> */}
        <View style={styles.cardtitle}>
          {BindTitle()}
          {pmsitem != null &&
          pmsitem?.elementmeta != null &&
          pmsitem?.elementmeta?.show_viewall != null &&
          pmsitem?.elementmeta?.show_viewall == 'T' ? (
            BindViewall()
          ) : (
            <></>
          )}
        </View>

        <View style={styles.itemView}>
          <TouchableOpacity
            onPress={() => {
              NavigateByName(
                navigation,
                data?.response[0]?.buyurl,
                {
                  type: 'shop',
                },
                data?.response[0],
                null,
                null
              );
            }}>
            <ImageComponent
              type="image"
              iwidth={imageWidth}
              iheight={imageHeight}
              source={data?.response[0]?.imagepath}
              resizeMode={'stretch'}
              style={{borderRadius: 2}}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
export default StaticShopBanner;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },

  viewall: {
    width: WIDTH_110,
    alignItems: 'center',
    flexDirection: 'row',
  },
  sectitle: {
    fontSize: FONT_20,
    lineHeight: FONT_30,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    // marginVertical: VERTICAL_20,

    color: colors.OOREDOO_BLACK,
  },
  viewContainer: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    backgroundColor: '#F9F9F9',
    // paddingVertical: HEIGHT_10,
  },
  innerview: {
    flex: 1,
    marginTop: VERTICAL_10,
  },
  bgView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9F9F9',
  },

  itemtouch: {
    marginVertical: widthPixel(5),
    alignItems: 'center',
  },
  imageview: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.2,
  },

  itemrenderView: {
    width: widthPixel(60),
    height: widthPixel(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: widthPixel(40),
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginHorizontal: widthPixel(12),
  },
  continueBtnContainer: {
    borderRadius: WIDTH_25,
    paddingTop: HORIZONTAL_2,
    paddingBottom: HORIZONTAL_2,
    paddingLeft: HORIZONTAL_20,
    paddingRight: HORIZONTAL_20,
  },
  titileView: {
    width: isTablet ? widthPixel(72) : widthPixel(80),
    paddingTop: 5,
  },
  promotionText: {
    textAlign: 'left',
    color: colors.WHITE,
    marginTop: VERTICAL_10,
    marginBottom: VERTICAL_5,
    fontFamily: OOREDOO_REGULAR_FONT,

    fontSize: FONT_21,
    lineHeight: FONT_26,
  },
  promotionsubText: {
    textAlign: 'left',
    marginTop: VERTICAL_5,
    color: colors.WHITE,
    marginBottom: VERTICAL_5,
    fontFamily: NOTOSANS_REGULAR_FONT,

    fontSize: FONT_16,
    lineHeight: FONT_26,
  },

  linktitleContainer: {
    textAlign: 'center',
    fontSize: FONT_12,
    fontFamily: NOTOSANS_REGULAR_FONT,
    alignSelf: 'center',
    paddingBottom: 10,
  },
  imageStyle: {
    height: widthPixel(30),
    width: widthPixel(30),
  },
  parentview: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    borderTopLeftRadius: borderRadius(10),
    borderTopRightRadius: borderRadius(10),
    backgroundColor: colors.WHITE,
  },
  viewmore: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_22,
    color: colors.OOREDOO_RED,
    paddingHorizontal: WIDTH_5,
  },
  // viewmore: {
  //   fontFamily: OOREDOO_HEAVY_FONT,
  //   fontSize: FONT_14,
  //   lineHeight: FONT_24,
  //   color: colors.OOREDOO_RED,
  // },
  // titleContainer: {
  //   flexDirection: 'row',
  //   marginTop: VERTICAL_20,
  //   marginHorizontal: isTablet ? HORIZONTAL_25 : HORIZONTAL_70,
  //   width: WIDTH_110,
  //   justifyContent: 'flex-end',
  // },
  titleContainer: {
    flexDirection: 'row',
    width: WIDTH_110,
    justifyContent: 'flex-end',
  },
  rightarrow: {
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_24,
    marginHorizontal: HORIZONTAL_2,
  },
  headertitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    fontSize: FONT_20,
    color: colors.OOREDOO_BLACK,
    left: isTablet ? -VERTICAL_40 : VERTICAL_5,
    paddingTop: VERTICAL_10,
  },
  inactiveDotColor: {
    width: WIDTH_12,
    height: WIDTH_12,
    borderRadius: WIDTH_12 / 2,
    marginHorizontal: 0,
  },
  dotscontainerStyle: {marginHorizontal: 2},
  dotStyle: {
    width: WIDTH_8,
    height: WIDTH_8,
    borderRadius: WIDTH_8 / 2,
    marginHorizontal: 1,
  },
  pagecontainerStyle: {marginVertical: -VERTICAL_25},
  itemView: {
    alignItems: 'center',
    marginTop: VERTICAL_18,
    marginBottom: VERTICAL_18,
  },
  cardtitle: {
    // marginBottom: VERTICAL_10,
    // flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignContent: 'center',
    marginHorizontal: HORIZONTAL_25,
    // backgroundColor:'red'
  },
});
