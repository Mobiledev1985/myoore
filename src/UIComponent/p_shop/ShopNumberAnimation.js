import React, {useRef, useEffect} from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  I18nManager,
  Dimensions,
  Platform,
} from 'react-native';

import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  FONT_10,
  FONT_13,
  FONT_15,
  FONT_22,
  FONT_24,
  HORIZONTAL_5,
  HORIZONTAL_10,
  VERTICAL_20,
  WIDTH_18,
  WIDTH_24,
  WIDTH_4,
  HORIZONTAL_12,
  VERTICAL_1,
} from '../../resources/styles/responsive';
import {verticalScale} from '../../commonHelper/scalingUtils';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';
import {useTranslation} from 'react-i18next';

const ShowNumberWithAnimation = ({
  isSelectedId,
  isPreviousSelectedId,
  item,
}) => {
  const {t} = useTranslation();
  const ImagePosition = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const TextPosition = useRef(new Animated.ValueXY({x: 0, y: 0})).current;
  const withoutIconTextPosition = useRef(
    new Animated.ValueXY({x: 0, y: 0})
  ).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const borderBgColorAnim = useRef(new Animated.Value(0)).current;
  const animDuration = 300;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(ImagePosition, {
        toValue: isSelectedId
          ? {
              x: I18nManager.isRTL ? -widthPixel(15) : widthPixel(15),
              y:
                I18nManager.isRTL && Platform.OS === 'android'
                  ? heightPixel(24)
                  : heightPixel(22),
            }
          : {x: 0, y: 0},
        duration: animDuration,
        useNativeDriver: true,
      }),

      Animated.timing(TextPosition, {
        toValue: isSelectedId
          ? {x: I18nManager.isRTL ? -widthPixel(40) : widthPixel(40), y: 0}
          : {x: 0, y: 0},
        duration: animDuration,
        useNativeDriver: true,
      }),

      Animated.timing(withoutIconTextPosition, {
        toValue: isSelectedId
          ? {x: I18nManager.isRTL ? -widthPixel(30) : widthPixel(30), y: 0}
          : {x: 0, y: 0},
        duration: animDuration,
        useNativeDriver: true,
      }),

      Animated.timing(fadeAnim, {
        toValue: isSelectedId ? 0 : 1,
        duration: animDuration,
        useNativeDriver: true,
      }),

      Animated.timing(bgColorAnim, {
        toValue: !isSelectedId ? 0 : 1,
        duration: animDuration,
        useNativeDriver: true,
      }),

      Animated.timing(borderBgColorAnim, {
        toValue: !isSelectedId ? 0 : 1,
        duration: animDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isSelectedId, isPreviousSelectedId]);

  return (
    <Animated.View
      key={item?.MSISDN}
      style={[
        styles.item,
        {
          borderColor: item?.selectedbgcolor,
          backgroundColor: bgColorAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [
              item?.bgcolor || 'white',
              isSelectedId
                ? item?.selectedbgcolor || 'white'
                : item?.bgcolor || 'white',
            ],
          }),
        },
      ]}>
      {item?.iconselected && item?.icon && (
        <Animated.View
          style={[
            styles.borderView,
            {
              borderColor: borderBgColorAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  item?.bgcolor || 'white',
                  isSelectedId
                    ? item?.selectedbgcolor || 'white'
                    : item?.bgcolor || 'white',
                ],
              }),
            },
          ]}></Animated.View>
      )}
      <View style={styles.imageParentView}>
        {item?.iconselected && item?.icon && (
          <Animated.View
            style={[
              styles.imageContainer,
              {
                bottom:
                  item?.Price != null &&
                  item?.Price != undefined &&
                  item?.Price != '' &&
                  item?.Price != '0' &&
                  item?.ClassType_En != 'Free'
                    ? I18nManager.isRTL
                      ? verticalScale(30)
                      : verticalScale(22)
                    : I18nManager.isRTL
                    ? verticalScale(22)
                    : verticalScale(18),
                // backgroundColor: 'green',
                transform: [
                  {translateX: ImagePosition.x},
                  {translateY: ImagePosition.y},
                ],
              },
            ]}>
            <ImageComponent
              type="image"
              iwidth={WIDTH_18}
              iheight={WIDTH_18}
              source={isSelectedId ? item?.iconselected : item?.icon}
              resizeMode={'contain'}
              fastImage={Platform.OS == 'ios' ? true : false}
              style={{
                bottom: Platform.OS == 'android' ? VERTICAL_1 : 0,
              }}
            />
          </Animated.View>
        )}

        <Animated.Text
          style={[
            styles.numberView,
            {
              fontFamily: isSelectedId
                ? RUBIK_SEMIBOLD_FONT
                : RUBIK_REGULAR_FONT,
              lineHeight: I18nManager.isRTL ? FONT_24 : FONT_15,
              color: isSelectedId ? item?.selectedtextcolor : item?.textcolor,
              transform:
                item?.iconSelected || item?.icon
                  ? [{translateX: TextPosition.x}, {translateY: TextPosition.y}]
                  : [
                      {translateX: withoutIconTextPosition.x},
                      {translateY: withoutIconTextPosition.y},
                    ],
            },
          ]}
          numberOfLines={1}>
          {item?.MSISDN}
        </Animated.Text>
        <Animated.View
          style={{
            alignItems: 'center',
            opacity: fadeAnim,
          }}>
          {item?.Price != null &&
          item?.Price != undefined &&
          item?.Price != '' &&
          item?.Price != '0' &&
          item?.ClassType_En != 'Free' ? (
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[styles.priceText, {color: item?.textcolor}]}
                numberOfLines={1}>
                {t('kd')}{' '}
              </Text>
              <Text
                style={[styles.priceText, {color: item?.textcolor}]}
                numberOfLines={1}>
                {item?.Price}
              </Text>
            </View>
          ) : null}
          <Text
            style={[styles.priceText, {color: item?.textcolor}]}
            numberOfLines={1}>
            {item?.ClassType_En}
          </Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  item: {
    borderWidth: 1,
    flexDirection: 'row',
    width: widthPixel(157) - 10,
    height: heightPixel(46),
    alignItems: 'center',
    marginBottom: VERTICAL_20,
    borderRadius: 4,
    // marginLeft: HORIZONTAL_5,
    // marginRight: HORIZONTAL_12,
    zIndex: 1,
  },
  priceText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_10,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_13,
  },
  imageParentView: {
    marginHorizontal: HORIZONTAL_10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    position: 'absolute',
    zIndex: 222,
    width: WIDTH_24,
  },
  numberView: {
    flex: 1,
    textAlign: 'left',
    fontSize: FONT_13,
  },
  borderView: {
    position: 'absolute',
    top: -1,
    left: Platform.OS == 'android' ? widthPixel(10) : widthPixel(10),
    borderWidth: 2,
    height: 1,
    width: WIDTH_24,
  },
});

export default ShowNumberWithAnimation;
