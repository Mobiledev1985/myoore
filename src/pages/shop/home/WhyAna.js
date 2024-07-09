import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  I18nManager,
  Platform,
} from 'react-native';
import ScreenName from '../../../navigator/ScreenName';
import {NavigateByName} from '../../../services/NavigationService';
import colors from '../../../resources/styles/colors';

import {
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../../resources/styles/fonts';

import {
  heightPixel,
  SCREEN_WIDTH,
  tabletMargin,
  widthPixel,
  isTablet,
} from '../../../resources/styles/normalizedimension';
import {
  borderRadius,
  BORDER_RADIUS_10,
  CARD_WIDTH,
  FONT_12,
  FONT_16,
  HORIZONTAL_10,
  HORIZONTAL_8,
  VERTICAL_10,
  VERTICAL_5,
  VERTICAL_2,
  FONT_20,
  FONT_22,
  FONT_35,
  FONT_10,
  VERTICAL_4,
  HORIZONTAL_2,
  VERTICAL_1,
  WIDTH_1,
  VERTICAL_20,
  VERTICAL_15,
  VERTICAL_18,
  VERTICAL_21,
  VERTICAL_8,
  VERTICAL_11,
  HORIZONTAL_5,
} from '../../../resources/styles/responsive';
import CommonCarousel from '../../../UIComponent/custom/CommonCarousel';
import {useQuery} from 'react-query';
import ImageComponent from '../../../models/basic/ImageComponent';

import {useNavigation} from '@react-navigation/native';
import {color} from 'react-native-reanimated';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../../commonHelper/middleware/callapi';
const WhyAna = ({pmsitem}) => {
  const isCarousel = React.useRef(null);
  const navigation = useNavigation();
  // const {
  //   data: {data} = {},
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useQuery(['', pmsitem.method, JSON.parse(pmsitem.sourceid), {}], {
  //   retry: false,
  //   retryOnMount: false,
  //   cacheTime: 0,
  //   staleTime: 0,
  // });

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      WhyAna.mutate();
    } catch (r) {}
  }, []);

  const WhyAna = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, JSON.parse(pmsitem.sourceid)],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  const renderCarouselItem = ({item, type}) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.itemtouch}
          onPress={() =>
            NavigateByName(
              navigation,
              item?.redirecturl,
              null,
              item,
              null,
              null,
              null
            )
          }>
          <View style={styles.itemView}>
            <ImageComponent
              type="image"
              iwidth={widthPixel(48)}
              iheight={heightPixel(48)}
              source={item?.imageurl}
              style={{
                alignSelf: 'center',
              }}
              resizeMode={'contain'}
            />
            <Text numberOfLines={2} style={[styles.linktitleContainer]}>
              {item?.displaytext}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const BindLinksLikeView = () => {
    return (
      <View>
        <View style={styles.mainContainer}>
          <View
            style={{justifyContent: 'center', alignItems: 'center', top: 12}}>
            <Text style={styles.wouldlikeText}>
              {pmsitem?.elementmeta?.title}
            </Text>
          </View>
          <View>
            <FlatList
              data={data?.response?.dynamictypes[0].cards}
              inverted={
                // Platform.OS === 'android' &&
                I18nManager.isRTL ? true : false
              }
              renderItem={renderCarouselItem}
              horizontal
            />
          </View>
        </View>
      </View>
    );
  };
  return (
    <View
      style={{
        marginBottom: heightPixel(10),
        marginTop: heightPixel(10),

        marginHorizontal: isTablet ? tabletMargin() : HORIZONTAL_2,
      }}>
      <View>{BindLinksLikeView()}</View>
    </View>
  );
};
export default WhyAna;

const styles = StyleSheet.create({
  bgView: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainContainer: {
    backgroundColor: '#F9F9F9',
    top: -18,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
  },
  itemtouch: {
    alignItems: 'center',
  },

  titileView: {
    width: isTablet ? widthPixel(72) : widthPixel(80),
    paddingTop: VERTICAL_21,
  },
  wouldlikeText: {
    textAlign: 'center',
    marginTop: VERTICAL_10,
    marginBottom: VERTICAL_5,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_20,
    lineHeight: FONT_35,
  },
  innertext: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_10,
    color: colors.WHITE,
  },
  linktitleContainer: {
    textAlign: 'center',
    fontSize: FONT_12,
    fontFamily: RUBIC_LIGHT_FONT,
    alignSelf: 'center',
    paddingBottom: VERTICAL_5,
    marginTop: VERTICAL_11,
    lineHeight: FONT_22,
    marginHorizontal: HORIZONTAL_10,
  },
  imageStyle: {
    height: widthPixel(55),
    width: widthPixel(55),
    alignSelf: 'center',
    marginTop: VERTICAL_10,
  },
  parentview: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    borderTopLeftRadius: borderRadius(10),
    borderTopRightRadius: borderRadius(10),
    backgroundColor: colors.WHITE,
  },
  itemView: {
    width: CARD_WIDTH / 3,
    alignItems: 'center',
    marginTop: VERTICAL_20,
  },
});
