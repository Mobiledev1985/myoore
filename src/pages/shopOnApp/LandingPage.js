import React, {useEffect, useState} from 'react';
import {StatusBar, StyleSheet, View} from 'react-native';
import HeaderStatusbar from '../../components/shopOnApp/HeaderStatusBar';
import ProductCategories from '../../components/shopOnApp/ProductCategories';
import {
  GET_SHOP_ON_APP_SETTINGS,
  PRODUCT_CATEGORIES,
} from '../../resources/route/endpoints';
import {useTranslation} from 'react-i18next';
import colors from '../../resources/styles/colors';
import {useMutation, useQuery} from 'react-query';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import HeaderComponent from '../../models/basic/HeaderComponent';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {
  SCREEN_HEIGHT,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigator/ScreenName';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import SupportedCountryModal from '../../models/templates/SupportedCountryModal';
import ErrorComponent from '../../models/basic/ErrorComponent';
import {HEIGHT_100} from '../../resources/styles/responsive';

const LandingPage = ({route}) => {
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [isLoading, setLoading] = useState(true);
  const [showfailureModal, setshowfailureModal] = useState(false);
  const [failuremsg, setfailuremsg] = useState('');
  const [categoryRoutename, setcategoryRoutename] = useState(null);
  const [failureTitle, setfailureTitle] = useState('');
  const [data, setdata] = useState();

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.ShopOnAppLandingPage,
    show: false,
  });

  useEffect(() => {
    global.isRatingSubmiitted = false;
    RecordScreenEvent('Shop Offers');
    global.ShopOnAPPAddressObj = {};
    global.contactNumber = null;
    global.contactwhatsapp = null;
    getSettingsData.mutate();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      global.contactdetailsAutoPopuplate = null;
      if (
        global.summaryedittosim != null &&
        global.summaryedittosim != undefined &&
        global.summaryedittosim != '' &&
        global.summaryedittosim == 'true'
      ) {
        // global.summaryedittosim = null;
      } else {
        global.landingtosim = 'true';
      }
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      try {
        if (
          global.deeplinkKeyword != null &&
          global.deeplinkKeyword != undefined &&
          global.deeplinkKeyword != ''
        ) {
          if (/\d/.test(global.deeplinkKeyword)) {
            var spiltValue = global.deeplinkKeyword.split('#');
            if (
              spiltValue != null &&
              spiltValue != undefined &&
              data?.response != null &&
              data?.response != undefined &&
              data?.response?.categories != null &&
              data?.response?.categories != undefined
            ) {
              if (spiltValue[0] === 'shoponapp') {
                const result = data?.response?.categories.filter(
                  item => Number(item.id) === Number(spiltValue[1])
                );
                // Check if there's a matching item and get its name
                const name =
                  result != null && result != undefined && result.length > 0
                    ? result[0].name
                    : '';
                if (name == '') {
                  setcategoryRoutename('Postpaid');
                } else {
                  setcategoryRoutename(name);
                }
                setTimeout(() => {
                  global.deeplinkKeyword = null;
                }, 2000);
              } else {
                setcategoryRoutename('none');
              }
            } else {
              setcategoryRoutename('none');
            }
          } else {
            setcategoryRoutename('none');
          }
        }
      } catch (e) {}
    }, [data, categoryRoutename])
  );

  // const {
  //   data: {data} = {},
  //   isFetching,
  //   remove,
  //   error,
  //   refetch,
  // } = useQuery(['', PRODUCT_CATEGORIES, {}, {}], {
  //   retry: false,
  //   retryOnMount: true,
  //   cacheTime: 300000,
  //   staleTime: 300000,
  // });

  React.useEffect(() => {
    try {
      getCategories.mutate();
    } catch (r) {}
  }, []);

  const getCategories = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, PRODUCT_CATEGORIES, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setLoading(false);
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
          try {
            if (
              global.deeplinkKeyword != null &&
              global.deeplinkKeyword != undefined &&
              global.deeplinkKeyword != ''
            ) {
              if (/\d/.test(global.deeplinkKeyword)) {
                var spiltValue = global.deeplinkKeyword.split('#');
                if (
                  spiltValue != null &&
                  spiltValue != undefined &&
                  udata?.data?.response != null &&
                  udata?.data?.response != undefined &&
                  udata?.data?.response?.categories != null &&
                  udata?.data?.response?.categories != undefined
                ) {
                  if (spiltValue[0] === 'shoponapp') {
                    const result = udata?.data?.response?.categories.filter(
                      item => Number(item.id) === Number(spiltValue[1])
                    );
                    // Check if there's a matching item and get its name
                    const name =
                      result != null && result != undefined && result.length > 0
                        ? result[0].name
                        : '';
                    if (name == '') {
                      setcategoryRoutename('Postpaid');
                    } else {
                      setcategoryRoutename(name);
                    }
                    setTimeout(() => {
                      global.deeplinkKeyword = null;
                    }, 2000);
                  }
                }
              }
            }
          } catch (e) {}
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {
        setLoading(false);
      },
    }
  );

  const getSettingsData = useMutation(
    req =>
      callQueryapi({
        queryKey: ['', GET_SHOP_ON_APP_SETTINGS, {}, {}],
      }),

    {
      onSuccess: (udata, variables, context) => {
        if (udata != null && udata != undefined && udata?.data != null) {
          if (udata?.data?.status === '0') {
            global.shopOnAppSettings = udata?.data?.response;
          } else {
            setshowfailureModal(true);
            setfailureTitle(
              udata?.data?.infomsg ? udata?.data?.infomsg : t('swwptal')
            );
            setfailuremsg(udata?.data?.infomsg ? udata?.data?.message : '');
          }
        }
      },
      onError: (uerror, variables, context) => {
        setshowfailureModal(true);
        setfailureTitle(t('swwptal'));
        // console.log(uerror);
      },
    }
  );

  return (
    <View style={styles.mainContainer}>
      <StatusBar
        backgroundColor={'transparent'}
        barStyle={'dark-content'}></StatusBar>
      <HeaderComponent
        showHeaderTitle={true}
        showFavouriteButton={false}
        showBanner={false}
        statusBarColor={colors.WHITE}
        headerTitle={t('Exclusive_offers_for_you')}
        isHeaderTextPressDisabled={true}
        type={'shoponapp'}
      />
      <>
        {(getCategories?.error ||
          data == null ||
          data === null ||
          data == undefined ||
          data?.status === '-1') &&
        !isLoading &&
        !getCategories?.isFetching ? (
          <View style={{marginTop: HEIGHT_100}}>
            <ErrorComponent
              showcard={true}
              error={getCategories?.error}
              data={data}
            />
          </View>
        ) : (
          <>
            {data && data?.response ? (
              <>
                <View>
                  <HeaderStatusbar elementMeta={data?.response?.steps} />
                </View>
                <View style={styles.categoryWrapper}>
                  <ProductCategories
                    categories={data?.response?.categories}
                    products={data?.response?.products}
                    setLoading={value => {
                      setLoading(value);
                    }}
                    ordernowbtn={data?.response?.ordernowbtn}
                    viewdetailsbtn={data?.response?.viewdetailsbtn}
                    viewdetailspopupbtn={data?.response?.viewdetailspopupbtn}
                    categoryRoutename={
                      categoryRoutename != null &&
                      categoryRoutename != undefined &&
                      categoryRoutename != ''
                        ? categoryRoutename
                        : 'none'
                    }
                  />
                </View>
              </>
            ) : null}
          </>
        )}
      </>

      {(isLoading || getCategories?.isLoading || getSettingsData.isLoading) && (
        <LoadingIndicator
          shouldDismissManual
          isVisible={
            isLoading || getCategories?.isFetching || getSettingsData.isLoading
          }
        />
      )}
      {showfailureModal ? (
        <SupportedCountryModal
          popupText={failuremsg}
          onDismiss={data => {
            setshowfailureModal(false);
          }}
          titleMsg={failureTitle ? failureTitle : ''}
          isFrom={'passwordManagement'}
        />
      ) : null}
    </View>
  );
};

export default LandingPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.BG_COLOR_WHITE,
  },
  categoryWrapper: {
    height: SCREEN_HEIGHT,
    flex: 1,
    marginHorizontal: tabletMargin(),
  },
});
