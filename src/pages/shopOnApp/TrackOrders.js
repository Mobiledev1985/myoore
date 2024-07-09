import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ScrollView} from 'react-native';
import colors from '../../resources/styles/colors';
import {
  GET_CATEGORY_FAQ,
  TRACKORDERS_API,
} from '../../resources/route/endpoints';
import OngoingTrackOrder from '../../components/shopOnApp/OngoingTrackOrder';
import TrackPreviousOrder from '../../components/shopOnApp/TrackPreviousOrder';
import HeaderComponent from '../../models/basic/HeaderComponent';
import {useTranslation} from 'react-i18next';
import {useMutation, useQuery} from 'react-query';
import {GetCacheKey} from '../../services/CacheUtil';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {
  heightPixel,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import Faqs from '../../components/shopOnApp/Faqs';
import {callQueryapi} from '../../commonHelper/middleware/callapi.android';
import {VERTICAL_20, VERTICAL_30} from '../../resources/styles/responsive';
import ErrorComponent from '../../models/basic/ErrorComponent';
import {getGlobalSettingValue} from '../../services/CommonUtils';
import {RecordScreenEvent} from '../../analytics/RecordEvents';

const TrackOrders = ({route}) => {
  const {t} = useTranslation();
  const [currentOrders, setCurrentOrders] = useState([]);
  const [previousOrders, setPreviousOrders] = useState([]);
  const [faqResp, setFaqResp] = useState('');
  const [isLoading, setisLoading] = useState(true);

  // const {
  //   data: {data} = {},
  //   isFetching,
  //   isLoading,
  //   remove,
  //   refetch,
  // } = useQuery(
  //   [
  //     GetCacheKey('trackorders'),
  //     TRACKORDERS_API,
  //     {
  //       email:
  //         route?.params?.params?.isFrom == 'ReceiptPage'
  //           ? route?.params?.params?.email
  //           : global.rnuserdetails?.email,
  //     },
  //     {},
  //   ],
  //   {
  //     enabled:
  //       route?.params?.type != null &&
  //       route?.params?.type != undefined &&
  //       route?.params?.type != '' &&
  //       route?.params?.type === 'guest'
  //         ? false
  //         : true,
  //     retry: false,
  //     retryOnMount: true,
  //     cacheTime: 300000,
  //     staleTime: 300000,
  //   }
  // );

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      if (
        route?.params?.type != null &&
        route?.params?.type != undefined &&
        route?.params?.type != '' &&
        route?.params?.type === 'guest'
      ) {
      } else {
        trackOrder.mutate();
      }
    } catch (r) {}
  }, []);

  const trackOrder = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          TRACKORDERS_API,
          {
            email:
              route?.params?.params?.isFrom == 'ReceiptPage'
                ? route?.params?.params?.email
                : global.rnuserdetails?.email,
          },
          {},
          true,
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setisLoading(false);
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {
        setisLoading(false);
      },
    }
  );

  const getFaqs = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GET_CATEGORY_FAQ,
          {
            faqid: getGlobalSettingValue('receipt_page_faqid'),
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        if (data?.data?.status === '0') {
          try {
            setFaqResp(data?.data?.response);
          } catch (error) {}
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  useEffect(() => {
    try {
      getFaqs.mutate();
    } catch (error) {}
  }, []);

  useEffect(() => {
    try {
      if (
        data != null &&
        data !== undefined &&
        data?.response != null &&
        data?.response !== undefined &&
        data?.response?.orders != null &&
        data?.response?.orders !== undefined
      ) {
        try {
          let currentitemsList = data?.response?.orders?.filter(
            x =>
              x?.orderstatus !== 'Delivered' &&
              x?.orderstatus !== 'Canceled' &&
              x?.orderstatus !== 'Cancelled'
          );
          setCurrentOrders(currentitemsList);
          let previousitemsList = data?.response?.orders.filter(
            x =>
              x?.orderstatus === 'Delivered' &&
              x?.orderstatus !== 'Canceled' &&
              x?.orderstatus !== 'Cancelled'
          );
          setPreviousOrders(previousitemsList);
        } catch (error) {}
      }
    } catch (error) {}
  }, [data?.response]);

  useEffect(() => {
    RecordScreenEvent('Shop Track Orders');
    try {
      if (
        route?.params?.type != null &&
        route?.params?.type != undefined &&
        route?.params?.type != '' &&
        route?.params?.type === 'guest' &&
        route?.params?.params != null &&
        route?.params?.params != undefined
      ) {
        try {
          let currentitemsList = [route?.params?.params]?.filter(
            x => x?.orderstatus !== 'Delivered'
          );
          setCurrentOrders(currentitemsList);
          let previousitemsList = [route?.params?.params].filter(
            x => x?.orderstatus === 'Delivered'
          );
          setPreviousOrders(previousitemsList);
        } catch (error) {}
      }
    } catch (error) {}
  }, []);

  return (
    <View
      style={{
        backgroundColor: colors.BG_COLOR_WHITE,
        flex: 1,
      }}>
      <HeaderComponent
        showBackButton={true}
        headerTitle={t('trackorder')}
        statusBarColor={colors.WHITE}
        isHeaderTextPressDisabled
        showBanner={false}
        type={'shoponapp'}
      />

      <ScrollView
        style={{
          marginHorizontal: tabletMargin(),
        }}>
        {currentOrders != null &&
          currentOrders !== undefined &&
          currentOrders.length > 0 && (
            <OngoingTrackOrder
              onGoingOrders={currentOrders}
              title={
                route?.params?.type != null &&
                route?.params?.type != undefined &&
                route?.params?.type != '' &&
                route?.params?.type === 'guest'
                  ? ''
                  : data?.response?.ongoingordertext
              }
              orderstatuslist={
                route?.params?.params?.isFrom === 'ReceiptPage'
                  ? data?.response?.orderstatuslist
                  : data?.response?.orderstatuslist
              }
            />
          )}

        {previousOrders != null &&
          previousOrders !== undefined &&
          previousOrders.length > 0 && (
            <View style={styles.previous}>
              <TrackPreviousOrder
                previousOrders={previousOrders}
                title={
                  route?.params?.type != null &&
                  route?.params?.type != undefined &&
                  route?.params?.type != '' &&
                  route?.params?.type === 'guest'
                    ? ''
                    : data?.response?.previousordertext
                }
              />
            </View>
          )}
        {data?.status === '-1' &&
        previousOrders?.length === 0 &&
        currentOrders?.length === 0 &&
        !isLoading ? (
          <View style={styles.previous}>
            <ErrorComponent
              showcard={true}
              defmessage={data?.message || t('nodata')}
            />
          </View>
        ) : (
          previousOrders?.length === 0 &&
          currentOrders?.length === 0 &&
          !isLoading && (
            <View style={styles.previous}>
              <ErrorComponent showcard={true} defmessage={t('nodata')} />
            </View>
          )
        )}
        {faqResp?.faqs?.length > 0 ? (
          <View style={{bottom: VERTICAL_20}}>
            <Faqs
              title={faqResp?.category?.name}
              listData={faqResp?.faqs}
              isFrom={'ReceiptPage'}
            />
          </View>
        ) : null}
      </ScrollView>
      {(trackOrder?.isFetching || trackOrder?.isLoading || isLoading) && (
        <View style={styles.loading}>
          <LoadingIndicator
            shouldDismissManual
            isVisible={
              trackOrder?.isFetching || trackOrder?.isLoading || isLoading
            }
          />
        </View>
      )}
    </View>
  );
};

export default TrackOrders;

const styles = StyleSheet.create({
  previous: {
    backgroundColor: colors.WHITE,
    // marginBottom: heightPixel(80),
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
