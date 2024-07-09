import React, {createRef, useEffect, useState} from 'react';
import {I18nManager, StyleSheet, Text, View} from 'react-native';
import HeaderComponent from '../../models/basic/HeaderComponent';
import colors from '../../resources/styles/colors';
import {useTranslation} from 'react-i18next';
import BottomButton from '../../components/shopOnApp/BottomButton';
import {
  FONT_11,
  FONT_13,
  FONT_16,
  HEIGHT_13,
  HEIGHT_17,
  HEIGHT_18,
  HEIGHT_19,
  HEIGHT_22,
  HEIGHT_30,
  HEIGHT_35,
  HEIGHT_37,
  HEIGHT_4,
  HEIGHT_5,
  WIDTH_12,
  WIDTH_14,
  WIDTH_40,
  BORDER_RADIUS_1,
  HEIGHT_15,
  FONT_37,
  FONT_24,
  FONT_20,
  FONT_30,
  FONT_29,
} from '../../resources/styles/responsive';
import ImageComponent from '../../models/basic/ImageComponent';
import {
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
// import Textinput from '../../models/basic/Textinput';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {ORDER_DETAILS_API} from '../../resources/route/endpoints';
import ScreenName from '../../navigator/ScreenName';
import {NavigateByName} from '../../services/NavigationService';
import {useNavigation} from '@react-navigation/native';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import SupportedCountryModal from '../../models/templates/SupportedCountryModal';
import {getGlobalSettingValue} from '../../services/CommonUtils';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import {heightPixel} from '../../resources/styles/normalizedimension';

const TrackOrderGuest = ({route}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const emailRef = createRef();
  const nummberRef = createRef();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const GlobalValue = global.shopOnAppSettings?.trackorderconfigurations;
  const [orderNumber, setOrderNumber] = useState('');
  const [orderNumberErr, setOrderNumberErr] = useState('');
  const [emailID, setEmailID] = useState('');
  const [emailError, setEmailError] = useState('');
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [openErrorModal, setErrorModal] = useState(false);

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.TrackOrderGuest,
    show: false,
  });

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#898989',
      text: '#000000',
      borderRadius: BORDER_RADIUS_1,
      backgroundColor: colors.WHITE,
    },
  };

  useEffect(() => {
    RecordScreenEvent('Shop Order Search');
  }, []);

  const validateEmail = text => {
    setEmailID(text);
    if (text != '') {
      if (emailRegex.test(text)) {
        setEmailError('');
      } else {
        setEmailError(t('peve'));
      }
    } else {
      setEmailError(t('peve'));
      emailRef?.current?.focus();
    }
  };

  const validateOrderNumber = text => {
    setOrderNumber(text);
    if (text == '') {
      nummberRef?.current?.focus();
    }
    if (text.length < 3) {
      setOrderNumberErr(t('pevon'));
    } else {
      setOrderNumberErr('');
    }
  };

  const orderDetailAPI = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          ORDER_DETAILS_API,
          {
            orderid: orderNumber,
            email: emailID,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        if (data?.data?.status === '0') {
          navigation.navigate(ScreenName.TrackOrder, {
            params: data?.data?.response,
            type: 'guest',
          });
        } else {
          setErrorModal(true);
          setErrorTitle(data?.data?.infomsg ? data?.data?.infomsg : t('oops'));
          setErrorMsg(
            data?.data?.message ? data?.data?.message : t('somethingwentwrong')
          );
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  return (
    <PaperProvider theme={theme}>
      <View style={styles.mainContainer}>
        <HeaderComponent
          showAlertIcon={false}
          showHeaderTitle={true}
          showChatIcon={false}
          showFavouriteButton={false}
          showBanner={false}
          statusBarColor={colors.WHITE}
          headerTitle={t('trackorder')}
          isHeaderTextPressDisabled={true}
          type={'ShopOnAppDiscover'}
        />
        <View style={styles.cardContainer}>
          <View style={styles.cardInnerContainer}>
            <View style={styles.titleView}>
              <ImageComponent
                type="image"
                iwidth={WIDTH_40}
                iheight={HEIGHT_35}
                source={getGlobalSettingValue('track_your_order_icon')}
                resizeMode={'contain'}
              />
              <View style={styles.titleInnerView}>
                <Text style={styles.titleText}>
                  {getGlobalSettingValue('track_your_order_title')}
                </Text>
                <Text style={styles.descText}>
                  {getGlobalSettingValue('track_your_order_desc')}
                </Text>
              </View>
            </View>
            <View style={styles.textInputView}>
              <View style={{marginBottom: HEIGHT_15}}>
                <TextInput
                  label={
                    <Text
                      style={{
                        fontFamily: RUBIK_LIGHT_FONT,
                        fontWeight: '300',
                        fontSize: FONT_13,
                      }}>
                      {t('Enter_order_number')}
                    </Text>
                  }
                  refvalue={nummberRef}
                  mode="outlined"
                  onFocus={() => {}}
                  value={orderNumber}
                  maxLength={50}
                  onChangeText={text => validateOrderNumber(text)}
                  keyboardType={'numeric'}
                  outlineColor={
                    orderNumberErr ? colors.RED : colors.OOREDDO_GREY
                  }
                  style={styles.textinput}
                  theme={{
                    fonts: {
                      regular: {
                        fontFamily: RUBIK_REGULAR_FONT,
                        fontSize: FONT_16,
                        fontWeight: '400',
                        lineHeight: I18nManager.isRTL ? FONT_29 : FONT_20,
                        includeFontPadding: false,
                      },
                    },
                  }}
                />
                {orderNumberErr ? (
                  <Text style={styles.errorMesssage}>{orderNumberErr}</Text>
                ) : null}
              </View>
              <View style={{marginBottom: HEIGHT_5}}>
                <TextInput
                  refvalue={emailRef}
                  label={
                    <Text
                      style={{
                        fontFamily: RUBIK_LIGHT_FONT,
                        fontWeight: '300',
                        fontSize: FONT_13,
                      }}>
                      {t('Enter_email_ID')}
                    </Text>
                  }
                  mode="outlined"
                  keyboardType={'email-address'}
                  onFocus={() => {}}
                  value={emailID}
                  maxLength={50}
                  onChangeText={text =>
                    validateEmail(
                      text.replace(
                        /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>\{\}\[\]\\\/]/g,
                        ''
                      )
                    )
                  }
                  outlineColor={emailError ? colors.RED : colors.OOREDDO_GREY}
                  style={styles.textinput}
                  theme={{
                    fonts: {
                      regular: {
                        fontFamily: RUBIK_REGULAR_FONT,
                        fontSize: FONT_16,
                        fontWeight: '400',
                        lineHeight: I18nManager.isRTL ? FONT_29 : FONT_20,
                        includeFontPadding: false,
                      },
                    },
                  }}
                />
                {emailError ? (
                  <Text style={styles.errorMesssage}>{emailError}</Text>
                ) : null}
              </View>
            </View>
          </View>
        </View>
        <BottomButton
          text={getGlobalSettingValue('track_your_order_btn')}
          onPress={() => {
            validateEmail(emailID);
            validateOrderNumber(orderNumber);
            if (!emailError && !orderNumberErr && emailID && orderNumber) {
              orderDetailAPI.mutate();
            }
          }}
        />
        {orderDetailAPI.isLoading && (
          <LoadingIndicator
            shouldDismissManual
            isVisible={orderDetailAPI.isLoading}
          />
        )}
        {openErrorModal ? (
          <SupportedCountryModal
            popupText={errorMsg}
            onDismiss={data => {
              setErrorModal(false);
            }}
            titleMsg={errorTitle ? errorTitle : ''}
            isFrom={'passwordManagement'}
          />
        ) : null}
      </View>
    </PaperProvider>
  );
};

