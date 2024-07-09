import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ImageBackground,
  Animated,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import ScreenName from '../navigator/ScreenName';
import {StackActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';
import colors from '../resources/styles/colors';
import {
  heightPixel,
  widthPixel,
  isTablet,
} from '../resources/styles/normalizedimension';
import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  FONT_14,
  FONT_24,
  HEIGHT_10,
  HEIGHT_20,
  HEIGHT_30,
  HEIGHT_40,
  HORIZONTAL_100,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_25,
  HORIZONTAL_30,
  HORIZONTAL_5,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_3,
  VERTICAL_30,
  VERTICAL_5,
  WIDTH_48,
} from '../resources/styles/responsive';
import {WINDOW_HEIGHT} from './utils';
import {OOREDOO_HEAVY_FONT} from '../resources/styles/fonts';
// import { isTablet } from 'react-native-device-info';

const HEADER_HEIGHT = isTablet ? 55 : 44;

function areEqual(prevProps, nextProps) {
  if (
    prevProps.left !== nextProps.left ||
    prevProps.right !== nextProps.right ||
    prevProps.title !== nextProps.title ||
    prevProps.headerImgPath !== nextProps.headerImgPath
  ) {
    return false;
  }
  return true;
}

const ScreenHeader = ({
  left,
  right,
  title,
  titleStyle,
  headerImgPath,
  headerComponent,
  animatedValue,
  bgtype,
  titlePressed,
  rassist = false,
}) => {
  let bgImage = require('../assets/image.png');
  if (bgtype === 2) {
    bgImage = require('../assets/bg.png');
  }
  const navigation = useNavigation();
  const RenderAssist = () => (
    <TouchableOpacity
      onPress={() => {
        global.assistParentID = 0;
        // navigation.navigate(ScreenName.OAssist);
        navigation.navigate(ScreenName.SupportHome);
      }}>
      <Image
        source={
          I18nManager.isRTL
            ? require('../assets/assist_icon_ar.png')
            : require('../assets/assist_icon.png')
        }
        style={{width: widthPixel(40), height: heightPixel(30)}}
        resizeMode={'contain'}
      />
    </TouchableOpacity>
  );
  let headerHeight = null;
  if (animatedValue && headerComponent) {
    headerHeight = animatedValue.interpolate({
      inputRange: [0, HEADER_HEIGHT, HEADER_HEIGHT * 2],
      outputRange: [WINDOW_HEIGHT / 2, WINDOW_HEIGHT / 4, HEADER_HEIGHT * 2],
      extrapolate: 'clamp',
    });
  }
  return (
    <>
      {headerComponent ? (
        <Animated.View
          style={[
            styles.prepaidBg,
            {
              height: headerHeight,
            },
          ]}>
          <ImageBackground
            source={bgImage}
            style={styles.bgImage}
            imageStyle={{resizeMode: 'repeat'}}
          />
        </Animated.View>
      ) : null}
      <View style={styles.container}>
        <View style={[styles.left, isTablet ? {bottom: heightPixel(38)} : {}]}>
          {left ? left() : null}
        </View>
        <View style={styles.middle}>
          {title ? (
            <TouchableOpacity onPress={titlePressed}>
              <Text
                style={[
                  titleStyle,
                  {marginTop: I18nManager.isRTL ? VERTICAL_5 : 0},
                ]}
                numberOfLines={2}
                ellipsizeMode={'middle'}>
                {title}
              </Text>
            </TouchableOpacity>
          ) : (
            <Image
              source={headerImgPath}
              style={styles.image}
              resizeMode={'contain'}
            />
          )}
        </View>
        {rassist && RenderAssist()}
        {!rassist && (
          <View
            style={[styles.right, isTablet ? {bottom: heightPixel(38)} : {}]}>
            {right ? right() : null}
          </View>
        )}
      </View>
    </>
  );
};

export default memo(ScreenHeader, areEqual);

const styles = StyleSheet.create({
  prepaidBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: -1,
  },
  bgImage: {
    width: widthPixel(375),
    height: heightPixel(350),
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  container: {
    height: HEADER_HEIGHT,
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    alignItems: 'center',
    paddingBottom: HORIZONTAL_25,
    marginHorizontal: APPLY_TABLET_OR_DEVICE_MARGIN,
  },
  left: {flex: 3},
  middle: {
    flex: 12,
    alignItems: 'center',
    marginTop: isTablet ? VERTICAL_20 : VERTICAL_20,
    height: heightPixel(30),
  },
  right: {flex: 3, alignItems: 'flex-end'},
  image: {height: 40, width: '60%'},
});
