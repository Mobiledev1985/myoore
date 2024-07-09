import React, {useEffect, useState} from 'react';
import {BackHandler, Platform, SafeAreaView, View} from 'react-native';
import colors from '../../resources/styles/colors';
import OrderCompleted from '../../components/shopOnApp/OrderCompleted';
import OrderDetail from '../../components/shopOnApp/orderDetail';
import {ScrollView} from 'react-native';
import TrackYourOrder from '../../components/shopOnApp/TrackYourOrder';
import Faqs from '../../components/shopOnApp/Faqs';
import BottomButton from '../../components/shopOnApp/BottomButton';
import {
  GET_CATEGORY_FAQ,
  GET_DYNAMIC_CARDS_API,
  ORDER_DETAILS_API,
  ORDER_STATUS_UPDATE,
} from '../../resources/route/endpoints';
import {useMutation} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import CircleBanner from '../../UIComponent/p_common/CircleBanner';
import OrderDetailModal from '../../models/shopOnApp/OrderDetailModal';
import Rating from '../../models/shopOnApp/RatingUs';
import ScreenName from '../../navigator/ScreenName';
import {RecordScreenEvent, RecordlogEvents} from '../../analytics/RecordEvents';
import {setItem} from '../../commonHelper/utils';
import {
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
} from '../../commonHelper/Constants';
import DeliveryCard from '../../components/shopOnApp/DeliveryCard';
import AmountSummery from '../../components/shopOnApp/AmountSummery';
import ToolTip from '../../models/shopOnApp/ToolTip';
import {HEIGHT_30} from '../../resources/styles/responsive';

