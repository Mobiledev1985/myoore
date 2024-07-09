import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  I18nManager,
} from 'react-native';
import {Modal, View, Image} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_14,
  FONT_16,
  FONT_20,
  FULL_WIDTH_PERCENTAGE,
  HEIGHT_10,
  HEIGHT_15,
  HEIGHT_22,
  HEIGHT_29,
  HEIGHT_4,
  HEIGHT_525,
  HEIGHT_676,
  HORIZONTAL_20,
  HORIZONTAL_22,
  VERTICAL_10,
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

const TermsAndConditionModal = ({
  visible,
  onClose,
  data,
  productDetails,
  shopsettings,
}) => {
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(bounceValue, {
          toValue: -animationHeight.current,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      bounceValue.setValue(0);
    }
  }, [visible, bounceValue]);
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
        <Animated.View
          style={{
            marginBottom: -animationHeight.current,
            transform: [{translateY: bounceValue}],
          }}>
          <TouchableOpacity style={styles.innerView} activeOpacity={1}>
            <View style={styles.borderImageContainer}>
              <Image
                source={require('../../assets/line_border.png')}
                resizeMode={'contain'}
                style={styles.borderImage}
              />
            </View>

            <View>
              <Text style={styles.titleText}>
                {I18nManager.isRTL
                  ? productDetails?.ProductTitle_ar
                  : productDetails?.ProductTitle}
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
          <View
            style={{
              height: animationHeight.current,
              backgroundColor: 'white',
            }}
          />
        </Animated.View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          onClose();
        }}
        style={styles.buttonContainer}>
        <Text style={styles.buttonText}>
          {shopsettings?.continuebtn_popup_label}
        </Text>
      </TouchableOpacity>
    </Modal>
  );
};

export default TermsAndConditionModal;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  borderImageContainer: {
    alignItems: 'center',
    marginTop: VERTICAL_10,
  },
  borderImage: {
    width: widthPixel(50),
    height: heightPixel(11),
    alignItems: 'center',
  },
  innerView: {
    height: SCREEN_HEIGHT - heightPixel(175),
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingHorizontal: WIDTH_24,
    paddingBottom: 50,
  },

  lineView: {
    marginTop: HEIGHT_15,
  },

  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    color: colors.BLACK,
    textAlign: 'left',
    marginTop: HEIGHT_29,
  },
  webView: {
    marginTop: HEIGHT_15,
    height: heightPixel(440),
  },
  buttonContainer: {
    height: heightPixel(40),
    width: widthPixel(326),
    marginHorizontal: HORIZONTAL_22,
    position: 'absolute',
    bottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: heightPixel(20),
    backgroundColor: colors.OOREDOO_RED,
  },
  buttonText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.WHITE,
    textAlign: 'center',
    fontWeight: '600',
  },
});
