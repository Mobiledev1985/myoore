import React from 'react';
import {
  Modal,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  ScrollView,
} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_13,
  FONT_16,
  FONT_20,
  FULL_WIDTH_PERCENTAGE,
  HEIGHT_10,
  HEIGHT_14,
  HEIGHT_16,
  HEIGHT_17,
  HEIGHT_22,
  HEIGHT_25,
  HEIGHT_4,
  HEIGHT_46,
  VERTICAL_10,
  WIDTH_22,
  WIDTH_226,
  WIDTH_27,
  WIDTH_50,
} from '../../resources/styles/responsive';
import {
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../basic/ImageComponent';
import DashedLine from 'react-native-dashed-line';
import {
  SCREEN_HEIGHT,
  heightPixel,
} from '../../resources/styles/normalizedimension';

const OrderDetailModal = ({
  visible,
  onClose,
  globalData,
  responseData,
  migrationData,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      statusBarTranslucent
      visible={visible}
      onRequestClose={() => {
        onClose();
      }}>
      <TouchableOpacity
        style={styles.bgView}
        activeOpacity={1}
        onPress={() => {
          onClose();
        }}
      />
      <View style={styles.mainView}>
        <View style={styles.InnerView}>
          <View style={styles.lineView} />

          <View style={styles.textView}>
            <Text style={styles.titleText}>
              {globalData?.order_details_popup_orderdetailheading}
            </Text>
            {/* <TouchableOpacity style={styles.downloadView}>
              <ImageComponent
                type="image"
                iwidth={WIDTH_22}
                iheight={HEIGHT_22}
                source={globalData?.download_icon_icon}
                resizeMode={'contain'}
              />
            </TouchableOpacity> */}
          </View>

          <View style={styles.lineView}>
            <DashedLine
              dashLength={5}
              dashThickness={0.5}
              dashGap={2}
              dashColor={colors.OOREDDO_LIGHT_GREY}
            />
          </View>

          <ScrollView
            contentContainerStyle={{zIndex: 999}}
            showsVerticalScrollIndicator={true}
            alwaysBounceVertical={true}
            scrollEnabled={true}
            nestedScrollEnabled={true}
            bounces={true}>
            <View style={styles.innerTextView}>
              <Text style={styles.innerTitleText}>
                {globalData?.order_details_popup_orderidtext}
              </Text>
              <View style={styles.innerDescView}>
                <Text
                  style={
                    styles.innnerDescText
                  }>{`#${responseData?.orderid}`}</Text>
              </View>
            </View>

            <View style={styles.lineView}>
              <DashedLine
                dashLength={5}
                dashThickness={0.5}
                dashGap={2}
                dashColor={colors.OOREDDO_LIGHT_GREY}
              />
            </View>
            {migrationData?.type !== 'migration' &&
              responseData?.items[0]?.simtype != 'esim' && (
                <>
                  <View style={styles.innerTextView}>
                    <Text style={styles.innerTitleText}>
                      {globalData?.order_details_popup_deliveryinfotext}
                    </Text>
                    <View
                      style={[
                        styles.innerDescView,
                        {
                          width: WIDTH_226,
                        },
                      ]}>
                      <Text
                        style={
                          styles.innnerDescText
                        }>{`${responseData?.address[0]?.firstname} ${responseData?.address[0]?.lastname}, ${responseData?.address[0]?.governorate}, ${responseData?.address[0]?.city}, ${responseData?.address[0]?.street}`}</Text>
                    </View>
                  </View>

                  <View style={styles.lineView}>
                    <DashedLine
                      dashLength={5}
                      dashThickness={0.5}
                      dashGap={2}
                      dashColor={colors.OOREDDO_LIGHT_GREY}
                    />
                  </View>
                </>
              )}

            <View style={styles.innerTextView}>
              <Text style={styles.innerTitleText}>
                {globalData?.order_details_popup_paymentmethodtext}
              </Text>
              <View style={styles.innerDescView}>
                <Text style={styles.innnerDescText}>
                  {responseData?.paymentmethod}
                </Text>
              </View>
            </View>

            <View style={styles.lineView}>
              <DashedLine
                dashLength={5}
                dashThickness={0.5}
                dashGap={2}
                dashColor={colors.OOREDDO_LIGHT_GREY}
              />
            </View>
            {migrationData?.type != 'migration' &&
              responseData?.items[0]?.simtype != 'esim' && (
                <>
                  <View style={styles.innerTextView}>
                    <Text style={styles.innerTitleText}>
                      {globalData?.order_details_popup_shippinginfotext}
                    </Text>
                    <View style={styles.innerDescView}>
                      <Text style={styles.innnerDescText}>
                        {responseData?.items[0]?.shippingmethod}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.lineView}>
                    <DashedLine
                      dashLength={5}
                      dashThickness={0.5}
                      dashGap={2}
                      dashColor={colors.OOREDDO_LIGHT_GREY}
                    />
                  </View>
                </>
              )}

            <View style={styles.innerTextView}>
              <Text style={styles.innerTitleText}>
                {globalData?.order_details_popup_itemstext}
              </Text>
              <View style={styles.innerDescView}>
                <Text style={styles.innnerDescText}>
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

              <View style={styles.numberView}>
                <Text style={styles.innnerDescText}>
                  {globalData?.order_details_popup_numbertext}
                </Text>
                <Text style={[styles.innnerDescText, {marginTop: VERTICAL_10}]}>
                  {migrationData != null &&
                  migrationData != undefined &&
                  migrationData != '' &&
                  (migrationData?.type == 'migration' ||
                    migrationData?.type == 'portin')
                    ? migrationData?.enteredNumber
                    : responseData?.items[0]?.number}
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default OrderDetailModal;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  bgView: {flex: 1, backgroundColor: colors.BLACK_TRANS_BG},
  InnerView: {
    height: 'auto',
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingHorizontal: WIDTH_27,
    paddingBottom: HEIGHT_46,
    maxHeight: SCREEN_HEIGHT - heightPixel(100),
  },
  lineView: {
    width: WIDTH_50,
    height: HEIGHT_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    alignSelf: 'center',
    marginTop: HEIGHT_10,
    borderRadius: 4,
  },
  textView: {
    marginTop: HEIGHT_25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    textAlign: 'left',
  },
  downloadView: {
    position: 'absolute',
    right: 0,
  },
  lineView: {
    marginTop: HEIGHT_14,
  },
  innerTitleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  innerTextView: {
    marginTop: HEIGHT_17,
  },
  innnerDescText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    textAlign: 'left',
  },
  innerDescView: {
    marginTop: HEIGHT_14,
  },
  numberView: {
    marginTop: HEIGHT_16,
  },
});
