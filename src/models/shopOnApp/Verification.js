import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Appearance,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {useTranslation} from 'react-i18next';
import {
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_1,
  BORDER_RADIUS_3,
  BORDER_RADIUS_10,
  BORDER_RADIUS_31,
  FONT_13,
  FONT_16,
  SCALE_SIZE_0,
  HORIZONTAL_20,
  HORIZONTAL_13,
  HORIZONTAL_14,
  HORIZONTAL_10,
  VERTICAL_10,
  VERTICAL_20,
  FONT_21,
  HORIZONTAL_5,
  FONT_15,
  WIDTH_27,
  HORIZONTAL_26,
  HORIZONTAL_15,
  HORIZONTAL_12,
} from '../../../../selfcarern/src/resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {useNavigation} from '@react-navigation/native';
import {verticalScale} from '../../commonHelper/scalingUtils';
import {
  OOREDOO_REGULAR_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../basic/ImageComponent';
import DatePicker from 'react-native-date-picker';
import momemt from 'moment';
import ItemsListModal from './ItemsListModal';
const Verification = ({
  verifyWithPaciObj,
  verifyWithOtherObj,
  paciError,
  otherError,
}) => {
  const [isCollapsed, setIsCollapsed] = useState('1');
  const [text, setText] = useState('');
  const [firstNametext, setfirstNametext] = useState('');
  const [lastNametext, setlastNametext] = useState('');
  const [civilidtext, setcivilidtext] = useState('');
  const [nationalitytext, setnationalitytext] = useState('');
  const [civilidexytext, setcivilidexytext] = useState('');
  const {t} = useTranslation();
  const [showLeftContent, setShowLeftContent] = useState(true);
  const [showRightContent, setShowRightContent] = useState(false);
  const navigation = useNavigation();
  const [paciCivilIdErrorShow, setpaciCivilIdErrorShow] = useState(false);
  const imageSource = require('../../assets/o2.png');
  const unselectimageSource = require('../../assets/verification_sim.png');
  const [gender, setgender] = useState('');
  const [dob, setdob] = useState('');
  const [dobobj, setdobobj] = useState('');
  const [civilidobj, setcivilidobj] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const [openNationalityModal, setOpenNationalityModal] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [dateType, setDateType] = useState('');

  const handleLeftButtonClick = () => {
    setShowLeftContent(true);
    setShowRightContent(false);
  };

  const handleRightButtonClick = () => {
    setShowLeftContent(false);
    setShowRightContent(true);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const selectItem = value => {
    setOpenNationalityModal(false);
    console.log('value', value);
  };

  useEffect(() => {
    verifyWithPaciObj({enable: isCollapsed, civilid: text});
  }, []);

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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <View style={styles.contentContainer}>
          <PaperProvider theme={theme}>
            <Collapse
              style={[styles.cardView]}
              touchableOpacityProps={styles.opactiy}
              isExpanded={isCollapsed === '1' ? true : false}
              onToggle={() => {
                setIsCollapsed(isCollapsed === '1' ? '' : '1');
              }}>
              <CollapseHeader>
                <View style={styles.header}>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_27}
                    iheight={WIDTH_27}
                    source={
                      global.shopOnAppSettings?.verifypaciconfigurations
                        ?.verify_paci_image
                    }
                    resizeMode={'contain'}
                    style={styles.headerImage}
                  />
                  <View style={styles.paciView}>
                    <Text style={styles.textLeft}>
                      {
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.verify_with_paci_title
                      }
                    </Text>
                    <Text style={styles.textLeftTwo} numberOfLines={2}>
                      {
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.verify_with_paci_desc
                      }
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setIsCollapsed(isCollapsed === '1' ? '' : '1');
                    }}>
                    <Image
                      source={
                        isCollapsed === '1' ? imageSource : unselectimageSource
                      }
                      style={styles.toggleImage}
                    />
                  </TouchableOpacity>
                </View>
              </CollapseHeader>
              <CollapseBody>
                <View style={styles.verifyPaci}>
                  <TextInput
                    label={
                      global.shopOnAppSettings?.verifypaciconfigurations
                        ?.enter_civili_id
                    }
                    mode="outlined"
                    keyboardType="numeric"
                    value={text}
                    onChangeText={text => {
                      verifyWithPaciObj({enable: isCollapsed, civilid: text});
                      setText(text);
                    }}
                    style={styles.input}
                    maxLength={12}
                    theme={{
                      colors: {
                        placeholder:
                          paciError != null &&
                          paciError != undefined &&
                          paciError != ''
                            ? colors.OOREDOO_RED
                            : colors.OOREDDO_GREY,
                        text: colors.OOREDDO_GREY,
                        primary: colors.OOREDDO_GREY,
                        underlineColor: 'transparent',
                        background:
                          paciError != null &&
                          paciError != undefined &&
                          paciError != ''
                            ? colors.OOREDOO_RED
                            : colors.OOREDDO_GREY,
                      },
                    }}
                    onBlur={() => {
                      if (text.length === 12) {
                        setpaciCivilIdErrorShow(false);
                      } else {
                        setpaciCivilIdErrorShow(true);
                      }
                    }}
                  />
                  {paciError != null &&
                  paciError !== undefined &&
                  paciError !== '' ? (
                    <Text style={styles.errorMesssage}>{paciError}</Text>
                  ) : null}
                  <View style={styles.bottomView}>
                    <Text style={styles.bottomText}>
                      {
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.verify_paci_tooltip
                      }
                    </Text>
                  </View>
                </View>
              </CollapseBody>
            </Collapse>

            <Collapse
              style={[styles.cardViewLater, !isCollapsed]}
              touchableOpacityProps={styles.opactiy}
              isExpanded={isCollapsed === '2' ? true : false}
              onToggle={() => {
                setIsCollapsed(isCollapsed === '2' ? '' : '2');
              }}>
              <CollapseHeader>
                <View style={styles.header}>
                  <ImageComponent
                    type="image"
                    iwidth={WIDTH_27}
                    iheight={WIDTH_27}
                    source={
                      global.shopOnAppSettings?.verifypaciconfigurations
                        ?.shop_verify_later_image
                    }
                    resizeMode={'contain'}
                    style={styles.headerImage}
                  />
                  <View style={styles.paciView}>
                    <Text style={styles.textLeft}>
                      {
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.verify_later_title
                      }
                    </Text>
                    <Text style={styles.textLeftTwo} numberOfLines={2}>
                      {
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.verify_later_desc
                      }
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setgender('');
                      setIsCollapsed(isCollapsed === '2' ? '' : '2');
                    }}>
                    <Image
                      source={
                        isCollapsed === '2' ? imageSource : unselectimageSource
                      }
                      style={styles.toggleImage}
                    />
                  </TouchableOpacity>
                </View>
              </CollapseHeader>
              <CollapseBody>
                <View style={styles.verifyPaci}>
                  <TextInput
                    label={
                      global.shopOnAppSettings?.verifypaciconfigurations
                        ?.enter_first_name_label
                    }
                    mode="outlined"
                    value={firstNametext}
                    maxLength={50}
                    onChangeText={text => {
                      setfirstNametext(text);
                      verifyWithOtherObj({
                        enable: isCollapsed,
                        firstName: firstNametext,
                        lastName: lastNametext,
                        civilId: civilidtext,
                        nationality: nationalitytext,
                        gender: gender,
                        dob: dobobj,
                        civilexy: civilidexytext,
                      });
                    }}
                    style={styles.input}
                    theme={{
                      colors: {
                        placeholder: colors.OOREDDO_GREY,
                        text: colors.BLACK,
                        primary: colors.OOREDDO_GREY,
                        underlineColor: 'transparent',
                        background: colors.OOREDDO_GREY,
                      },
                    }}
                  />
                  <View style={styles.lastNameView}>
                    <TextInput
                      label={
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.enter_last_name_label
                      }
                      mode="outlined"
                      value={lastNametext}
                      maxLength={50}
                      onChangeText={text => {
                        setlastNametext(text);
                        verifyWithOtherObj({
                          enable: isCollapsed,
                          firstName: firstNametext,
                          lastName: lastNametext,
                          civilId: civilidtext,
                          nationality: nationalitytext,
                          gender: gender,
                          dob: dobobj,
                          civilexy: civilidexytext,
                        });
                      }}
                      style={styles.input}
                      theme={{
                        colors: {
                          placeholder: colors.OOREDDO_GREY,
                          text: colors.BLACK,
                          primary: colors.OOREDDO_GREY,
                          underlineColor: 'transparent',
                          // background:
                          //   paciError != null &&
                          //   paciError != undefined &&
                          //   paciError != '' &&
                          //   paciCivilIdErrorShow === true
                          //     ? colors.OOREDOO_RED
                          //     : colors.OOREDDO_GREY,
                        },
                      }}
                    />
                  </View>
                  <View style={styles.emailView}>
                    <TextInput
                      label={
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.enter_civili_id
                      }
                      mode="outlined"
                      value={civilidtext}
                      maxLength={12}
                      onChangeText={text => {
                        setcivilidtext(text);
                        verifyWithOtherObj({
                          enable: isCollapsed,
                          firstName: firstNametext,
                          lastName: lastNametext,
                          civilId: civilidtext,
                          nationality: nationalitytext,
                          gender: gender,
                          dob: dobobj,
                          civilexy: civilidexytext,
                        });
                      }}
                      style={styles.input}
                      theme={{
                        colors: {
                          placeholder: colors.OOREDDO_GREY,
                          text: colors.BLACK,
                          primary: colors.OOREDDO_GREY,
                          underlineColor: 'transparent',
                          // background:
                          //   paciError != null &&
                          //   paciError != undefined &&
                          //   paciError != '' &&
                          //   paciCivilIdErrorShow === true
                          //     ? colors.OOREDOO_RED
                          //     : colors.OOREDDO_GREY,
                        },
                      }}
                    />
                  </View>
                  <View style={styles.governorateView}>
                    <TextInput
                      label={''}
                      mode="outlined"
                      value={
                        nationalitytext ||
                        global.shopOnAppSettings?.verifypaciconfigurations
                          ?.nationality_label
                      }
                      caretHidden={true}
                      onChangeText={text => {
                        setnationalitytext(text);
                        verifyWithOtherObj({
                          enable: isCollapsed,
                          firstName: firstNametext,
                          lastName: lastNametext,
                          civilId: civilidtext,
                          nationality: nationalitytext,
                          gender: gender,
                          dob: dobobj,
                          civilexy: civilidexytext,
                        });
                      }}
                      style={styles.input}
                      right={
                        <TextInput.Icon
                          name="chevron-down"
                          style={styles.iconStyle}
                        />
                      }
                      onFocus={() => {
                        setOpenNationalityModal(true);
                      }}
                      theme={{
                        colors: {
                          placeholder: colors.OOREDDO_GREY,
                          text: colors.BLACK,
                          primary: colors.OOREDDO_GREY,
                          underlineColor: 'transparent',
                          // background:
                          //   paciError != null &&
                          //   paciError != undefined &&
                          //   paciError != '' &&
                          //   paciCivilIdErrorShow === true
                          //     ? colors.OOREDOO_RED
                          //     : colors.OOREDDO_GREY,
                        },
                      }}
                    />
                  </View>
                  <View
                    style={{
                      marginTop: VERTICAL_20,
                      height: heightPixel(20),
                      flexDirection: 'row',
                      left: 2,
                    }}>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setgender('male');
                        verifyWithOtherObj({
                          enable: isCollapsed,
                          firstName: firstNametext,
                          lastName: lastNametext,
                          civilId: civilidtext,
                          nationality: nationalitytext,
                          gender: gender,
                          dob: dobobj,
                          civilexy: civilidexytext,
                        });
                      }}>
                      <Image
                        source={
                          gender === 'male' ? imageSource : unselectimageSource
                        }
                        style={{
                          width: widthPixel(20),
                          height: heightPixel(20),
                          resizeMode: 'contain',
                        }}
                      />
                      <Text
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 5,
                          fontFamily:
                            gender === 'male'
                              ? RUBIK_SEMIBOLD_FONT
                              : RUBIK_REGULAR_FONT,
                          fontSize: FONT_15,
                        }}>
                        {
                          global.shopOnAppSettings?.verifypaciconfigurations
                            ?.male_label
                        }
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        left: 10,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setgender('female');
                        verifyWithOtherObj({
                          enable: isCollapsed,
                          firstName: firstNametext,
                          lastName: lastNametext,
                          civilId: civilidtext,
                          nationality: nationalitytext,
                          gender: gender,
                          dob: dobobj,
                          civilexy: civilidexytext,
                        });
                      }}>
                      <Image
                        source={
                          gender === 'female'
                            ? imageSource
                            : unselectimageSource
                        }
                        style={{
                          width: widthPixel(20),
                          height: heightPixel(20),
                          resizeMode: 'contain',
                          // top: 2,
                        }}
                      />
                      <Text
                        style={{
                          flexDirection: 'row',
                          marginHorizontal: 5,
                          fontFamily:
                            gender === 'female'
                              ? RUBIK_SEMIBOLD_FONT
                              : RUBIK_REGULAR_FONT,
                          fontSize: FONT_15,
                        }}>
                        {
                          global.shopOnAppSettings?.verifypaciconfigurations
                            ?.female_label
                        }
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.textContainer}>
                    <View style={styles.governorateView}>
                      <TextInput
                        label={
                          dobobj ||
                          global.shopOnAppSettings?.verifypaciconfigurations
                            ?.date_of_birth_label
                        }
                        mode="outlined"
                        caretHidden={true}
                        value={
                          dobobj != null && dobobj != undefined && dobobj != ''
                            ? dobobj
                            : t('verifylaterdateformat')
                        }
                        onChangeText={text => {
                          setdobobj(text);
                          verifyWithOtherObj({
                            enable: isCollapsed,
                            firstName: firstNametext,
                            lastName: lastNametext,
                            civilId: civilidtext,
                            nationality: nationalitytext,
                            gender: gender,
                            dob: dobobj,
                            civilexy: civilidexytext,
                          });
                        }}
                        style={styles.input}
                        right={
                          <TextInput.Icon
                            name="calendar-month"
                            style={styles.iconStyle}
                          />
                        }
                        onFocus={() => {
                          setDateType('dob');
                          setOpenPicker(true);
                        }}
                      />
                    </View>
                    <View style={styles.governorateView}>
                      <TextInput
                        label={
                          civilidobj ||
                          global.shopOnAppSettings?.verifypaciconfigurations
                            ?.civilid_expiry_label
                        }
                        mode="outlined"
                        caretHidden={true}
                        value={
                          civilidobj != null &&
                          civilidobj != undefined &&
                          civilidobj != ''
                            ? civilidobj
                            : t('verifylaterdateformat')
                        }
                        onChangeText={text => {
                          setcivilidexytext(text);
                          verifyWithOtherObj({
                            enable: isCollapsed,
                            firstName: firstNametext,
                            lastName: lastNametext,
                            civilId: civilidtext,
                            nationality: nationalitytext,
                            gender: gender,
                            dob: dobobj,
                            civilexy: civilidexytext,
                          });
                        }}
                        style={styles.input}
                        right={
                          <TextInput.Icon
                            name="calendar-month"
                            style={styles.iconStyle}
                          />
                        }
                        onFocus={() => {
                          setDateType('civilid');
                          setOpenPicker(true);
                        }}
                      />
                    </View>
                  </View>
                  {openPicker && (
                    <DatePicker
                      modal
                      textColor={
                        Appearance.getColorScheme() === 'dark'
                          ? colors.WHITE
                          : colors.BLACK
                      }
                      mode={'date'}
                      open={openPicker}
                      date={dateSelected}
                      minimumDate={
                        new Date(momemt().subtract('100 * 365 + 25', 'day'))
                      }
                      maximumDate={
                        new Date(momemt().subtract('18 * 365 + 6', 'day'))
                      }
                      onConfirm={date => {
                        var value = date.setTime(
                          date.getTime() + date.getTimezoneOffset() * 60 * 1000
                        );
                        const newDate = momemt(value).format('MM/DD/YY');
                        setOpenPicker(false);
                        if (dateType === 'dob') {
                          setdobobj(newDate);
                        } else {
                          setcivilidobj(newDate);
                        }
                      }}
                      onCancel={() => {
                        setOpenPicker(false);
                      }}
                    />
                  )}
                  {openNationalityModal && (
                    <ItemsListModal
                      type={'governorate'}
                      onTryAgainClick={selectItem}
                      onDismiss={() => {
                        setOpenNationalityModal(false);
                      }}
                    />
                  )}
                </View>
              </CollapseBody>
            </Collapse>
          </PaperProvider>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BORDER_RADIUS_10,
  },
  contentContainer: {
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: heightPixel(50),
    paddingRight: HORIZONTAL_20,
    marginVertical: VERTICAL_10,
    marginBottom: 10,
  },
  headerImage: {
    marginLeft: HORIZONTAL_13,
  },
  paciView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: HORIZONTAL_26,
  },
  textLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
  },
  textLeftTwo: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    fontWeight: '400',
    width: widthPixel(237),
  },
  toggleImage: {
    width: widthPixel(20),
    height: heightPixel(20),
    left: verticalScale(20),
    resizeMode: 'contain',
  },
  verifyPaci: {
    flexDirection: 'column',
    marginLeft: HORIZONTAL_12,
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_20,
  },
  input: {
    width: SCREEN_WIDTH - widthPixel(57),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
  },
  bottomView: {
    backgroundColor: '#B4F6EB',
    borderRadius: BORDER_RADIUS_31,
    width: SCREEN_WIDTH - widthPixel(52),
    height: heightPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_10,
  },
  bottomText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
  },
  lastNameView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  emailView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  governorateView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  areaView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  additionalView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  textContainer: {
    flex: 1,
  },
  iconStyle: {
    marginRight: HORIZONTAL_10,
    width: widthPixel(30),
    height: widthPixel(30),
    marginTop: HORIZONTAL_15,
  },
  cardView: {
    borderRadius: BORDER_RADIUS_10,
    width: SCREEN_WIDTH - widthPixel(26),
    borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 5,
    marginHorizontal: HORIZONTAL_13,
    backgroundColor: 'white',
  },
  cardViewLater: {
    borderRadius: BORDER_RADIUS_10,
    width: SCREEN_WIDTH - widthPixel(26),
    borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 5,
    marginHorizontal: HORIZONTAL_13,
    backgroundColor: 'white',
    marginVertical: VERTICAL_20,
    // top: VERTICAL_10,
  },
  errorMesssage: {
    flexDirection: 'row',
    textAlign: 'left',
    fontSize: FONT_13,
    lineHeight: FONT_21,
    marginStart: HORIZONTAL_5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: colors.OOREDOO_RED,
    fontFamily: RUBIK_LIGHT_FONT,
    // top: -VERTICAL_20,
  },
  opactiy: {
    activeOpacity: 1,
  },
});

export default Verification;
