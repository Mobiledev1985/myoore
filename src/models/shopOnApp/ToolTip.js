import React from 'react';
import {StyleSheet, TouchableOpacity, Modal, View, Text} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_13,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_14,
  HEIGHT_20,
  HEIGHT_50,
  HEIGHT_8,
  WIDTH_20,
} from '../../resources/styles/responsive';
import ImageComponent from '../basic/ImageComponent';
import {RUBIK_LIGHT_FONT} from '../../resources/styles/fonts';

const ToolTip = ({isVisible, onClose, desc}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      statusBarTranslucent
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        style={styles.mainView}
        onPress={() => {
          onClose();
        }}
        activeOpacity={1}>
        <View style={styles.innerView}>
          <View style={styles.imageView}>
            <ImageComponent
              type="image"
              iwidth={WIDTH_20}
              iheight={HEIGHT_20}
              source={
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.paymonthadvance_tooltip_icon
              }
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.textView}>
            <Text style={styles.textStyle}>{desc}</Text>
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ToolTip;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerView: {
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingHorizontal: HEIGHT_50,
    marginHorizontal: HEIGHT_10,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.INACTIVEDOT,
    paddingBottom: HEIGHT_14,
  },
  imageView: {
    marginTop: HEIGHT_12,
    alignSelf: 'center',
  },
  textView: {
    marginTop: HEIGHT_8,
  },
  textStyle: {
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'center',
  },
});
