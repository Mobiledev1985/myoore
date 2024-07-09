import React from 'react';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_10,
  FONT_13,
  FONT_16,
  HEIGHT_10,
  HEIGHT_12,
  HEIGHT_14,
  HEIGHT_20,
  HEIGHT_24,
  HEIGHT_26,
  HEIGHT_29,
  HEIGHT_6,
  HEIGHT_7,
  WIDTH_100,
  WIDTH_12,
  WIDTH_19,
  WIDTH_20,
  WIDTH_3,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import DashedLine from 'react-native-dashed-line';
import ImageComponent from '../../models/basic/ImageComponent';

const OrderDetail = ({
  responseData,
  globalData,
  onDetailPress,
  migrationData,
}) => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ImageComponent
          type="image"
          iwidth={WIDTH_20}
          iheight={HEIGHT_26}
          source={globalData?.order_details_icon}
          resizeMode={'contain'}
        />
        <Text style={styles.titleTextStyle}>
          {globalData?.order_details_title}
        </Text>
      </View>

      <View style={styles.firstLineView}>
        <DashedLine
          dashLength={5}
          dashThickness={0.5}
          dashGap={2}
          dashColor={colors.OOREDDO_LIGHT_GREY}
        />
      </View>

      <View style={styles.secondContainer}>
        <Text style={styles.planText}>{globalData?.plan_title_label}</Text>
        <Text style={styles.descText}>
          {responseData?.items[0]?.commitment != null &&
          responseData?.items[0]?.commitment != undefined &&
          responseData?.items[0]?.commitment != '' &&
          responseData?.items[0]?.commitment != 'None'
            ? responseData?.items[0]?.name +
              ' + ' +
              responseData?.items[0]?.commitment +
              ' ' +
              responseData?.items[0]?.commitmentlabel
            : responseData?.items[0]?.name}
        </Text>
      </View>

      <View style={styles.secondLineView}>
        <DashedLine
          dashLength={5}
          dashThickness={0.5}
          dashGap={2}
          dashColor={colors.OOREDDO_LIGHT_GREY}
        />
      </View>

      <View style={styles.thirdContainer}>
        <Text style={styles.numberText}>{globalData?.number_title_label}</Text>
        <Text style={styles.numberDesc}>
          {migrationData != null &&
          migrationData != undefined &&
          migrationData != '' &&
          (migrationData?.type == 'migration' ||
            migrationData?.type == 'portin')
            ? migrationData?.enteredNumber
            : responseData?.items[0]?.number}
        </Text>
      </View>

      <View>
        <TouchableOpacity
          style={styles.viewDetailView}
          onPress={() => onDetailPress()}>
          <Text style={styles.viewDetailText}>
            {globalData?.view_details_btn}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OrderDetail;

const styles = StyleSheet.create({
  mainContainer: {
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
    marginTop: HEIGHT_24,
    elevation: 2,
  },

  titleContainer: {
    flexDirection: 'row',
    paddingTop: HEIGHT_12,
    paddingBottom: HEIGHT_7,
    alignItems: 'center',
    paddingHorizontal: HEIGHT_12,
  },
  titleTextStyle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    marginLeft: WIDTH_19,
    textAlign: 'left',
    color: colors.BLACK,
  },
  firstLineView: {
    marginRight: WIDTH_3,
  },
  secondContainer: {
    paddingHorizontal: HEIGHT_12,
    justifyContent: 'center',
  },
  planText: {
    marginTop: HEIGHT_10,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    color: colors.BLACK,
  },
  descText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    color: colors.BLACK,
  },
  editText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    textDecorationLine: 'underline',
    color: colors.BLACK,
  },

  editView: {
    padding: 5,
    position: 'absolute',
    right: WIDTH_12,
  },
  secondLineView: {
    marginTop: HEIGHT_20,
    marginRight: WIDTH_3,
  },

  thirdContainer: {
    paddingHorizontal: HEIGHT_12,
    justifyContent: 'center',
  },
  numberText: {
    marginTop: HEIGHT_12,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    color: colors.BLACK,
  },
  numberDesc: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    color: colors.BLACK,
  },
  thirdLineView: {
    marginTop: HEIGHT_12,
    marginRight: WIDTH_3,
  },
  viewDetailView: {
    padding: 5,
    marginTop: HEIGHT_29,
    marginBottom: HEIGHT_14,
    marginLeft: WIDTH_12,
    width: WIDTH_100,
  },
  viewDetailText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    textAlign: 'left',
    color: colors.BLACK,
  },
});
