import React from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import colors from '../../resources/styles/colors';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import {
  BORDER_RADIUS_30,
  FONT_13,
  HEIGHT_16,
  HEIGHT_20,
  HEIGHT_22,
  HEIGHT_40,
  WIDTH_12,
  WIDTH_140,
  WIDTH_20,
  WIDTH_22,
  WIDTH_38,
} from '../../resources/styles/responsive';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import ImageComponent from '../../models/basic/ImageComponent';
import Icon from 'react-native-vector-icons/Entypo';

const BottomPayButton = ({
  text,
  onPressPlaceOrder,
  selectedMethod,
  onChangePayPress,
}) => {
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity
        style={styles.innerContainer}
        activeOpacity={0.5}
        onPress={() => {
          onChangePayPress();
        }}>
        <ImageComponent
          type="image"
          iwidth={WIDTH_38}
          iheight={HEIGHT_20}
          source={selectedMethod?.iconpath}
          resizeMode={'contain'}
          style={{marginLeft: WIDTH_22}}
        />

        <View style={styles.touchView}>
          <Icon
            name={'chevron-small-down'}
            size={16}
            color={colors.OOREDOO_BLACK}
          />
        </View>
      </TouchableOpacity>
      <LandingPageButton
        title={text}
        onPress={() => {
          onPressPlaceOrder();
        }}
        customStyle={styles.buttonContainer}
        customTextStyle={styles.buttonText}
        numberOfLines={1}
      />
    </View>
  );
};

export default BottomPayButton;

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
    width: FULL_WIDTH_PERCENTAGE,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: Platform.OS == 'android' ? 10 : 3,
  },
  innerContainer: {
    width: WIDTH_140,
    height: HEIGHT_40,
    alignItems: 'center',
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS_30,
    marginLeft: WIDTH_20,
    flexDirection: 'row',
  },
  buttonContainer: {
    width: WIDTH_140,
    height: HEIGHT_40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_30,
    marginLeft: WIDTH_22,
    position: 'absolute',
    right: WIDTH_20,
  },
  buttonText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.WHITE,
  },
  touchView: {
    height: HEIGHT_22,
    width: WIDTH_22,
    borderRadius: 50,
    borderWidth: 0.5,
    borderColor: colors.OOREDDO_LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    right: WIDTH_12,
  },
});
