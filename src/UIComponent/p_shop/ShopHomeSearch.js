import React, {useState} from 'react';
import {View, TextInput, FlatList, Text, Image, StyleSheet} from 'react-native';
import colors from '../../resources/styles/colors';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  tabletMargin,
  widthPixel,
  isTablet,
} from '../../resources/styles/normalizedimension';
import {
  NOTOSANS_LIGHT_FONT,
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_16,
  FONT_20,
  VERTICAL_HORIZONTAL_16,
  VERTICAL_30,
  FONT_22,
  FONT_24,
  FONT_26,
  FONT_28,
  HEIGHT_70,
  HEIGHT_20,
  HEIGHT_50,
  HORIZONTAL_25,
  HORIZONTAL_40,
  HORIZONTAL_12,
  WIDTH_20,
  WIDTH_40,
  WIDTH_10,
  BORDER_RADIUS_10,
  WIDTH_5,
  WIDTH_55,
  HORIZONTAL_60,
  HORIZONTAL_75,
  WIDTH_30,
  FONT_12,
} from '../../resources/styles/responsive';
import {ShadowFlex} from 'react-native-neomorph-shadows';
import {useTranslation} from 'react-i18next';
const ShopHomeSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const {t} = useTranslation();
  const [data, setData] = useState([
    {id: '1', name: 'Apple'},
    {id: '2', name: 'Banana'},
    {id: '3', name: 'Cherry'},
    // Add more items as needed
  ]);

  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View>
      {/* <ShadowFlex style={styles.buyContainer}> */}
      <TouchableOpacity>
        <View style={styles.viewContainer}>
          <View style={styles.searchview}>
            <View style={styles.imageview}>
              <Image
                style={styles.imgsearch}
                source={require('../../assets/search.png')}
                resizeMode={'contain'}
              />
            </View>
            <View>
              <TextInput
                style={{
                  fontSize: FONT_12,
                  fontFamily: searchQuery
                    ? NOTOSANS_REGULAR_FONT
                    : NOTOSANS_LIGHT_FONT,
                  color: '#AAAAAA',
                }}
                placeholder={t('shopsearchplaceholder')}
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
              />
            </View>
            <FlatList
              data={filteredData}
              keyExtractor={item => item.id}
              // renderItem={({ item }) => <Text>{item.name}</Text>}
            />
          </View>
        </View>
      </TouchableOpacity>
      {/* </ShadowFlex> */}
    </View>
  );
};

export default ShopHomeSearch;
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    paddingHorizontal: HORIZONTAL_40,
  },

  innerview: {
    flex: 1,

    paddingHorizontal: WIDTH_20,
  },

  imgsearch: {
    width: WIDTH_40,
    marginRight: HORIZONTAL_75,
    height: WIDTH_30,
    marginHorizontal: -125,
  },

  subview: {
    justifyContent: 'center',

    alignContent: 'center',

    alignItems: 'center',
  },

  subtext: {
    color: colors.GREY_SHOP,

    fontSize: FONT_16,

    lineHeight: FONT_26,

    fontFamily: NOTOSANS_REGULAR_FONT,

    alignSelf: 'center',

    textAlign: 'left',
  },

  imageview: {
    width: widthPixel(50),

    // justifyContent: 'center',
  },

  searchview: {
    borderWidth: 1,
    backgroundColor: colors.OOREDDO_GREY,
    borderColor: colors.SILVER,

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    height: HEIGHT_50,

    backgroundColor: colors.WHITE,

    borderRadius: WIDTH_55,
  },

  buyContainer: {
    shadowOpacity: 0.2,
    shadowColor: colors.GREY,
    backgroundColor: colors.OOREDDO_GREY,
    shadowRadius: BORDER_RADIUS_10,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: isTablet ? tabletMargin() + HORIZONTAL_12 : WIDTH_10,
    padding: VERTICAL_HORIZONTAL_16,
    bottom: VERTICAL_30,
    height: HEIGHT_70,
    alignItems: 'center',
  },
});
