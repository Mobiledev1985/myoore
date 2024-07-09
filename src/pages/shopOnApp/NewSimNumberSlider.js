import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  Image,
  I18nManager,
  TouchableOpacity,
  Platform,
  FlatList,
} from 'react-native';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  FONT_10,
  FONT_13,
  FONT_15,
  FONT_16,
  FONT_22,
  FONT_24,
  HEIGHT_30,
  HORIZONTAL_10,
  HORIZONTAL_160,
  HORIZONTAL_2,
  HORIZONTAL_20,
  HORIZONTAL_5,
  VERTICAL_8,
  VERTICAL_10,
  VERTICAL_2,
  VERTICAL_20,
  WIDTH_10,
  WIDTH_18,
  WIDTH_24,
  WIDTH_25,
  WIDTH_30,
  WIDTH_4,
  WIDTH_40,
} from '../../resources/styles/responsive';
import {verticalScale} from '../../commonHelper/scalingUtils';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import ImageComponent from '../../models/basic/ImageComponent';
import {useTranslation} from 'react-i18next';
import ErrorComponent from '../../models/basic/ErrorComponent';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import colors from '../../resources/styles/colors';
import ShowNumberWithAnimation from '../../UIComponent/p_shop/ShopNumberAnimation';
import Swiper from 'react-native-swiper';
import {RecordlogEvents} from '../../analytics/RecordEvents';
import {
  SCREEN_WIDTH,
  isTablet,
} from '../../resources/styles/normalizedimension';

const ITEM_WIDTH = SCREEN_WIDTH / 2; // Assuming 2 columns
const ITEM_HEIGHT = 100; // Example height, adjust as needed
const ITEMS_PER_PAGE = 8; // 4 rows * 2 columns
const ITEMS_ROWS_COLUMNS = 8; // 4 rows * 2 columns
const PREMIUM_ICON = require('../../assets/premium.png');

