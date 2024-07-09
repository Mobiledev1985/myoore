import React from 'react';
import {I18nManager, StyleSheet, Text, View} from 'react-native';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {
  FONT_13,
  FONT_16,
  HEIGHT_30,
  WIDTH_22,
  HEIGHT_20,
  HEIGHT_15,
  WIDTH_15,
  WIDTH_12,
  HEIGHT_8,
  WIDTH_7,
  WIDTH_33,
  VERTICAL_60,
} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {GET_DYNAMIC_CARDS_API} from '../../resources/route/endpoints';
import {FlatList} from 'react-native';
import {
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';

const StepsToVerify = () => {
  const [cardsData, setCardsData] = React.useState('');

  React.useEffect(() => {
    getCards.mutate();
  }, []);

  const getCards = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          ,
          GET_DYNAMIC_CARDS_API,
          {
            type: 'rn_verify_paci_steps',
            customertype: 'B2C',
            rateplantype: 'PREPAID',
            isdigitalcustomer: 'true',
            ishybrid: 'false',
            voiceline: 'true',
          },
          {},
        ],
      }),

    {
      onSuccess: udata => {
        if (udata != null && udata != undefined && udata?.data != null) {
          if (udata?.data?.status === '0') {
            setCardsData(udata?.data?.response?.dynamictypes[0]);
          }
        }
      },
      onError: uerror => {},
    }
  );

  const renderItem = ({item, index}) => {
    return (
      <View>
        <View style={styles.itemTitleView}>
          <View style={styles.circle}></View>
          <View style={styles.itemTextView}>
            <Text style={styles.itemTitle}>
              {I18nManager.isRTL ? item?.displaytext_ar : item?.displaytext}
            </Text>
          </View>
        </View>
        <View style={styles.itemDescView}>
          {index == cardsData?.cards?.length - 1 ? null : (
            <View
              style={{
                width: 2,
                backgroundColor: colors.OOREDOO_RED,
              }}></View>
          )}
          <Text style={styles.itemDescText}>{item?.description}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.mainView}>
      <View style={styles.titleView}>
        <Text style={styles.titleText}>{cardsData?.heading}</Text>
      </View>
      <View style={styles.listView}>
        <FlatList
          bounces={false}
          data={cardsData?.cards}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    // marginTop: HEIGHT_30,
    backgroundColor: colors.BG_LIGHT_GREY,
    paddingLeft: WIDTH_22,
    paddingRight: WIDTH_33,
    // marginBottom: VERTICAL_60,
  },
  titleView: {
    marginTop: HEIGHT_20,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    color: colors.BLACK,
    textAlign: 'left',
  },
  listView: {
    marginTop: HEIGHT_20,
  },
  itemTitleView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    backgroundColor: colors.OOREDOO_RED,
    height: WIDTH_15,
    width: WIDTH_15,
    borderRadius: WIDTH_15 / 2,
  },
  itemTextView: {
    marginLeft: WIDTH_12,
  },
  itemTitle: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
  },
  itemDescView: {
    flexDirection: 'row',
    paddingLeft: WIDTH_7,
  },
  itemDescText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
    textAlign: 'left',
    marginLeft: WIDTH_22,
    marginTop: HEIGHT_8,
    paddingBottom: HEIGHT_20,
  },
});

export default StepsToVerify;
