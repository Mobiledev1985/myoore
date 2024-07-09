import React, {useCallback, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View, Image} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_8,
  FONT_13,
  FONT_16,
  FONT_25,
  HEIGHT_14,
  HEIGHT_16,
  HEIGHT_19,
  HEIGHT_20,
  HEIGHT_3,
  HEIGHT_32,
  HEIGHT_40,
  HEIGHT_48,
  HORIZONTAL_1,
  HORIZONTAL_10,
  HORIZONTAL_11,
  HORIZONTAL_20,
  HORIZONTAL_3,
  HORIZONTAL_4,
  HORIZONTAL_5,
  HORIZONTAL_6,
  HORIZONTAL_7,
  VERTICAL_10,
  VERTICAL_13,
  VERTICAL_14,
  VERTICAL_15,
  VERTICAL_2,
  VERTICAL_20,
  WIDTH_12,
  WIDTH_20,
  WIDTH_3,
  WIDTH_32,
  WIDTH_38,
  WIDTH_4,
  WIDTH_9,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {TouchableOpacity} from 'react-native';
import {GET_SHIPPING_METHOD} from '../../resources/route/endpoints';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import ImageComponent from '../../models/basic/ImageComponent';
import TextComponent from '../../models/basic/TextComponent';
import {
  heightPixel,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {getGlobalSettingValue} from '../../services/CommonUtils';

const TRACK_ITEM_IMG = require('../../assets/trackorderright.png');

const TrackPreviousOrder = ({previousOrders, title}) => {
  const [selected, setSelected] = useState('');

  // Set state for the data, offset, and hasMore
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initially load a subset of data
    if (previousOrders && previousOrders.length > 0) {
      const initialData = previousOrders.slice(0, 10);
      setData(initialData);
      setOffset(10);
    }
  }, [previousOrders]);

  const globalDeliveredStatusTtext = getGlobalSettingValue(
    'order_delivered_text'
  );

  const loadMoreData = () => {
    if (hasMore) {
      const newOffset = offset + 10; // New offset for the next data subset
      const newData = previousOrders.slice(offset, newOffset);

      setData([...data, ...newData]); // Append the new data to the existing list
      setOffset(newOffset); // Update the offset

      // Check if there's more data to load
      setHasMore(newOffset < previousOrders && previousOrders.length);
    }
  };

  const renderItem = useCallback(({item, index}) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={[
          styles.itemContainer,
          // {
          //   borderColor:
          //     index === selected ? colors.INACTIVEDOT : colors.INACTIVEDOT,
          // },
        ]}
        onPress={() => {
          setSelected(index);
        }}>
        <View style={styles.innerContainer}>
          <View style={styles.imageView}>
            {/* <Image
              source={item?.items[0]?.image}
              style={{width: widthPixel(74), height: heightPixel(73)}}
            /> */}
            <ImageComponent
              type="image"
              iwidth={widthPixel(74)}
              iheight={heightPixel(73)}
              source={item?.items[0]?.image}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.textView}>
            <View>
              <TextComponent
                data={'#' + item?.orderid}
                lines={1}
                type="text"
                style={styles.productID}
              />
            </View>
            <View style={styles.descView}>
              <TextComponent
                data={item?.items[0]?.name}
                lines={3}
                type="text"
                style={styles.descText}
              />
            </View>
          </View>
        </View>
        <View style={styles.insideContainer}>
          <View style={styles.previousMain}>
            <Image
              source={TRACK_ITEM_IMG}
              style={{width: widthPixel(34), height: heightPixel(34)}}
            />
            <TextComponent
              data={
                globalDeliveredStatusTtext != null &&
                globalDeliveredStatusTtext != undefined &&
                globalDeliveredStatusTtext != ''
                  ? globalDeliveredStatusTtext
                  : item?.orderstatus
              }
              lines={3}
              type="text"
              style={[styles.descText, {marginHorizontal: HORIZONTAL_10}]}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  }, []);
  return (
    <View style={styles.mainContainer}>
      {title != null && title != undefined && title != '' && (
        <TextComponent
          data={title}
          lines={1}
          type="text"
          style={styles.titleText}
        />
      )}
      <FlatList
        data={data}
        bounces={false}
        renderItem={renderItem}
        keyExtractor={(_, index) => String(index)}
        showsVerticalScrollIndicator={false}
        onEndReached={loadMoreData}
        onEndReachedThreshold={0.5} // Threshold when the event is triggered
      />
    </View>
  );
};

export default TrackPreviousOrder;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.WHITE,
    paddingHorizontal: WIDTH_12,
    paddingTop: HEIGHT_20,
    paddingBottom: HEIGHT_20,
    marginTop: HEIGHT_20,
  },
  itemContainer: {
    borderRadius: BORDER_RADIUS_10,
    borderWidth: 0.5,
    backgroundColor: colors.BG_COLOR_WHITE,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    paddingBottom: HEIGHT_19,
    marginTop: VERTICAL_20,
    borderColor: colors.INACTIVEDOT,
  },
  insideContainer: {
    borderRadius: BORDER_RADIUS_10,
    // borderWidth: 0.5,
    backgroundColor: colors.TOO_LIGHT_GREY,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    paddingBottom: HEIGHT_19,
    marginTop: VERTICAL_14,
    marginHorizontal: HORIZONTAL_11,
  },
  innerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: HEIGHT_16,
  },
  imageView: {
    marginLeft: WIDTH_12,
  },
  textView: {
    marginLeft: WIDTH_9,
  },
  descView: {
    marginTop: HEIGHT_3,
    width: widthPixel(165),
  },
  descText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
    lineHeight: FONT_25,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    marginHorizontal: HORIZONTAL_4,
  },
  previousMain: {
    marginHorizontal: HORIZONTAL_20,
    paddingTop: VERTICAL_13,
    flexDirection: 'row',
    alignItems: 'center',
  },
  productID: {
    color: colors.GREY_HIGH,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
});
