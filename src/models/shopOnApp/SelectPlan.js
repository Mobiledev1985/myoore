import * as React from 'react';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {DefaultTheme, Provider as PaperProvider} from 'react-native-paper';
import {RUBIK_SEMIBOLD_FONT} from '../../../../selfcarern/src/resources/styles/fonts';
import {
  BORDER_RADIUS_1,
  BORDER_RADIUS_10,
  FONT_13,
  FONT_16,
  FONT_24,
  HORIZONTAL_10,
  HORIZONTAL_12,
  HORIZONTAL_15,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  VERTICAL_6,
  VERTICAL_3,
  VERTICAL_60,
  VERTICAL_70,
  VERTICAL_80,
  VERTICAL_8,
  FONT_25,
  FONT_18,
} from '../../../../selfcarern/src/resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import TextComponent from '../basic/TextComponent';
import ScreenName from '../../navigator/ScreenName';
import {useNavigation} from '@react-navigation/native';
import ImageComponent from '../basic/ImageComponent';

const SelectPlan = ({
  selectedPlandata,
  parentProduct,
  childProduct,
  viewdetailsmodal,
}) => {
  const navigation = useNavigation();
  const [text, setText] = React.useState('');
  const {t} = useTranslation();

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#ED1C24',
      text: '#000000',
    },
  };

  return (
    <LinearGradient
      start={{x: 1, y: 1}}
      end={{x: 1, y: 0}}
      colors={[colors.OOREDDO_GRADIENT_ONE, colors.OOREDDO_GRADIENT_TWO]}
      style={styles.gradientContainer}>
      <View style={styles.container}>
        <View>
          <View style={styles.headerContainer}>
            <Text style={styles.textSelectLeft}>
              {selectedPlandata?.selectedplan_text}
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate(ScreenName.ShopOnAppLandingPage)
              }>
              <Text style={styles.textSelectRight}>
                {selectedPlandata?.changeplan_text}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contentContainer}>
            <PaperProvider theme={theme}>
              <View style={styles.cardView}>
                <View style={styles.cardInnerContainer}>
                  <View
                    style={
                      Platform.OS === 'ios'
                        ? styles.iosContainer
                        : styles.androidContainer
                    }>
                    <View style={styles.imageComponent}>
                      <View style={styles.selectView}>
                        <ImageComponent
                          type="image"
                          iwidth={widthPixel(69)}
                          iheight={heightPixel(49)}
                          source={
                            childProduct?.productthumbnail != '' &&
                            childProduct?.productthumbnail != null &&
                            childProduct?.productthumbnail != undefined
                              ? childProduct?.productthumbnail
                              : parentProduct?.productthumbnail
                          }
                          resizeMode={'contain'}
                          style={{
                            marginBottom: I18nManager.isRTL ? VERTICAL_10 : 0,
                            marginHorizontal:
                              isTablet && Platform.OS == 'android'
                                ? HORIZONTAL_12
                                : 0,
                          }}
                        />
                        <View style={styles.simView}>
                          <TextComponent
                            data={`${
                              childProduct != '' &&
                              childProduct != null &&
                              childProduct != undefined
                                ? childProduct?.productname
                                : parentProduct?.productname
                            }  ${
                              childProduct != '' &&
                              childProduct != null &&
                              childProduct != undefined
                                ? childProduct?.plancommitment == null ||
                                  childProduct?.plancommitment == undefined ||
                                  childProduct?.plancommitment == ''
                                  ? ''
                                  : '+' + childProduct?.plancommitment
                                : parentProduct?.plancommitment == null ||
                                  parentProduct?.plancommitment == undefined ||
                                  parentProduct?.plancommitment == ''
                                ? ''
                                : '+' + parentProduct?.plancommitment
                            }`}
                            lines={2}
                            type="text"
                            style={styles.textLeftEnglish}
                            //style={I18nManager.isRTL ? styles.textLeftArabic : styles.textLeftEnglish}
                          />

                          {/* <TextComponent
                            data={
                              childProduct != '' &&
                              childProduct != null &&
                              childProduct != undefined
                                ? childProduct?.plancommitment == null ||
                                  childProduct?.plancommitment == undefined ||
                                  childProduct?.plancommitment == ''
                                  ? ''
                                  : '+' + childProduct?.plancommitment
                                : parentProduct?.plancommitment == null ||
                                  parentProduct?.plancommitment == undefined ||
                                  parentProduct?.plancommitment == ''
                                ? ''
                                : '+' + parentProduct?.plancommitment
                            }
                            // data={'+' + commitments?.label}
                            lines={2}
                            type="text"
                            style={styles.textLeftEnglish}
                            // style={I18nManager.isRTL ? styles.textLeftSecondArabic : styles.textLeftSecondEnglish}
                          /> */}
                          {/* <Text style={I18nManager.isRTL ? styles.textLeftArabic : styles.textLeftEnglish}>
                            {t('shamel')}
                          </Text> */}
                          {/* <Text style={I18nManager.isRTL ? styles.textLeftSecondArabic : styles.textLeftSecondEnglish} numberOfLines={2}>
                            {t('shamel2')}
                          </Text> */}
                          {/* <Text style={styles.textLeftArabic}>{t('shamel')}</Text>
                          <Text style={styles.textLeftSecondArabic} numberOfLines={2}>
                            {t('shamel2')}
                          </Text> */}
                        </View>
                      </View>
                      <Image
                        source={require('../../assets/line_dotted.png')}
                        style={styles.lineDotted}
                      />
                    </View>
                  </View>
                </View>
                <View style={styles.viewCardDetails}>
                  <TouchableOpacity onPress={() => viewdetailsmodal(true)}>
                    <Text style={styles.viewText}>
                      {selectedPlandata?.viewdetails_text}
                    </Text>
                  </TouchableOpacity>
                  {childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined &&
                  childProduct?.validity != null &&
                  childProduct?.validity != undefined &&
                  childProduct.validity !== '' &&
                  childProduct.validity !== '0' ? (
                    <Text style={styles.textRight}>
                      {`${childProduct?.price} ${childProduct?.kdtext}/ ${childProduct?.validity}`}
                    </Text>
                  ) : parentProduct != '' &&
                    parentProduct != null &&
                    parentProduct != undefined &&
                    parentProduct?.validity != null &&
                    parentProduct?.validity != undefined &&
                    parentProduct.validity !== '' &&
                    parentProduct.validity !== '0' ? (
                    <Text style={styles.textRight}>
                      {`${parentProduct?.price} ${parentProduct?.kdtext}/ ${parentProduct?.validity}`}
                    </Text>
                  ) : (
                    <Text style={styles.textRight}>
                      {`${parentProduct?.price} ${parentProduct?.kdtext}`}
                    </Text>
                  )}
                </View>
              </View>
            </PaperProvider>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: VERTICAL_20,
    flex: 1,
  },
  cardInnerContainer: {
    flexDirection: 'row',
  },
  iosContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageComponent: {
    flexDirection: 'column',
  },
  selectView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginStart: I18nManager.isRTL ? 25 : 10,
  },
  selectImage: {
    width: widthPixel(69),
    height: heightPixel(49),
    marginBottom: I18nManager.isRTL ? VERTICAL_10 : 0,
    // resizeMode: 'stretch',
  },
  simView: {
    // marginStart: 10,
    marginVertical: I18nManager.isRTL ? VERTICAL_20 : VERTICAL_10,
    // alignItems: 'center',
    // justifyContent: 'center',
    //marginHorizontal: HORIZONTAL_5,
    width: widthPixel(165),
    // marginTop: I18nManager.isRTL ? VERTICAL_10 : VERTICAL_20,
  },
  lineDotted: {
    width: isTablet
      ? SCREEN_WIDTH - widthPixel(130)
      : SCREEN_WIDTH - widthPixel(20),
    height: heightPixel(2),
    // marginHorizontal: 5,
    // marginTop: I18nManager.isRTL ? 0 : VERTICAL_15,
    marginBottom: I18nManager.isRTL ? 0 : VERTICAL_15,
  },
  androidContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: I18nManager.isRTL ? 5 : 20,
  },
  viewDetails: {
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    fontFamily: RUBIK_SEMIBOLD_FONT,
  },
  viewCardDetails: {
    // marginTop: I18nManager.isRTL ? 5 : VERTICAL_15,
    marginHorizontal: 15,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewText: {
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginTop: heightPixel(3),
    // fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    // textAlign: I18nManager.isRTL ? 'right' : 'left',
    // marginTop: Platform.OS === 'ios' ? -7 : VERTICAL_10,
    // marginTop: Platform.OS === 'ios' ? 5 : VERTICAL_10,
  },
  gradientContainer: {
    width: isTablet ? SCREEN_WIDTH / 1.3 : SCREEN_WIDTH,
    height: heightPixel(190),
  },
  iconTextView: {
    flexDirection: 'row',
    marginTop: Platform.OS === 'android' ? VERTICAL_10 : 0,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: I18nManager.isRTL ? 3 : 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: I18nManager.isRTL ? HORIZONTAL_15 : HORIZONTAL_10,
    marginTop: VERTICAL_80,
    marginBottom: I18nManager.isRTL ? VERTICAL_6 : VERTICAL_10,
  },
  contentContainer: {
    marginHorizontal: HORIZONTAL_5,
    // marginTop: VERTICAL_6,
    // marginBottom: VERTICAL_6,
  },
  cardView: {
    backgroundColor: '#FFFFFF',
    borderRadius: BORDER_RADIUS_10,
    // padding: HORIZONTAL_12,
    width: isTablet
      ? SCREEN_WIDTH / 1.3 - widthPixel(20)
      : SCREEN_WIDTH - widthPixel(20),
    height: 'auto',
    borderWidth: BORDER_RADIUS_1,
    borderColor: '#ED1C24',
    elevation: 5,
  },
  textSelectLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    fontSize: FONT_13,
    // lineHeight: 24,
    // fontWeight: '600',
  },
  textSelectRight: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'right',
    color: colors.BLACK,
    textDecorationLine: 'underline',
    fontSize: FONT_13,
    //  lineHeight: 24,
    // fontWeight: '600',
  },
  textLeftEnglish: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    marginTop: I18nManager.isRTL ? 0 : VERTICAL_10,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_18,
    textAlign: 'left',
    width: widthPixel(250),
  },
  textLeftSecondEnglish: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_18,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    borderWidth: 1,
    //width: SCREEN_WIDTH - widthPixel(84),
  },
  textLeftArabic: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    marginTop: I18nManager.isRTL ? 0 : VERTICAL_10,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_18,
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    // width: SCREEN_WIDTH - widthPixel(84),
  },
  textLeftSecondArabic: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    lineHeight: I18nManager.isRTL ? FONT_24 : FONT_18,
    textAlign: I18nManager.isRTL ? 'left' : 'right',
    width: isTablet
      ? SCREEN_WIDTH / 1.3 - widthPixel(84)
      : SCREEN_WIDTH - widthPixel(84),
  },
  textRight: {
    // fontFamily: RUBIK_SEMIBOLD_FONT,
    // fontSize: FONT_13,
    // alignItems: 'flex-end',
    // justifyContent: 'flex-end',
    // // fontWeight: '600',
    marginTop: heightPixel(3),
    // marginTop: VERTICAL_6,
    fontSize: FONT_13,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    // fontWeight: '600',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  descText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
    lineHeight: FONT_25,
  },
});

export default SelectPlan;
