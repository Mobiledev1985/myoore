import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import colors from '../../resources/styles/colors';
import {
  FONT_13,
  FONT_14,
  FONT_16,
  FONT_18,
  FONT_28,
  HEIGHT_10,
  HEIGHT_11,
  HEIGHT_12,
  HEIGHT_20,
  VERTICAL_15,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_11,
  WIDTH_12,
  WIDTH_15,
  WIDTH_5,
  WIDTH_7,
} from '../../resources/styles/responsive';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';
import {shopPriceCalculation} from '../../services/CommonUtils';

const AmountSummery = ({
  data,
  parentProduct,
  childProduct,
  numderObj,
  grandTotall,
  onpayMonthlyPress,
  onpayAdvancePressed,
  addcartresponse,
  type = '',
}) => {
  const [grandTotal, setGrandTotal] = useState('');
  const TotalPrice =
    parseFloat(
      childProduct ? childProduct?.price : parentProduct && parentProduct?.price
    ) + parseFloat(numderObj?.Price);

  useEffect(() => {
    setGrandTotal(grandTotall);
  }, [grandTotall]);

  return (
    <View
      style={[
        styles.mainView,
        {
          marginHorizontal: type === 'migration' ? 0 : WIDTH_12,
          marginTop: type === 'migration' ? 0 : HEIGHT_20,
          paddingVertical: type === 'migration' ? HEIGHT_10 : HEIGHT_20,
        },
      ]}>
      {type === 'migration' && (
        <View style={styles.migrationEligibleView}>
          <Text style={styles.migrationEligibleText} numberOfLines={1}>
            {data?.you_are_eligible_text}
          </Text>
        </View>
      )}
      <View>
        <View style={styles.container1}>
          <Text style={[styles.titleText, {width: '60%'}]}>
            {childProduct && childProduct?.productname
              ? childProduct?.productname
              : parentProduct && parentProduct?.productname}
          </Text>
          <Text style={styles.descText}>
            {childProduct
              ? childProduct?.validity
                ? childProduct?.kdtext +
                  ' ' +
                  childProduct?.price +
                  '/' +
                  childProduct?.validity
                : childProduct?.kdtext + ' ' + childProduct?.price
              : parentProduct?.validity
              ? parentProduct?.kdtext +
                ' ' +
                parentProduct?.price +
                '/' +
                parentProduct?.validity
              : parentProduct?.kdtext + ' ' + parentProduct?.price}
          </Text>
        </View>
        {type === 'migration' || type === 'migrationsummary' ? (
          numderObj?.oamount != null &&
          numderObj?.oamount != undefined &&
          numderObj?.oamount != '' ? (
            <View style={styles.container2}>
              <Text style={styles.titleText}>
                {
                  global?.shopOnAppSettings?.productdetailsconfigurations
                    ?.outstanding_amount
                }
              </Text>
              <Text style={styles.descText}>
                {numderObj?.oamount +
                  ' ' +
                  (childProduct?.kdtext || parentProduct?.kdtext)}
              </Text>
            </View>
          ) : (
            <></>
          )
        ) : type === 'portin' || type === 'portinsummary' ? (
          <View style={styles.container2}>
            <Text style={styles.titleText}>
              {
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.shipping_label
              }
            </Text>
            <Text style={styles.descText}>
              {'0' + ' ' + (childProduct?.kdtext || parentProduct?.kdtext)}
            </Text>
          </View>
        ) : (
          <View style={styles.container2}>
            <Text style={styles.titleText}>{data?.number_price_label}</Text>
            <Text style={styles.descText}>{numderObj?.Price}</Text>
          </View>
        )}

        {grandTotal && grandTotal?.discountamount ? (
          <View style={styles.container2}>
            <Text style={styles.titleText}>
              {
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.summary_offercode_applied
              }
            </Text>
            <Text style={styles.descText}>
              {grandTotal?.discountamount ? grandTotal?.discountamount : 0}
            </Text>
          </View>
        ) : null}
      </View>

      {(childProduct && childProduct?.linetype == 'Postpaid') ||
      (parentProduct && parentProduct?.linetype == 'Postpaid') ? (
        <>
          <View style={styles.dashedView}>
            <DashedLine
              dashLength={5}
              dashThickness={0.5}
              dashGap={2}
              dashColor={colors.OOREDDO_LIGHT_GREY}
            />
          </View>

          <View>
            <View style={[styles.container3]}>
              <Text style={styles.titleText}>
                {type === 'migration'
                  ? data?.you_pay_monthly_popup_label
                  : data?.you_pay_monthly_label}
              </Text>
              {type !== 'migration' && (
                <TouchableOpacity
                  style={{marginLeft: WIDTH_5}}
                  onPress={() => {
                    onpayMonthlyPress();
                  }}>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_11}
                    iheight={HEIGHT_11}
                    source={
                      global?.shopOnAppSettings?.summarypageconfigurations
                        ?.paymonthadvance_tooltip_icon
                    }
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.descText}>
                {' '}
                {childProduct?.kdtext} {childProduct?.price}/
                {childProduct.validity}
              </Text>
            </View>

            <View style={styles.container3}>
              <Text style={styles.titleText}>
                {type === 'migration'
                  ? data?.you_pay_advance_popup_label
                  : data?.you_pay_advance_label}
              </Text>
              {type !== 'migration' && (
                <TouchableOpacity
                  style={{marginLeft: WIDTH_5}}
                  onPress={() => {
                    onpayAdvancePressed();
                  }}>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_11}
                    iheight={HEIGHT_11}
                    source={
                      global?.shopOnAppSettings?.summarypageconfigurations
                        ?.paymonthadvance_tooltip_icon
                    }
                    resizeMode={'contain'}
                  />
                </TouchableOpacity>
              )}
              <Text style={styles.descText}>
                {type === 'migration' || type === 'migrationsummary'
                  ? parentProduct?.type === 'configurable'
                    ? `${
                        childProduct?.kdtext + ' ' + childProduct?.duetoday || 0
                      } `
                    : `${
                        parentProduct?.kdtext + ' ' + parentProduct?.duetoday ||
                        0
                      } `
                  : `${
                      childProduct?.kdtext +
                      ' ' +
                      addcartresponse?.product?.payadvanceprice
                    }`}
              </Text>
            </View>
          </View>
        </>
      ) : null}

      <View style={styles.dashedView}>
        <DashedLine
          dashLength={5}
          dashThickness={0.5}
          dashGap={2}
          dashColor={colors.OOREDDO_LIGHT_GREY}
        />
      </View>

      <View>
        <View style={styles.container2}>
          <Text style={styles.titleTextBold}>
            {type === 'migration'
              ? data?.pay_now_popup_label
              : data?.paynow_label}
          </Text>
          <Text
            style={[
              styles.descText,
              {
                fontFamily: RUBIK_SEMIBOLD_FONT,
                fontSize: FONT_14,
                color: colors.OOREDOO_RED,
              },
            ]}>
            {type === 'migration'
              ? ''
              : `${childProduct?.kdtext || parentProduct?.kdtext} ${' '}`}
            {type === 'migration'
              ? shopPriceCalculation(
                  parentProduct,
                  childProduct,
                  '',
                  false,
                  'migration',
                  numderObj?.oamount
                ).toFixed(3) +
                ' ' +
                `${
                  parentProduct?.type === 'configurable'
                    ? childProduct?.kdtext
                    : parentProduct?.kdtext
                }`
              : grandTotal
              ? grandTotal?.grandtotalamount
              : addcartresponse?.carttotalprice}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default AmountSummery;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.TOO_LIGHT_GREY,
    borderRadius: 10,
    paddingHorizontal: WIDTH_15,
  },
  titleText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  titleTextBold: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_14,
    color: colors.OOREDOO_RED,
    textAlign: 'left',
  },
  descText: {
    position: 'absolute',
    right: 0,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
  },
  container3: {
    flexDirection: 'row',
    marginTop: HEIGHT_12,
    alignItems: 'center',
  },
  container2: {flexDirection: 'row', marginTop: HEIGHT_12},
  container1: {flexDirection: 'row'},
  dashedView: {marginTop: HEIGHT_12},
  imagestyle: {
    marginLeft: WIDTH_7,
    width: WIDTH_10,
    height: HEIGHT_10,
  },
  migrationEligibleView: {
    alignItems: 'center',
    marginBottom: VERTICAL_15,
  },
  migrationEligibleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    lineHeight: I18nManager.isRTL ? FONT_28 : FONT_18,
    paddingTop: VERTICAL_5,
  },
});
