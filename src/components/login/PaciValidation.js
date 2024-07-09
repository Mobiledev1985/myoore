import React from 'react';
import {
  FONT_12,
  FONT_14,
  FONT_16,
  FONT_20,
  FONT_22,
  FONT_24,
  FONT_26,
  HAS_NOTCH,
  HEIGHT_100,
  HEIGHT_40,
  HEIGHT_45,
  HEIGHT_48,
  HEIGHT_49,
  HEIGHT_50,
  HEIGHT_53,
  HORIZONTAL_10,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_25,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_25,
  VERTICAL_30,
  VERTICAL_5,
  VERTICAL_50,
  WIDTH_30,
  WIDTH_40,
} from '../../resources/styles/responsive';
import {
  SCALE_SIZE_12,
  SCALE_SIZE_25,
  SCALE_SIZE_30,
  SCALE_SIZE_8,
  SCALE_SIZE_0,
  VERTICAL_SCALE_10,
  VERTICAL_SCALE_20,
  MOBILEID_TIMER_STATUS,
  SCALE_SIZE_36,
  VERTICAL_SCALE_15,
  VERTICAL_SCALE_42,
  SCALE_SIZE_10,
  SCALE_SIZE_5,
} from '../../commonHelper/Constants';
import {useCallback, useEffect, useRef, useState} from 'react';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../../resources/styles/fonts';
import colors from '../../resources/styles/colors';
import {LandingPageButton} from '../../commonHelper/Button';

