import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  I18nManager,
} from 'react-native';
import colors from '../resources/styles/colors';
import {SCALE_SIZE_14, SCALE_SIZE_8} from '../commonHelper/Constants';
import {
  NOTOSANS_LIGHT_FONT,
  RUBIK_MEDIUM_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../resources/styles/fonts';
import {useTranslation} from 'react-i18next';
import React, {useState} from 'react';
import {
  HEIGHT_10,
  HEIGHT_20,
  HEIGHT_26,
  VERTICAL_13,
  VERTICAL_14,
  VERTICAL_15,
  WIDTH_100,
  WIDTH_79,
  FONT_13,
  FONT_16,
  VERTICAL_20,
  HORIZONTAL_14,
  HEIGHT_14,
  HEIGHT_297,
  HEIGHT_30,
  FONT_12,
  FONT_14,
  FONT_25,
  FONT_20,
  FONT_22,
  FONT_24,
} from '../resources/styles/responsive';
import {SCALE_SIZE_25, SCALE_SIZE_5} from './Constants';
import HTMLModalView from './HTMLModalView';
import {heightPixel, widthPixel} from '../resources/styles/normalizedimension';

const CardItem = ({item, onReadPress, onRequestClose, readItem}) => {
  const {t} = useTranslation();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <View style={styles.cardView}>
      <Text style={styles.cardTitle} numberOfLines={1}>
        {item?.ProductDetails?.Title}
      </Text>

      <View style={styles.lineDivider} />

      <Text style={styles.cardDescription} numberOfLines={8}>
        {item?.ProductDetails?.description}
      </Text>

      <TouchableOpacity
        onPress={() => {
          onReadPress(item);
          setIsPressed(true);
        }}
        style={styles.cardImageView}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={{
              fontFamily: RUBIK_MEDIUM_FONT,
              fontSize: FONT_14,
              color: colors.OOREDOO_RED,
              lineHeight: I18nManager.isRTL ? FONT_22 : FONT_14,
            }}>
            {item?.ProductDetails?.buyurl}
          </Text>
          <Image
            style={styles.Imagestyle}
            source={require('../assets/up.png')}
            tintColor={colors.OOREDOO_RED}
          />
        </View>
      </TouchableOpacity>

      {isPressed && (
        <HTMLModalView
          isVisible={isPressed}
          itemSummary={readItem?.ProductDetails?.summary}
          itemTitle={readItem?.ProductDetails?.Title}
          onClose={() => {
            onRequestClose();
            setIsPressed(false);
          }}
        />
      )}
    </View>
  );
};

export default CardItem;

const styles = StyleSheet.create({
  lineDivider: {
    height: 1,
    backgroundColor: colors.DARK_SHADOW_GREY,
    marginVertical: VERTICAL_15,
  },
  Imagestyle: {
    height: widthPixel(14),
    width: widthPixel(14),
    left: widthPixel(2),
    top: I18nManager.isRTL ? heightPixel(1) : -heightPixel(1),
    alignSelf: 'flex-end',
  },
  cardImageView: {
    marginTop: HEIGHT_30,
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    marginBottom: HEIGHT_14,
    height: SCALE_SIZE_25,
    // width: WIDTH_100,
    padding: SCALE_SIZE_5,
  },
  cardView: {
    flex: 1,
    backgroundColor: colors.WHITE,
    height: HEIGHT_297,
    marginTop: VERTICAL_20,
    borderRadius: SCALE_SIZE_8,
    shadowColor: colors.DARK_SHADOW_GREY,
    shadowRadius: SCALE_SIZE_5,
    shadowOpacity: 1,
    paddingHorizontal: HORIZONTAL_14,
    paddingTop: VERTICAL_14,
    paddingBottom: VERTICAL_13,
  },
  cardDescription: {
    fontFamily: NOTOSANS_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
    lineHeight: HEIGHT_20,
    color: colors.BLACK,
  },
  cardTitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
    color: colors.BLACK,
    lineHeight: HEIGHT_26,
  },
});
