import React from 'react';
import {
  I18nManager,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  FONT_13,
  FONT_16,
  HEIGHT_12,
  HEIGHT_16,
  HEIGHT_19,
  HEIGHT_20,
  HEIGHT_24,
  HEIGHT_3,
  WIDTH_11,
  WIDTH_14,
  WIDTH_15,
  WIDTH_25,
} from '../../resources/styles/responsive';
import ImageComponent from '../../models/basic/ImageComponent';
import Icon from 'react-native-vector-icons/Entypo';
import {
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigator/ScreenName';
import {NavigateByName} from '../../services/NavigationService';

const TrackYourOrder = ({data, isFrom, responseData}) => {
  const navigation = useNavigation();

  const onClick = () => {
    try {
      navigation.navigate(ScreenName.TrackOrder, {
        screen: ScreenName.TrackOrder,
        params: {
          isFrom: isFrom,
          email: responseData?.address[0]?.email,
        },
      });
    } catch (error) {}
  };

  return (
    <TouchableOpacity
      style={styles.mainView}
      activeOpacity={0.5}
      onPress={() => {
        onClick();
      }}>
      <View style={styles.innerView}>
        <View style={styles.ImageView}>
          <ImageComponent
            type="image"
            iwidth={WIDTH_25}
            iheight={HEIGHT_20}
            source={data?.track_your_order_icon}
            resizeMode={'contain'}
          />
        </View>
        <View>
          <Text numberOfLines={1} style={styles.titleText}>
            {data?.track_your_order_title}
          </Text>
          <Text numberOfLines={1} style={styles.desctext}>
            {data?.track_your_order_desc}
          </Text>
        </View>
        <View style={styles.iconView}>
          <Icon
            name={
              I18nManager.isRTL ? 'chevron-thin-left' : 'chevron-thin-right'
            }
            size={16}
            color={colors.OOREDOO_BLACK}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default TrackYourOrder;

const styles = StyleSheet.create({
  mainView: {
    backgroundColor: colors.BG_COLOR_WHITE,
    borderWidth: 0.5,
    borderColor: colors.INACTIVEDOT,
    marginHorizontal: HEIGHT_12,
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowColor: colors.BLACK,
    shadowOpacity: 0.1,
    borderRadius: 10,
    marginTop: HEIGHT_24,
    elevation: 2,
  },
  innerView: {
    flexDirection: 'row',
    paddingTop: HEIGHT_16,
    paddingBottom: HEIGHT_19,
    alignItems: 'center',
  },
  ImageView: {
    marginLeft: WIDTH_15,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    textAlign: 'left',
    marginLeft: WIDTH_11,
  },
  desctext: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
    marginLeft: WIDTH_11,
    marginTop: HEIGHT_3,
  },
  iconView: {
    position: 'absolute',
    right: WIDTH_14,
    padding: 5,
  },
});
