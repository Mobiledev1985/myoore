import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImageComponent from '../../models/basic/ImageComponent';
import {
  FONT_10,
  FONT_12,
  FONT_13,
  FONT_16,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_15,
  HEIGHT_20,
  HEIGHT_32,
  HEIGHT_6,
  HEIGHT_8,
  WIDTH_12,
  WIDTH_14,
  WIDTH_15,
  WIDTH_16,
  WIDTH_176,
  WIDTH_18,
  WIDTH_2,
  WIDTH_32,
  WIDTH_6,
  WIDTH_8,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import colors from '../../resources/styles/colors';
import DashedLine from 'react-native-dashed-line';
import {useTranslation} from 'react-i18next';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigator/ScreenName';

const DeliveryCard = ({
  data,
  userDetails,
  setUserDetails,
  numderObj,
  isFrom,
  addressId,
}) => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  return (
    <View style={styles.mainView}>
      <View style={styles.innerView}>
        <View style={styles.firstContainer}>
          <View style={styles.containerView1}>
            <ImageComponent
              type="image"
              iwidth={WIDTH_32}
              iheight={HEIGHT_32}
              source={data?.delivery_icon}
              resizeMode={'contain'}
            />
          </View>

          <View style={styles.titleTextView}>
            <Text style={styles.titleText}>{data?.delivery_title}</Text>
          </View>

          {isFrom == 'ConfirmationPage' ? null : (
            <TouchableOpacity
              style={styles.editView}
              onPress={() => {
                navigation.navigate(ScreenName.ShopOnAppEditAddress, {
                  userData: userDetails,
                  setUserDetails: setUserDetails,
                  numberData: numderObj,
                  addressId: addressId,
                });
              }}>
              <Text style={styles.editText}>{t('edit')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.lineView}>
          <DashedLine
            dashLength={5}
            dashThickness={0.5}
            dashGap={2}
            dashColor={colors.OOREDDO_LIGHT_GREY}
          />
        </View>

        <View style={styles.containerView2}>
          <Text
            style={
              styles.descText
            }>{`${userDetails?.firstname} ${userDetails?.lastname}, ${userDetails?.governorate}, ${userDetails?.area}, ${userDetails?.street}`}</Text>
        </View>

        <View style={styles.containerView3}>
          <Text style={styles.numberText}>
            {numderObj && numderObj?.MSISDN}
          </Text>
        </View>
      </View>

      {/* <View
        style={[
          styles.containerView4,
          {backgroundColor: data?.delivery_tool_tip_bgcolor},
        ]}>
        <ImageComponent
          type="image"
          iwidth={WIDTH_12}
          iheight={HEIGHT_12}
          source={data?.delivery_tool_tip_icon}
          resizeMode={'contain'}
        />
        <Text style={styles.text4}>{data?.delivery_tool_tip}</Text>
      </View> */}
    </View>
  );
};

export default DeliveryCard;

const styles = StyleSheet.create({
  mainView: {
    marginHorizontal: WIDTH_12,
    marginTop: HEIGHT_20,
  },
  innerView: {
    borderColor: colors.INACTIVEDOT,
    borderRadius: 10,
    borderWidth: 0.5,
    backgroundColor: colors.BG_COLOR_WHITE,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    elevation: 3,
  },
  firstContainer: {
    flexDirection: 'row',
  },
  containerView1: {
    marginLeft: WIDTH_12,
    marginTop: WIDTH_12,
  },
  titleTextView: {
    marginLeft: WIDTH_8,
    marginTop: WIDTH_16,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
  },
  editView: {
    alignSelf: 'flex-end',
    padding: 5,
    position: 'absolute',
    right: WIDTH_12,
    alignSelf: 'center',
  },
  editText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    textAlign: 'right',
    textDecorationLine: 'underline',
  },
  lineView: {
    marginTop: HEIGHT_10,
    paddingRight: WIDTH_2,
  },
  containerView2: {
    width: WIDTH_176,
    marginTop: HEIGHT_10,
    // marginLeft: widthPixel(14),
  },
  descText: {
    marginLeft: WIDTH_14,
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  containerView3: {
    marginTop: HEIGHT_20,
    marginBottom: HEIGHT_12,
  },
  numberText: {
    marginLeft: WIDTH_14,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  containerView4: {
    borderRadius: 31,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: HEIGHT_8,
    paddingBottom: HEIGHT_6,
    marginTop: HEIGHT_12,
  },
  text4: {
    marginLeft: WIDTH_6,
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_12,
    marginRight: WIDTH_15,
    textAlign: 'left',
    color: colors.BLACK,
  },
});
