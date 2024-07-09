import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import ImageComponent from '../models/basic/ImageComponent';
import TextComponent from '../models/basic/TextComponent';
import {
  NOTOSANS_LIGHT_FONT,
  OOREDOO_HEAVY_FONT,
} from '../resources/styles/fonts';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  widthPixel,
} from '../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_8,
  FONT_13,
  FONT_14,
  FONT_21,
  HEIGHT_104,
  HEIGHT_33,
  VERTICAL_5,
  WIDTH_12,
  WIDTH_32,
  WIDTH_80,
} from '../resources/styles/responsive';
import colors from '../resources/styles/colors';
import {SCALE_SIZE_14} from './Constants';
import {useTranslation} from 'react-i18next';
import Animated, {FadeInUp, FadeOutUp} from 'react-native-reanimated';

const ToastPopup = ({showToast, imgSrc, title, desc}) => {
  const {t} = useTranslation();
  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={styles.toastView}>
      <View style={styles.questPopup}>
        <View style={styles.questMain}>
          <ImageComponent
            type="image"
            iwidth={WIDTH_32}
            iheight={HEIGHT_33}
            source={imgSrc}
            resizeMode="contain"
            fastImage={true}
          />

          <TextComponent
            data={title ? title : ''}
            type="text"
            style={styles.questTitle}
          />
        </View>

        <TextComponent
          style={styles.questText}
          data={desc}
          type="text"
          lines={2}
        />
      </View>
    </Animated.View>
  );
};

export default ToastPopup;

const styles = StyleSheet.create({
  toastView: {
    position: 'absolute',
    top: heightPixel(47),
    alignSelf: 'center',
    zIndex: 999,
  },
  questPopup: {
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: {width: 0, height: 2},
    shadowColor:
      Platform.OS == 'android' ? colors.BLACK : colors.DARK_SHADOW_GREY,
    shadowRadius: SCALE_SIZE_14,
    shadowOpacity: 1,
    elevation: 3,
    borderRadius: BORDER_RADIUS_8,
    backgroundColor: colors.BG_COLOR_WHITE,
    height: HEIGHT_104,
    width: isTablet
      ? SCREEN_WIDTH - widthPixel(100)
      : SCREEN_WIDTH - widthPixel(24),
    paddingHorizontal: WIDTH_80,
  },
  questMain: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    //padding:10,
  },
  questTitle: {
    fontFamily: OOREDOO_HEAVY_FONT,
    marginLeft: WIDTH_12,
    fontSize: FONT_14,
    textAlign: 'left',
    color: colors.BLACK,
  },
  questText: {
    marginVertical: VERTICAL_5,
    textAlign: 'center',
    fontSize: FONT_13,
    fontFamily: NOTOSANS_LIGHT_FONT,
    lineHeight: FONT_21,
  },
});
