import {useNavigation} from '@react-navigation/native';

import React, {useState, useRef, useEffect} from 'react';

import {useTranslation} from 'react-i18next';

import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Platform,
  I18nManager,
  Dimensions,
  Alert,
  Linking,
  Animated,
} from 'react-native';
import {useScreenBgColor} from '../../../models/hooks/getBgColor';
import colors from '../../../resources/styles/colors';
import {
  NOTOSANS_REGULAR_FONT,
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
  SCREEN_HEIGHT,
} from '../../../resources/styles/normalizedimension';
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
  WIDTH_5,
  VERTICAL_20,
  FONT_26,
  HORIZONTAL_10,
  VERTICAL_10,
  VERTICAL_5,
  FONT_21,
  WIDTH_110,
  HEIGHT_200,
  WIDTH_8,
  HORIZONTAL_25,
  HORIZONTAL_70,
  HORIZONTAL_5,
  WIDTH_2,
  VERTICAL_15,
  WIDTH_18,
  VERTICAL_25,
  FONT_20,
  WIDTH_20,
  HORIZONTAL_100,
  WIDTH_330,
  WIDTH_10,
  WIDTH_350,
  VERTICAL_40,
  WIDTH_351,
  WIDTH_40,
  BORDER_RADIUS_25,
  CARD_WIDTH,
  HORIZONTAL_19,
  VERTICAL_12,
  VERTICAL_18,
  HORIZONTAL_15,
  HORIZONTAL_13,
} from '../../../resources/styles/responsive';
import ImageComponent from '../../../models/basic/ImageComponent';
import Carousel, {Pagination} from '@mbcafeapp/react-native-snap-carousel';
import {useMutation, useQuery} from 'react-query';
import {NavigateByName} from '../../../services/NavigationService';
import {isLinkExternal} from '../../../commonHelper/utils';
import {callQueryapi} from '../../../commonHelper/middleware/callapi.ios';

