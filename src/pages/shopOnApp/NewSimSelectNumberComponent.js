import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  I18nManager,
  Platform,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_31,
  FONT_12,
  FONT_16,
  HEIGHT_28,
  HORIZONTAL_10,
  HORIZONTAL_13,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_3,
  WIDTH_155,
  WIDTH_200,
  WIDTH_4,
  WIDTH_8,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {useTranslation} from 'react-i18next';
import colors from '../../resources/styles/colors';
import NewSimCategoryButton from './NewSimCategoryButton';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import Toast from 'react-native-simple-toast';

const ARROW_DOWN_UP = require('../../assets/down.png');
const ARROW_DOWN_DOWN = require('../../assets/up.png');
const DONE_ARROW = require('../../assets/done_right.png');

const NewSimSelectNumberComponent = ({
  itemValue,
  setitemValue,
  NewSimSelectNumberComponentData,
  onboardingtype,
  setonboardingtype,
  parentProduct,
  childProduct,
  datacompleted,
  setdatacompleted,
  scrollViewRef,
  focusedFun,
  verificationCompleted,
  settooglestatusnumber,
  reloadList,
  setreloadList,
  setPortInOption,
  portInOption,
  setIsTNCAccepted,
  isTNCAccepted,
  setenteredNumberRes,
  enteredNumberRes,
}) => {
  const {t} = useTranslation();
  const [enableContent, setenableContent] = useState(false);
  const [itemSelect, setitemSelect] = useState('');
  const [isCollapsed, setisCollapsed] = useState(false);
  const [IsnumberSelect, setIsnumberSelect] = useState(false);
  const [searchNumbersList, setSearchNumbersList] = useState([]);
  const [availableNumberList, setAvailableNumberList] = useState([]);
  const [inputText, setInputText] = useState('');
  const [selindex, setselIndex] = useState(0);
  const [searchStatus, setsearchStatus] = useState(0);
  const [availableStatus, setAvailableNumberStatus] = useState(0);

  useEffect(() => {
    if (datacompleted?.contactdetail) {
      setisCollapsed(true);
      focusedFun('selectnumberExpanded');
    }
  }, [datacompleted?.contactdetail]);

  const clickRadioButton = (value, selectedRadio) => {
    setonboardingtype(selectedRadio?.onboardingtype);
    setIsnumberSelect(false);
    // setitemValue(value);
    setitemSelect(value);
    setenteredNumberRes(null);
  };

  return (
    <View style={styles.Main}>
      <Collapse
        style={[styles.cardView, !isCollapsed && styles.cardView2]}
        touchableOpacityProps={styles.opactiy}
        isExpanded={isCollapsed}
        onToggle={isExpanded => {
          if (!isExpanded) {
            setenteredNumberRes(null);
            // setIsnumberSelect(false);
            setitemSelect('');
            if (
              global.NewSimNumberSliderItem == null &&
              global.NewSimNumberSliderItem == undefined
            ) {
              setdatacompleted(prevState => ({
                ...prevState,
                selectnumber: false,
              }));
            }
          }
          if (IsnumberSelect) {
            focusedFun('selectnumber');
          }
          settooglestatusnumber(isExpanded);
          setisCollapsed(isExpanded);
        }}>
        <CollapseHeader>
          <View
            style={[
              styles.Container,
              {display: enableContent ? 'flex' : 'flex'},
            ]}>
            <TouchableOpacity
              style={{
                flex: 1,
                height: '100%',
                justifyContent: 'center',
              }}
              activeOpacity={1}
              onPress={() => {
                if (!datacompleted?.contactdetail) {
                  Toast.show(t('pecdf'));
                  return;
                } else {
                  if (isCollapsed) {
                    setenteredNumberRes(null);
                    setitemSelect('');
                    if (
                      global.NewSimNumberSliderItem == null &&
                      global.NewSimNumberSliderItem == undefined
                    ) {
                      setdatacompleted(prevState => ({
                        ...prevState,
                        selectnumber: false,
                      }));
                    }
                  }
                  if (IsnumberSelect) {
                    focusedFun('selectnumber');
                  }
                  settooglestatusnumber(!isCollapsed);
                  setisCollapsed(!isCollapsed);
                }
              }}>
              <Text style={styles.ContentText}>
                {NewSimSelectNumberComponentData?.select_your_number}
              </Text>
            </TouchableOpacity>
            <TouchableHighlight
              style={styles.arrowTouchEffect}
              underlayColor={colors.OOREDDO_COLLAPSE_UNDERLEY}
              onPress={() => {
                if (!datacompleted?.contactdetail) {
                  Toast.show(t('pecdf'));
                  return;
                } else {
                  if (isCollapsed) {
                    setenteredNumberRes(null);
                    setitemSelect('');
                    if (
                      global.NewSimNumberSliderItem == null &&
                      global.NewSimNumberSliderItem == undefined
                    ) {
                      setdatacompleted(prevState => ({
                        ...prevState,
                        selectnumber: false,
                      }));
                    }
                  }
                  if (IsnumberSelect) {
                    focusedFun('selectnumber');
                  }
                  settooglestatusnumber(!isCollapsed);
                  setisCollapsed(!isCollapsed);
                }
              }}>
              {IsnumberSelect || enteredNumberRes?.transaction ? (
                isCollapsed || !isCollapsed ? (
                  <Image
                    source={DONE_ARROW}
                    resizeMode={'contain'}
                    style={styles.vectorIconUp}
                  />
                ) : (
                  <Image
                    source={isCollapsed ? ARROW_DOWN_UP : ARROW_DOWN_DOWN}
                    style={styles.imageContainer}
                  />
                )
              ) : (
                <Image
                  source={isCollapsed ? ARROW_DOWN_UP : ARROW_DOWN_DOWN}
                  style={styles.imageContainer}
                />
              )}
            </TouchableHighlight>
          </View>
        </CollapseHeader>
        <CollapseBody>
          <View>
            <NewSimCategoryButton
              clickRadioButton={clickRadioButton}
              NewSimSelectNumberComponentData={NewSimSelectNumberComponentData}
              setIsnumberSelect={setIsnumberSelect}
              parentProduct={parentProduct}
              childProduct={childProduct}
              datacompleted={datacompleted}
              setdatacompleted={setdatacompleted}
              focusedFun={focusedFun}
              verificationCompleted={verificationCompleted}
              reloadList={reloadList}
              setreloadList={setreloadList}
              setPortInOption={setPortInOption}
              portInOption={portInOption}
              setIsTNCAccepted={setIsTNCAccepted}
              isTNCAccepted={isTNCAccepted}
              enteredNumberRes={enteredNumberRes}
              searchNumbersList={searchNumbersList}
              setSearchNumbersList={setSearchNumbersList}
              availableNumberList={availableNumberList}
              setAvailableNumberList={setAvailableNumberList}
              inputText={inputText}
              setInputText={setInputText}
              selindex={selindex}
              setselIndex={setselIndex}
              searchStatus={searchStatus}
              setsearchStatus={setsearchStatus}
              availableStatus={availableStatus}
              setAvailableNumberStatus={setAvailableNumberStatus}
            />
          </View>
          {itemSelect == '' ? (
            <View
              style={[
                styles.bottomView,
                {
                  backgroundColor:
                    NewSimSelectNumberComponentData?.selectnumber_tooltip_bgcolor,
                },
              ]}>
              <Text
                numberOfLines={1}
                style={[
                  styles.bottomText,
                  {
                    color:
                      NewSimSelectNumberComponentData?.selectnumber_tooltip_textcolor,
                  },
                ]}>
                {NewSimSelectNumberComponentData?.selectnumber_tooltip}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </CollapseBody>
      </Collapse>
    </View>
  );
};

// Define the styles for the app components
const styles = StyleSheet.create({
  Main: {
    // flex: 1,
    justifyContent: 'center',
    // backgroundColor: 'white',
    marginVertical: VERTICAL_20,
  },
  Container: {
    // borderWidth: 1,
    height: heightPixel(61),
    marginHorizontal: HORIZONTAL_5,
    borderRadius: 5,
    backgroundColor: 'white',
    // borderColor: colors.SILVER,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // shadowOffset: { width: 0, height: 3 },
    // shadowColor: '#0000001A',
    // shadowOpacity: 0.5,
    // shadowRadius: 2,
    // elevation: 3,
  },
  ContentText: {
    marginHorizontal: HORIZONTAL_10,
    fontSize: FONT_16,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    textAlign: 'left',
    width: WIDTH_200,
  },
  arrowTouchEffect: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
  },
  imageContainer: {
    height: heightPixel(22),
    width: widthPixel(22),
  },
  cardView:
    Platform.OS === 'ios'
      ? {
          backgroundColor: colors.BG_COLOR_WHITE,
          borderRadius: BORDER_RADIUS_10,
          //padding: VERTICAL_10,
          width: isTablet ? SCREEN_WIDTH / 1.3 : SCREEN_WIDTH - widthPixel(26),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(220),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(800),
          borderWidth: 0.5,
          borderColor: colors.SILVER,
          elevation: 2,
          marginHorizontal: isTablet ? 0 : HORIZONTAL_13,
          shadowOpacity: 0.25,
          // shadowColor: colors.GREY,
          shadowRadius: BORDER_RADIUS_10,
          right: isTablet ? widthPixel(2) : 0,
          shadowOffset: {width: 0, height: 2},
          // marginVertical: VERTICAL_20,
        }
      : {
          backgroundColor: colors.BG_COLOR_WHITE,
          borderRadius: BORDER_RADIUS_10,
          //padding: VERTICAL_10,
          width: isTablet ? SCREEN_WIDTH / 1.3 : SCREEN_WIDTH - widthPixel(26),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(220),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(800),
          borderWidth: 0.5,
          borderColor: colors.SILVER,
          elevation: 4,
          marginHorizontal: isTablet ? 0 : HORIZONTAL_13,
          shadowOpacity: 0.25,
          // shadowColor: colors.GREY,
          shadowRadius: BORDER_RADIUS_10,
          right: isTablet ? widthPixel(2) : 0,
          shadowOffset: {width: 0, height: 2},
          // marginVertical: VERTICAL_20,
        },
  specialDiscount: {
    backgroundColor: '#B4F6EB',
    borderRadius: 31,
    height: HEIGHT_28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: VERTICAL_10,
  },
  specialDiscountText: {
    fontSize: FONT_12,
    fontFamily: RUBIK_LIGHT_FONT,
    color: colors.BLACK,
  },
  vectorIconUp: {
    width: widthPixel(22),
    height: heightPixel(22),
    // bottom: VERTICAL_3,
    // right: I18nManager.isRTL ? WIDTH_8 : WIDTH_4,
  },
  opactiy: {
    activeOpacity: 1,
  },
  bottomView: {
    // backgroundColor: '#B4F6EB',
    borderRadius: BORDER_RADIUS_31,
    width: widthPixel(324),
    height: heightPixel(28),
    // marginTop: VERTICAL_20,
    marginBottom: VERTICAL_20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    left: FONT_12,
  },
  bottomText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_12,
    //color: colors.BLACK,
    width: isTablet
      ? Platform.OS == 'android'
        ? tabletMargin() + widthPixel(220)
        : tabletMargin() + widthPixel(170)
      : widthPixel(290),
    marginStart: HORIZONTAL_10,
  },
});

export default NewSimSelectNumberComponent;
