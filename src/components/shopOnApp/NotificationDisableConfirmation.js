import React, {useEffect, useRef} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  Image,
  I18nManager,
} from 'react-native';
import {Modal, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import colors from '../../resources/styles/colors';
import {
  FONT_14,
  FONT_16,
  FONT_20,
  FONT_24,
  FONT_28,
  FONT_30,
  FULL_WIDTH_PERCENTAGE,
  HEIGHT_10,
  HEIGHT_30,
  HEIGHT_35,
  HORIZONTAL_40,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_25,
  VERTICAL_30,
  VERTICAL_35,
  VERTICAL_40,
  WIDTH_53,
  WIDTH_55,
  WIDTH_67,
  WIDTH_95,
} from '../../resources/styles/responsive';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  RUBIK_SEMIBOLD_FONT,
  RUBIK_REGULAR_FONT,
  NOTOSANS_LIGHT_FONT,
} from '../../resources/styles/fonts';
import LottieView from 'lottie-react-native';

const NotificationDisableConfirmation = ({visible, onClose, onConfirm}) => {
  const bounceValue = useRef(new Animated.Value(0)).current;
  const animationHeight = useRef(70);
  const {t} = useTranslation();
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
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <View style={styles.innerView}>
              <View
                style={{
                  position: 'absolute',
                  top: heightPixel(10),
                }}>
                <LottieView
                  resizeMode="cover"
                  source={require('../../assets/confirmation.json')}
                  autoPlay
                  loop={true}
                  style={styles.lottieStyle}
                />
              </View>
              <TouchableOpacity
                onPress={() => onClose()}
                style={styles.closeIconView}>
                <Image
                  source={require('../../assets/close.png')}
                  style={styles.closeImage}
                  resizeMode={'contain'}
                />
              </TouchableOpacity>
              <Text style={styles.titleText} numberOfLines={2}>
                {t('dywtdn')}
              </Text>
              <View style={{width: widthPixel(323)}}>
                <Text style={styles.descriptionText} numberOfLines={4}>
                  {t('dnwpyfsonuao')}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => onClose()}
                  style={styles.buttonView}>
                  <Text
                    style={[styles.ButtonText, {color: colors.OOREDOO_RED}]}>
                    {t('close')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onConfirm()}
                  style={[
                    styles.buttonView,
                    {backgroundColor: colors.OOREDOO_RED},
                  ]}>
                  <Text style={[styles.ButtonText, {color: colors.WHITE}]}>
                    {t('disable')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                height: animationHeight.current,
                backgroundColor: 'white',
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

export default NotificationDisableConfirmation;

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  innerView: {
    height: heightPixel(343),
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingTop: heightPixel(20),
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    lineHeight: FONT_28,
    color: colors.BLACK,
    marginHorizontal: HORIZONTAL_40,
    textAlign: 'center',
    marginTop: VERTICAL_20,
  },
  descriptionText: {
    fontFamily: NOTOSANS_LIGHT_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_24,
    color: colors.BLACK,
    marginTop: I18nManager.isRTL ? VERTICAL_15 : VERTICAL_10,
    fontWeight: '300',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPixel(I18nManager.isRTL ? 70 : 80),
  },
  buttonView: {
    width: widthPixel(150),
    height: heightPixel(40),
    borderRadius: heightPixel(20),
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ButtonText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    textAlign: 'center',
  },
  lottieStyle: {
    width: WIDTH_55,
    height: WIDTH_55,
  },
  closeIconView: {
    height: HEIGHT_35,
    width: HEIGHT_35,
    position: 'absolute',
    right: 5,
    top: 5,
  },
  closeImage: {height: HEIGHT_35, width: HEIGHT_35},
});