//import type { Node } from 'react';
import Textinput from '../../models/basic/Textinput';
import ScreenName from '../../navigator/ScreenName';
import BottomPoppup from '../../commonHelper/BottomPopup';
import BottomAuthenticationPaciPopup from '../../commonHelper/BottomAuthenticationPaciPopup';
import {
  UnitTestProps,
  consoleLog,
  debounce,
  setItem,
  validateEmail,
  getItem,
  removeItem,
} from '../../commonHelper/utils';
import ScreenHeader from '../../commonHelper/ScreenHeader';
import {
  StackActions,
  useFocusEffect,
  useIsFocused,
} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {DEVICE_HEADER_PADDING} from '../../resources/styles/responsive';
//import { heightPixel } from '../../resources/styles/normalizedimension';
import {
  I18nManager,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import {CIVILID_API} from '../resources/route/endpoints';
import {MOBILEID_STATUS} from '../../resources/route/endpoints';
import {getGlobalSettingValue} from '../../services/CommonUtils';
/* $FlowFixMe[missing-local-annot] The type annotation(s) required by Flow's

 * LTI update could not be added via codemod */
const STATUS_BAR_HEIGHT = StatusBar.currentHeight || 40;
const PaciValidation = ({navigation}) => {
  const {t} = useTranslation();
  const isFocused = useIsFocused();
  const FIELD_REQUIRED_TEXT = t('tfr');
  const [checkscroll, setcheckscroll] = useState(false);
  const [civilAddress, setCivilAddress] = useState('');
  const [error, setError] = useState('');
  const [onclickTxt, setonclickTxt] = useState('');
  const [bottomAuthpopUp, setbottomAuthpopUp] = useState(false);
  const [bottomAuthDescription, setbottomAuthDescription] = useState(null);
  const [popupError, setpopupError] = useState();
  const [showModal, setshowModal] = useState(false);
  const [showValidAuth, setshowValidAuth] = useState(false);
  const [paciButtontext, setpaciButtontext] = useState(null);
  const [ButtonTexttitle, setButtonTexttitle] = useState(null);
  const [otpButtontext, setotpButtontext] = useState(null);
  const [isprefilledDataAvailable, setisprefilledDataAvailable] =
    useState('false');
  const _scrollLogin = useRef();

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isFocused])
  );

  function renderLeftIcon() {
    return (
      <TouchableOpacity
        style={{
          width: WIDTH_30,
          height: HEIGHT_40,
          marginLeft: SCALE_SIZE_12,
          top: SCALE_SIZE_30,
        }}
        // activeOpacity={0.8}
        onPress={() => {
          navigation.reset({
            routes: [{name: ScreenName.landingScreen}],
          });
          return;
        }}>
        <Image
          source={require('../../assets/backicon.png')}
          style={styles.backButton}
        />
      </TouchableOpacity>
    );
  }

  const valUserCivilID = () => {
    let validString = civilAddress;
    if (civilAddress.length === 0) {
      setError(FIELD_REQUIRED_TEXT);
      // global.loginPaciScreen = true;
    } else if (civilAddress.length === 12) {
      global.EnableStatusApiTimer = true;
      global.isContinueDisabled = false;
      removeItem(MOBILEID_TIMER_STATUS);
      setbottomAuthpopUp(true);
    } else {
      setError(getGlobalSettingValue('pevcid') || t('pevcid'));
    }
  };

  const validateTextInput = value => {
    setisprefilledDataAvailable('false');
    let validStr = value;
    if (validStr) {
      let validText = validStr.replace(
        /[`\D~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",.<> \{\}\[\]\\\/]/g,
        ''
      );
      validStr = validText.replace('‘', '');
      validStr = validText.replace('“', '');
      if (validStr) {
        if (!value.trim()) {
          setError(t('pemn'));
          return;
        } else {
          if (value.length === 13) {
            return;
          }
          setError('');
        }
      }
    }
    setCivilAddress(validStr);
  };

  return (
    <View style={{flex: 1}}>
      <View style={{paddingTop: DEVICE_HEADER_PADDING}}>
        <ScreenHeader
          title={t('login')}
          titleStyle={{
            fontSize: FONT_14,
            lineHeight: isTablet ? FONT_24 : FONT_24,
            top: VERTICAL_30,
            fontFamily: OOREDOO_HEAVY_FONT,
            color: colors.BLACK,
          }}
          // right={renderRightIcon}
          left={renderLeftIcon}
        />
        <View
          style={{
            marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
            marginTop: VERTICAL_30,
          }}>
          <View style={styles.TopView}>
            <Text style={styles.civilidTextContainer}>
              {t('entercivilidnumber')}
            </Text>
          </View>
          <Textinput
            additionalStyle={{
              borderColor: error ? colors.RED : colors.LIGHT_BLACK,
              marginTop: VERTICAL_20,
              marginLeft: HORIZONTAL_25,
              marginRight: HORIZONTAL_25,
              marginHorizontal: isTablet ? HORIZONTAL_25 : 0,
            }}
            autoCorrect={false}
            value={civilAddress}
            maxLength={12}
            // keyboardType="numeric"
            keyboardType={Platform.OS === 'android' ? 'numeric' : 'number-pad'}
            error={error}
            imageSource={require('../../assets/warning.png')}
            onChangeText={val =>
              validateTextInput(
                val.replace(/[`~!@#$%^&*()_|+\-=?;:'",.<> \{\}\[\]\\\/]/g, '')
              )
            }
            //onChangeText={text => validateTextInput(text.replace(/\s/g, ''))}
            onSubmitEditing={valUserCivilID}
          />

          {error ? (
            <Text
              //{...UnitTestProps('login', 'text', 'iderror')}
              style={styles.apiError}>
              {error}
            </Text>
          ) : null}
          <View style={styles.continueViewContainer}>
            <LandingPageButton
              title={t('continue')}
              onPress={valUserCivilID}
              customStyle={styles.continueBtnContainer}
              customTextStyle={styles.continueBtnText}
            />
          </View>
        </View>

        {bottomAuthpopUp ? (
          <BottomAuthenticationPaciPopup
            visible={bottomAuthpopUp}
            civilAddress={civilAddress}
            type={'deviceauth'}
            onClose={() => {
              setbottomAuthpopUp(false);
            }}
            height={heightPixel(380)}
          />
        ) : null}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  civilidTextContainer: {
    fontSize: FONT_12,
    // top: VERTICAL_SCALE_40,
    lineHeight: FONT_20,
    fontFamily: OOREDOO_HEAVY_FONT,
    marginHorizontal: HORIZONTAL_25,
    marginBottom: VERTICAL_SCALE_10,
    alignSelf: 'flex-start',
    color: colors.BLACK,
  },
  TopView: {
    paddingTop: VERTICAL_10,
  },
  backButton: {
    width: WIDTH_30,
    height: isTablet ? HEIGHT_40 : HEIGHT_53,
    paddingTop: VERTICAL_25,
    paddingLeft: HORIZONTAL_15,
    marginRight: SCALE_SIZE_36,
    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  continueViewContainer: {
    marginHorizontal: HORIZONTAL_25,
    alignSelf: 'stretch',
    marginTop: VERTICAL_5,
  },
  apiError: {
    fontSize: FONT_12,
    lineHeight: FONT_20,
    // marginTop: VERTICAL_SCALE_42,
    marginHorizontal: HORIZONTAL_25,
    fontFamily: NOTOSANS_REGULAR_FONT,
    marginTop: VERTICAL_SCALE_15,
    color: colors.RED,
    textAlign: 'left',
  },
  continueBtnContainer: {
    padding: SCALE_SIZE_8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.OOREDOO_RED,
    marginVertical: VERTICAL_SCALE_20,
    borderRadius: SCALE_SIZE_25,
  },

  continueBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,

    marginHorizontal: HORIZONTAL_20,
    // marginVertical: VERTICAL_SCALE_5,
  },
});

export default PaciValidation;
