import React, {useEffect, useRef} from 'react';
import {
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from 'react-native';
import {Modal, View} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_14,
  FONT_16,
  FONT_20,
  FULL_WIDTH_PERCENTAGE,
  HEIGHT_30,
  HORIZONTAL_40,
  VERTICAL_15,
  WIDTH_67,
} from '../../resources/styles/responsive';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  RUBIK_SEMIBOLD_FONT,
  RUBIK_REGULAR_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';
import LottieView from 'lottie-react-native';

const SwitchCategoryConfirmation = ({
  visible,
  onClose,
  onConfirm,
  NewSimSelectNumberComponentData,
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
          <TouchableOpacity onPress={() => {}} activeOpacity={1}>
            <View style={styles.innerView}>
              {/* <ImageComponent
                type="image"
                iwidth={widthPixel(76)}
                iheight={widthPixel(86)}
                source={NewSimSelectNumberComponentData?.loosedata_img}
                resizeMode={'contain'}
              /> */}
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
              <Text style={styles.titleText} numberOfLines={2}>
                {NewSimSelectNumberComponentData?.loosedata_title}
              </Text>
              <View style={{width: widthPixel(269)}}>
                <Text style={styles.descriptionText} numberOfLines={4}>
                  {NewSimSelectNumberComponentData?.loosedata_desc}
                </Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  onPress={() => onClose()}
                  style={styles.buttonView}>
                  <Text
                    style={[styles.ButtonText, {color: colors.OOREDOO_RED}]}>
                    {NewSimSelectNumberComponentData?.loosedata_close_btn}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => onConfirm()}
                  style={[
                    styles.buttonView,
                    {backgroundColor: colors.OOREDOO_RED},
                  ]}>
                  <Text style={[styles.ButtonText, {color: colors.WHITE}]}>
                    {NewSimSelectNumberComponentData?.loosedata_continue_btn}
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

export default SwitchCategoryConfirmation;

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
    color: colors.BLACK,
    marginHorizontal: HORIZONTAL_40,
    marginTop: HEIGHT_30,
  },
  descriptionText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    marginTop: VERTICAL_15,
    fontWeight: '300',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '85%',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: heightPixel(40),
  },
  buttonView: {
    width: widthPixel(141),
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
    width: WIDTH_67,
    height: WIDTH_67,
  },
});
