import React, {useEffect} from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  BORDER_RADIUS_25,
  FONT_13,
  FONT_14,
  FONT_16,
  FONT_20,
  HEIGHT_10,
  HEIGHT_110,
  HEIGHT_12,
  HEIGHT_13,
  HEIGHT_19,
  HEIGHT_23,
  HEIGHT_230,
  HEIGHT_37,
  HEIGHT_40,
  HEIGHT_55,
  HEIGHT_6,
  HEIGHT_61,
  HEIGHT_67,
  HEIGHT_82,
  HEIGHT_9,
  WIDTH_12,
  WIDTH_16,
  WIDTH_215,
  WIDTH_25,
  WIDTH_259,
  WIDTH_326,
  WIDTH_67,
} from '../../resources/styles/responsive';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import {useTranslation} from 'react-i18next';
import LottieView from 'lottie-react-native';
import {LandingPageButton} from '../../commonHelper/Button';
import ImageComponent from '../../models/basic/ImageComponent';
import ScreenName from '../../navigator/ScreenName';
import {useNavigation} from '@react-navigation/native';
import {isTablet} from 'react-native-device-info';
import TriggerAdjustEvent from '../../UIComponent/AdjustSDK';
import {isDeviceHuawei} from '../../commonHelper/Constants';
import {output} from '../../commonHelper/ApiHeaders';

