import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
  Image,
} from 'react-native';
import colors from '../resources/styles/colors';
import {ImageBackground} from 'react-native';
import {
  BORDER_RADIUS_10,
  FONT_12,
  FONT_13,
  FONT_14,
  FONT_17,
  FONT_20,
  HEIGHT_18,
  HEIGHT_195,
  HEIGHT_20,
  HEIGHT_200,
  HEIGHT_250,
  HEIGHT_300,
  HEIGHT_32,
  HEIGHT_350,
  HEIGHT_42,
  HORIZONTAL_10,
  HORIZONTAL_12,
  HORIZONTAL_120,
  HORIZONTAL_20,
  HORIZONTAL_3,
  HORIZONTAL_5,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_100,
  VERTICAL_11,
  VERTICAL_12,
  VERTICAL_14,
  VERTICAL_140,
  VERTICAL_150,
  VERTICAL_160,
  VERTICAL_170,
  VERTICAL_40,
  VERTICAL_6,
  WIDTH_139,
  WIDTH_165,
  WIDTH_335,
  WIDTH_351,
  WIDTH_375,
  WIDTH_45,
} from '../resources/styles/responsive';
import {SCREEN_WIDTH, isTablet} from '../resources/styles/normalizedimension';
import {FlatList} from 'react-native-gesture-handler';
import {
  NOTOSANS_BOLD_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../resources/styles/fonts';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useQuery} from 'react-query';
import {PASSPORT_COUNTRIES_ALL} from '../resources/route/endpoints';
import {useState} from 'react';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';

const AllCountriesViewPacks = ({onPress}) => {
  const [isPassportcountries, setisPassportcountries] = useState(false);
  // const passportcountries = useQuery(
  //   [{}, PASSPORT_COUNTRIES_ALL.url, PASSPORT_COUNTRIES_ALL.data, {}],
  //   {
  //     retry: 1,
  //     retryOnMount: true,
  //     cacheTime: 300,
  //     staleTime: 0,
  //     onSuccess: (udata, variables, context) => {
  //       if (passportcountries?.data?.data?.status === '0') {
  //       }
  //       setTimeout(() => {
  //         setisPassportcountries(true);
  //       }, 3000);
  //     },
  //   }
  // );

  React.useEffect(() => {
    try {
      passportcountries.mutate();
    } catch (r) {}
  }, []);

  const passportcountries = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, PASSPORT_COUNTRIES_ALL.url, PASSPORT_COUNTRIES_ALL.data],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
        }
        setTimeout(() => {
          setisPassportcountries(true);
        }, 3000);
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  const itemdataAll = [
    {id: 1, image: require('../assets/UnitedArabEmirates.png')},
    {id: 2, image: require('../assets/UnitedArabEmirates.png')},
    {id: 3, image: require('../assets/UnitedArabEmirates.png')},
    {id: 4, image: require('../assets/UnitedArabEmirates.png')},
  ];
  const renderItemAll = item => {
    return (
      <View
        style={{
          flexDirection: 'row',
          width: WIDTH_335,
          height: HEIGHT_42,
          backgroundColor: colors.WHITE,
          borderWidth: 1,
          borderRadius: BORDER_RADIUS_10,
          borderColor: colors.LINE_LIGHT_GRAY,
          marginTop: VERTICAL_14,
          shadowOffset: {
            height: HEIGHT_20,
            width: 0,
          },
          shadowColor: colors.SHADOW,
          shadowOpacity: 3,
          elevation: 2,
          // padding: 30,
        }}>
        {/* <TouchableOpacity> */}
        <Image
          source={item?.item?.image}
          style={{
            width: WIDTH_45,
            height: HEIGHT_32,
            marginLeft: HORIZONTAL_5,
            // marginTop: VERTICAL_2,
            marginTop: VERTICAL_6,
          }}
        />

        <Text
          style={{
            height: HEIGHT_18,
            width: WIDTH_139,
            textAlign: 'center',
            justifyContent: 'center',
            alignContent: 'center',
            marginLeft: HORIZONTAL_3,
            fontFamily: NOTOSANS_BOLD_FONT,
            fontSize: FONT_13,
            lineHeight: FONT_17,
            marginTop: I18nManager.isRTL ? VERTICAL_14 : VERTICAL_12,
          }}>
          United Arab Emirates
        </Text>

        <Icon
          name={I18nManager.isRTL ? 'chevron-left' : 'chevron-right'}
          size={FONT_12}
          color="#221E20"
          style={{marginLeft: HORIZONTAL_120, marginTop: VERTICAL_12}}
        />

        {/* </TouchableOpacity> */}
      </View>
    );
  };

  return (
    <View style={{flex: 1, marginHorizontal: HORIZONTAL_10}}>
      <Text
        style={{
          fontFamily: RUBIK_SEMIBOLD_FONT,
          fontSize: FONT_14,
          lineHeight: FONT_20,
          marginTop: VERTICAL_40,
          textAlign: 'left',
          marginLeft: I18nManager.isRTL ? HORIZONTAL_8 : 0,
        }}>
        ALL COUNTRIES
      </Text>

      <FlatList
        bounces={true}
        data={itemdataAll}
        renderItem={renderItemAll}
        keyExtractor={(_, i) => i.toString()}
      />
    </View>
  );
};

export default memo(AllCountriesViewPacks);
