import React, {useEffect, useRef} from 'react';
import {
  FlatList,
  I18nManager,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import {
  FONT_16,
  HEIGHT_12,
  HEIGHT_30,
  HEIGHT_75,
  HORIZONTAL_12,
  HORIZONTAL_13,
  HORIZONTAL_7,
  WIDTH_75,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import ImageComponent from '../../models/basic/ImageComponent';

const WhyBuyOnline = ({data, buyOnlinebuttonClicked}) => {
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{}}
        disabled={
          item?.redirecturl != null &&
          item?.redirecturl != undefined &&
          item?.redirecturl != ''
            ? false
            : true
        }
        onPress={() => {
          try {
            buyOnlinebuttonClicked(item);
          } catch (error) {}
        }}>
        <View style={styles.itemView}>
          <ImageComponent
            type="image"
            iwidth={WIDTH_75}
            iheight={HEIGHT_75}
            source={item?.imageurl}
            resizeMode={'contain'}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {data && data?.data ? (
        <View style={styles.mainView}>
          <View>
            <Text style={styles.titleText}>{data?.title}</Text>
          </View>

          <View>
            <FlatList
              bounces={true}
              data={data?.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
              inverted={
                Platform.OS === 'android' && I18nManager.isRTL ? true : false
              }
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default WhyBuyOnline;

const styles = StyleSheet.create({
  mainView: {
    marginTop: HEIGHT_30,
    paddingHorizontal: HORIZONTAL_13,
  },
  titleText: {
    textAlign: 'left',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    marginLeft: HORIZONTAL_7,
  },
  itemView: {
    marginRight: HORIZONTAL_12,
    marginTop: HEIGHT_12,
  },
});