export default TrackOrderGuest;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.BG_COLOR_WHITE,
  },
  cardContainer: {
    backgroundColor: colors.BG_PINK,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: WIDTH_12,
  },
  cardInnerContainer: {
    backgroundColor: colors.BG_COLOR_WHITE,
    marginHorizontal: HEIGHT_13,
    marginVertical: HEIGHT_30,
    width: FULL_WIDTH_PERCENTAGE,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    borderRadius: 10,
    borderWidth: 0.5,
    borderColor: colors.INACTIVEDOT,
    paddingBottom: HEIGHT_22,
  },
  titleView: {
    flexDirection: 'row',
    marginTop: HEIGHT_30,
    marginLeft: HEIGHT_19,
  },
  titleInnerView: {
    marginLeft: HEIGHT_17,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    textAlign: 'left',
  },
  descText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
    marginTop: HEIGHT_4,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_11,
    fontFamily: RUBIK_LIGHT_FONT,
    marginTop: HEIGHT_5,
    marginHorizontal: WIDTH_14,
  },
  textinput: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_16,
    marginHorizontal: WIDTH_14,
    backgroundColor: colors.BG_COLOR_WHITE,
    // height: heightPixel(50),
    includeFontPadding: false,
    textAlignVertical: 'center',
  },
  textInputView: {
    marginTop: HEIGHT_37,
  },
  inputText: {
    color: colors.BLACK,
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_13,
    lineHeight: null,
  },
});
