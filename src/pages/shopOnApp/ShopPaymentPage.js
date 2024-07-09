/* eslint-disable no-undef */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
  ScrollView,
  DeviceEventEmitter,
} from 'react-native';
import colors from '../../resources/styles/colors';
import HeaderComponent from '../../models/basic/HeaderComponent';
import {useTranslation} from 'react-i18next';
import HeaderStatusbar from '../../components/shopOnApp/HeaderStatusBar';
import DeliveryCard from '../../components/shopOnApp/DeliveryCard';
import DeliveryType from '../../components/shopOnApp/DeliveryType';
import PromoCode from '../../components/shopOnApp/PromoCode';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import BottomButton from '../../components/shopOnApp/BottomButton';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import ScreenName from '../../navigator/ScreenName';
import PaySelectionModal from '../../components/shopOnApp/PaySelectionModal';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {
  EndPointUserDetails,
  GET_PAYMENT_LIST,
  GET_SAVE_CARD_CUSTOMERID,
  GET_TERMS_AND_CONDITIONS,
  PLACE_ORDER_API,
  SHOP_PAYMENT_LINK,
  UNRESERVE_API,
  UNRESERVE_NUMBER,
} from '../../resources/route/endpoints';
import BottomPayButton from '../../components/shopOnApp/BottomPayButton';
import RNGoSell from '@tap-payments/gosell-sdk-react-native';
import DeviceInfo from 'react-native-device-info';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import {GetCacheKey} from '../../services/CacheUtil';
import {appCredentials} from '../../../sdkConfigurations';
import {
  GetMobileNo,
  getGlobalSettingValue,
  shopPriceCalculation,
} from '../../services/CommonUtils';
import SummeryCard from '../../components/shopOnApp/SummeryCard';
import {HEIGHT_100} from '../../resources/styles/responsive';
import ReturnRefundCard from '../../components/shopOnApp/ReturnRefundCard';
import AmountSummery from '../../components/shopOnApp/AmountSummery';
import ReturnRefundModal from '../../components/shopOnApp/ReturnRefundModal';
import Toast from 'react-native-simple-toast';
import BottomPlan from '../../models/shopOnApp/BottomPlan';
import {useDispatch, useSelector} from 'react-redux';
import {
  AllowedCardNetworks,
  AllowedMethods,
  SdkMode,
  getGooglePayToken,
  TapCurrencyCode,
  GoogleToken,
  getTapToken,
  TapToken,
} from '@tap-payments/google-pay-rn';
import SupportedCountryModal from '../../models/templates/SupportedCountryModal';
import {
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import ToolTip from '../../models/shopOnApp/ToolTip';
import CircularProgressBar from '../../components/shopOnApp/CircularProgressBar';
import TimeOutPopup from '../../models/shopOnApp/TimeOutPopup';
import {
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
  isDeviceHuawei,
} from '../../commonHelper/Constants';
import {setItem} from '../../commonHelper/utils';
import {RecordScreenEvent, RecordlogEvents} from '../../analytics/RecordEvents';
import {NavigateByName} from '../../services/NavigationService';
import ToastPopup from '../../commonHelper/ToastPopup';
import {output} from '../../commonHelper/ApiHeaders';
const {PaymentTypes, AllowedCadTypes, TrxMode, SDKMode} =
  RNGoSell.goSellSDKModels;

const PaymentPage = ({route}) => {
  const dispatch = useDispatch();
  const state = useSelector(stateObj => stateObj.userData);
  const isLoggedIn = state.isLoggedIn;
  const reduxState = useSelector(state => state);
  const userdetailskey = GetCacheKey('MANAGE_CARDS_USER_DETAILS');
  const {t} = useTranslation();
  const navigation = useNavigation();
  const [showTimeOutPopup, setshowTimeOutPopup] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [paymentList, setPaymentList] = useState('');
  const [selectedPayMethod, setSelectedPayMethod] = useState('');
  const [selectedPayMethodIndex, setSelectedPayMethodIndex] = useState('');
  const [isPayMethodSelected, setIsPayMethodSelected] = useState(false);
  const [showErrorModal, setshowErrorModal] = useState(false);
  const [showfailureModal, setshowfailureModal] = useState(false);
  const [isdisabled, setisdisabled] = useState(false);
  const [msg, setmsg] = useState('');
  const [failuremsg, setfailuremsg] = useState('');
  const [failureTitle, setfailureTitle] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [policyData, setPolicyData] = useState('');
  const [addedCardNum, setAddedCardNum] = useState('');
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const isFrom = useRef('');
  const [promoData, sePromoData] = useState('');
  const [promoText, setPromoText] = useState('');
  const [deliveryTypeObj, setDeliveryTypeObj] = useState('');
  const [loader, setLoader] = useState(false);
  const [applePaymentData, setApplePaymentData] = useState(null);
  const [tokenization, setTokenization] = useState(null);
  const [isPayMntPressed, setPayMntPressed] = useState(false);
  const [isPayAdvcPressed, setPayAdvcPressed] = useState(false);
  const [showToast, setshowToast] = useState(false);
  const [stateuserdata, setstateuserdata] = useState(null);
  const [placeOrderButtondisable, setPlaceOrderButtondisable] = useState(false);
  const [userDetails, setUserDetails] = useState(
    route?.params?.params?.item
      ? route?.params?.params?.item?.physicalsimdata
      : ''
  );
  const paymentObj = useRef(null);

  const item = route?.params?.params?.item ? route?.params?.params?.item : '';

  const parentProductDetails = route?.params?.params?.item
    ? route?.params?.params?.item?.parentProduct
    : '';

  const childProductDetails = route?.params?.params?.item
    ? route?.params?.params?.item?.childProduct
    : '';

  const addcartresponse = route?.params?.params?.item
    ? route?.params?.params?.item?.addcartresponse
    : '';

  const selectedNumberObj = route?.params?.params?.item
    ? route?.params?.params?.item?.selectednumberobject
    : '';

  const simType = route?.params?.params?.item
    ? route?.params?.params?.item?.simtype
    : '';

  const transID = route?.params?.params?.item
    ? route?.params?.params?.item?.transid
    : '';

  const configID = route?.params?.params?.item
    ? route?.params?.params?.item?.configpid
    : '';
  const cartID = route?.params?.params?.item
    ? route?.params?.params?.item?.cartID
    : '';

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.PaymentPage,
    show: false,
  });

  useFocusEffect(
    React.useCallback(() => {
      setisdisabled(false);
    }, [])
  );

  useEffect(() => {
    RecordScreenEvent('Shop Summery');
    getPaymentList.mutate();
    getTermsAndConditions.mutate();
    const popUpListener = DeviceEventEmitter.addListener(
      'closeTimerModal',
      () => {
        setshowTimeOutPopup(false);
      }
    );
    return () => {
      popUpListener.remove();
    };
  }, []);

  // const userdetailsdata = useQuery(
  //   [userdetailskey, EndPointUserDetails.url, {}, {}, true],
  //   {
  //     retry: false,
  //     cacheTime: 0,
  //     staleTime: 0,
  //   }
  // );

  React.useEffect(() => {
    try {
      userdetailsdata.mutate();
    } catch (r) {}
  }, []);

  const userdetailsdata = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, EndPointUserDetails.url, {}, {}, true],
      }),
    {
      onSuccess: (udata, variables, context) => {},
      onError: (error, variables, context) => {},
    }
  );

  const PlaceorderCTEvent = (Status, statusdescription) => {
    try {
      RecordlogEvents('Place Order', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        'Payment Method':
          promoData?.grandtotalamount == 0 ||
          addcartresponse?.carttotalprice == 0
            ? 'free'
            : selectedPayMethod?.channel, //knet,creditcard,applepay,googlepay,
        'Total Amount': promoData?.grandtotalamount
          ? promoData?.grandtotalamount
          : addcartresponse?.carttotalprice, //total payment price,
        'Discount Amount': promoData?.discountamount
          ? promoData?.discountamount
          : '',
        Status: Status,
        statusdescription: statusdescription,
        Type: 'Place Order Initiation',
      });
    } catch (e) {}
  };

  const PlaceOrder = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          PLACE_ORDER_API,
          {
            transid: transID,
            quoteid: cartID,
            paymentmethod:
              promoData?.grandtotalamount == 0 ||
              addcartresponse?.carttotalprice == 0
                ? 'free'
                : selectedPayMethod?.channel, //knet,creditcard,applepay,googlepay
            firstname:
              userDetails?.firstname || global.ShopOnAPPAddressObj?.firstName,
            lastname:
              userDetails?.lastname || global.ShopOnAPPAddressObj?.lastName,
            email:
              userDetails?.email ||
              route?.params?.params?.item?.physicalsimdata?.esimemail ||
              route?.params?.params?.item?.physicalsimdata?.email ||
              item?.contactemail ||
              '',
            telephone: item?.contactnumber,
            street: userDetails?.street || global.ShopOnAPPAddressObj?.street,
            region:
              userDetails?.governoratevalue ||
              global.ShopOnAPPAddressObj?.governoratevalue,
            city:
              userDetails?.areavalue || global.ShopOnAPPAddressObj?.areavalue,
            postcode: '',
            countryid: 'KW',
            couponcode: promoText ? promoText : '',
            shippingmethod: deliveryTypeObj?.code,
            onboardingtype:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ||
              'onboarding',
            discountprice: promoData?.discountamount
              ? promoData?.discountamount
              : '',
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setPlaceOrderButtondisable(false);
        if (data?.data?.status === '0') {
          setItem(SHOP_CART_ID, '');
          setItem(SHOP_ITEM_ID, '');
          setItem(SHOP_ACCOUNT_ID, '');
          setItem(SHOP_CART_TIME, '');
          var AllItem = {
            params: route?.params?.params,
            orderId: data?.data?.response,
            promoData: promoData ? promoData : '',
          };
          paymentObj.current = AllItem;
          PlaceorderCTEvent('Success', data?.data?.message);
          if (
            promoData?.grandtotalamount == 0 ||
            addcartresponse?.carttotalprice == 0
          ) {
            global.prevTime = null;
            navigation.navigate(ScreenName.ConfirmationPage, {
              type: 'shoponapp',
              action: 'shoponapp',
              params: paymentObj.current,
            });
          } else {
            ShopPaymentLInk.mutate();
          }
        } else {
          PlaceorderCTEvent('Failure', data?.data?.message);
          setshowfailureModal(true);
          setfailureTitle(
            data?.data?.infomsg ? data?.data?.infomsg : t('oops')
          );
          setfailuremsg(
            data?.data?.message ? data?.data?.message : t('somethingwentwrong')
          );
        }
      },
      onError: (error, variables, context) => {
        setPlaceOrderButtondisable(false);
        console.log(error);
        setshowfailureModal(true);
        setfailureTitle(t('oops'));
        setfailuremsg(t('somethingwentwrong'));
      },
    }
  );

  const ShopPaymentLInk = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_PAYMENT_LINK,
          {
            quoteid: cartID, //cartid
            productid: childProductDetails
              ? childProductDetails?.id
              : parentProductDetails && parentProductDetails?.id,
            linetype: childProductDetails
              ? childProductDetails?.plantype
              : parentProductDetails && parentProductDetails?.plantype, //select product linetype
            transid: transID ? transID : '', //transid generated after number reserve
            msisdn: selectedNumberObj ? selectedNumberObj?.MSISDN : '', //selected number
            numberprice: selectedNumberObj ? selectedNumberObj?.Price : '', //selected number price
            paymentchannel: selectedPayMethod?.channel, //KNET or CREDIT
            transactiontype: item?.onboardingtype, //onboarding,migration,portin
            totalprice: promoData?.grandtotalamount
              ? promoData?.grandtotalamount
              : addcartresponse?.carttotalprice, //total payment price
            discountprice: promoData?.discountamount
              ? promoData?.discountamount
              : '', //discount price after coupon applied
            itemtype: '', // NA
            itemid: '', // NA
            itemcategory: '', // NA
            itemsubcategory: '', // NA
            itemdesc: '', // NA
            itemprice: childProductDetails
              ? childProductDetails?.price
              : parentProductDetails && parentProductDetails?.price,
            discounttype: '', // NA
            couponcode: promoText ? promoText : '', //coupon code if any
            couponvalue: selectedNumberObj
              ? selectedNumberObj?.discountamount
              : '', //discount value in applypromocode response
            siebelrowid: '', // NA
            isgooglepay:
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLEPAY'
                ? 'T'
                : '', //T or empty
            paymentData:
              selectedPayMethod?.optiontype?.toUpperCase() == 'APPLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'APPLEPAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLEPAY'
                ? applePaymentData
                : '', //in case of google and apple pay
            isapplepay:
              selectedPayMethod?.optiontype?.toUpperCase() == 'APPLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'APPLEPAY'
                ? 'T'
                : '', //T or empty
            cardid: selectedPayMethod?.cardid || '', //saved card case pass card id
            tokenid: tokenization?.token || '',
            savecard:
              tokenization?.save_card === true ||
              tokenization?.save_card === 'true' ||
              selectedPayMethod?.cardid != null ||
              selectedPayMethod?.cardid !== undefined ||
              selectedPayMethod?.cardid !== ''
                ? 'Y'
                : 'N',
            gtokenid:
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() == 'GOOGLEPAY'
                ? applePaymentData?.id || ''
                : '', //googlepay case send gtokenid
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setItem(SHOP_CART_ID, '');
        setItem(SHOP_ITEM_ID, '');
        setItem(SHOP_ACCOUNT_ID, '');
        setItem(SHOP_CART_TIME, '');
        if (data?.data?.status === '0') {
          navigation.navigate(ScreenName.webviewScreen, {
            url: data?.data?.response?.paymenturl,
            headerTitle: t('pay'),
            type: 'shoponapp',
            deeplink: data?.data?.deeplink,
            action: 'shoponapp',
            item: data?.data?.response,
            paymentItem: selectedPayMethod,
            paymenttype: selectedPayMethod?.channel,
            reduxState: reduxState,
            isLoggedIn: isLoggedIn,
            dispatchvalue: dispatch,
            params: paymentObj.current,
          });
        } else {
          setshowfailureModal(true);
          setfailureTitle(
            data?.data?.infomsg ? data?.data?.infomsg : t('oops')
          );
          setfailuremsg(
            data?.data?.message ? data?.data?.message : t('somethingwentwrong')
          );
        }
      },
      onError: (error, variables, context) => {
        setshowfailureModal(true);
        setfailureTitle(t('oops'));
        setfailuremsg(t('somethingwentwrong'));
      },
    }
  );

  const getTermsAndConditions = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GET_TERMS_AND_CONDITIONS,
          {
            segmentid:
              global?.shopOnAppSettings?.summarypageconfigurations
                ?.refund_policy_segmentid,
            iseshop: false,
            childlineflag: false,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        if (data?.data?.status === '0') {
          setPolicyData(data?.data?.response[0]?.ProductDetails?.summary);
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  const saveCustomerIdApi = useMutation(
    req =>
      callQueryapi({
        queryKey: ['', GET_SAVE_CARD_CUSTOMERID, {cid: customerId || ''}],
      }),
    {
      onSuccess: udata => {
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            getPaymentList.mutate();
            setstateuserdata(udata?.data?.response);
            setshowToast(true);
            setTimeout(() => {
              setshowToast(false);
              setIsPayModalOpen(true);
            }, 2000);
          } else {
            setstateuserdata(udata?.data?.response);
            setshowToast(true);
            setTimeout(() => {
              setshowToast(false);
            }, 2000);
            setShowLoader(false);
          }
        }
      },
      onError: (uerror, variables, context) => {
        setShowLoader(false);
      },
    }
  );

  const getPaymentList = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          ,
          GET_PAYMENT_LIST,
          {purchasetype: 'shopon', points: '0', price: '55', type: ''},
          {},
        ],
      }),

    {
      onSuccess: (udata, variables, context) => {
        setShowLoader(false);
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            if (udata?.data?.response?.length > 0) {
              var paymentsListArray = [];
              for (let a = 0; a < udata?.data?.response?.length; a++) {
                var obj = udata?.data?.response[a];
                obj.index = a;
                if (
                  obj?.optiontype?.toUpperCase() === 'GOOGLE PAY' &&
                  isDeviceHuawei &&
                  !output?.hasGms
                ) {
                } else if (
                  obj?.optiontype?.toUpperCase() === 'REQUEST FRIEND' &&
                  isDeviceHuawei &&
                  !output?.hasGms
                ) {
                } else {
                  paymentsListArray.push(obj);
                }
              }
            }
            setPaymentList(paymentsListArray);
            if (addedCardNum && addedCardNum != '') {
              udata?.data?.response?.map((item, index) => {
                if (item?.cardnumber == addedCardNum) {
                  setSelectedPayMethod(item);
                  setSelectedPayMethodIndex(index);
                  return;
                }
              });
            }
          } else {
            setshowfailureModal(true);
            setfailureTitle(
              udata?.data?.infomsg ? udata?.data?.infomsg : t('oops')
            );
            setfailuremsg(
              udata?.data?.message
                ? udata?.data?.message
                : t('somethingwentwrong')
            );
          }
        }
      },
      onError: (uerror, variables, context) => {
        setShowLoader(false);
      },
    }
  );

  const unReserveNumber = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          '',
          UNRESERVE_API,
          {
            unreserve_msisdn:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
              'portin'
                ? route?.params?.params?.item?.pmsisdn
                : selectedNumberObj?.MSISDN,
            doremovecart: 'T', //T or F
            cartid: cartID, //cartid from add to cart api
            itemid: item?.itemID, //itemid from add to cart api
            accountid: item?.accountID || '',
            onboardingtype:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ||
              'onboarding',
          },
        ],
      }),
    {
      onSuccess: udata => {
        setItem(SHOP_CART_ID, '');
        setItem(SHOP_ITEM_ID, '');
        setItem(SHOP_ACCOUNT_ID, '');
        setItem(SHOP_CART_TIME, '');
        setShowLoader(false);
        let temp = isFrom.current;
        isFrom.current = '';
        if (temp === 'Plan') {
          NavigateByName(navigation, 'shoponapp', null, null);
        } else {
          try {
            var finalItem = {
              parentProduct: parentProductDetails,
              childProduct: childProductDetails,
            };
            global.NewSimNumberSliderItem = null;
            // navigation.reset({
            //   index: 1,
            //   routes: [
            //     {name: navigation.navigate(ScreenName.PayStack)},
            //     {
            //       name: navigation.navigate(ScreenName.ShopOnAppLandingPage),
            //     },
            //   ],
            // });
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

            NavigateByName(
              navigation,
              ScreenName.OrderNewSimScreen,
              finalItem,
              null
            );
          } catch (e) {}
        }
      },
      onError: (uerror, variables, context) => {
        setShowLoader(false);
      },
    }
  );

  //Saved card
  const startSDK = async () => {
    try {
      if (isdisabled === false) {
        if (Platform.OS == 'ios') {
          const osVersion = DeviceInfo.getSystemVersion();
          var myInt = parseInt(osVersion);
          if (myInt < 13) {
            setshowErrorModal(true);
            setmsg(getGlobalSettingValue('deviceversiontapcheck'));
            return;
          }
        }
        setisdisabled(true);

        if (
          userdetailsdata?.data?.data?.response?.customerid != null &&
          userdetailsdata?.data?.data?.response?.customerid !== undefined &&
          userdetailsdata?.data?.data?.response?.customerid !== ''
        ) {
          await (RNGoSell.goSellSDK &&
            RNGoSell.goSellSDK.startPayment(existingcustomer, 0, handleResult));
        } else {
          await (RNGoSell.goSellSDK &&
            RNGoSell.goSellSDK.startPayment(newcustomer, 0, handleResult));
        }
      } else {
        Toast.show('Please wait...');
        setShowLoader(false);
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const existingcustomer = {
    appCredentials: appCredentials,
    sessionParameters: {
      paymentStatementDescriptor: '',
      transactionCurrency: 'kwd',
      isUserAllowedToSaveCard: true,
      paymentType: PaymentTypes.ALL,
      shipping: [],
      allowedCadTypes: AllowedCadTypes.ALL,
      paymentitems: [],
      paymenMetaData: {},
      applePayMerchantID: '',
      authorizeAction: {timeInHours: 10, time: 10, type: 'CAPTURE'},
      cardHolderName: '', // THIS REQUIRED
      editCardHolderName: true,
      postURL: '',
      paymentDescription: '',
      destinations: 'null',
      taxes: [],
      merchantID: '',
      SDKMode: SDKMode.Sandbox,
      isRequires3DSecure: true,
      receiptSettings: {id: null, email: false, sms: true},
      allowsToSaveSameCardMoreThanOnce: false,
      paymentReference: {},
      customer: {customerId: userdetailsdata?.data?.data?.response?.customerid},
      amount: '0',
      trxMode: TrxMode.SAVE_CARD,
    },
  };

  const newcustomer = {
    appCredentials: appCredentials,
    sessionParameters: {
      paymentStatementDescriptor: '',
      transactionCurrency: 'kwd',
      isUserAllowedToSaveCard: true,
      paymentType: PaymentTypes.ALL,
      shipping: [],
      allowedCadTypes: AllowedCadTypes.ALL,
      paymentitems: [],
      paymenMetaData: {},
      applePayMerchantID: '',
      authorizeAction: {timeInHours: 10, time: 10, type: 'CAPTURE'},
      cardHolderName: '', // THIS REQUIRED
      editCardHolderName: true,
      postURL: '',
      paymentDescription: '',
      destinations: 'null',
      taxes: [],
      merchantID: '',
      SDKMode: SDKMode.Sandbox,
      isRequires3DSecure: true,
      receiptSettings: {id: null, email: false, sms: true},
      allowsToSaveSameCardMoreThanOnce: false,
      paymentReference: {},
      customer: {
        isdNumber: '965',
        number:
          GetMobileNo(userdetailsdata?.data?.data?.response?.msisdn) ||
          GetMobileNo(global.customerprofile?.Msisdn) ||
          '',
        customerId: userdetailsdata?.data?.data?.response?.customerid || '',
        first_name:
          userdetailsdata?.data?.data?.response?.firstname ||
          userdetailsdata?.data?.data?.response?.msisdn ||
          GetMobileNo(global.customerprofile?.Msisdn) ||
          '',
        middle_name: '',
        last_name:
          userdetailsdata?.data?.data?.response?.lastname ||
          userdetailsdata?.data?.data?.response?.firstname ||
          '-Online',
        email:
          userdetailsdata?.data?.data?.response?.email || 'noreply@mail.com',
      },
      amount: '0',
      trxMode: TrxMode.SAVE_CARD,
    },
  };

  const handleResult = (error, status) => {
    try {
      setisdisabled(false);
      var myString = JSON.stringify(status);
      var resultStr = String(status?.sdk_result);
      switch (resultStr) {
        case 'SUCCESS':
          handleSDKResult(status);
          break;
        case 'FAILED':
          setShowLoader(false);
          break;
        case 'SDK_ERROR':
          setShowLoader(false);
          break;
        case 'NOT_IMPLEMENTED':
          break;
        default:
          setShowLoader(false);
          break;
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const handleSDKResult = result => {
    try {
      setisdisabled(false);

      switch (result.trx_mode) {
        case 'CHARGE':
          global.paymentCustomerID = result?.customer_id || '';
          printSDKResult(result);
          setShowLoader(false);
          break;
        case 'AUTHORIZE':
          printSDKResult(result);
          setShowLoader(false);
          break;
        case 'SAVE_CARD':
          printSDKResult(result);
          setAddedCardNum(result?.card_first_six + result?.card_last_four);
          setCustomerId(result?.customer_id);
          setShowLoader(true);
          saveCustomerIdApi.mutate();
          break;
        case 'TOKENIZE':
          Object.keys(result).map(key => {});
          setShowLoader(false);
          break;
        default:
          setShowLoader(false);
          break;
      }
    } catch (error) {
      setShowLoader(false);
    }
  };

  const printSDKResult = result => {
    try {
      if (!result) {
        return;
      }
      Object.keys(result).map(key => {});
    } catch (error) {}
  };
  //Saved card end

  //Google pay start
  const initGooglePay = useCallback(async () => {
    try {
      if (Platform.OS != 'ios') {
        const osVersion = DeviceInfo.getSystemVersion();
        var myInt = parseInt(osVersion);
        if (myInt < 7) {
          setshowErrorModal(true);
          setmsg(getGlobalSettingValue('deviceversionandroidcheck'));
          return;
        }
      }
      setLoader(true);
      const config = {
        secretKey: appCredentials.sandbox_secrete_key,
        bundleID: appCredentials.bundleID,
        countryCode: 'KW',
        transactionCurrency: TapCurrencyCode.KWD,
        allowedCardNetworks: [
          AllowedCardNetworks.VISA,
          AllowedCardNetworks.AMEX,
        ],
        allowedCardAuthMethods: AllowedMethods.all,
        environmentMode: SdkMode.sandbox,
        gatewayId: getGlobalSettingValue('googlepaygateway'),
        gatewayMerchantID: getGlobalSettingValue('googlepaygatewayMerchantId'),
        amount: promoData
          ? parseFloat(promoData?.grandtotalamount)
          : childProductDetails
          ? parseFloat(childProductDetails?.price)
          : parseFloat(parentProductDetails && parentProductDetails?.price) +
            parseFloat(selectedNumberObj?.Price),
      };

      console.log('config', config);
      const res: TapToken = await getTapToken(config);
      // let res: TapToken = await getTapToken(config);
      setApplePaymentData(res);
      if (res != null && res != undefined && res != '') {
        setTimeout(() => {
          setLoader(false);
          setisdisabled(false);
        }, 1500);
        // onClickContinue();
        if (
          global?.shopOnAppSettings?.summarypageconfigurations
            ?.Max_time_exceed >= global.prevTime &&
          route?.params?.params?.item?.selectedNumMigPortRes?.type !==
            'migration' &&
          route?.params?.params?.item?.selectedNumMigPortRes?.type !== 'portin'
        ) {
          setshowfailureModal(true);
          setfailureTitle(
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.placeorder_not_allow_title || t('oops')
          );
          setfailuremsg(
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.placeorder_not_allow_message
          );
        } else {
          setPlaceOrderButtondisable(true);
          PlaceOrder.mutate();
        }
      } else {
        setisdisabled(false);
        setLoader(false);
      }
    } catch (error) {
      setLoader(false);
      setisdisabled(false);
    }
  }, []);

  //Google pay end

  const getPrice = () => {
    try {
      var price = promoData
        ? promoData?.grandtotalamount
        : parseFloat(
            childProductDetails
              ? childProductDetails?.price
              : parentProductDetails && parentProductDetails?.price
          ) + parseFloat(selectedNumberObj?.Price) || '0';
      return String(price);
    } catch (error) {}
  };

  //Credit card start
  const newcustomercreditcard = {
    appCredentials: appCredentials,
    sessionParameters: {
      paymentStatementDescriptor: '',
      transactionCurrency: 'kwd',
      isUserAllowedToSaveCard: true,
      paymentType: PaymentTypes.ALL,
      shipping: [],
      allowedCadTypes: AllowedCadTypes.ALL,
      paymentitems: [],
      paymenMetaData: {},
      applePayMerchantID: '',
      authorizeAction: {timeInHours: 10, time: 10, type: 'CAPTURE'},
      cardHolderName: '', // THIS REQUIRED
      editCardHolderName: true,
      postURL: '',
      paymentDescription: '',
      destinations: 'null',
      taxes: [],
      merchantID: '',
      SDKMode: SDKMode.Sandbox,
      isRequires3DSecure: true,
      receiptSettings: {id: null, email: false, sms: true},
      allowsToSaveSameCardMoreThanOnce: false,
      paymentReference: {},
      customer: {
        isdNumber: '965',
        number:
          GetMobileNo(userdetailsdata?.data?.data?.response?.msisdn) ||
          GetMobileNo(global.customerprofile?.Msisdn) ||
          '',
        customerId: userdetailsdata?.data?.data?.response?.customerid || '',
        first_name:
          userdetailsdata?.data?.data?.response?.firstname ||
          userdetailsdata?.data?.data?.response?.msisdn ||
          GetMobileNo(global.customerprofile?.Msisdn) ||
          '',
        middle_name: '',
        last_name:
          userdetailsdata?.data?.data?.response?.lastname ||
          userdetailsdata?.data?.data?.response?.firstname ||
          '-Online',
        email:
          userdetailsdata?.data?.data?.response?.email || 'noreply@mail.com',
      },
      amount: promoData
        ? promoData?.grandtotalamount
        : addcartresponse?.carttotalprice,
      trxMode: TrxMode.TOKENIZE_CARD,
    },
  };

  const existingcustomercreditcard = {
    appCredentials: appCredentials,
    sessionParameters: {
      paymentStatementDescriptor: '',
      transactionCurrency: 'kwd',
      isUserAllowedToSaveCard: true,
      paymentType: PaymentTypes.ALL,
      shipping: [],
      allowedCadTypes: AllowedCadTypes.ALL,
      paymentitems: [],
      paymenMetaData: {},
      applePayMerchantID: '',
      authorizeAction: {timeInHours: 10, time: 10, type: 'CAPTURE'},
      cardHolderName: '', // THIS REQUIRED
      editCardHolderName: true,
      postURL: '',
      paymentDescription: '',
      destinations: 'null',
      taxes: [],
      merchantID: '',
      SDKMode: SDKMode.Sandbox,
      isRequires3DSecure: true,
      receiptSettings: {id: null, email: false, sms: true},
      allowsToSaveSameCardMoreThanOnce: false,
      paymentReference: {},
      customer: {customerId: userdetailsdata?.data?.data?.response?.customerid},
      amount: promoData
        ? promoData?.grandtotalamount
        : addcartresponse?.carttotalprice,
      trxMode: TrxMode.TOKENIZE_CARD,
    },
  };

  const startSDKCreditCard = () => {
    try {
      console.log('isdisabled', isdisabled);
      if (isdisabled === false || isdisabled === true) {
        if (Platform.OS == 'ios') {
          const osVersion = DeviceInfo.getSystemVersion();
          var myInt = parseInt(osVersion);
          if (myInt < 13) {
            setshowErrorModal(true);
            setmsg(getGlobalSettingValue('deviceversiontapcheck'));
            return;
          }
        }
        setisdisabled(true);
        setLoader(true);
        global.paysdkwidgetisopened = true;
        console.log('isdisabled 1', userdetailsdata?.data?.data?.response);

        if (
          userdetailsdata?.data?.data?.response?.customerid != null &&
          userdetailsdata?.data?.data?.response?.customerid !== undefined &&
          userdetailsdata?.data?.data?.response?.customerid !== ''
        ) {
          console.log('isdisabled 2', existingcustomercreditcard);

          RNGoSell.goSellSDK &&
            RNGoSell.goSellSDK.startPayment(
              existingcustomercreditcard,
              0,
              handleResultCreditCard
            );
        } else {
          console.log('isdisabled 3', newcustomercreditcard);

          RNGoSell.goSellSDK &&
            RNGoSell.goSellSDK.startPayment(
              newcustomercreditcard,
              0,
              handleResultCreditCard
            );
        }
      } else {
        Toast.show('Please wait...');
      }
    } catch (error) {}
  };

  const handleResultCreditCard = (error, status) => {
    try {
      setisdisabled(false);
      var myString = JSON.stringify(status);
      setLoader(false);
      global.paysdkwidgetisopened = false;
      var resultStr = String(status.sdk_result);
      switch (resultStr) {
        case 'SUCCESS':
          handleSDKResultCreditCard(status);
          break;
        case 'FAILED':
          handleSDKResultCreditCard(status);
          break;
        case 'SDK_ERROR':
          break;
        case 'NOT_IMPLEMENTED':
          break;
      }
    } catch (error) {
      consoleLog('err', error);
    }
  };

  const handleSDKResultCreditCard = result => {
    try {
      setisdisabled(false);
      setLoader(false);
      switch (result.trx_mode) {
        case 'CHARGE':
          global.paymentCustomerID = result?.customer_id || '';
          printSDKResultCreditCard(result);
          break;
        case 'AUTHORIZE':
          printSDKResultCreditCard(result);
          break;
        case 'SAVE_CARD':
          printSDKResultCreditCard(result);
          break;
        case 'TOKENIZE':
          setTokenization(result);
          // onClickContinue();
          if (
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.Max_time_exceed >= global.prevTime &&
            route?.params?.params?.item?.selectedNumMigPortRes?.type !==
              'migration' &&
            route?.params?.params?.item?.selectedNumMigPortRes?.type !==
              'portin'
          ) {
            setshowfailureModal(true);
            setfailureTitle(
              global?.shopOnAppSettings?.summarypageconfigurations
                ?.placeorder_not_allow_title || t('oops')
            );
            setfailuremsg(
              global?.shopOnAppSettings?.summarypageconfigurations
                ?.placeorder_not_allow_message
            );
          } else {
            setPlaceOrderButtondisable(true);
            PlaceOrder.mutate();
          }
          Object.keys(result).map(key => {});
          break;
      }
    } catch (error) {}
  };

  const printSDKResultCreditCard = result => {
    try {
      setisdisabled(false);
      if (!result) {
        return;
      }
      Object.keys(result).map(key => {});
    } catch (error) {}
  };

  //Credit card end

  //Apple Pay Method Start
  if (Platform.OS === 'ios') {
    const PaymentRequest = require('react-native-payments').PaymentRequest;
    const METHOD_DATA = [
      {
        supportedMethods: ['apple-pay'],
        data: {
          merchantIdentifier: 'merchant.com.wataniya.wataniyakuwait',
          supportedNetworks: ['visa', 'mastercard', 'amex'],
          countryCode: 'KW',
          currencyCode: 'KWD',
        },
      },
    ];

    const DETAILS = {
      id: 'Ooredoo Kuwait',
      displayItems: [
        {
          label:
            childProductDetails !== '' &&
            childProductDetails != null &&
            childProductDetails !== undefined
              ? childProductDetails?.productname
              : parentProductDetails?.productname,
          amount: {
            currency: 'KD',
            value:
              parseFloat(
                promoData
                  ? promoData?.grandtotalamount
                  : addcartresponse?.carttotalprice
              ) || '0',
          },
        },
      ],
      total: {
        label: 'Ooredoo Kuwait',
        amount: {
          currency: 'KD',
          value:
            parseFloat(
              promoData
                ? promoData?.grandtotalamount
                : addcartresponse?.carttotalprice
            ) || '0',
        },
      },
    };

    const paymentRequest = new PaymentRequest(METHOD_DATA, DETAILS);

    paymentRequest.addEventListener('shippingaddresschange', e => {
      // eslint-disable-next-line no-undef
      const updatedDetails = getUpdatedDetailsForShippingAddress(
        paymentRequest.shippingAddress
      );

      e.updateWith(updatedDetails);
    });

    paymentRequest.addEventListener('shippingoptionchange', e => {
      const updatedDetails = getUpdatedDetailsForShippingOption(
        paymentRequest.shippingOption
      );

      e.updateWith(updatedDetails);
    });

    applepay = () => {
      paymentRequest._state = 'created';
      paymentRequest.canMakePayments().then(canMakePayment => {
        if (canMakePayment) {
          paymentRequest.show().then(paymentResponse => {
            // Your payment processing code goes here
            setApplePaymentData(paymentResponse?._details?.paymentData);
            paymentResponse.complete('success');
            // onClickContinue();
            if (
              global?.shopOnAppSettings?.summarypageconfigurations
                ?.Max_time_exceed >= global.prevTime &&
              route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                'migration' &&
              route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                'portin'
            ) {
              setshowfailureModal(true);
              setfailureTitle(
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.placeorder_not_allow_title || t('oops')
              );
              setfailuremsg(
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.placeorder_not_allow_message
              );
            } else {
              setPlaceOrderButtondisable(true);
              PlaceOrder.mutate();
            }
          });
        } else {
          setshowErrorModal(true);
          setmsg(t('unable'));
        }
      });
    };
  }
  //Apple pay MEthod End

  return (
    <View style={styles.mainContainer}>
      <HeaderComponent
        // showAlertIcon={false}
        showHeaderTitle={true}
        showFavouriteButton={false}
        showBanner={false}
        statusBarColor={colors.WHITE}
        headerTitle={t('pay')}
        isHeaderTextPressDisabled={true}
        type={'shoponapp'}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.KeyboardAvoidingViewStyle}>
        <HeaderStatusbar
          elementMeta={global?.shopOnAppSettings?.summarypageconfigurations}
        />
        <ScrollView
          contentContainerStyle={styles.scrollView}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
          bounces={true}>
          <SummeryCard
            data={global?.shopOnAppSettings?.summarypageconfigurations}
            type={
              route?.params?.params?.item?.selectedNumMigPortRes?.type || ''
            }
            parentProduct={parentProductDetails}
            childProduct={childProductDetails}
            numderObj={
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                'migration' ||
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                'portin'
                ? route?.params?.params?.item?.selectedNumMigPortRes
                : selectedNumberObj
            }
            onPlanEditClick={() => {
              setShowLoader(true);
              unReserveNumber.mutate();
              isFrom.current = 'Plan';
            }}
            onNumberEditClick={() => {
              setShowLoader(true);
              global.summaryedittosim = 'true';
              unReserveNumber.mutate();
              isFrom.current = 'Number';
            }}
            item={item}
            onViewDetailPress={() => {
              setDetailModalOpen(true);
            }}
          />

          {simType == 'esim' ||
          route?.params?.params?.item?.selectedNumMigPortRes?.type ==
            'migration' ? null : (
            <>
              <DeliveryCard
                data={global?.shopOnAppSettings?.summarypageconfigurations}
                item={item}
                userDetails={userDetails}
                setUserDetails={setUserDetails}
                numderObj={selectedNumberObj}
                addressId={route?.params?.params?.item?.saveAddressID || ''}
              />
              <DeliveryType
                isLoading={value => setShowLoader(value)}
                selectedMethodObj={obj => {
                  setDeliveryTypeObj(obj);
                }}
                cartID={cartID}
                userDetails={userDetails}
                item={item}
              />
            </>
          )}

          <PromoCode
            isLoading={value => setShowLoader(value)}
            data={global?.shopOnAppSettings?.summarypageconfigurations}
            returnRespObj={obj => {
              sePromoData(obj);
            }}
            returnPromoText={text => setPromoText(text)}
            cartID={cartID}
          />

          <ReturnRefundCard
            onPolicyPress={() => setIsModalOpen(true)}
            data={global?.shopOnAppSettings?.summarypageconfigurations}
          />

          <AmountSummery
            data={global?.shopOnAppSettings?.summarypageconfigurations}
            type={
              route?.params?.params?.item?.selectedNumMigPortRes?.type +
              'summary'
            }
            item={item}
            parentProduct={parentProductDetails}
            childProduct={childProductDetails}
            numderObj={
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                'migration' ||
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                'portin'
                ? route?.params?.params?.item?.selectedNumMigPortRes?.res
                : selectedNumberObj
            }
            grandTotall={promoData}
            addcartresponse={addcartresponse}
            onpayMonthlyPress={() => {
              setPayMntPressed(true);
            }}
            onpayAdvancePressed={() => {
              setPayAdvcPressed(true);
            }}
          />
        </ScrollView>
      </KeyboardAvoidingView>

      {(!isPayMethodSelected || promoData?.grandtotalamount == 0) && (
        <BottomButton
          disable={placeOrderButtondisable}
          text={
            promoData?.grandtotalamount == 0 ||
            addcartresponse?.carttotalprice == 0
              ? global?.shopOnAppSettings?.summarypageconfigurations
                  ?.place_order_btn
              : global?.shopOnAppSettings?.summarypageconfigurations
                  ?.select_payment_method_btn
          }
          onPress={() => {
            if (
              promoData?.grandtotalamount == 0 ||
              addcartresponse?.carttotalprice == 0
            ) {
              if (
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.Max_time_exceed >= global.prevTime &&
                route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                  'migration' &&
                route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                  'portin'
              ) {
                setshowfailureModal(true);
                setfailureTitle(
                  global?.shopOnAppSettings?.summarypageconfigurations
                    ?.placeorder_not_allow_title || t('oops')
                );
                setfailuremsg(
                  global?.shopOnAppSettings?.summarypageconfigurations
                    ?.placeorder_not_allow_message
                );
              } else {
                setPlaceOrderButtondisable(true);
                PlaceOrder.mutate();
              }
            } else setIsPayModalOpen(true);
          }}
        />
      )}

      {isModalOpen && (
        <ReturnRefundModal
          visible={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={policyData ? policyData : ''}
        />
      )}

      {isPayMethodSelected && (
        // !promoData?.grandtotalamount == 0 &&
        // !addcartresponse?.carttotalprice == 0 &&
        <BottomPayButton
          text={
            global?.shopOnAppSettings?.summarypageconfigurations
              ?.place_order_btn
          }
          onPressPlaceOrder={() => {
            if (
              selectedPayMethod?.optiontype?.toUpperCase() === 'GOOGLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'GOOGLEPAY'
            ) {
              initGooglePay();
            } else if (
              selectedPayMethod?.optiontype?.toUpperCase() === 'APPLE PAY' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'APPLEPAY'
            ) {
              applepay();
            } else if (
              selectedPayMethod?.optiontype?.toUpperCase() ===
                'ANOTHER CREDIT CARD' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'VISA' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'MASTER CARD' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'MASTERCARD' ||
              selectedPayMethod?.optiontype?.toUpperCase() === 'AMEX'
            ) {
              if (selectedPayMethod?.issavedcard?.toUpperCase() === 'T') {
                if (
                  global?.shopOnAppSettings?.summarypageconfigurations
                    ?.Max_time_exceed >= global.prevTime &&
                  route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                    'migration' &&
                  route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                    'portin'
                ) {
                  setshowfailureModal(true);
                  setfailureTitle(
                    global?.shopOnAppSettings?.summarypageconfigurations
                      ?.placeorder_not_allow_title || t('oops')
                  );
                  setfailuremsg(
                    global?.shopOnAppSettings?.summarypageconfigurations
                      ?.placeorder_not_allow_message
                  );
                } else {
                  setPlaceOrderButtondisable(true);
                  PlaceOrder.mutate();
                }
              } else {
                startSDKCreditCard();
              }
            } else {
              if (
                global?.shopOnAppSettings?.summarypageconfigurations
                  ?.Max_time_exceed >= global.prevTime &&
                route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                  'migration' &&
                route?.params?.params?.item?.selectedNumMigPortRes?.type !==
                  'portin'
              ) {
                setshowfailureModal(true);
                setfailureTitle(
                  global?.shopOnAppSettings?.summarypageconfigurations
                    ?.placeorder_not_allow_title || t('oops')
                );
                setfailuremsg(
                  global?.shopOnAppSettings?.summarypageconfigurations
                    ?.placeorder_not_allow_message
                );
              } else {
                setPlaceOrderButtondisable(true);
                PlaceOrder.mutate();
              }
            }
          }}
          selectedMethod={selectedPayMethod}
          onChangePayPress={() => setIsPayModalOpen(true)}
          selectedIndex={selectedPayMethodIndex ? selectedPayMethodIndex : ''}
        />
      )}

      {isPayModalOpen && (
        <PaySelectionModal
          visible={isPayModalOpen}
          onClose={() => {
            setIsPayModalOpen(false);
          }}
          paymentList={paymentList ? paymentList : ''}
          selectedMethod={(item, index) => {
            if (item) {
              setSelectedPayMethod(item);
            }
            setIsPayMethodSelected(true);
            setSelectedPayMethodIndex(index);
          }}
          selectedIndex={selectedPayMethodIndex}
          onAddCardPress={() => {
            setShowLoader(true);
            startSDK();
            setIsPayModalOpen(false);
          }}
          data={global?.shopOnAppSettings?.summarypageconfigurations}
        />
      )}

      {showTimeOutPopup && (
        <TimeOutPopup
          visible={showTimeOutPopup}
          onContinue={() => {
            setItem(SHOP_CART_ID, '');
            setItem(SHOP_ITEM_ID, '');
            setItem(SHOP_ACCOUNT_ID, '');
            setItem(SHOP_CART_TIME, '');
            setshowTimeOutPopup(false);
            setTimeout(() => {
              navigation.reset({
                index: 1,
                routes: [
                  {
                    name: ScreenName.tabStack,
                    state: {
                      routes: [
                        {
                          name: ScreenName.ShopStack,
                        },
                      ],
                    },
                  },
                  {
                    name: ScreenName.tabStack,
                    state: {
                      routes: [
                        {
                          name: ScreenName.ShopStack,
                          state: {
                            routes: [{name: ScreenName.ShopOnAppLandingPage}],
                          },
                        },
                      ],
                    },
                  },
                ],
              });
            }, 800);
          }}
        />
      )}
      {route?.params?.params?.item?.selectedNumMigPortRes?.type !==
        'migration' &&
        route?.params?.params?.item?.selectedNumMigPortRes?.type !==
          'portin' && (
          <View
            style={{
              height: widthPixel(37),
              alignItems: 'flex-end',
              right: widthPixel(14),
              bottom: widthPixel(90),
            }}>
            <CircularProgressBar
              radius={widthPixel(37) / 2}
              strokeWidth={10}
              style={{
                height: widthPixel(37),
                width: widthPixel(37),
              }}
              reverseNumber={route?.params?.params?.item?.msisdn}
              cartId={route?.params?.params?.item?.cartID || ''} //cartid from add to cart api
              itemId={route?.params?.params?.item?.itemID || ''} //itemid from add to cart api
              accountId={route?.params?.params?.item?.accountID || ''}
              showPopup={() => {
                if (global.shoptransactionStatus !== 'completed') {
                  setshowTimeOutPopup(true);
                }
              }}
              type={
                route?.params?.params?.item?.selectedNumMigPortRes?.type ||
                'onboarding'
              }
            />
          </View>
        )}
      <BottomPlan
        visible={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        selectedPlandata={
          global?.shopOnAppSettings?.productdetailsconfigurations
        }
        parentProduct={parentProductDetails}
        childProduct={childProductDetails}
        simType={route?.params?.params?.item?.simtype || ''}
        type={route?.params?.params?.item?.selectedNumMigPortRes?.type || ''}
        outstandingamount={
          route?.params?.params?.item?.selectedNumMigPortRes?.res?.oamount || 0
        }
        numberSelected={
          route?.params?.params?.item?.selectedNumMigPortRes?.type ==
            'migration' ||
          route?.params?.params?.item?.selectedNumMigPortRes?.type == 'portin'
            ? route?.params?.params?.item?.selectedNumMigPortRes?.enteredNumber
            : selectedNumberObj?.MSISDN
        }
      />

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

      {(showLoader ||
        getPaymentList.isLoading ||
        userdetailsdata.isLoading ||
        getTermsAndConditions.isLoading ||
        PlaceOrder.isLoading ||
        ShopPaymentLInk.isLoading ||
        unReserveNumber.isLoading) && (
        <LoadingIndicator
          shouldDismissManual
          isVisible={
            showLoader ||
            getPaymentList.isLoading ||
            userdetailsdata.isLoading ||
            getTermsAndConditions.isLoading ||
            PlaceOrder.isLoading ||
            ShopPaymentLInk.isLoading ||
            unReserveNumber.isLoading
          }
        />
      )}

      <CustomDialogue
        message={msg}
        visible={showErrorModal}
        onClose={() => {
          setshowErrorModal(false);
        }}
      />
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

      {showToast ? (
        <ToastPopup
          showToast={showToast}
          imgSrc={stateuserdata?.icon || ''}
          title={stateuserdata?.title || ''}
          desc={stateuserdata?.desc || ''}
        />
      ) : null}
    </View>
  );
};

export default PaymentPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.BG_COLOR_WHITE,
  },
  KeyboardAvoidingViewStyle: {
    flex: 1,
    marginHorizontal: tabletMargin(),
  },
  scrollView: {
    paddingBottom: HEIGHT_100,
    flexGrow: 1,
  },
});