const NewSimNumberSlider = ({
  numberList,
  status,
  setIsnumberSelect,
  datacompleted,
  setdatacompleted,
  childProduct,
  parentProduct,
  selindex,
  setIsDataFilled,
  isTabSwitched,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isItemClick, setIsItemClick] = useState(false);
  const [previousSelectedId, setPreviousSelectedId] = useState(null);
  const [numberListData, setNumberListData] = useState([]);
  const [loader, setLoader] = useState(true);
  const {t} = useTranslation();

  React.useEffect(() => {
    if (
      global.NewSimNumberSliderItem != null &&
      global.NewSimNumberSliderItem != undefined &&
      global.NewSimNumberSliderItem != ''
    ) {
      try {
        setSelectedItem(global.NewSimNumberSliderItem);
        setIsnumberSelect(true);
        setIsItemClick(true);
      } catch (e) {}
    }
  }, [isItemClick]);

  useEffect(() => {
    setLoader(true);
    let newDataList = [];
    Array.from({
      length: Math.ceil(numberList?.length / ITEMS_PER_PAGE),
    }).map((parent, pIndex) => {
      let newItem = numberList.slice(
        pIndex * ITEMS_PER_PAGE,
        (pIndex + 1) * ITEMS_PER_PAGE
      );
      newDataList.push(newItem);
    });
    setNumberListData(newDataList);
    if (
      numberList &&
      numberList?.length > 8 &&
      I18nManager.isRTL &&
      Platform.OS === 'android'
    ) {
      setCurrentPage(Math.ceil(numberList?.length / ITEMS_PER_PAGE) - 1);
    } else {
      setCurrentPage(0);
    }
    setTimeout(() => {
      setLoader(false);
    }, 500);
  }, [numberList]);

  const SelectNumberCTevent = number => {
    try {
      RecordlogEvents('Select Number', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Selection type': 'new',
        Number: '965' + number,
        Migration: '',
        Operator: '',
      });
    } catch (e) {}
  };

  useEffect(() => {
    if (isTabSwitched) {
      setSelectedItem(null);
    }
  }, [isTabSwitched]);

  const handleScroll = event => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    // Adjust the calculation to account for item widths and margins
    //const page = Math.floor(scrollPosition / (SCREEN_WIDTH * ITEMS_PER_PAGE));

    const page = Math.ceil(scrollPosition / SCREEN_WIDTH);
    setCurrentPage(page);
  };

  const onScrollEnd = e => {
    let contentOffset = e.nativeEvent.contentOffset;
    let viewSize = e.nativeEvent.layoutMeasurement;
    // Divide the horizontal offset by the width of the view to see which page is visible
    let pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentPage(pageNum);
  };

  const renderList = item => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.cardNumberBox}
        onPress={() => {
          setPreviousSelectedId(selectedItem?.MSISDN);
          if (selectedItem?.MSISDN === item?.MSISDN) {
            global.NewSimNumberSliderItem = null;
            setSelectedItem(null);
            setdatacompleted(prevState => ({
              ...prevState,
              selectnumber: false,
            }));
            setIsnumberSelect(false);
            setIsItemClick(false);
            setIsDataFilled(false);
          } else {
            SelectNumberCTevent(item?.MSISDN);
            var selectedItem = {
              ...item,
              className:
                childProduct != null &&
                childProduct !== undefined &&
                childProduct !== ''
                  ? childProduct?.numberclass[selindex]
                  : parentProduct?.numberclass[selindex],
            };
            global.NewSimNumberSliderItem = selectedItem;
            if (
              global.contactinfoEmail != null &&
              global.contactinfoEmail != undefined &&
              global.contactinfoEmail != ''
            ) {
              if (
                global.formData != null &&
                global.formData != undefined &&
                global.formData != '' &&
                global.formData.itemValue == 'physicalsim'
              ) {
                if (
                  global.formData?.formData.firstname == null ||
                  global.formData?.formData.firstname == undefined ||
                  global.formData?.formData.firstname == ''
                ) {
                  setdatacompleted(prevState => ({
                    ...prevState,
                    choosesim: false,
                    selectnumber: true,
                  }));
                } else {
                  if (
                    global.summaryedittosim != null &&
                    global.summaryedittosim != undefined &&
                    global.summaryedittosim != '' &&
                    global.summaryedittosim == 'true'
                  ) {
                    setdatacompleted(prevState => ({
                      ...prevState,
                      selectnumber: true,
                      choosesim: true,
                      contactdetail: true,
                    }));
                  } else {
                    setdatacompleted(prevState => ({
                      ...prevState,
                      choosesim: true,
                      selectnumber: true,
                    }));
                  }
                }
              } else {
                setdatacompleted(prevState => ({
                  ...prevState,
                  choosesim: true,
                  selectnumber: true,
                  contactdetail: true,
                }));
              }
            } else {
              if (
                global.summaryedittosim != null &&
                global.summaryedittosim != undefined &&
                global.summaryedittosim != '' &&
                global.summaryedittosim == 'true'
              ) {
                setdatacompleted(prevState => ({
                  ...prevState,
                  selectnumber: true,
                  choosesim: true,
                  contactdetail: true,
                }));
              } else {
                setdatacompleted(prevState => ({
                  ...prevState,
                  selectnumber: true,
                }));
              }
            }

            setIsDataFilled(true);
            setSelectedItem(item);
            setIsnumberSelect(true);
            setIsItemClick(true);
          }
        }}>
        <ShowNumberWithAnimation
          item={item}
          isSelectedId={selectedItem?.MSISDN == item?.MSISDN}
          isPreviousSelectedId={previousSelectedId == item?.MSISDN}
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      {numberListData?.length > 0 && status == '0' && !loader ? (
        <View style={styles.container}>
          <FlatList
            data={numberListData}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            pagingEnabled
            initialNumToRender={numberListData?.length}
            showsHorizontalScrollIndicator={false}
            snapToInterval={
              isTablet
                ? SCREEN_WIDTH / 1.23 -
                  widthPixel(Platform.OS === 'android' ? 61 : 64)
                : SCREEN_WIDTH - widthPixel(Platform.OS === 'android' ? 61 : 64)
            }
            decelerationRate={Platform.OS === 'ios' ? 'fast' : 'normal'}
            onMomentumScrollEnd={onScrollEnd}
            renderItem={(pItem, pageIndex) => (
              <View key={pageIndex} style={[styles.page]}>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  {pItem?.item?.map(
                    (item, index) => index < 4 && renderList(item)
                  )}
                </View>
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                  }}>
                  {pItem?.item?.map(
                    (item, index) => index >= 4 && renderList(item)
                  )}
                </View>
              </View>
            )}
          />
          <View style={styles.pagination}>
            {Array.from({
              length: Math.ceil(numberList?.length / ITEMS_ROWS_COLUMNS),
            }).map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  {
                    backgroundColor:
                      index === currentPage ? colors.RED : '#D3D3D3',
                    width: index === currentPage ? WIDTH_25 : WIDTH_10,
                  },
                ]}
              />
            ))}
          </View>
        </View>
      ) : (
        <View style={{height: heightPixel(280)}}>
          {status == '' || status == null || status == undefined || loader ? (
            <LoadingIndicator shouldDismissManual isVisible={true} />
          ) : status != 0 ? (
            <ErrorComponent showcard={true} defmessage={t('nodata')} />
          ) : null}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    marginTop: VERTICAL_20,
    paddingTop: VERTICAL_10,
    //  backgroundColor:'red',
  },
  page: {
    // width: widthPixel(165),
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: '100%',
    width: isTablet
      ? SCREEN_WIDTH / 1.23 - widthPixel(Platform.OS === 'android' ? 61 : 64)
      : SCREEN_WIDTH - widthPixel(Platform.OS === 'android' ? 61 : 64),
    paddingTop: VERTICAL_10,
  },
  item: {
    borderWidth: 1,
    flexDirection: 'row',
    // width:widthPixel(156) - 20 ,
    // height:heightPixel(46),
    width: widthPixel(157) - 10,
    height: heightPixel(46),
    alignItems: 'center',
    marginBottom: VERTICAL_20,
    borderRadius: 4,
    marginHorizontal: HORIZONTAL_5,
    //backgroundColor:'green'
  },
  selectedViewitem: {
    // flexDirection: 'row',
    width: widthPixel(157) - 10,
    height: heightPixel(46),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: VERTICAL_20,
    borderRadius: 4,
    marginHorizontal: HORIZONTAL_5,
  },
  pagination: {
    flexDirection:
      I18nManager.isRTL && Platform.OS === 'android' ? 'row-reverse' : 'row',
    justifyContent:
      I18nManager.isRTL && Platform.OS === 'android'
        ? 'flex-end'
        : 'flex-start',
    alignSelf: 'flex-start',
    // marginTop: VERTICAL_20,
  },
  paginationDot: {
    //width: 10,
    height: heightPixel(10),
    borderRadius: heightPixel(10) / 2,
    marginHorizontal: HORIZONTAL_5,
  },

  container: {
    // flex: 1,
    height: heightPixel(280),
    alignItems: 'center',
    paddingHorizontal: 5,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFA500',
    padding: VERTICAL_20,
    alignItems: 'center',
  },
  number: {
    fontSize: FONT_24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  crownIcon: {
    width: WIDTH_30,
    height: HEIGHT_30,
    marginBottom: 10,
  },
  status: {
    fontSize: FONT_16,
    color: '#888',
  },
  priceText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_10,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_13,
  },
  selectedView: {
    marginHorizontal: HORIZONTAL_10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    // borderWidth: 1,
  },
  selectedImage: {
    right: HORIZONTAL_5,
    bottom: VERTICAL_2,
  },
  cardNumberBox: {
    height: heightPixel(46),
    marginVertical: VERTICAL_8,
  },
});

export default NewSimNumberSlider;
