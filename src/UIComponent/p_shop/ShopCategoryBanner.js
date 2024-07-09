import {useNavigation} from '@react-navigation/core';
import React, {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {useQuery} from 'react-query';
import {useDispatch, useSelector} from 'react-redux';
import ImageComponent from '../../models/basic/ImageComponent';
import colors from '../../resources/styles/colors';
import {NOTOSANS_REGULAR_FONT} from '../../resources/styles/fonts';
import {
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  CARD_WIDTH,
  FONT_22,
  FONT_38,
  HEIGHT_200,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_5,
  WIDTH_10,
  WIDTH_450,
} from '../../resources/styles/responsive';
import {GetCacheKey} from '../../services/CacheUtil';
import {
  UnitTestProps,
  consoleLog,
  findObjectByKey,
} from '../../commonHelper/utils';
import {NavigateByName} from '../../services/NavigationService';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';

// import {
//   useNavigation,
// } from '@react-navigation/native';

const ShopCategoryBanner = ({pmsitem}) => {
  const dispatch = useDispatch();
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );
  const key = GetCacheKey('ShopCategoryBanner' + `${pmsitem.uniqueid}`);
  const navigation = useNavigation();

  // const {
  //   data: {data} = {},
  //   isLoading,
  //   error,
  //   isFetching,
  // } = useQuery([key, pmsitem.method, pmsitem.sourceid, {}], {
  //   retry: false,
  //   cacheTime: 300000,
  //   staleTime: 300000,
  // });

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      if (cachedAPIData && cachedAPIData?.length > 0) {
        const foundObj = findObjectByKey(cachedAPIData, 'Key', key);
        if (foundObj != null && foundObj != undefined && foundObj) {
          setdata(foundObj?.Resp_Obj);
        } else {
          shopcategorybannerAPI.mutate();
        }
      } else {
        shopcategorybannerAPI.mutate();
      }
    } catch (r) {}
  }, []);

  const shopcategorybannerAPI = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, pmsitem.method, pmsitem.sourceid],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
          if (cachedAPIData && cachedAPIData?.length > 0) {
            const foundObj = findObjectByKey(cachedAPIData, 'Key', key);
            if (foundObj) {
            } else {
              let tempObj = {
                Key: key,
                Resp_Obj: udata?.data,
              };
              dispatch(setCommonAPIData(tempObj));
            }
          } else {
            let tempObj = {
              Key: key,
              Resp_Obj: udata?.data,
            };
            dispatch(setCommonAPIData(tempObj));
          }
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  if (shopcategorybannerAPI?.isLoading || shopcategorybannerAPI?.isFetching) {
    return (
      <View
        {...UnitTestProps('shopcategorybanner', 'view', 'parentview')}
        style={styles.parentview}>
        <View
          {...UnitTestProps('shopcategorybanner', 'view', 'imageshop')}
          style={{minHeight: HEIGHT_200}}
        />
      </View>
    );
  }
  if (
    !shopcategorybannerAPI?.isLoading &&
    !shopcategorybannerAPI?.isFetching &&
    (shopcategorybannerAPI?.error ||
      data == null ||
      data.response === null ||
      data.response === undefined ||
      data?.response.length == 0)
  ) {
    return <View />;
  }

  return (
    <TouchableOpacity
      activeOpacity={1}
      style={styles.viewContainer}
      onPress={() => {
        NavigateByName(
          navigation,
          data?.response[0].buyurl,
          {
            type: 'shop',
          },
          data?.response[0]
        );
      }}>
      {/* <View
        {...UnitTestProps('shopcategorybanner', 'view', 'subview1')}
        style={styles.innerview}> */}
      {/* <View> */}
      {/* <View style={{alignItems: 'center'}}> */}
      <ImageComponent
        {...UnitTestProps('shopcategorybanner', 'imagecomponent', 'imageshop')}
        type="image"
        iwidth={SCREEN_WIDTH}
        iheight={isTablet ? widthPixel(480) : widthPixel(380)}
        source={data?.response[0]?.imagepath}
        refreshimage={true}
        // resizeMode={'contain'}
      />
      {/* </View> */}
      {/* </View> */}
      {/* </View> */}
    </TouchableOpacity>
  );
};

export default ShopCategoryBanner;
const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: isTablet ? VERTICAL_10 : 0,
    // marginHorizontal: tabletMargin(),
    // paddingVertical: HEIGHT_10,
  },
  innerview: {
    flex: 1,
  },
  cardtitle: {
    flex: 1,
    alignContent: 'center',
    marginHorizontal: WIDTH_10,
  },
  sectitle: {
    fontSize: FONT_22,
    lineHeight: FONT_38,
    fontFamily: NOTOSANS_REGULAR_FONT,
    textAlign: 'left',
    marginVertical: VERTICAL_20,
    color: colors.OOREDOO_BLACK,
  },
});
