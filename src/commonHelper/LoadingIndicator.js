import {FONT_16, FONT_24, VERTICAL_10} from '../resources/styles/responsive';
import React, {memo} from 'react';
import {StyleSheet, View} from 'react-native';

import LottieView from 'lottie-react-native';
import {NOTOSANS_REGULAR_FONT} from '../resources/styles/fonts';
import colors from '../resources/styles/colors';
import {useTranslation} from 'react-i18next';
import {widthPixel} from '../resources/styles/normalizedimension';

const LoadingIndicator = ({isVisible}) => {
  const {t} = useTranslation();
  return (
    <>
      {isVisible ? (
        <View style={styles.loading}>
          <View style={[styles.loading, styles.loaderBg]} />
          <View style={styles.loaderContainer}>
            <LottieView
              source={require('../../src/assets/loader.json')}
              autoPlay
              loop
              style={{height: widthPixel(100), width: widthPixel(100)}}
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'transparent',
    borderWidth: 1,
  },
  loaderBg: {
    backgroundColor: colors.WHITE,
    opacity: 0,
  },
  loaderContainer: {
    height: widthPixel(100),
    width: widthPixel(100),
  },
  loadertext: {
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_24,
    color: colors.OOREDOO_BLACK,
    textAlign: 'left',
    paddingTop: VERTICAL_10,
  },
});

export default memo(LoadingIndicator);
