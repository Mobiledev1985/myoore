import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_13,
  FONT_16,
  HEIGHT_12,
  HEIGHT_14,
  HEIGHT_18,
  HEIGHT_20,
  HEIGHT_26,
  WIDTH_14,
  WIDTH_20,
} from '../../resources/styles/responsive';
import {Image} from 'react-native';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';

const ReturnRefundCard = ({onPolicyPress, data}) => {
  return (
    <View style={styles.mainView}>
      <ImageComponent
        type="image"
        iwidth={WIDTH_20}
        iheight={HEIGHT_26}
        source={data?.refun_retun_icon}
        resizeMode={'contain'}
      />
      <Text style={styles.refundText}>{data?.refun_return_text}</Text>
      <TouchableOpacity
        style={styles.touchView}
        onPress={() => onPolicyPress()}>
        <Text style={styles.policyText}>{data?.read_policy_btn}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReturnRefundCard;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.BG_COLOR_WHITE,
    borderWidth: 0.5,
    borderColor: colors.INACTIVEDOT,
    marginHorizontal: HEIGHT_12,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    borderRadius: 10,
    marginTop: HEIGHT_20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: WIDTH_14,
    paddingVertical: HEIGHT_14,
    elevation: 3,
  },

  refundText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    marginLeft: HEIGHT_18,
    width: '60%',
    textAlign: 'left',
  },

  touchView: {
    padding: 5,
    position: 'absolute',
    right: WIDTH_14,
  },

  policyText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textDecorationLine: 'underline',
  },
});
