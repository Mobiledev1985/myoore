import React, {useEffect, useState} from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Platform,
  Linking,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  heightPixel,
  widthPixel,
  isTablet,
} from '../../resources/styles/normalizedimension';
import {
  HEIGHT_30,
  VERTICAL_10,
  FONT_16,
  HORIZONTAL_20,
  HORIZONTAL_5,
  VERTICAL_15,
  FONT_10,
  FONT_13,
  HORIZONTAL_10,
  FONT_14,
  BORDER_RADIUS_25,
  HORIZONTAL_30,
  VERTICAL_18,
  FONT_20,
  FONT_12,
  WIDTH_17,
  HEIGHT_22,
  HEIGHT_4,
  WIDTH_50,
  HEIGHT_18,
  HEIGHT_29,
  HEIGHT_20,
  HEIGHT_17,
  WIDTH_29,
  HEIGHT_8,
  HEIGHT_19,
  HEIGHT_15,
  WIDTH_8,
  WIDTH_326,
  HEIGHT_40,
  HEIGHT_5,
  HORIZONTAL_15,
  BORDER_RADIUS_1,
  WIDTH_25,
  HEIGHT_24,
} from '../../resources/styles/responsive';
import {LandingPageButton} from '../../commonHelper/Button';
import {useTranslation} from 'react-i18next';
import {I18nManager} from 'react-native';
import DashedLine from 'react-native-dashed-line';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {RATING_STAR_SVG, SAVE_RATING} from '../../resources/route/endpoints';
import Toast from 'react-native-simple-toast';
import DeviceInfo from 'react-native-device-info';
import {output} from '../../commonHelper/ApiHeaders';
import {getItem, setItem} from '../../commonHelper/utils';
import InAppReview from 'react-native-in-app-review';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {KeyboardAvoidingView} from 'react-native';
import ImageComponent from '../basic/ImageComponent';

const MAX_CHAR_LENGTH = 246;