const UpdatedShop = ({pmsitem, item}) => {
  const navigation = useNavigation();
  const scrollX = new Animated.Value(0);
  let position = Animated.divide(scrollX, SCREEN_WIDTH);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {bgcolor} = useScreenBgColor();
  const {t} = useTranslation();
  const [index, setIndex] = React.useState(0);
  const isCarousel = React.useRef(null);
  // const SLIDER_WIDTH = Dimensions.get('window').width + 80;
  // const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 0.7);
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize currentIndex to 0
  const flatListRef = useRef(null);
  const deviceWidth = Dimensions.get('window').width;
  const containerWidth = SCREEN_WIDTH - widthPixel(24);
  const aspectRatio = 393 / 240; // Image's original aspect ratio
  const imageWidth = Math.min(containerWidth, deviceWidth);
  const imageHeight = imageWidth / aspectRatio;
  const [data, setdata] = useState();

  const shopbannerApi = useMutation(
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
      shopbannerApi.mutate();
    } catch (r) {}
  }, []);

  // const {data: {data} = {}, isLoading, error, isFetching} = useQuery(
  //   ['', pmsitem.method, JSON.parse(pmsitem.sourceid), {}],
  //   {
  //     retry: false,
  //     retryOnMount: false,
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );
  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            NavigateByName(
              navigation,
              item?.url,
              {
                type: 'shop',
              },
              item
            );
          }}>
          <View
            style={{
              // marginLeft: -WIDTH_5,
              // borderTopLeftRadius: BORDER_RADIUS_25,
              // borderTopRightRadius: BORDER_RADIUS_25,
              marginHorizontal: widthPixel(12),
            }}>
            <ImageComponent
              type="image"
              iwidth={
                isTablet
                  ? SCREEN_WIDTH - HORIZONTAL_100
                  : I18nManager.isRTL
                  ? imageWidth
                  : imageWidth
              }
              iheight={isTablet ? heightPixel(260) : imageHeight}
              source={item?.path}
              // resizeMode={'stretch'}
              resizeMode={'contain'}
              style={
                {
                  // overflow: 'hidden',
                  // borderRadius: BORDER_RADIUS_25,
                }
              }
            />
          </View>
        </TouchableOpacity>
      </View>
    );
  };
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
                ? tabletMargin() + HORIZONTAL_19
                : HORIZONTAL_19,
              // top: -VERTICAL_5,
              paddingTop: isTablet ? VERTICAL_10 : VERTICAL_10,
              // paddingBottom: isTablet ? 0 : VERTICAL_10,
            }}>
            {/* <View> */}
            <Text numberOfLines={1} style={styles.headertitle}>
              {pmsitem?.elementmeta?.title}
            </Text>
            {/* </View> */}
            <View style={{left: HORIZONTAL_13}}>
              {pmsitem?.elementmeta?.more_title != null &&
                pmsitem?.elementmeta?.more_title != undefined && (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      paddingTop: heightPixel(4),
                      alignItems: 'center',
                      justifyContent: 'center',
                      right: WIDTH_18,
                    }}
                    onPress={() => {
                      NavigateByName(
                        navigation,
                        pmsitem?.elementmeta?.viewall_url,
                        {
                          type: 'shop',
                        },
                        pmsitem?.elementmeta
                      );
                    }}>
                    <Text style={styles.viewmore}>
                      {pmsitem?.elementmeta?.more_title}
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
    shopbannerApi?.isLoading ||
    shopbannerApi?.isFetching ||
    shopbannerApi?.error ||
    !data ||
    data?.status == '-1'
  ) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: '#F9F9F9',
        paddingHorizontal: tabletMargin(),
      }}>
      {showHeader()}
      {data != null &&
      data != undefined &&
      data?.response[0]?.banners?.length > 0 ? (
        <View
          style={{
            marginBottom: VERTICAL_10,
            marginTop: VERTICAL_18,
            backgroundColor: '#F9F9F9',
          }}>
          <View style={[styles.bgView]}>
            <FlatList
              ref={flatListRef}
              data={data?.response[0]?.banners}
              renderItem={renderItem}
              horizontal
              bounces={true}
              enableMomentum
              pagingEnabled={true}
              showsHorizontalScrollIndicator={false}
              onSnapToItem={indx => {
                setCurrentIndex(indx);
              }}
              firstItem={
                Platform.OS === 'ios'
                  ? 0
                  : I18nManager.isRTL
                  ? data?.response[0]?.banners.length
                  : 0
              }
              keyExtractor={(_, index) => index.toString()}
              activeSlideAlignment={'start'}
              decelerationRate={0.9}
              onScroll={Animated.event(
                [{nativeEvent: {contentOffset: {x: scrollX}}}],
                {
                  listener: event => {
                    // Update the selectedIndex based on scroll position
                    const index = Math.round(
                      event.nativeEvent.contentOffset.x / SCREEN_WIDTH
                    );
                    setSelectedIndex(index);
                  },
                  useNativeDriver: false,
                }
              )}
            />
            <View style={styles.dotView}>
              {data?.response[0]?.banners.length > 1 &&
                data?.response[0]?.banners.map((_, i) => {
                  let opacity = position.interpolate({
                    inputRange: [i - 1, i, i + 1],
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                  });

                  // Determine the active dot based on the current position
                  let dotColor = i === selectedIndex ? colors.RED : '#EEEEEE';

                  return (
                    <Animated.View
                      key={i}
                      style={[
                        styles.dotViewContain,
                        {backgroundColor: dotColor},
                      ]}
                    />
                  );
                })}
            </View>
            {/* <Pagination
              dotsLength={data?.response[0]?.banners.length}
              activeDotIndex={currentIndex}
              containerStyle={styles.pagecontainerStyle}
              dotStyle={styles.dotStyle}
              inactiveDotStyle={styles.inactiveDotColor}
              dotColor={colors.RED}
              inactiveDotColor={colors.GREY}
              inactiveDotOpacity={0.4}
              inactiveDotScale={0.99}
              dotContainerStyle={styles.dotscontainerStyle}
              // showsHorizontalScrollIndicator={true}
            /> */}
          </View>
        </View>
      ) : null}
    </View>
  );
};
export default UpdatedShop;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: SCREEN_WIDTH,
  },
  bgView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  itemtouch: {
    marginVertical: widthPixel(5),
    alignItems: 'center',
  },
  imageview: {
    width: SCREEN_WIDTH * 0.25,
    height: SCREEN_HEIGHT * 0.2,
    backgroundColor: colors.WHITE,
  },
  itemrenderView: {
    width: widthPixel(60),
    height: widthPixel(60),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS_25,
    borderWidth: 1,
    borderColor: colors.BORDER_COLOR,
    marginHorizontal: widthPixel(12),
    backgroundColor: colors.WHITE,
  },
  imageStyle: {
    height: widthPixel(30),
    width: widthPixel(30),
  },
  viewmore: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    color: colors.OOREDOO_RED,
  },

  headertitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    fontSize: FONT_20,
    color: colors.OOREDOO_BLACK,
    left: isTablet ? -VERTICAL_25 : VERTICAL_5,
    paddingTop: VERTICAL_5,
  },
  dotscontainerStyle: {marginHorizontal: HORIZONTAL_2},
  dotStyle: {
    width: WIDTH_8,
    height: WIDTH_8,
    borderRadius: WIDTH_8 / 2,
    marginHorizontal: 1,
    flexDirection:
      Platform.OS === 'ios' ? 'row' : I18nManager.isRTL ? 'row-reverse' : 'row',
  },
  pagecontainerStyle: {
    marginVertical: -VERTICAL_25,
  },
  paginationView: {
    flex: 1,
    marginHorizontal: 0,
    marginLeft: 0,
    marginTop: 0,
  },
  dotView: {
    flexDirection:
      Platform.OS === 'android' && I18nManager.isRTL ? 'row-reverse' : 'row',
    justifyContent: 'center',
    marginTop: VERTICAL_12,
  },
  dotViewContain: {
    // height: HEIGHT_9,
    // width: WIDTH_9,
    width: isTablet ? 12 : WIDTH_8,
    height: isTablet ? 12 : WIDTH_8,
    margin: WIDTH_2,
    borderRadius: 6,
  },
});