const ConfirmationPage = ({route}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const [orderResponse, setOrderResponse] = useState('');
  const [faqResp, setFaqResp] = useState('');
  const [isOrderSuccess, setOrderSuccess] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [isPayMntPressed, setPayMntPressed] = useState(false);
  const [isPayAdvcPressed, setPayAdvcPressed] = useState(false);

  const item = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item
    : '';

  const paymentItem = route?.params?.params?.params?.paymentItem
    ? route?.params?.params?.params?.paymentItem
    : '';
  const userDetails = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item?.physicalsimdata
    : '';

  const selectedNumberObj = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item?.selectednumberobject
    : '';

  const parentProductDetails = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item?.parentProduct
    : '';

  const childProductDetails = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item?.childProduct
    : '';

  const addcartresponse = route?.params?.params?.params?.item
    ? route?.params?.params?.params?.item?.addcartresponse
    : '';

  const promoData = route?.params?.params?.promoData
    ? route?.params?.params?.promoData
    : '';

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isFocused])
  );
  useEffect(() => {
    RecordScreenEvent('Shop Confirmation Screen');
    global.shoptransactionStatus = 'completed';
    setLoading(true);
    orderDetailAPI.mutate();
    getFaqs.mutate();
  }, []);

  const orderStatusUpdate = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          '',
          ORDER_STATUS_UPDATE,
          {
            orderid: route?.params?.params?.orderId?.id,
            status: 'canceled',
          },
          {},
        ],
      }),

    {
      onSuccess: (udata, variables, context) => {
        if (udata != null && udata != undefined && udata?.data != null) {
          if (udata?.data?.status === '0') {
            navigation.pop(2);
          }
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const orderDetailAPI = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          ORDER_DETAILS_API,
          {
            orderid: route?.params?.params?.orderId?.id,
            email: route?.params?.params?.orderId?.customeremail,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setLoading(false);
        if (data?.data?.status === '0') {
          if (
            data?.data?.response?.paymentstatus == 'success' ||
            data?.data?.response?.paymentstatus == 'pending'
          ) {
            PlaceorderCTEvent(
              data?.data?.response?.paymentstatus,
              data?.data?.message
            );
            setOrderSuccess(true);
            setOrderResponse(data?.data?.response);
          } else {
            PlaceorderCTEvent(
              data?.data?.response?.paymentstatus,
              data?.data?.message
            );
            setOrderSuccess(false);
            setOrderResponse(data?.data?.response);
          }
        } else {
          PlaceorderCTEvent(
            data?.data?.response?.paymentstatus,
            data?.data?.message
          );
          setOrderSuccess(false);
          setOrderResponse(data?.data?.response);
        }
      },
      onError: (error, variables, context) => {
        PlaceorderCTEvent('Failure', '');
        setLoading(false);
      },
    }
  );

  const PlaceorderCTEvent = (Status, statusdescription) => {
    try {
      RecordlogEvents('Place Order', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Payment Method': paymentItem?.channel, //knet,creditcard,applepay,googlepay,
        'Total Amount': promoData?.grandtotalamount
          ? promoData?.grandtotalamount
          : addcartresponse?.carttotalprice, //total payment price,
        'Discount Amount': promoData?.discountamount
          ? promoData?.discountamount
          : '',
        Status: Status,
        statusdescription: statusdescription,
        Type: 'Place Order Completed',
      });
    } catch (e) {}
  };

  const getFaqs = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GET_CATEGORY_FAQ,
          {
            faqid: 17,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        if (data?.data?.status === '0') {
          setFaqResp(data?.data?.response);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.BG_COLOR_WHITE,
        paddingTop: Platform.OS == 'android' ? HEIGHT_30 : 0,
      }}>
      <SafeAreaView>
        <ScrollView
          contentContainerStyle={{
            backgroundColor: colors.BG_COLOR_WHITE,
            paddingBottom: 100,
          }}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
          scrollEnabled={true}
          bounces={true}>
          {orderResponse ? (
            <>
              {orderResponse ? (
                <OrderCompleted
                  isSuccess={isOrderSuccess}
                  responseData={orderResponse}
                  migrationData={item?.selectedNumMigPortRes}
                  globalData={
                    global?.shopOnAppSettings?.receiptpageconfigurations
                  }
                  onTryAgainPress={() => {
                    setItem(SHOP_CART_ID, '');
                    setItem(SHOP_ITEM_ID, '');
                    setItem(SHOP_ACCOUNT_ID, '');
                    setItem(SHOP_CART_TIME, '');
                    if (
                      global?.shopOnAppSettings?.receiptpageconfigurations
                        ?.allow_payment_tryagain == 'T'
                    ) {
                      orderStatusUpdate.mutate();
                    } else {
                      navigation.reset({
                        index: 0,
                        routes: [{name: ScreenName.shopScreen}],
                      });
                    }
                  }}
                  item={item}
                />
              ) : null}

              {orderResponse ? (
                <OrderDetail
                  isSuccess={isOrderSuccess}
                  responseData={orderResponse}
                  migrationData={item?.selectedNumMigPortRes}
                  globalData={
                    global?.shopOnAppSettings?.receiptpageconfigurations
                  }
                  onDetailPress={() => {
                    setModalOpen(true);
                  }}
                />
              ) : null}

              {orderResponse?.items[0]?.simtype != 'esim' &&
              orderResponse?.paymentstatus != 'success' &&
              item?.selectedNumMigPortRes?.type != 'migration' ? (
                <DeliveryCard
                  data={global?.shopOnAppSettings?.summarypageconfigurations}
                  item={item}
                  userDetails={userDetails}
                  numderObj={selectedNumberObj}
                  isFrom="ConfirmationPage"
                />
              ) : null}

              {orderResponse?.paymentstatus != 'success' ? (
                <AmountSummery
                  data={global?.shopOnAppSettings?.summarypageconfigurations}
                  item={item}
                  parentProduct={parentProductDetails}
                  childProduct={childProductDetails}
                  numderObj={selectedNumberObj}
                  grandTotall={promoData}
                  addcartresponse={addcartresponse}
                  onpayMonthlyPress={() => {
                    setPayMntPressed(true);
                  }}
                  onpayAdvancePressed={() => {
                    setPayAdvcPressed(true);
                  }}
                />
              ) : null}

              {global?.shopOnAppSettings?.receiptpageconfigurations
                ?.show_track_order_section == 'T' &&
              orderResponse?.items[0]?.simtype != 'esim' &&
              orderResponse?.paymentstatus == 'success' &&
              item?.selectedNumMigPortRes?.type != 'migration' &&
              item?.selectedNumMigPortRes?.type != 'portin' ? (
                <TrackYourOrder
                  data={global?.shopOnAppSettings?.receiptpageconfigurations}
                  isFrom={'ReceiptPage'}
                  responseData={orderResponse}
                />
              ) : null}

              {global?.shopOnAppSettings?.receiptpageconfigurations
                ?.show_banner_section == 'T' &&
              orderResponse?.paymentstatus == 'success' ? (
                <CircleBanner
                  sourceitem={{
                    method: GET_DYNAMIC_CARDS_API,
                    sourceid:
                      global?.shopOnAppSettings?.receiptpageconfigurations
                        ?.receipt_page_banner_dynamiccardtype,
                  }}
                  urlKey={'shopOnAppBanner'}
                  key={''}
                  showfullbanner={true}
                  pmsitem={''}
                  type={'shopOnAppPage'}
                />
              ) : null}

              {global?.shopOnAppSettings?.receiptpageconfigurations
                ?.show_banner_section == 'T' &&
              orderResponse?.paymentstatus == 'success' ? (
                <Rating />
              ) : null}

              {global?.shopOnAppSettings?.receiptpageconfigurations
                ?.show_order_faq_section == 'T' &&
              orderResponse?.paymentstatus == 'success' ? (
                <>
                  {faqResp?.faqs?.length > 0 ? (
                    <Faqs
                      title={faqResp?.category?.name}
                      listData={faqResp?.faqs}
                      isFrom={'ReceiptPage'}
                    />
                  ) : null}
                </>
              ) : null}
            </>
          ) : null}
        </ScrollView>
      </SafeAreaView>

      {isModalOpen && (
        <OrderDetailModal
          visible={isModalOpen}
          responseData={orderResponse}
          migrationData={item?.selectedNumMigPortRes}
          globalData={global?.shopOnAppSettings?.receiptpageconfigurations}
          onClose={() => {
            setModalOpen(false);
          }}
        />
      )}

      {orderResponse ? (
        <BottomButton
          text={
            global?.shopOnAppSettings?.receiptpageconfigurations
              ?.continue_shopping_btn
          }
          onPress={() => {
            setItem(SHOP_CART_ID, '');
            setItem(SHOP_ITEM_ID, '');
            setItem(SHOP_ACCOUNT_ID, '');
            setItem(SHOP_CART_TIME, '');
            navigation.reset({
              index: 0,
              routes: [{name: ScreenName.shopScreen}],
            });
          }}
        />
      ) : null}

      {(orderDetailAPI.isLoading || isLoading) && (
        <LoadingIndicator
          shouldDismissManual
          isVisible={isLoading || orderDetailAPI.isLoading}
        />
      )}

      {isPayMntPressed && (
        <ToolTip
          isVisible={isPayMntPressed}
          onClose={() => {
            setPayMntPressed(false);
          }}
          desc={
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.paymonthly_tooltip_text
          }
        />
      )}
      {isPayAdvcPressed && (
        <ToolTip
          isVisible={isPayAdvcPressed}
          onClose={() => {
            setPayAdvcPressed(false);
          }}
          desc={
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.payadvance_tooltip_text
          }
        />
      )}
    </View>
  );
};

export default ConfirmationPage;