const OrderCompleted = ({
  isSuccess,
  responseData,
  migrationData,
  globalData,
  onTryAgainPress,
  item,
}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const isHuawei = isDeviceHuawei && !output?.hasGms;

  useEffect(() => {
    if (isSuccess) {
      TriggerAdjustEvent(
        isHuawei ? 'a20q73' : 'sxbuqe',
        [
          {
            key: 'ProductDetail',
            value: item?.childProduct?.productname
              ? item?.childProduct?.productname
              : item?.parentProduct?.productname,
          },
          {
            key: 'Type',
            value:
              item?.onboardingtype == 'onboarding'
                ? 'GA'
                : item?.onboardingtype == 'migration'
                ? 'Migration'
                : item?.onboardingtype == 'portin'
                ? 'Portin'
                : '',
          },
          {key: 'Status', value: 'Success'},
          {
            key: 'content_ids',
            value: item?.addcartresponse?.product?.productid,
          },
          {
            key: 'content_name',
            value: item?.addcartresponse?.product?.name,
          },
          {
            key: 'content_type',
            value: item?.selectednumberobject?.Category,
          },
        ],
        parseFloat(item?.addcartresponse?.carttotalprice)
      );
      let linetype = item?.childProduct?.linetype
        ? item?.childProduct?.linetype
        : item?.parentProduct?.linetype;
      if (item?.onboardingtype == 'onboarding') {
        if (linetype === 'Postpaid') {
          TriggerAdjustEvent(
            isHuawei ? 'a2d7jj' : 'j19c7a',
            [
              {
                key: 'ProductDetail',
                value: item?.childProduct?.productname
                  ? item?.childProduct?.productname
                  : item?.parentProduct?.productname,
              },
              {
                key: 'Type',
                value: 'Purchase Postpaid',
              },
              {key: 'Status', value: 'Success'},
              {
                key: 'content_ids',
                value: item?.addcartresponse?.product?.productid,
              },
              {
                key: 'content_name',
                value: item?.addcartresponse?.product?.name,
              },
              {
                key: 'content_type',
                value: item?.selectednumberobject?.Category,
              },
            ],
            parseFloat(item?.addcartresponse?.carttotalprice)
          );
        } else if (linetype === 'Prepaid') {
          TriggerAdjustEvent(
            isHuawei ? 'mavde0' : 'gr0nw3',
            [
              {
                key: 'ProductDetail',
                value: item?.childProduct?.productname
                  ? item?.childProduct?.productname
                  : item?.parentProduct?.productname,
              },
              {
                key: 'Type',
                value: 'Purchase Prepaid',
              },
              {key: 'Status', value: 'Success'},
              {
                key: 'content_ids',
                value: item?.addcartresponse?.product?.productid,
              },
              {
                key: 'content_name',
                value: item?.addcartresponse?.product?.name,
              },
              {
                key: 'content_type',
                value: item?.selectednumberobject?.Category,
              },
            ],
            parseFloat(item?.addcartresponse?.carttotalprice)
          );
        }
      }
    } else {
      TriggerAdjustEvent(isHuawei ? 'fkgyrn' : '6q7u91', [
        {
          key: 'ProductDetail',
          value: item?.childProduct?.productname
            ? item?.childProduct?.productname
            : item?.parentProduct?.productname,
        },
        {
          key: 'Type',
          value:
            item?.onboardingtype == 'onboarding'
              ? 'GA'
              : item?.onboardingtype == 'migration'
              ? 'Migration'
              : item?.onboardingtype == 'portin'
              ? 'Portin'
              : '',
        },
        {key: 'Status', value: 'Failure'},
        {key: 'value', value: 'revenue'},
        {
          key: 'content_ids',
          value: item?.addcartresponse?.product?.productid,
        },
        {
          key: 'content_name',
          value: item?.addcartresponse?.product?.name,
        },
        {
          key: 'content_type',
          value: item?.selectednumberobject?.Category,
        },
      ]);
    }
  }, []);

  const onCopyDetails = orderID => {
    Clipboard.setString(orderID);
    Toast.show(t('details_copied'));
  };

  return (
    <View style={{marginTop: HEIGHT_55}}>
      <View
        style={[
          styles.mainView,
          {
            backgroundColor: isSuccess
              ? colors.SKYLIGHT_BLUE
              : colors.OOREDOO_RED,
          },
        ]}>
        {isSuccess ? (
          <>
            <View style={styles.innerView1}>
              <View style={styles.titleView1}>
                <Text style={styles.titleText1}>
                  {responseData?.successresponse?.title}
                </Text>
              </View>

              <View style={styles.descView1}>
                <Text style={styles.descText1}>
                  {responseData?.successresponse?.desc}
                </Text>

                <View style={styles.container1}>
                  <Text style={styles.orderText}>
                    {responseData?.successresponse?.orderidtext}
                  </Text>
                  <View style={styles.container2}>
                    <Text
                      style={
                        styles.orderID
                      }>{`#${responseData?.orderid}`}</Text>
                    <TouchableOpacity
                      onPress={() => onCopyDetails(responseData?.orderid)}
                      style={styles.copyView}>
                      <ImageComponent
                        type="image"
                        iwidth={WIDTH_16}
                        iheight={HEIGHT_19}
                        source={responseData?.successresponse?.orderidcopyicon}
                        resizeMode={'contain'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {migrationData?.type !== 'migration' && (
                <View style={styles.container3}>
                  <Text style={styles.descText2}>
                    {responseData?.successresponse?.orderdeliverytooltip}
                  </Text>
                </View>
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.container4}>
              <Text style={styles.sorryText}>
                {responseData?.failresponse?.title}
              </Text>
              <Text style={styles.descText3}>
                {responseData?.failresponse?.title1}
              </Text>
            </View>

            <View style={styles.container5}>
              <Text style={styles.descText4}>
                {responseData?.failresponse?.desc}{' '}
                <Text
                  onPress={() => {
                    navigation.navigate(ScreenName.SupportHome, {
                      screen: ScreenName.SupportHome,
                    });
                  }}
                  style={styles.chatAgent}>
                  {responseData?.failresponse?.chatwithagenttext}
                </Text>
              </Text>
            </View>

            <View style={styles.container6}>
              <LandingPageButton
                title={responseData?.failresponse?.try_again_btn}
                onPress={() => {
                  onTryAgainPress();
                }}
                customStyle={[
                  styles.btnContainer,
                  {
                    backgroundColor:
                      responseData?.failresponse?.try_again_btn_bgcolor,
                  },
                ]}
                customTextStyle={[
                  styles.btnText,
                  {
                    color: responseData?.failresponse?.try_again_btn_textcolor,
                  },
                ]}
              />
            </View>
          </>
        )}
        <View style={styles.lottieView}>
          <LottieView
            resizeMode="cover"
            source={
              isSuccess
                ? require('../../assets/Success_Screen_Tick_Mark.json')
                : require('../../assets/VerifiedError.json')
            }
            autoPlay
            loop={true}
            style={styles.lottieStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default OrderCompleted;

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: WIDTH_12,
    alignItems: 'center',
    paddingBottom: HEIGHT_19,
    borderRadius: HEIGHT_10,
    elevation: 3,
  },
  innerView1: {
    alignItems: 'center',
  },
  titleView1: {
    marginTop: HEIGHT_61,
  },
  titleText1: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
  },
  descView1: {
    marginTop: HEIGHT_6,
    width: WIDTH_215,
  },
  descText1: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'center',
  },
  container1: {
    width: WIDTH_259,
    borderRadius: HEIGHT_13,
    backgroundColor: colors.BG_GREEN,
    alignSelf: 'center',
    marginTop: HEIGHT_23,
    paddingBottom: HEIGHT_12,
  },
  orderText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'center',
    marginTop: HEIGHT_12,
  },
  container2: {
    marginTop: HEIGHT_12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  orderID: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
  },
  copyView: {
    right: WIDTH_25,
    position: 'absolute',
  },
  copyImage: {
    height: HEIGHT_19,
    width: WIDTH_16,
  },
  container3: {
    marginTop: HEIGHT_9,
  },
  descText2: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
  },
  lottieView: {
    position: 'absolute',
    top: heightPixel(-33),
  },
  lottieStyle: {
    width: WIDTH_67,
    height: WIDTH_67,
  },
  container4: {
    marginTop: HEIGHT_61,
  },
  sorryText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'center',
    color: colors.BG_COLOR_WHITE,
  },
  descText3: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BG_COLOR_WHITE,
  },
  container5: {
    width: WIDTH_215,
    marginTop: HEIGHT_9,
  },
  descText4: {
    paddingTop: 5,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'center',
    color: colors.BG_COLOR_WHITE,
    lineHeight: I18nManager.isRTL ? null : isTablet ? 26 : 16,
  },
  chatAgent: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'center',
    color: colors.BG_COLOR_WHITE,
    textDecorationLine: 'underline',
    lineHeight: I18nManager.isRTL ? null : 16,
  },
  container6: {
    marginTop: HEIGHT_37,
  },
  btnContainer: {
    height: HEIGHT_40,
    width: WIDTH_326,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_25,
    marginHorizontal: WIDTH_12,
  },
  btnText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
  },
});
