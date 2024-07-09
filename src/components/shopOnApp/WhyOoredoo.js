import React from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
} from 'react-native';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_13,
  FONT_16,
  HEIGHT_150,
  HEIGHT_20,
  HEIGHT_30,
  HEIGHT_8,
  HORIZONTAL_12,
  WIDTH_104,
  WIDTH_11,
  WIDTH_12,
  WIDTH_20,
  WIDTH_250,
} from '../../resources/styles/responsive';
import ImageComponent from '../../models/basic/ImageComponent';
import {TouchableOpacity} from 'react-native';
import colors from '../../resources/styles/colors';
import LinearGradient from 'react-native-linear-gradient';

const WhyOoredoo = ({data, whyOordeoobuttonClicked}) => {
  const renderItem = ({item, index}) => {
    return (
      <TouchableOpacity
        disabled={
          item?.redirecturl != null &&
          item?.redirecturl != undefined &&
          item?.redirecturl != ''
            ? false
            : true
        }
        onPress={() => {
          try {
            whyOordeoobuttonClicked(item);
          } catch (error) {}
        }}
        style={[
          styles.itemView,
          {
            marginLeft: index == 0 ? WIDTH_12 : null,
          },
        ]}>
        <ImageComponent
          type="image"
          iwidth={WIDTH_250}
          iheight={HEIGHT_150}
          source={item?.imageurl}
          resizeMode={'contain'}
          style={styles.image}
        />
        <LinearGradient
          start={I18nManager.isRTL ? {x: 1, y: 0} : {x: 0, y: 1}}
          end={I18nManager.isRTL ? {x: 0, y: 0} : {x: 1, y: 1}}
          colors={['rgba(44, 44, 44, 1)', 'rgba(0, 0, 0, 0)']}
          style={styles.gradientView}>
          <Text style={styles.floatingText}>{item?.displaytext}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {data && data?.desc ? (
        <View style={styles.mainView}>
          <View style={styles.container1}>
            <Text style={styles.titleText}>{data?.title}</Text>
          </View>

          <View style={styles.container2}>
            <Text style={styles.descText}>{data?.desc}</Text>
          </View>
          <View style={styles.listView}>
            <FlatList
              bounces={true}
              data={data?.data}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={renderItem}
            />
          </View>
        </View>
      ) : null}
    </>
  );
};

export default WhyOoredoo;

const styles = StyleSheet.create({
  mainView: {marginTop: HEIGHT_30},
  container1: {
    marginHorizontal: WIDTH_20,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
    color: colors.BLACK,
  },
  container2: {
    marginTop: HEIGHT_8,
    marginHorizontal: WIDTH_20,
  },
  descText: {
    textAlign: 'left',
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
  },
  listView: {
    marginTop: HEIGHT_20,
  },
  itemView: {
    borderRadius: 10,
    marginRight: HORIZONTAL_12,
  },
  gradientView: {
    position: 'absolute',
    justifyContent: 'center',
    borderRadius: 10,
    width: WIDTH_250,
    height: HEIGHT_150,
  },
  floatingText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.WHITE,
    width: WIDTH_104,
    marginLeft: WIDTH_11,
    textAlign: 'left',
  },
  image: {
    // height: HEIGHT_150,
    // width: WIDTH_250,
    borderRadius: 10,
  },
});
