import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import colors from '../../resources/styles/colors';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import {
  BORDER_RADIUS_25,
  FONT_13,
  HEIGHT_16,
  HEIGHT_20,
  HEIGHT_40,
  VERTICAL_4,
  WIDTH_22,
  WIDTH_28,
  WIDTH_326,
} from '../../resources/styles/responsive';
import {
  SCREEN_WIDTH,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';

const BottomButton = ({text, onPress, disable = false}) => {
  return (
    <View style={styles.mainContainer}>
      <LandingPageButton
        disabled={disable}
        title={text}
        onPress={() => {
          if (!disable) {
            onPress();
          }
        }}
        customStyle={[
          styles.buttonContainer,
          {backgroundColor: disable ? colors.LIGHT_GREY : colors.OOREDOO_RED},
        ]}
        customTextStyle={styles.buttonText}
        numberOfLines={1}
      />
    </View>
  );
};

export default BottomButton;

const styles = StyleSheet.create({
  mainContainer: {
    position: 'absolute',
    bottom: 0,
    backgroundColor: colors.BG_COLOR_WHITE,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: HEIGHT_20,
    paddingBottom: HEIGHT_16,
    shadowOffset: {
      height: 2,
      width: 2,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.5,
    width: SCREEN_WIDTH,
    elevation: Platform.OS == 'android' ? 10 : 3,
  },
  buttonContainer: {
    width: WIDTH_326,
    height: HEIGHT_40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_25,
    marginLeft: WIDTH_22,
    marginRight: WIDTH_28,
    alignSelf: 'center',
    bottom: VERTICAL_4,
  },
  buttonText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.WHITE,
  },
});
