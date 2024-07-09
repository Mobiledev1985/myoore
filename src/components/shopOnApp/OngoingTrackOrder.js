import React, {useCallback, useEffect, useRef, useState} from 'react';
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
  VERTICAL_15,
  VERTICAL_2,
  VERTICAL_20,
  WIDTH_12,
  WIDTH_20,
  WIDTH_3,
  WIDTH_32,
  WIDTH_38,
  WIDTH_4,
  WIDTH_5,
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
import LottieView from 'lottie-react-native';

const TRACK_ITEM_IMG = require('../../assets/trackorderitem.png');

const OngoingTrackOrder = ({
  isLoading,
  onGoingOrders,
  title,
  orderstatuslist,
}) => {
  const [selected, setSelected] = useState('');
  const trackorderItems = useRef(orderstatuslist?.split(','));

  // Set state for the data, offset, and hasMore
  const [data, setData] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Initially load a subset of data
    if (onGoingOrders && onGoingOrders.length > 0) {
      const initialData = onGoingOrders.slice(0, 10);
      setData(initialData);
      setOffset(10);
    }
  }, [onGoingOrders]);

  const loadMoreData = () => {
    if (hasMore) {
      const newOffset = offset + 10; // New offset for the next data subset
      const newData = onGoingOrders.slice(offset, newOffset);

      setData([...data, ...newData]); // Append the new data to the existing list
      setOffset(newOffset); // Update the offset

      // Check if there's more data to load
      setHasMore(newOffset < onGoingOrders && onGoingOrders.length);
    }
  };

  const renderItem = useCallback(({item, index}) => {
    var itemValue = item;
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
            <Image
              source={TRACK_ITEM_IMG}
              style={{width: widthPixel(74), height: heightPixel(73)}}
            />
            {/* <ImageComponent
              type="image"
              iwidth={WIDTH_32}
              iheight={HEIGHT_32}
              source={item?.icon}
              resizeMode={'contain'}
            /> */}
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
          <FlatList
            bounces={false}
            data={trackorderItems?.current}
            renderItem={({item, index}) => {
              let indexValue = 0;
              if (
                itemValue?.orderstatus.toUpperCase() === 'PENDING' ||
                itemValue?.orderstatus.toUpperCase() === 'PROCESSING'
              ) {
                indexValue = 0;
              } else if (
                itemValue?.orderstatus.toUpperCase() === 'OUT FOR DELIVERY' ||
                itemValue?.orderstatus.toUpperCase() === 'EN ROUTE'
              ) {
                indexValue = 1;
              } else if (itemValue?.orderstatus.toUpperCase() === 'DELIVERED') {
                indexValue = 2;
              }
              return (
                <View style={{paddingTop: index == 0 ? VERTICAL_15 : 0}}>
                  <View
                    style={{
                      marginHorizontal: HORIZONTAL_20,
                      marginTop: index == 0 ? 0 : 3,
                    }}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      {indexValue > index ? (
                        <View
                          style={{
                            borderWidth: 1,
                            borderRadius: widthPixel(20) / 2,
                            padding: VERTICAL_2,
                            borderColor: '#3CDBC0', // #AAAAAA // #3CDBC0
                          }}>
                          <View
                            style={[
                              styles.radioButton,
                              // Change the border color and the background color based on the selection
                              {
                                borderColor: '#3CDBC0',
                                backgroundColor: '#3CDBC0',
                              },
                            ]}
                          />
                        </View>
                      ) : indexValue === index ? (
                        <LottieView
                          resizeMode={'cover'}
                          source={require('../../assets/placeorderdot.json')}
                          autoPlay
                          loop={true}
                          style={{
                            width: widthPixel(20),
                            height: widthPixel(20),
                            right: WIDTH_3,
                            marginTop: 0,
                          }}
                        />
                      ) : (
                        <View
                          style={{
                            borderWidth: 1,
                            borderRadius: widthPixel(20) / 2,
                            padding: VERTICAL_2,
                            borderColor: '#AAAAAA', // #AAAAAA // #3CDBC0
                          }}>
                          <View
                            style={[
                              styles.radioButton,
                              // Change the border color and the background color based on the selection
                              {
                                borderColor: '#AAAAAA',
                                backgroundColor: '#AAAAAA',
                              },
                            ]}
                          />
                        </View>
                      )}
                      <TextComponent
                        data={item}
                        lines={1}
                        type="text"
                        style={styles.deliverystatus}
                      />
                    </View>
                    {trackorderItems?.current.length - 1 !== index && (
                      // <View style={[styles.verticalLine, {backgroundColor: '#3CDBC0'}]} />
                      <View style={styles.container}>
                        <View
                          style={[
                            styles.progressBar,
                            {
                              height: `${
                                indexValue > index
                                  ? 100
                                  : indexValue + 1 > index
                                  ? 50
                                  : 0
                              }%`,
                            },
                          ]}
                        />
                      </View>
                    )}
                  </View>
                </View>
              );
            }}
            extraData={item}
            showsVerticalScrollIndicator={false}
          />
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

export default OngoingTrackOrder;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.BG_PINK,
    paddingHorizontal: WIDTH_12,
    paddingTop: HEIGHT_20,
    paddingBottom: HEIGHT_20,
    // marginTop: HEIGHT_20,
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
    marginTop: HEIGHT_14,
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
  productID: {
    color: colors.GREY_HIGH,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  radioButton: {
    width: widthPixel(11),
    height: widthPixel(11),
    borderRadius: widthPixel(11) / 2,
    // borderWidth: 2,
  },
  deliverystatus: {
    marginHorizontal: HORIZONTAL_10,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
  },
  verticalLine: {
    width: WIDTH_3,
    height: HEIGHT_40,
    borderRadius: 5,
    marginHorizontal: HORIZONTAL_7,
    marginTop: 2,
  },
  container: {
    width: WIDTH_5,
    height: HEIGHT_40,
    borderRadius: 5,
    marginHorizontal: HORIZONTAL_5,
    marginTop: HORIZONTAL_5,
    overflow: 'hidden', // Clip the progress bar content that overflows its container
    marginBottom: 3,
    backgroundColor: '#AAAAAA',
  },
  progressBar: {
    backgroundColor: '#3CDBC0', // Color of the progress indicator
    width: '100%', // Full width of the container
  },
});
