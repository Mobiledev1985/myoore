import {
  BORDER_RADIUS_25,
  FONT_14,
  FONT_16,
  FONT_18,
  FONT_22,
  FONT_25,
  FONT_28,
  FONT_35,
  HEIGHT_36,
  HEIGHT_4,
  HORIZONTAL_10,
  HORIZONTAL_30,
  VERTICAL_20,
  VERTICAL_40,
  VERTICAL_5,
  WIDTH_155,
  WIDTH_30,
  WIDTH_50,
  WIDTH_8,
} from '../../resources/styles/responsive';
import {
  StyleSheet,
  View,
  Modal,
  Animated,
  I18nManager,
  Text,
} from 'react-native';
import {
  SCREEN_WIDTH,
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';

import React, {useEffect, useRef} from 'react';
import colors from '../../resources/styles/colors';
import {
  OOREDOO_HEAVY_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {TouchableOpacity} from 'react-native';
import ImageComponent from '../basic/ImageComponent';
import {LandingPageButton} from '../../commonHelper/Button';
import {useNavigation} from '@react-navigation/native';
import {NavigateByName} from '../../services/NavigationService';

const TimeOutPopup = ({onContinue, visible}) => {
  const navigation = useNavigation();
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
    <Modal visible={true} transparent>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          flex: 1,
          backgroundColor: 'rgba(0, 0, 0, 0.4)', // Adjust the opacity as needed
        }}>
        <View style={styles.modal}>
          {/* <TouchableWithoutFeedback> */}
          <Animated.View
            style={{
              marginBottom: -animationHeight.current,
              transform: [{translateY: bounceValue}],
            }}>
            <>
              <TouchableOpacity activeOpacity={1} style={styles.modalInner}>
                <View style={{alignItems: 'center'}}>
                  <View
                    style={{
                      width: WIDTH_50,
                      height: HEIGHT_4,
                      backgroundColor: colors.OOREDDO_LIGHT_GREY,
                      alignSelf: 'center',
                      marginTop: heightPixel(10),
                      borderRadius: 4,
                    }}
                  />
                </View>
                <View style={[styles.topViewContainer]}>
                  <View style={styles.iconContainer}>
                    <ImageComponent
                      type="image"
                      iwidth={WIDTH_155}
                      iheight={WIDTH_155}
                      source={
                        global.shopOnAppSettings?.timersettings
                          ?.timer_timeout_popup_icon
                      }
                      resizeMode={'contain'}
                    />
                  </View>
                  <Text
                    style={{
                      fontFamily: RUBIK_SEMIBOLD_FONT,
                      fontSize: FONT_22,
                      lineHeight: I18nManager.isRTL ? FONT_35 : FONT_25,
                      marginHorizontal: HORIZONTAL_30,
                      top: -heightPixel(20),
                    }}>
                    {
                      global.shopOnAppSettings?.timersettings
                        ?.timer_timeout_popup_title
                    }
                  </Text>
                  <Text
                    numberOfLines={3}
                    style={{
                      fontFamily: RUBIK_LIGHT_FONT,
                      fontSize: FONT_16,
                      lineHeight: I18nManager.isRTL ? FONT_28 : FONT_18,
                      textAlign: 'center',
                      // marginTop: VERTICAL_20,
                      marginHorizontal: HORIZONTAL_30,
                    }}>
                    {
                      global.shopOnAppSettings?.timersettings
                        ?.timer_timeout_popup_desc
                    }
                  </Text>
                  <LandingPageButton
                    title={
                      global.shopOnAppSettings?.timersettings
                        ?.timer_timeout_popup_continuebtn
                    }
                    onPress={() => {
                      onContinue();
                    }}
                    customStyle={styles.tryagainBtnContainerside}
                    customTextStyle={styles.tryagainBtnText}
                  />
                </View>
              </TouchableOpacity>
              <View
                style={{
                  height: animationHeight.current,
                  backgroundColor: colors.WHITE,
                }}
              />
            </>
          </Animated.View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};
export default React.memo(TimeOutPopup);

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  modalInner: {
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    shadowRadius: 6,
    width: SCREEN_WIDTH,
    elevation: 4,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    height: I18nManager.isRTL ? heightPixel(430) : heightPixel(384),
  },
  topViewContainer: {
    alignItems: 'center',
  },
  tryagainBtnContainerside: {
    padding: WIDTH_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    width: SCREEN_WIDTH - WIDTH_30,
    borderColor: colors.OOREDOO_RED,
    borderWidth: 1,
    marginTop: VERTICAL_40,
    marginHorizontal: HORIZONTAL_10,
  },
  tryagainBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_22,
    color: colors.WHITE,
    marginVertical: VERTICAL_5,
  },
});
