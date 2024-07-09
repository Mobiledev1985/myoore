import React, {useState} from 'react';
import {I18nManager, StyleSheet, View, Text} from 'react-native';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_BOLD_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_13,
  FONT_16,
  FONT_22,
  FONT_34,
  HEIGHT_12,
  HEIGHT_20,
  WIDTH_12,
  WIDTH_15,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {LandingPageButton} from '../../commonHelper/Button';
import {SCALE_SIZE_25} from '../../commonHelper/Constants';
import Textinput from '../../models/basic/Textinput';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {
  APPLY_PROMO_CODE,
  REMOVE_PROMO_CODE,
} from '../../resources/route/endpoints';
import {useTranslation} from 'react-i18next';

const PromoCode = ({
  isLoading,
  data,
  returnRespObj,
  returnPromoText,
  cartID,
}) => {
  const {t} = useTranslation();
  const [promoCode, setPromoCode] = useState('');
  const [applyPromoResp, setApplyPromoResp] = useState('');
  const [applyPromoError, setApplyPromoError] = useState('');
  const [removePromoResp, setRemovePromoResp] = useState('');
  const [succMsg, setsuccMsg] = useState('');
  const [errMsg, setErrMsg] = useState('');

  const applyPromoCode = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          APPLY_PROMO_CODE,
          {quoteid: cartID, couponcode: req},
          {},
        ],
      }),

    {
      onSuccess: udata => {
        isLoading(false);
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            returnPromoText(promoCode);
            returnRespObj(udata?.data?.response);
            setErrMsg('');
            setApplyPromoResp(udata?.data?.response);
            setsuccMsg(udata?.data?.message);
          } else {
            returnPromoText('');
            setsuccMsg('');
            setApplyPromoError(udata?.data?.response);
            setErrMsg(udata?.data?.message);
          }
        }
      },
      onError: uerror => {
        isLoading(false);
      },
    }
  );

  const removePromoCode = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, REMOVE_PROMO_CODE, {quoteid: cartID}, {}],
      }),

    {
      onSuccess: udata => {
        isLoading(false);
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            returnRespObj(udata?.data?.response);
            setRemovePromoResp(udata?.data?.response);
            setsuccMsg('');
            setErrMsg('');
            setApplyPromoResp('');
            setApplyPromoError('');
            setPromoCode('');
            returnPromoText('');
          }
        }
      },
      onError: (uerror, variables, context) => {
        isLoading(false);
      },
    }
  );

  return (
    <View
      style={[
        styles.mainView,
        {
          paddingBottom: succMsg || errMsg ? heightPixel(9) : heightPixel(32),
        },
      ]}>
      <View>
        <Text style={styles.titleText}>{data?.apply_promocode_title}</Text>
      </View>

      <View style={styles.inputView}>
        <Textinput
          additionalStyle={{
            borderColor:
              promoCode.length == 0
                ? colors.INACTIVEDOT
                : applyPromoResp?.successbgcolor
                ? '#86C8BC'
                : applyPromoError?.errorbgcolor
                ? '#ED1C24'
                : colors.INACTIVEDOT,
            borderWidth: 1,
            borderRadius: 6,
            backgroundColor:
              promoCode.length == 0
                ? colors.TOO_LIGHT_GREY
                : applyPromoResp?.successbgcolor
                ? applyPromoResp?.successbgcolor
                : applyPromoError?.errorbgcolor
                ? applyPromoError?.errorbgcolor
                : colors.TOO_LIGHT_GREY,
            borderStyle: 'dashed',
            height: heightPixel(33),
            width: widthPixel(211),
          }}
          fontStyle={{
            fontFamily: RUBIK_BOLD_FONT,
            fontSize: FONT_16,
            color: colors.BLACK,
            lineHeight: I18nManager.isRTL ? FONT_34 : FONT_22,
          }}
          value={promoCode}
          onFocus={() => {
            setErrMsg('');
          }}
          maxLength={16}
          onChangeText={text => {
            setPromoCode(text);
            if (text.length > 2 || text.length === 0) {
              setErrMsg('');
            } else setErrMsg(t('pevpc'));
          }}
          editable={succMsg ? false : true}
        />

        <LandingPageButton
          title={
            succMsg ? data?.remove_promocode_btn : data?.applypromocode_btn
          }
          onPress={() => {
            isLoading(true);
            if (succMsg) {
              removePromoCode.mutate();
            } else {
              applyPromoCode.mutate(promoCode);
            }
          }}
          customStyle={{
            width: widthPixel(99),
            height: heightPixel(33),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: succMsg
              ? colors.OOREDDO_LIGHT_GREY
              : colors.OOREDOO_RED,
            borderRadius: SCALE_SIZE_25,
            marginLeft: WIDTH_15,
            marginRight: widthPixel(13),
          }}
          customTextStyle={{
            fontFamily: RUBIK_SEMIBOLD_FONT,
            fontSize: FONT_13,
            color: colors.WHITE,
            textAlign: 'left',
          }}
        />
      </View>
      {(succMsg || errMsg) && (
        <View
          style={{
            marginTop: heightPixel(11),
          }}>
          <Text
            style={[
              styles.msgText,
              {color: succMsg ? colors.BLACK : colors.OOREDOO_RED},
            ]}>
            {succMsg ? succMsg : errMsg}
          </Text>
        </View>
      )}
    </View>
  );
};

export default PromoCode;

const styles = StyleSheet.create({
  mainView: {
    borderRadius: 10,
    borderColor: colors.INACTIVEDOT,
    borderWidth: 0.5,
    backgroundColor: colors.BG_COLOR_WHITE,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    marginHorizontal: WIDTH_12,
    paddingLeft: WIDTH_15,
    paddingTop: HEIGHT_12,
    marginTop: HEIGHT_20,
    elevation: 3,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
    color: colors.BLACK,
  },

  inputView: {
    flexDirection: 'row',
    marginTop: HEIGHT_12,
  },

  msgText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    fontWeight: 300,
    textAlign: 'left',
  },
});
