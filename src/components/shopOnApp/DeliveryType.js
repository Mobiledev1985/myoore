import React, {useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  BORDER_RADIUS_10,
  BORDER_RADIUS_8,
  FONT_13,
  FONT_16,
  HEIGHT_14,
  HEIGHT_16,
  HEIGHT_19,
  HEIGHT_20,
  HEIGHT_3,
  HEIGHT_32,
  WIDTH_12,
  WIDTH_20,
  WIDTH_32,
  WIDTH_9,
} from '../../resources/styles/responsive';
import {
  RUBIC_LIGHT_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../resources/styles/fonts';
import {TouchableOpacity} from 'react-native';
import {GET_SHIPPING_METHOD} from '../../resources/route/endpoints';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import ImageComponent from '../../models/basic/ImageComponent';

const DeliveryType = ({
  isLoading,
  selectedMethodObj,
  userDetails,
  cartID,
  item,
}) => {
  const [selected, setSelected] = useState('');
  const [succResp, setSuccResp] = useState('');
  const [isDefaultSelected, setDefaultSelected] = useState(false);

  useEffect(() => {
    getShippingMethod.mutate();
  }, []);

  const getShippingMethod = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          ,
          GET_SHIPPING_METHOD,
          {
            quoteid: cartID,
            firstname:
              userDetails?.firstname || global.ShopOnAPPAddressObj?.firstName,
            lastname:
              userDetails?.lastname || global.ShopOnAPPAddressObj?.lastName,
            telephone: item?.contactnumber,
            street: userDetails?.street || global.ShopOnAPPAddressObj?.street,
            region:
              userDetails?.governoratevalue ||
              global.ShopOnAPPAddressObj?.governoratevalue,
            city:
              userDetails?.areavalue || global.ShopOnAPPAddressObj?.areavalue,
            postcode: '',
            countryid: 'KW',
          },
          {},
        ],
      }),

    {
      onSuccess: (udata, variables, context) => {
        isLoading(false);
        if (udata != null && udata != undefined && udata?.data != null) {
          if (udata?.data?.status === '0') {
            setSuccResp(udata?.data?.response?.shippingmethods);
          }
        }
      },
      onError: (uerror, variables, context) => {
        isLoading(false);
      },
    }
  );

  const renderItem = ({item, index}) => {
    if (index === 0 && !isDefaultSelected) {
      setSelected(index);
      selectedMethodObj(item);
      setDefaultSelected(true);
    }
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          {
            borderColor:
              index === selected ? colors.OOREDOO_RED : colors.INACTIVEDOT,
          },
        ]}
        onPress={() => {
          setSelected(index);
          selectedMethodObj(item);
        }}>
        <View style={styles.innerContainer}>
          <View style={styles.imageView}>
            <ImageComponent
              type="image"
              iwidth={WIDTH_32}
              iheight={HEIGHT_32}
              source={item?.icon}
              resizeMode={'contain'}
            />
          </View>
          <View style={styles.textView}>
            <View>
              <Text style={styles.titleText}>{item?.carriertitle}</Text>
            </View>
            <View style={styles.descView}>
              <Text style={styles.descText}>{item?.methodtitle}</Text>
            </View>
          </View>
          <View style={styles.radiobtnContainer}>
            <View style={styles.radiobtnInnerView}>
              {index === selected ? (
                <View style={styles.radioOuterView}>
                  <View style={styles.radioInner} />
                </View>
              ) : (
                <View style={styles.radiounselectedOuter}></View>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.mainContainer}>
      <FlatList
        bounces={false}
        data={succResp}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default DeliveryType;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: colors.BG_PINK,
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
    marginTop: HEIGHT_14,
    // elevation: 3,
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
  },
  descText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    textAlign: 'left',
  },
  radiobtnContainer: {
    position: 'absolute',
    right: WIDTH_12,
  },
  radiobtnInnerView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
    alignItems: 'center',
  },
  radioOuterView: {
    width: WIDTH_20,
    height: WIDTH_20,
    borderRadius: WIDTH_20 / 2,
    backgroundColor: colors.OOREDOO_RED,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radiounselectedOuter: {
    width: WIDTH_20,
    height: WIDTH_20,
    borderRadius: WIDTH_20 / 2,
    borderWidth: 1,
    borderColor: colors.OOREDDO_LIGHT_GREY,
  },
  radioInner: {
    width: WIDTH_12,
    height: WIDTH_12,
    borderRadius: BORDER_RADIUS_8,
    backgroundColor: colors.WHITE,
  },
  titleText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
  },
});