const RatingModalNew = ({
  visible,
  rating,
  onClose,
  reasons,
  isReasons,
  isComments,
  RatingContentValue,
  bottomPop,
  setRationg,
}) => {
  const {t} = useTranslation();
  const [commentRef, setCommentRef] = useState(false);
  const key_save_rating = `${global.UniqueToken}_SAVE_RATING`;
  const [ratings, setRatings] = useState(rating);
  const [showcommentError, setshowcommentError] = useState(false);
  const [comment, setComment] = useState('');
  const remainingCharacters = MAX_CHAR_LENGTH - comment.length;
  const [showLoader, setShowLoader] = useState(false);

  const [needComments, setneedComments] = useState(false);
  const [reasontype, setReasonType] = useState('');
  const [reason, setReason] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(null);

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
    setRatings(rating);
  }, [rating]);

  const handleStarPress = value => {
    setRatings(value);
    setRationg(value);
  };

  const handleTextChange = text => {
    if (text.length <= MAX_CHAR_LENGTH) {
      setComment(text);
    }
  };

  const onsubmit = () => {
    if (ratings > RatingContentValue) {
      setShowLoader(true);
      saveRating.mutate();
    } else {
      if (
        isReasons?.toLowerCase() == 'true' &&
        isComments?.toLowerCase() == 'false'
      ) {
        if (reason === null || reason === undefined || reason === '') {
          Toast.show(t('psr'));
        } else if (needComments) {
          if (
            comment === null ||
            comment === undefined ||
            comment === '' ||
            comment.trim() === null ||
            comment.trim() === undefined ||
            comment.trim() === ''
          ) {
            Toast.show(t('peyc'));
          } else {
            setShowLoader(true);
            saveRating.mutate();
          }
        } else {
          setShowLoader(true);
          saveRating.mutate();
        }
      } else if (
        isReasons?.toLowerCase() == 'false' &&
        isComments?.toLowerCase() == 'true'
      ) {
        if (
          comment === null ||
          comment === undefined ||
          comment === '' ||
          comment.trim() === null ||
          comment.trim() === undefined ||
          comment.trim() === ''
        ) {
          Toast.show(t('peyc'));
        } else {
          setShowLoader(true);
          saveRating.mutate();
        }
      } else if (
        isComments?.toLowerCase() == 'true' &&
        isReasons?.toLowerCase() == 'true'
      ) {
        if (reason === null || reason === undefined || reason === '') {
          Toast.show(t('psr'));
        } else if (
          comment === null ||
          comment === undefined ||
          comment === '' ||
          comment.trim() === null ||
          comment.trim() === undefined ||
          comment.trim() === ''
        ) {
          Toast.show(t('peyc'));
        } else {
          setShowLoader(true);
          saveRating.mutate();
        }
      } else {
        if (needComments) {
          if (
            comment === null ||
            comment === undefined ||
            comment === '' ||
            comment.trim() === null ||
            comment.trim() === undefined ||
            comment.trim() === ''
          ) {
            Toast.show(t('peyc'));
          } else {
            setShowLoader(true);
            saveRating.mutate();
          }
        } else {
          setShowLoader(true);
          saveRating.mutate();
        }
      }
    }
  };

  const saveRating = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          key_save_rating,
          SAVE_RATING,
          {
            action:
              global?.shopOnAppSettings?.receiptpageconfigurations
                ?.rating_type_onboarding,
            rating: ratings,
            trans_status: 'success',
            reasontype: ratings <= RatingContentValue ? reasontype || '' : '',
            reason: ratings <= RatingContentValue ? reason || '' : '',
            comments: ratings <= RatingContentValue ? comment || '' : '',
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setShowLoader(false);
        global.isRatingSubmiitted = true;
        if (udata != null && udata !== undefined && udata.data != null) {
          if (ratings >= 4) {
            onClose();
            setCommentRef(false);
            reviewfun();
          } else {
            onClose();
            setCommentRef(false);
            setTimeout(() => {
              bottomPop(true);
            }, 100);
          }
        }
      },
      onError: (uerror, variables, context) => {
        setShowLoader(false);
      },
    }
  );

  const reviewfun = async () => {
    DeviceInfo.getInstallerPackageName().then(installerPackageName => {
      if (
        (installerPackageName === 'com.huawei.appmarket' ||
          installerPackageName === 'unknown') &&
        Platform.OS !== 'ios' &&
        output.devcieName === 'huawei'
      ) {
        Alert.alert(t('holdon'), t('rateUs'), [
          {
            text: t('Cancel'),
            onPress: () => null,
            style: 'cancel',
          },
          {
            text: t('okuper'),
            onPress: () =>
              Linking.openURL('appmarket://details?id=com.wataniya'),
          },
        ]);
      }
    });

    const lastDateAppReviewed = await getItem('in_App_Review');
    if (lastDateAppReviewed !== null) {
      let Today = new Date();
      const leftTime = Math.abs(Today - Date.parse(lastDateAppReviewed));
      let leftDays = Math.ceil(leftTime / (1000 * 60 * 60 * 24));
      if (leftDays > 0) {
        await setItem('in_App_Review', new Date().toString());
        InAppReview.RequestInAppReview()
          .then(res => {
            bottomPop(true);
          })
          .catch(error => consoleLog('Errr', error));
      } else {
      }
    } else {
      await setItem('in_App_Review', new Date().toString());
      InAppReview.RequestInAppReview()
        .then(res => {
          if (res === true) {
            InAppReview.RequestInAppReview();
          }
        })
        .catch(error => consoleLog('Errr', error));
    }
  };

  const renderItem = ({item, index}) => (
    <TouchableOpacity
      activeOpacity={0.5}
      onPress={() => {
        setSelectedIndex(index);
        setReasonType(item?.displaytext);
        setReason(item?.description);
        setneedComments(item?.comments);
      }}
      style={[
        styles.item,
        {
          marginBottom:
            index == reasons.length - 1 ||
            index == reasons.length - 2 ||
            index == reasons.length - 3
              ? 0
              : HEIGHT_8,
          marginRight:
            index == 2 ||
            index == 5 ||
            index == 8 ||
            index == 11 ||
            index == 14 ||
            index == 17 ||
            index == 20 ||
            index == 23 ||
            index == 26
              ? 0
              : HEIGHT_19,
          backgroundColor:
            index == selectedIndex ? colors.OOREDOO_RED : colors.BG_COLOR_WHITE,
          borderColor:
            index == selectedIndex ? colors.OOREDOO_RED : colors.OOREDDO_GREY,
        },
      ]}>
      <Text
        style={[
          styles.itemText,
          {
            color: index == selectedIndex ? colors.WHITE : colors.BLACK,
          },
        ]}>
        {item?.description}
      </Text>
    </TouchableOpacity>
  );

  return (
    <PaperProvider theme={theme}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        statusBarTranslucent
        onRequestClose={() => {
          onClose();
          setCommentRef(false);
        }}>
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => {
            onClose();
            setCommentRef(false);
          }}
          activeOpacity={1}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'position'}>
            <TouchableOpacity
              onPress={() => {}}
              activeOpacity={1}
              style={styles.popupContainer}>
              <View style={styles.lineView}></View>

              <View style={{marginTop: HEIGHT_29}}>
                <Text style={styles.modalText}>
                  {
                    global?.shopOnAppSettings?.receiptpageconfigurations
                      ?.rating_thank_you_text
                  }
                </Text>
              </View>

              <View
                style={[
                  styles.container,
                  {paddingBottom: ratings > 3 ? HEIGHT_40 : 0},
                ]}>
                {[1, 2, 3, 4, 5].map((value, index) => (
                  <TouchableOpacity
                    key={value}
                    onPress={() => handleStarPress(value)}>
                    <ImageComponent
                      type="image"
                      iwidth={WIDTH_25}
                      iheight={HEIGHT_24}
                      source={
                        value <= ratings
                          ? RATING_STAR_SVG.selected_img
                          : RATING_STAR_SVG.unSelected_img
                      }
                      resizeMode={'contain'}
                      style={{
                        marginRight: index === 4 ? 0 : HORIZONTAL_30,
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {ratings <= RatingContentValue ? (
                <>
                  <View style={styles.dashedLineView}>
                    <DashedLine
                      dashLength={5}
                      dashThickness={0.5}
                      dashGap={2}
                      dashColor={colors.OOREDDO_LIGHT_GREY}
                    />
                  </View>

                  <View style={styles.dashedLineView}>
                    <Text style={styles.modalText}>
                      {
                        global?.shopOnAppSettings?.receiptpageconfigurations
                          ?.rating_reasons_title
                      }
                    </Text>
                  </View>

                  <View style={styles.listView}>
                    <FlatList
                      data={reasons}
                      renderItem={renderItem}
                      keyExtractor={item => item.id}
                      numColumns={3}
                      contentContainerStyle={{flexGrow: 1}}
                      scrollEnabled={false}
                    />
                  </View>

                  <View style={styles.separatorContainer}>
                    <View>
                      <DashedLine
                        dashLength={5}
                        dashThickness={0.5}
                        dashGap={2}
                        dashColor={colors.OOREDDO_LIGHT_GREY}
                      />
                    </View>
                    <View style={{paddingHorizontal: WIDTH_8}}>
                      <Text style={styles.separatorText}>
                        {
                          global?.shopOnAppSettings?.receiptpageconfigurations
                            ?.or_text
                        }
                      </Text>
                    </View>
                    <View>
                      <DashedLine
                        dashLength={5}
                        dashThickness={0.5}
                        dashGap={2}
                        dashColor={colors.OOREDDO_LIGHT_GREY}
                      />
                    </View>
                  </View>

                  <View
                    style={[
                      styles.additionalView,
                      showcommentError
                        ? {
                            borderColor: colors.OOREDOO_RED,
                            borderWidth: 1,
                            backgroundColor: colors.LIGHT_RED_SHADOW,
                          }
                        : {},
                    ]}>
                    <TextInput
                      label={
                        <Text
                          style={{
                            fontFamily: RUBIK_LIGHT_FONT,
                            fontWeight: '300',
                            fontSize: FONT_13,
                            color: commentRef ? undefined : colors.BLACK,
                          }}>
                          {
                            global?.shopOnAppSettings?.receiptpageconfigurations
                              ?.type_comments_placeholder
                          }
                        </Text>
                      }
                      mode="outlined"
                      textAlignVertical="top"
                      style={[
                        styles.additional,
                        {
                          backgroundColor: commentRef
                            ? 'white'
                            : colors.LINE_LIGHT_GRAY,
                        },
                      ]}
                      multiline
                      value={comment}
                      onFocus={() => {
                        setCommentRef(true);
                      }}
                      onChangeText={text => {
                        setshowcommentError(false);
                        handleTextChange(text);
                      }}
                      outlineColor="transparent"
                      theme={{
                        fonts: {
                          regular: {
                            fontSize: FONT_13,
                            fontFamily: NOTOSANS_LIGHT_FONT,
                            fontWeight: '300',
                          },
                        },
                        roundness: 11,
                      }}
                    />
                    {showcommentError ? (
                      <Text style={styles.errorMesssage}>{t('peyc')}</Text>
                    ) : null}
                    {comment.length > 0 ? (
                      <View style={styles.characterCountContainer}>
                        <Text style={styles.characterCountText}>
                          {`${remainingCharacters}/${MAX_CHAR_LENGTH}`}
                        </Text>
                      </View>
                    ) : (
                      <View style={styles.characterCountContainer}>
                        <Text style={styles.characterCountText}>
                          {MAX_CHAR_LENGTH + '/' + MAX_CHAR_LENGTH}
                        </Text>
                      </View>
                    )}
                  </View>
                </>
              ) : null}

              <LandingPageButton
                title={
                  global?.shopOnAppSettings?.receiptpageconfigurations
                    ?.submit_btn
                }
                onPress={() => {
                  onsubmit();
                }}
                customStyle={{
                  width: WIDTH_326,
                  height: HEIGHT_40,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: colors.OOREDOO_RED,
                  borderRadius: BORDER_RADIUS_25,
                  marginTop: 20,
                  alignSelf: 'center',
                }}
                customTextStyle={{
                  fontFamily: RUBIK_SEMIBOLD_FONT,
                  fontSize: FONT_14,
                  color: colors.WHITE,
                }}
              />
            </TouchableOpacity>
          </KeyboardAvoidingView>
          {(saveRating.isLoading || showLoader) && (
            <LoadingIndicator
              shouldDismissManual
              isVisible={saveRating.isLoading || showLoader}
            />
          )}
        </TouchableOpacity>
      </Modal>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: HEIGHT_22,
    paddingVertical: HEIGHT_5,
  },
  additionalView: {
    marginHorizontal: HORIZONTAL_20,
    height: heightPixel(195),
  },
  lineView: {
    width: WIDTH_50,
    height: HEIGHT_4,
    backgroundColor: colors.OOREDDO_LIGHT_GREY,
    alignSelf: 'center',
    marginTop: HEIGHT_18,
    borderRadius: 4,
  },

  additional: {
    textAlign: I18nManager.isRTL ? 'right' : 'left',
    height: '100%',
  },
  modalText: {
    fontSize: FONT_16,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    color: colors.BLACK,
    textAlign: 'center',
  },
  popupContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: colors.BG_COLOR_WHITE,
    paddingBottom: HEIGHT_30,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: colors.BLACK_TRANS_BG,
    justifyContent: 'flex-end',
  },
  star: {
    width: widthPixel(25),
    height: widthPixel(24),
  },
  item: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 37,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 3,
  },
  itemText: {
    fontSize: FONT_10,
    fontFamily: RUBIK_REGULAR_FONT,
    textAlign: 'center',
  },
  separatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: HEIGHT_15,
  },
  separatorText: {
    marginHorizontal: HORIZONTAL_5,
    fontSize: FONT_16,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    color: colors.BLACK,
    bottom: VERTICAL_10,
  },
  characterCountContainer: {
    position: 'absolute',
    bottom: VERTICAL_15,
    right: isTablet ? 10 : I18nManager.isRTL ? WIDTH_17 : 10,
  },
  characterCountText: {
    fontSize: FONT_13,
    fontFamily: NOTOSANS_LIGHT_FONT,
    color: colors.OOREDDO_LIGHT_GREY,
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    marginTop: VERTICAL_18,
    marginHorizontal: 3,
  },
  dashedLineView: {
    marginTop: HEIGHT_20,
  },
  listView: {
    marginTop: HEIGHT_17,
    marginHorizontal: WIDTH_29,
  },
});

export default RatingModalNew;
