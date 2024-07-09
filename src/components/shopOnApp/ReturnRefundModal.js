import React from 'react';
import {Dimensions, TouchableOpacity, Text, StyleSheet} from 'react-native';
import {Modal, View} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_20,
  FULL_WIDTH_PERCENTAGE,
  HEIGHT_10,
  HEIGHT_20,
  HEIGHT_22,
  HEIGHT_29,
  HEIGHT_4,
  HEIGHT_525,
  HEIGHT_676,
  WIDTH_24,
  WIDTH_50,
} from '../../resources/styles/responsive';
import {
  SCREEN_HEIGHT,
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import AutoHeightWebView from 'react-native-autoheight-webview';
import {decode} from 'html-entities';
import DashedLine from 'react-native-dashed-line';
import {isTablet} from 'react-native-device-info';

const ReturnRefundModal = ({visible, onClose, data}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
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
        <TouchableOpacity style={styles.innerView} activeOpacity={1}>
          <View style={styles.lineView}></View>

          <View style={styles.titleView}>
            <Text style={styles.titleText}>
              {
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.refun_return_text
              }
            </Text>
          </View>

          <View style={styles.lineView}>
            <DashedLine
              dashLength={5}
              dashThickness={0.5}
              dashGap={2}
              dashColor={colors.OOREDDO_LIGHT_GREY}
            />
          </View>

          <View style={styles.webView}>
            <AutoHeightWebView
              scrollEnabled={true}
              nestedScrollEnabled={true}
              source={{
                html: decode(data, {mode: 'nonAsciiPrintable'}),
              }}
              style={{
                width: Dimensions.get('window').width - widthPixel(50),
              }}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ReturnRefundModal;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },

  innerView: {
    maxHeight: SCREEN_HEIGHT - heightPixel(80),
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingHorizontal: WIDTH_24,
  },
  lineView: {
    width: WIDTH_50,
    height: HEIGHT_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    alignSelf: 'center',
    marginTop: HEIGHT_10,
    borderRadius: 4,
  },

  lineView: {
    marginTop: HEIGHT_22,
  },

  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    color: colors.BLACK,
    textAlign: 'left',
    marginTop: HEIGHT_29,
  },
  webView: {
    marginTop: HEIGHT_22,
    height: HEIGHT_525,
    paddingBottom: isTablet ? HEIGHT_20 : 0,
  },
});
