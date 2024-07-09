import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
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
  HEIGHT_16,
  HEIGHT_18,
  HEIGHT_20,
  HEIGHT_23,
  HEIGHT_26,
  HEIGHT_28,
  HEIGHT_6,
  HEIGHT_7,
  HORIZONTAL_25,
  WIDTH_100,
  WIDTH_11,
  WIDTH_12,
  WIDTH_19,
  WIDTH_20,
  WIDTH_3,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import DashedLine from 'react-native-dashed-line';
import ImageComponent from '../../models/basic/ImageComponent';
import {useTranslation} from 'react-i18next';

const SummeryCard = ({
  data,
  onPlanEditClick,
  onNumberEditClick,
  item,
  parentProduct,
  childProduct,
  numderObj,
  onViewDetailPress,
  type,
}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.mainContainer}>
      <View style={styles.titleContainer}>
        <ImageComponent
          type="image"
          iwidth={WIDTH_20}
          iheight={HEIGHT_26}
          source={data?.summary_title_icon}
          resizeMode={'contain'}
        />
        <Text style={styles.titleTextStyle}>{data?.summary_title}</Text>
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
        <Text style={styles.planText}>{data?.plan_title_label}</Text>
        <Text style={styles.descText}>{`${
          childProduct && childProduct?.productname
            ? childProduct?.productname
            : parentProduct && parentProduct?.productname
        }${
          childProduct && childProduct?.plancommitment
            ? childProduct?.plancommitment != null &&
              childProduct?.plancommitment != undefined &&
              childProduct?.plancommitment != ''
              ? ' + ' +
                childProduct?.plancommitment +
                ' ' +
                data?.summary_page_commitment_label
              : ''
            : parentProduct?.plancommitment != null &&
              parentProduct?.plancommitment != undefined &&
              parentProduct?.plancommitment != ''
            ? ' + ' +
              parentProduct?.plancommitment +
              ' ' +
              data?.summary_page_commitment_label
            : ''
        } `}</Text>
        <TouchableOpacity
          style={styles.editView}
          onPress={() => onPlanEditClick()}>
          <Text style={styles.editText}>{t('edit')}</Text>
        </TouchableOpacity>
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
        <Text style={styles.numberText}>{data?.number_title_label}</Text>
        <Text style={styles.numberDesc}>
          {type === 'migration' || type === 'portin'
            ? numderObj?.enteredNumber
            : numderObj && numderObj?.MSISDN}
        </Text>
        <TouchableOpacity
          style={styles.editView}
          onPress={() => onNumberEditClick()}>
          <Text style={styles.editText}>{t('edit')}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.thirdLineView}>
        <DashedLine
          dashLength={5}
          dashThickness={0.5}
          dashGap={2}
          dashColor={colors.OOREDDO_LIGHT_GREY}
        />
      </View>

      <View>
        <TouchableOpacity
          style={styles.viewDetailView}
          onPress={() => onViewDetailPress()}>
          <Text style={styles.viewDetailText}>{data?.view_details_btn}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SummeryCard;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.BG_COLOR_WHITE,
    borderWidth: 0.5,
    borderColor: colors.INACTIVEDOT,
    marginHorizontal: WIDTH_12,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    borderRadius: 10,
    marginTop: HEIGHT_23,
    elevation: 3,
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
  },
  descText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginRight: HORIZONTAL_25,
    width: '75%',
  },
  editText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    textDecorationLine: 'underline',
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
    marginTop: HEIGHT_10,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  numberDesc: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  thirdLineView: {
    marginTop: HEIGHT_12,
    marginRight: WIDTH_3,
  },
  viewDetailView: {
    padding: 5,
    marginTop: HEIGHT_16,
    marginBottom: HEIGHT_18,
    marginLeft: WIDTH_11,
    width: WIDTH_100,
  },
  viewDetailText: {
    marginTop: HEIGHT_6,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textDecorationLine: 'underline',
    textAlign: 'left',
  },
});
