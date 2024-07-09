import React, {useEffect, useState} from 'react';
import {
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../resources/styles/colors';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import {
  SCREEN_WIDTH,
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  FONT_16,
  HEIGHT_14,
  HEIGHT_20,
  HEIGHT_24,
  HEIGHT_28,
  HORIZONTAL_10,
  HORIZONTAL_40,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_16,
  VERTICAL_20,
  WIDTH_25,
  WIDTH_27,
} from '../../resources/styles/responsive';
import RatingModalNew from './RatingModalNew';
import LinearGradient from 'react-native-linear-gradient';
import {isTablet} from 'react-native-device-info';
import {
  GET_RATING_REASONS,
  RATING_STAR_SVG,
} from '../../resources/route/endpoints';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import BottomPoppup from '../../commonHelper/BottomPopup';
import {useNavigation} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import ScreenName from '../../navigator/ScreenName';
import ImageComponent from '../basic/ImageComponent';

const Rating = () => {
  const navigation = useNavigation();
  const {t} = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reasons, setReasons] = useState([]);
  const [ratingSheet, setRatingSheet] = useState(false);

  useEffect(() => {
    getRatingReasons.mutate();
  }, []);

  const handleStarPress = value => {
    if (!global.isRatingSubmiitted) {
      setRating(value);
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const getRatingReasons = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GET_RATING_REASONS,
          {
            action:
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.rating_type_onboarding,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.response) {
          setReasons(udata?.data?.response?.reasons);
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  return (
    <View>
      <LinearGradient
        start={{x: 1, y: 1}}
        end={{x: 1, y: 0}}
        colors={[colors.OOREDDO_GRADIENT_ONE, colors.OOREDDO_GRADIENT_TWO]}
        style={styles.gradientContainer}>
        <View style={styles.card}>
          <Text style={styles.rateUsText}>
            {
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.rate_us_title
            }
          </Text>
          <View style={styles.container}>
            {[1, 2, 3, 4, 5].map((value, index) => (
              <TouchableOpacity
                activeOpacity={1}
                key={value}
                onPress={() => handleStarPress(value)}>
                <ImageComponent
                  type="image"
                  iwidth={WIDTH_25}
                  iheight={HEIGHT_24}
                  source={
                    value <= rating
                      ? RATING_STAR_SVG.selected_img
                      : RATING_STAR_SVG.unSelected_img
                  }
                  resizeMode={'contain'}
                  style={{
                    marginRight: index === 4 ? 0 : WIDTH_27,
                  }}
                />
              </TouchableOpacity>
            ))}
          </View>

          <RatingModalNew
            visible={modalVisible}
            rating={rating}
            onClose={closeModal}
            reasons={reasons}
            isReasons={
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.is_rating_reasons_mandatory
            }
            isComments={
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.is_rating_comments_mandatory
            }
            bottomPop={value => {
              setRatingSheet(value);
            }}
            RatingContentValue={
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.show_reasons_when_star_count
            }
            setRationg={value => setRating(value)}
          />
        </View>
      </LinearGradient>

      {ratingSheet && (
        <BottomPoppup
          designmode={2}
          visible={ratingSheet}
          message={
            global?.shopOnAppSettings?.receiptpageconfigurations
              ?.show_reasons_when_star_count == null ||
            global?.shopOnAppSettings?.receiptpageconfigurations
              ?.show_reasons_when_star_count == undefined
              ? ''
              : rating >
                global?.shopOnAppSettings?.receiptpageconfigurations
                  ?.show_reasons_when_star_count
              ? t('wwtyfotas')
              : t('ifuneed')
          }
          onHide={() => {
            setModalVisible(false);
            setRatingSheet(false);
          }}
          onClose={() => {
            setModalVisible(false);
            setRatingSheet(false);
            // navigation.navigate(ScreenName.homeScreen);
            if (
              global.logintype == null ||
              global.logintype == '' ||
              global.logintype == undefined
            ) {
              navigation.navigate(ScreenName.authStack, {
                screen: ScreenName.landingScreen,
              });
            } else {
              navigation.reset({
                index: 0,
                routes: [
                  {
                    name: ScreenName.tabStack,
                    state: {routes: [{name: ScreenName.homeStack}]},
                  },
                ],
              });
            }
          }}
          tryagainClick={() => {
            global.openChatPopup = true;
            navigation.navigate(ScreenName.SupportHome);
            setModalVisible(false);
            setRatingSheet(false);
          }}
          title={t('tfru')}
          btnName={t('surveychatwithagent')}
          showInfoIcon={true}
          type={'rating'}
          hideBtnName={
            global?.shopOnAppSettings?.receiptpageconfigurations
              ?.show_reasons_when_star_count == null ||
            global?.shopOnAppSettings?.receiptpageconfigurations
              ?.show_reasons_when_star_count == undefined
              ? ''
              : rating >
                global?.shopOnAppSettings?.receiptpageconfigurations
                  ?.show_reasons_when_star_count
              ? true
              : false
          }
        />
      )}
    </View>
  );
};

export default Rating;

const styles = StyleSheet.create({
  card: {
    // padding: HORIZONTAL_10,
    elevation: 3,
    shadowColor: colors.BG_PINK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  gradientContainer: {
    width: isTablet ? SCREEN_WIDTH : widthPixel(375),
    marginTop: HEIGHT_20,
  },
  rateUsText: {
    fontSize: FONT_16,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    lineHeight: I18nManager.isRTL ? null : VERTICAL_16,
    textAlign: 'center',
    marginTop: VERTICAL_20,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: HEIGHT_14,
    marginBottom: HEIGHT_28,
  },
  star: {
    marginRight: HORIZONTAL_5,
    width: widthPixel(25),
    height: widthPixel(24),
  },
});
