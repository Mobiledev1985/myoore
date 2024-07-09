import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import React, {createRef, useEffect, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  I18nManager,
  LayoutAnimation,
  BackHandler,
  Modal,
  DeviceEventEmitter,
  TouchableHighlight,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {useMutation, useQuery} from 'react-query';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import momemt from 'moment';
import {
  RUBIK_SEMIBOLD_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  OOREDOO_REGULAR_FONT,
  RUBIK_LIGHT_FONT,
} from '../../resources/styles/fonts';
import {
  FULL_HEIGHT_PERCENTAGE,
  MOBILEID_TIMER_STATUS,
  SCALE_SIZE_10,
  SCALE_SIZE_14,
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
} from '../../commonHelper/Constants';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import {findObjectByKey, setItem} from '../../commonHelper/utils';
import BottomSheet from '../../models/basic/BottomSheet';
import HeaderComponent from '../../models/basic/HeaderComponent';
import ScreenName from '../../navigator/ScreenName';
import {
  NATIONALITY_API,
  SHOP_PACIHASMOBILEID,
  SIM_VERIFYLATER_API,
  UNRESERVE_API,
  UPDATEKYC_API,
} from '../../resources/route/endpoints';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
} from '../../resources/styles/fonts';
import {
  CARD_WIDTH,
  FONT_12,
  FONT_13,
  FONT_14,
  FONT_16,
  FONT_20,
  FONT_24,
  FONT_26,
  HEIGHT_60,
  HORIZONTAL_5,
  HORIZONTAL_10,
  HORIZONTAL_20,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  WIDTH_60,
  BORDER_RADIUS_10,
  BORDER_RADIUS_24,
  BORDER_RADIUS_16,
  BORDER_RADIUS_1,
  FONT_15,
  WIDTH_27,
  HORIZONTAL_12,
  BORDER_RADIUS_31,
  BORDER_RADIUS_3,
  HORIZONTAL_15,
  HORIZONTAL_13,
  FONT_21,
  HORIZONTAL_26,
  SCALE_SIZE_0,
  VERTICAL_5,
  VERTICAL_30,
  FONT_22,
  VERTICAL_6,
  VERTICAL_12,
  HORIZONTAL_1,
  FONT_25,
  FONT_30,
  FONT_37,
  FONT_28,
  HEIGHT_50,
} from '../../resources/styles/responsive';
import {NavigateByName} from '../../services/NavigationService';
import BottomPlan from '../../models/shopOnApp/BottomPlan';
import ShopPaciAuthentication from '../../models/shopOnApp/ShopPaciAuthentication';
import HeaderStatusbar from '../../components/shopOnApp/HeaderStatusBar';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import DatePicker from 'react-native-date-picker';
import {Appearance} from 'react-native';
import ImageComponent from '../../models/basic/ImageComponent';
import ItemsListModal from '../../models/shopOnApp/ItemsListModal';
import {verticalScale} from '../../commonHelper/scalingUtils';
import BottomEmailVerifyDialog from '../../models/basic/BottomEmailVerifyDialog';
import StepsToVerify from '../../components/shopOnApp/StepsToVerify';
import SupportedCountryModal from '../../models/templates/SupportedCountryModal';
import {KeyboardAvoidingView} from 'react-native';
import {Platform} from 'react-native';
import {GetCacheKey} from '../../services/CacheUtil';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import CircularProgressBar from '../../components/shopOnApp/CircularProgressBar';
import TimeOutPopup from '../../models/shopOnApp/TimeOutPopup';
import {RecordScreenEvent, RecordlogEvents} from '../../analytics/RecordEvents';
import {shopPriceCalculation} from '../../services/CommonUtils';
import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';
const OrderVerificationScreen = ({
  navigation,
  route,
  visible,
  isFrom,
  response,
  productInfo,
}) => {
  const isFocused = useIsFocused();
  const {parentProduct, childProduct} = route?.params?.params?.item;
  const {t} = useTranslation();
  const [showTimeOutPopup, setshowTimeOutPopup] = useState(false);
  const [ctext, setcText] = useState('');
  const [bottomPlanVisible, setBottomPlanVisible] = useState(false);
  const [showPaciPopup, setshowPaciPopup] = useState(false);
  const [paciModelType, setpaciModelType] = useState('');
  const [modalObj, setModalObj] = useState(null);
  const [paciError, setPaciError] = useState();
  const [isLoader, setisLoader] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState('1');
  const [firstNametext, setfirstNametext] = useState('');
  const [lastNametext, setlastNametext] = useState('');
  const [civilidtext, setcivilidtext] = useState('');
  const [nationalitytext, setnationalitytext] = useState('');
  const [msg, setmsg] = useState('');
  const [errorTitle, seterrorTitle] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const imageSource = require('../../assets/o2.png');
  const unselectimageSource = require('../../assets/verification_sim.png');
  const [gender, setgender] = useState('');
  const [dobobj, setdobobj] = useState('');
  const [civilidobj, setcivilidobj] = useState('');
  const [openPicker, setOpenPicker] = useState(false);
  const [openNationalityModal, setOpenNationalityModal] = useState(false);
  const [dateSelected, setDateSelected] = useState(new Date());
  const [dateType, setDateType] = useState('');
  const [firstNameerror, setfirstNameerror] = useState('');
  const [lastNameerror, setlastNameerror] = useState('');
  const [civiliderror, setciviliderror] = useState('');
  const [nationalityerror, setnationalityerror] = useState('');
  const [gendererror, setgendererror] = useState('');
  const [doberror, setdoberror] = useState('');
  const [civilidexyerror, setcivilidexyerror] = useState('');
  const [openSheet, setopenSheet] = useState(false);
  const [continueButtonDisable, setContinueButtonDisable] = useState(true);
  const nationalityItem = useRef([]);
  const nationalityItemIndex = useRef(0);
  const paciCivilid = useRef('');
  const otherfirstname = useRef('');
  const otherlastname = useRef('');
  const othercivilid = useRef('');
  const othernationality = useRef('');
  const othernationalityValue = useRef('');
  const othergender = useRef('');
  const otherdob = useRef('');
  const othercivilexy = useRef('');
  const mobileidTransid = useRef('');
  const lastNameRef = createRef();
  const civilIDRef = createRef();

  const dispatch = useDispatch();
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.OrderVerificationScreen,
    show: false,
  });

  useEffect(() => {
    global.contactdetailsAutoPopuplate = null;
    RecordScreenEvent('Shop Verification');
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

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          setisLoader(true);
          unReserveNumberApi.mutate();
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
  const openBottomPlanModal = () => {
    setBottomPlanVisible(true);
  };

  const closeBottomPlanModal = () => {
    setBottomPlanVisible(false);
  };

  const closePopup = () => {
    setopenSheet(false);
  };

  const clearError = () => {
    //setPaciError('');
    setfirstNameerror('');
    setlastNameerror('');
    // setciviliderror('');
    setnationalityerror('');
    setgendererror('');
    setdoberror('');
    setcivilidexyerror('');
    paciCivilid.current = '';
    otherfirstname.current = '';
    otherlastname.current = '';
    othercivilid.current = '';
    othernationality.current = '';
    othergender.current = '';
    otherdob.current = '';
    othercivilexy.current = '';
    global.verifyscreenObj = null;
  };

  const continueButtonClick = () => {
    try {
      setContinueButtonDisable(true);
      clearError();
      if (isCollapsed === '1') {
        if (ctext?.length < 3) {
          setPaciError(t(''));
          setContinueButtonDisable(false);
        } else if (ctext?.length < 11) {
          setPaciError(t('pevcid'));
          setContinueButtonDisable(false);
        } else {
          setisLoader(true);
          var reqObj = {
            civilId: ctext,
            type: '1',
          };
          global.verifyscreenObj = reqObj;
          verifywithPaciApi.mutate();
        }
      } else {
        if (firstNametext?.length == 0) {
          setfirstNameerror(t('pefn'));
          setContinueButtonDisable(false);
        } else if (lastNametext?.length == 0) {
          setlastNameerror(t('peln'));
          setContinueButtonDisable(false);
        } else if (civilidtext?.length < 3) {
          setciviliderror(t(''));
          setContinueButtonDisable(false);
        } else if (civilidtext?.length < 12) {
          setciviliderror(t('pevcid'));
          setContinueButtonDisable(false);
        } else if (nationalitytext?.length == 0) {
          setnationalityerror(t('psn'));
          setContinueButtonDisable(false);
        } else if (gender?.length == 0) {
          setgendererror(t('psg'));
          setContinueButtonDisable(false);
        } else if (dobobj?.length == 0) {
          setdoberror(t('psdob'));
          setContinueButtonDisable(false);
        } else if (civilidobj?.length == 0) {
          setcivilidexyerror(t('pscied'));
          setContinueButtonDisable(false);
        } else {
          setisLoader(true);
          var reqObj = {
            firstName: firstNametext,
            lastName: lastNametext,
            civilId: civilidtext,
            nationality: nationalitytext,
            gender: gender,
            dob: dobobj || otherdob.current,
            civilexy: civilidobj,
            type: '2',
          };
          global.verifyscreenObj = reqObj;
          verificationLaterApi.mutate();
        }
      }
    } catch (error) {}
  };

  const validationCheck = () => {
    try {
      if (isCollapsed === '1') {
        if (
          paciCivilid.current?.length < 3 ||
          paciCivilid.current?.length < 12
        ) {
          setContinueButtonDisable(true);
        } else {
          setContinueButtonDisable(false);
        }
      } else {
        otherdob.current = otherdob.current || global.verifyscreenObj?.dob;
        othercivilexy.current =
          othercivilexy.current || global.verifyscreenObj?.civilexy;
        if (
          otherfirstname.current?.length === 0 ||
          otherlastname.current?.length === 0 ||
          othercivilid.current?.length < 3 ||
          othercivilid.current?.length < 12 ||
          othernationality.current?.length === 0 ||
          othergender.current?.length === 0 ||
          otherdob.current?.length === 0 ||
          othercivilexy.current?.length === 0
        ) {
          setContinueButtonDisable(true);
        } else {
          setContinueButtonDisable(false);
        }
      }
    } catch (error) {}
  };

  const VerifyPACICTEvent = (VerifyType, Status, statusdescription) => {
    try {
      RecordlogEvents('Verify PACI', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        VerifyType: VerifyType,
        Status: Status,
        statusdescription: statusdescription,
      });
    } catch (e) {}
  };

  const verifywithPaciApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SHOP_PACIHASMOBILEID,
          {
            civilid: ctext,
            otransid: route?.params?.params?.item?.transid,
            source:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ||
              'onboarding',
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        global.isContinueDisabled = false;
        setContinueButtonDisable(false);
        setItem(MOBILEID_TIMER_STATUS, '0');
        try {
          mobileidTransid.current = udata?.data?.response?.transid;
          setModalObj(udata?.data);
          setisLoader(false);
          if (udata?.data?.status === '0') {
            setpaciModelType('mobileidavailable');
            setshowPaciPopup(true);
          } else {
            VerifyPACICTEvent('paci', 'Failure', udata?.data?.message);
            if (udata?.data?.code === '914143') {
              setpaciModelType('mobileiduninstall');
              setshowPaciPopup(true);
            } else if (udata?.data?.code === '914141') {
              setpaciModelType('mobileidlow');
              setshowPaciPopup(true);
            } else {
              setPaciError(udata?.data?.message);
            }
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        setContinueButtonDisable(false);
      },
    }
  );

  const paciupdatekycApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          UPDATEKYC_API,
          {
            pacitransid: mobileidTransid.current, //paciauthenticationid which you are sending for authenticationgetstatus api
            otransid: route?.params?.params?.item?.transid, //ordertransid in numreserve api response
            mode: 'paci',
            selectednumber:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ===
                'migration' ||
              route?.params?.params?.item?.selectedNumMigPortRes?.type ===
                'portin'
                ? route?.params?.params?.item?.selectedNumMigPortRes
                    ?.enteredNumber
                : route?.params?.params?.item?.msisdn, //selectednumber
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          setisLoader(false);
          if (udata?.data?.status === '0') {
            setopenSheet(true);
            setTimeout(() => {
              setopenSheet(false);
              NavigateByName(
                navigation,
                ScreenName.PaymentPage,
                route?.params?.params,
                null,
                null
              );
            }, 3000);
          } else {
            setShowErrorModal(true);
            seterrorTitle(
              udata?.data?.infomsg ? udata?.data?.infomsg : t('oops')
            );
            setmsg(
              udata?.data?.message
                ? udata?.data?.message
                : t('somethingwentwrong')
            );
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const verificationLaterApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SIM_VERIFYLATER_API,
          {
            otransid: route?.params?.params?.item?.transid,
            msisdn: route?.params?.params?.item?.msisdn,
            firstname: firstNametext,
            lastname: lastNametext,
            civilid: civilidtext,
            nationality: othernationalityValue.current || '',
            gender: gender === 'male' ? 'M' : 'F',
            dob: dobobj,
            civilidexpiry: civilidobj,
            iscommitment: 'false',
            action:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ||
              'onboarding',
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          setisLoader(false);
          setContinueButtonDisable(false);
          if (
            global.verifyscreenObj != null &&
            global.verifyscreenObj != undefined &&
            global.verifyscreenObj != ''
          ) {
            otherfirstname.current =
              otherfirstname.current != null &&
              otherfirstname.current != undefined &&
              otherfirstname.current != ''
                ? otherfirstname.current
                : global.verifyscreenObj?.firstName || '';
            otherlastname.current =
              otherlastname.current != null &&
              otherlastname.current != undefined &&
              otherlastname.current != ''
                ? otherlastname.current
                : global.verifyscreenObj?.lastName || '';
            othercivilid.current =
              othercivilid.current != null &&
              othercivilid.current != undefined &&
              othercivilid.current != ''
                ? othercivilid.current
                : global.verifyscreenObj?.civilId || '';
            othernationality.current =
              othernationality.current != null &&
              othernationality.current != undefined &&
              othernationality.current != ''
                ? othernationality.current
                : global.verifyscreenObj?.nationality || '';
            othergender.current =
              othergender.current != null &&
              othergender.current != undefined &&
              othergender.current != ''
                ? othergender.current
                : global.verifyscreenObj?.gender || '';
            otherdob.current =
              otherdob.current != null &&
              otherdob.current != undefined &&
              otherdob.current != ''
                ? otherdob.current
                : global.verifyscreenObj?.dob || '';
            otherdob.current =
              othercivilexy.current != null &&
              othercivilexy.current != undefined &&
              othercivilexy.current != ''
                ? othercivilexy.current
                : global.verifyscreenObj?.civilexy || '';
          }
          if (udata?.data?.status === '0') {
            VerifyPACICTEvent('manual', 'Success', udata?.data?.message);
            try {
              setopenSheet(true);
              global.ShopOnAPPAddressObj = {
                ...global.ShopOnAPPAddressObj,
                firstName: otherfirstname.current || '',
                lastName: otherlastname.current || '',
              };
              // global.ShopOnAPPAddressObj['firstName'] = otherfirstname.current;
              // global.ShopOnAPPAddressObj['lastName'] = otherlastname.current;
              setTimeout(() => {
                setopenSheet(false);
                NavigateByName(
                  navigation,
                  ScreenName.PaymentPage,
                  route?.params?.params,
                  null,
                  null
                );
              }, 3000);
            } catch (error) {}
          } else {
            VerifyPACICTEvent('manual', 'Failure', udata?.data?.message);
            try {
              setShowErrorModal(true);
              seterrorTitle(
                udata?.data?.infomsg ? udata?.data?.infomsg : t('oops')
              );
              setmsg(
                udata?.data?.message
                  ? udata?.data?.message
                  : t('somethingwentwrong')
              );
            } catch (error) {}
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        setContinueButtonDisable(false);
      },
    }
  );

  const onSuccessAPI = udata => {
    setisLoader(false);
    try {
      if (udata?.data?.status === '0') {
        if (udata?.data?.response != null) {
          nationalityItem.current = udata?.data?.response;
          if (nationalitytext != '') {
            const index = udata?.data?.response.findIndex(
              item => item.value === nationalitytext
            );

            if (index !== -1) {
              nationalityItemIndex.current = index;
            } else {
              nationalityItemIndex.current = 0;
            }
          }
          setOpenNationalityModal(true);
        } else {
        }
      } else {
      }
    } catch (e) {}
  };

  // const nationalityApi = useQuery(
  //   [GetCacheKey('nationalitylist'), NATIONALITY_API, {}, {}],
  //   {
  //     retry: false,
  //     cacheTime: 300000,
  //     staleTime: 300000,
  //     enabled: false,
  //     onSuccess: (udata, variables, context) => {
  //       setisLoader(false);
  //       try {
  //         if (udata?.data?.status === '0') {
  //           if (udata?.data?.response != null) {
  //             nationalityItem.current = udata?.data?.response;
  //             if (nationalitytext != '') {
  //               const index = udata?.data?.response.findIndex(
  //                 item => item.value === nationalitytext
  //               );

  //               if (index !== -1) {
  //                 nationalityItemIndex.current = index;
  //               } else {
  //                 nationalityItemIndex.current = 0;
  //               }
  //             }
  //             setOpenNationalityModal(true);
  //           } else {
  //           }
  //         } else {
  //         }
  //       } catch (e) {}
  //     },
  //     onError: (uerror, variables, context) => {
  //       setisLoader(false);
  //     },
  //   }
  // );

  // React.useEffect(() => {
  //   try {
  //     nationalityApi.mutate();
  //   } catch (r) {}
  // }, []);

  const nationalityApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, NATIONALITY_API, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        onSuccessAPI(udata);
        if (cachedAPIData && cachedAPIData?.length > 0) {
          const foundObj = findObjectByKey(
            cachedAPIData,
            'Key',
            GetCacheKey('nationalitylist')
          );
          if (foundObj) {
          } else {
            let tempObj = {
              Key: GetCacheKey('nationalitylist'),
              Resp_Obj: udata,
            };
            dispatch(setCommonAPIData(tempObj));
          }
        } else {
          let tempObj = {
            Key: GetCacheKey('nationalitylist'),
            Resp_Obj: udata,
          };
          dispatch(setCommonAPIData(tempObj));
        }
      },
      onError: (error, variables, context) => {},
    }
  );

  const unReserveNumberApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          UNRESERVE_API,
          {
            unreserve_msisdn:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ==
              'portin'
                ? route?.params?.params?.item?.pmsisdn
                : route?.params?.params?.item?.msisdn,
            doremovecart: 'T', //T or F
            cartid: route?.params?.params?.item?.cartID || '', //cartid from add to cart api
            itemid: route?.params?.params?.item?.itemID || '', //itemid from add to cart api
            accountid: route?.params?.params?.item?.accountID || '',
            onboardingtype:
              route?.params?.params?.item?.selectedNumMigPortRes?.type ||
              'onboarding',
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        setItem(SHOP_CART_ID, '');
        setItem(SHOP_ITEM_ID, '');
        setItem(SHOP_ACCOUNT_ID, '');
        setItem(SHOP_CART_TIME, '');
        setisLoader(false);
        try {
          setModalObj(udata?.data);
          setisLoader(false);
          if (udata?.data?.status === '0') {
            navigation.goBack();
          } else {
            NavigateByName(
              navigation,
              'shoponapp',
              {type: 'shop'},
              null,
              null,
              null,
              null
            );
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {},
    }
  );

  const selectItem = value => {
    setOpenNationalityModal(false);
    setnationalitytext(value?.label);
    othernationality.current = value?.label;
    othernationalityValue.current = value?.value;
    setnationalityerror('');
    validationCheck();
  };

  const currentDate = new Date();
  const minDate = new Date(
    currentDate.getFullYear() - 100,
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const minDateForCivilID = new Date(
    currentDate.setDate(currentDate.getDate() + 30)
  );

  const maxDate = new Date(momemt().subtract(18 * 365 + 6, 'day'));
  let today = new Date();
  const civilIdAutoDate = new Date(today.setMonth(today.getMonth() + 1));

  // const getMinimumDate = () => {
  //   const currentDate = new Date();
  //   const minimumDate = new Date(
  //     currentDate.getFullYear() - 100,
  //     currentDate.getMonth(),
  //     currentDate.getDate()
  //   );
  //   return minimumDate;
  // };

  // const getdobMaxDate = () => {
  //   const currentDate = new Date();
  //   const minimumDate = new Date(
  //     currentDate.getFullYear() - 18,
  //     currentDate.getMonth(),
  //     currentDate.getDate()
  //   );
  //   return minimumDate;
  // };

  const getMaximumDate = () => {
    const currentDate = new Date();
    const maximumDate = new Date(
      currentDate.getFullYear() + 50,
      currentDate.getMonth(),
      currentDate.getDate()
    );
    return maximumDate;
  };

  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: '#898989',
      text: '#000000',
      borderRadius: BORDER_RADIUS_1,
      backgroundColor: colors.WHITE,
    },
  };

  const dateSelectedItemConvertion = seldate => {
    try {
      const [day, month, year] = seldate.split('/');

      // Create a new Date object from the components
      const dateObject = new Date(`${year}-${month}-${day}`);
      return dateObject;
    } catch (error) {}
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        // showBackButton={true}
        headerTitle={t('order_new_sim')}
        statusBarColor={colors.WHITE}
        isHeaderTextPressDisabled
        showBanner={false}
        type={'shoponapp'}
        onCustomBackPress={() => {
          setisLoader(true);
          unReserveNumberApi.mutate();
        }}
      />

      <View
        style={{
          flex: 1,
          backgroundColor: isTablet ? null : colors.BG_LIGHT_GREY,
        }}>
        <View style={styles.gradientContainer}>
          <View style={styles.subContainer}>
            <BottomPlan
              visible={bottomPlanVisible}
              onClose={closeBottomPlanModal}
              selectedPlandata={
                global.shopOnAppSettings?.productdetailsconfigurations
              }
              parentProduct={parentProduct}
              childProduct={childProduct}
              simType={route?.params?.params?.item?.simtype || ''}
              type={
                route?.params?.params?.item?.selectedNumMigPortRes?.type || ''
              }
              outstandingamount={
                route?.params?.params?.item?.selectedNumMigPortRes?.res
                  ?.oamount || 0
              }
              numberSelected={
                route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                  'migration' ||
                route?.params?.params?.item?.selectedNumMigPortRes?.type ==
                  'portin'
                  ? route?.params?.params?.item?.selectedNumMigPortRes
                      ?.enteredNumber
                  : route?.params?.params?.item?.selectednumberobject?.MSISDN
              }
            />
            <HeaderStatusbar
              elementMeta={global.shopOnAppSettings?.verifypaciconfigurations}
            />
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : null}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 94 : -70}>
              <ScrollView
                keyboardShouldPersistTaps={'handled'}
                showsVerticalScrollIndicator={false}>
                <View
                  style={[
                    styles.subCollapsecontainer,
                    {paddingBottom: isCollapsed !== '2' ? HEIGHT_50 : 0},
                  ]}>
                  <View
                    style={[
                      styles.contentContainer,
                      {
                        paddingBottom: isCollapsed === '2' ? HEIGHT_50 : 0,
                        marginBottom:
                          isTablet && isCollapsed !== '2'
                            ? I18nManager.isRTL
                              ? -heightPixel(210)
                              : -heightPixel(230)
                            : 0,
                      },
                    ]}>
                    <PaperProvider theme={theme}>
                      <View style={{backgroundColor: '#FFF8F9'}}>
                        <Collapse
                          style={[styles.cardView]}
                          touchableOpacityProps={styles.opactiy}
                          isExpanded={isCollapsed === '1' ? true : false}
                          onToggle={() => {
                            clearError();
                            paciCivilid.current = ctext;
                            setIsCollapsed(isCollapsed === '1' ? '' : '1');
                            if (ctext?.length == 12) {
                              setContinueButtonDisable(false);
                            } else {
                              setContinueButtonDisable(true);
                            }

                            // LayoutAnimation.configureNext(
                            //   LayoutAnimation.Presets.easeInEaseOut
                            // );
                          }}>
                          <CollapseHeader>
                            <View style={styles.header}>
                              <ImageComponent
                                type="image"
                                iwidth={WIDTH_27}
                                iheight={WIDTH_27}
                                source={
                                  global.shopOnAppSettings
                                    ?.verifypaciconfigurations
                                    ?.verify_paci_image
                                }
                                resizeMode={'contain'}
                                style={styles.headerImage}
                              />
                              <View
                                style={[
                                  styles.paciView,
                                  isTablet
                                    ? {}
                                    : {
                                        width: SCREEN_WIDTH - widthPixel(130),
                                      },
                                ]}>
                                <Text style={styles.textLeft}>
                                  {
                                    global.shopOnAppSettings
                                      ?.verifypaciconfigurations
                                      ?.verify_with_paci_title
                                  }
                                </Text>
                                <Text
                                  style={styles.textLeftTwo}
                                  numberOfLines={2}>
                                  {
                                    global.shopOnAppSettings
                                      ?.verifypaciconfigurations
                                      ?.verify_with_paci_desc
                                  }
                                </Text>
                              </View>
                              {/* <TouchableOpacity
                                style={{borderWidth: 1}}
                                onPress={() => {
                                  clearError();
                                  setIsCollapsed(
                                    isCollapsed === '1' ? '' : '1'
                                  );
                                  setContinueButtonDisable(true);
                                  LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                  );
                                }}> */}
                              <TouchableHighlight
                                style={[styles.radioButtonTouch, {left: 0}]}
                                underlayColor={colors.OOREDDO_RADIO_UNDERLEY}
                                onPress={() => {
                                  clearError();
                                  paciCivilid.current = ctext;
                                  setIsCollapsed(
                                    isCollapsed === '1' ? '' : '1'
                                  );
                                  if (ctext?.length == 12) {
                                    setContinueButtonDisable(false);
                                  } else {
                                    setContinueButtonDisable(true);
                                  }
                                }}>
                                <Image
                                  source={
                                    isCollapsed === '1'
                                      ? imageSource
                                      : unselectimageSource
                                  }
                                  style={styles.toggleImage}
                                />
                              </TouchableHighlight>
                              {/* </TouchableOpacity> */}
                            </View>
                          </CollapseHeader>
                          <CollapseBody>
                            <View style={styles.verifyPaci}>
                              <TextInput
                                textAlignVertical="center"
                                refvalue={ctext}
                                label={
                                  <Text
                                    style={{
                                      fontFamily: RUBIK_LIGHT_FONT,
                                      fontWeight: '300',
                                      fontSize: FONT_13,
                                    }}>
                                    {
                                      global.shopOnAppSettings
                                        ?.verifypaciconfigurations
                                        ?.enter_civili_id
                                    }
                                  </Text>
                                }
                                mode="outlined"
                                keyboardType="numeric"
                                value={ctext}
                                onChangeText={text => {
                                  setcText(
                                    text.replace(
                                      /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",٫.<>a-zA-Z\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]/g,
                                      ''
                                    )
                                  );
                                  paciCivilid.current = text.replace(
                                    /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",٫.<>a-zA-Z\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]/g,
                                    ''
                                  );
                                  const spaceRemove =
                                    paciCivilid.current.replace(' ', '');
                                  setcText(spaceRemove);
                                  paciCivilid.current = spaceRemove;
                                  if (text?.length == 12 || text?.length < 3) {
                                    setPaciError('');
                                  } else {
                                    setPaciError(t('pevcid'));
                                  }
                                  validationCheck();
                                }}
                                style={styles.input}
                                maxLength={12}
                                theme={{
                                  colors: {
                                    placeholder:
                                      paciError != null &&
                                      paciError != undefined &&
                                      paciError != ''
                                        ? colors.OOREDOO_RED
                                        : colors.OOREDDO_GREY,
                                    text: colors.BLACK,
                                    selectionColor: colors.OOREDDO_GREY,
                                    primary:
                                      paciError != null &&
                                      paciError != undefined &&
                                      paciError != ''
                                        ? colors.OOREDOO_RED
                                        : colors.OOREDDO_GREY,
                                    underlineColor: 'transparent',
                                    background:
                                      paciError != null &&
                                      paciError != undefined &&
                                      paciError != ''
                                        ? colors.OOREDOO_RED
                                        : colors.OOREDDO_GREY,
                                  },
                                  fonts: {
                                    regular: {
                                      fontFamily: RUBIK_REGULAR_FONT,
                                      fontSize: FONT_16,
                                      fontWeight: '400',
                                    },
                                  },
                                }}
                                onBlur={() => {
                                  if (ctext.length === 12 || ctext.length < 3) {
                                    setPaciError('');
                                  } else {
                                    setPaciError(t('pevcid'));
                                  }
                                }}
                              />
                              {paciError != null &&
                              paciError !== undefined &&
                              paciError !== '' ? (
                                <Text style={styles.errorMesssage}>
                                  {paciError}
                                </Text>
                              ) : null}
                              <View style={styles.bottomView}>
                                <Text
                                  style={styles.bottomText}
                                  numberOfLines={1}>
                                  {
                                    global.shopOnAppSettings
                                      ?.verifypaciconfigurations
                                      ?.verify_paci_tooltip
                                  }
                                </Text>
                              </View>
                            </View>
                          </CollapseBody>
                        </Collapse>
                        {childProduct?.allowmanualpaci != null &&
                          childProduct?.allowmanualpaci !== undefined &&
                          childProduct?.allowmanualpaci !== '' &&
                          childProduct?.allowmanualpaci === 'Yes' &&
                          route?.params?.params?.item?.simtype !== 'esim' &&
                          route?.params?.params?.item?.selectedNumMigPortRes
                            ?.type !== 'migration' && (
                            <Collapse
                              style={[styles.cardViewLater, !isCollapsed]}
                              touchableOpacityProps={styles.opactiy}
                              isExpanded={isCollapsed === '2' ? true : false}
                              onToggle={() => {
                                clearError();
                                setIsCollapsed(isCollapsed === '2' ? '' : '2');
                                otherfirstname.current = firstNametext;
                                otherlastname.current = lastNametext;
                                othercivilid.current = civilidtext;
                                othernationality.current = nationalitytext;
                                othergender.current = gender;
                                otherdob.current = dobobj;
                                othercivilexy.current = civilidobj;
                                if (
                                  firstNametext.length > 0 &&
                                  lastNametext.length > 0 &&
                                  civilidtext.length === 12 &&
                                  nationalitytext.length > 0 &&
                                  gender?.length > 0 &&
                                  dobobj.length > 0 &&
                                  civilidobj.length > 0
                                ) {
                                  setContinueButtonDisable(false);
                                } else {
                                  setContinueButtonDisable(true);
                                }

                                // LayoutAnimation.configureNext(
                                //   LayoutAnimation.Presets.easeInEaseOut
                                // );
                              }}>
                              <CollapseHeader>
                                <View style={styles.header}>
                                  <ImageComponent
                                    type="image"
                                    iwidth={WIDTH_27}
                                    iheight={WIDTH_27}
                                    source={
                                      global.shopOnAppSettings
                                        ?.verifypaciconfigurations
                                        ?.shop_verify_later_image
                                    }
                                    resizeMode={'contain'}
                                    style={styles.headerImage}
                                  />
                                  <View
                                    style={[
                                      styles.paciView,
                                      isTablet
                                        ? {}
                                        : {
                                            width:
                                              SCREEN_WIDTH - widthPixel(130),
                                          },
                                    ]}>
                                    <Text style={styles.textLeft}>
                                      {
                                        global.shopOnAppSettings
                                          ?.verifypaciconfigurations
                                          ?.verify_later_title
                                      }
                                    </Text>
                                    <Text
                                      style={styles.textLeftTwo}
                                      numberOfLines={2}>
                                      {
                                        global.shopOnAppSettings
                                          ?.verifypaciconfigurations
                                          ?.verify_later_desc
                                      }
                                    </Text>
                                  </View>
                                  {/* <TouchableOpacity
                                onPress={() => {
                                  setgender('');
                                  clearError();
                                  setIsCollapsed(
                                    isCollapsed === '2' ? '' : '2'
                                  );
                                  setContinueButtonDisable(true);
                                  LayoutAnimation.configureNext(
                                    LayoutAnimation.Presets.easeInEaseOut
                                  );
                                }}> */}
                                  <TouchableHighlight
                                    style={[styles.radioButtonTouch, {left: 1}]}
                                    underlayColor={
                                      colors.OOREDDO_RADIO_UNDERLEY
                                    }
                                    onPress={() => {
                                      clearError();
                                      setIsCollapsed(
                                        isCollapsed === '2' ? '' : '2'
                                      );
                                      otherfirstname.current = firstNametext;
                                      otherlastname.current = lastNametext;
                                      othercivilid.current = civilidtext;
                                      othernationality.current =
                                        nationalitytext;
                                      othergender.current = gender;
                                      otherdob.current = dobobj;
                                      othercivilexy.current = civilidobj;
                                      if (
                                        firstNametext.length > 0 &&
                                        lastNametext.length > 0 &&
                                        civilidtext.length === 12 &&
                                        nationalitytext.length > 0 &&
                                        gender?.length > 0 &&
                                        dobobj.length > 0 &&
                                        civilidobj.length > 0
                                      ) {
                                        setContinueButtonDisable(false);
                                      } else {
                                        setContinueButtonDisable(true);
                                      }
                                    }}>
                                    <Image
                                      source={
                                        isCollapsed === '2'
                                          ? imageSource
                                          : unselectimageSource
                                      }
                                      style={[
                                        styles.toggleImage,
                                        // {right: widthPixel(8)},
                                      ]}
                                    />
                                  </TouchableHighlight>
                                  {/* </TouchableOpacity> */}
                                </View>
                              </CollapseHeader>
                              <CollapseBody>
                                <View style={styles.verifyPaci}>
                                  <TextInput
                                    label={
                                      <Text
                                        style={{
                                          fontFamily: RUBIK_LIGHT_FONT,
                                          fontWeight: '300',
                                          fontSize: FONT_13,
                                        }}>
                                        {
                                          global.shopOnAppSettings
                                            ?.verifypaciconfigurations
                                            ?.enter_first_name_label
                                        }
                                      </Text>
                                    }
                                    mode="outlined"
                                    value={firstNametext}
                                    maxLength={50}
                                    onChangeText={text => {
                                      if (text.length > 0) {
                                        setfirstNameerror('');
                                      }
                                      setfirstNametext(
                                        text.replace(
                                          /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'".,<>0-9\{\}\[\]\\\/]/g,
                                          ''
                                        )
                                      );
                                      otherfirstname.current = text.replace(
                                        /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'".,<>0-9\{\}\[\]\\\/]/g,
                                        ''
                                      );
                                      validationCheck();
                                    }}
                                    style={styles.input}
                                    onSubmitEditing={() => {
                                      lastNameRef?.current?.focus();
                                    }}
                                    theme={{
                                      colors: {
                                        placeholder:
                                          firstNameerror != null &&
                                          firstNameerror != undefined &&
                                          firstNameerror != ''
                                            ? colors.OOREDOO_RED
                                            : colors.OOREDDO_GREY,
                                        text: colors.BLACK,
                                        primary:
                                          firstNameerror != null &&
                                          firstNameerror != undefined &&
                                          firstNameerror != ''
                                            ? colors.OOREDOO_RED
                                            : colors.OOREDDO_GREY,
                                        underlineColor: 'transparent',
                                        background:
                                          firstNameerror != null &&
                                          firstNameerror != undefined &&
                                          firstNameerror != ''
                                            ? colors.OOREDOO_RED
                                            : colors.OOREDDO_GREY,
                                      },
                                      fonts: {
                                        regular: {
                                          fontFamily: RUBIK_REGULAR_FONT,
                                          fontSize: FONT_16,
                                          fontWeight: '400',
                                        },
                                      },
                                    }}
                                  />
                                  {firstNameerror != null &&
                                  firstNameerror !== undefined &&
                                  firstNameerror !== '' ? (
                                    <Text style={styles.errorMesssage}>
                                      {firstNameerror}
                                    </Text>
                                  ) : null}
                                  <View style={styles.lastNameView}>
                                    <TextInput
                                      ref={lastNameRef}
                                      label={
                                        <Text
                                          style={{
                                            fontFamily: RUBIK_LIGHT_FONT,
                                            fontWeight: '300',
                                            fontSize: FONT_13,
                                          }}>
                                          {
                                            global.shopOnAppSettings
                                              ?.verifypaciconfigurations
                                              ?.enter_last_name_label
                                          }
                                        </Text>
                                      }
                                      mode="outlined"
                                      value={lastNametext}
                                      maxLength={50}
                                      onSubmitEditing={() => {
                                        civilIDRef?.current?.focus();
                                      }}
                                      onChangeText={text => {
                                        if (text.length > 0) {
                                          setlastNameerror('');
                                        }
                                        setlastNametext(
                                          text.replace(
                                            /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'".,<>0-9\{\}\[\]\\\/]/g,
                                            ''
                                          )
                                        );
                                        otherlastname.current = text.replace(
                                          /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'".,<>0-9\{\}\[\]\\\/]/g,
                                          ''
                                        );
                                        validationCheck();
                                      }}
                                      style={styles.input}
                                      theme={{
                                        colors: {
                                          placeholder:
                                            lastNameerror != null &&
                                            lastNameerror != undefined &&
                                            lastNameerror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                          text: colors.BLACK,
                                          primary:
                                            lastNameerror != null &&
                                            lastNameerror != undefined &&
                                            lastNameerror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                          underlineColor: 'transparent',
                                          background:
                                            lastNameerror != null &&
                                            lastNameerror != undefined &&
                                            lastNameerror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                        },
                                        fonts: {
                                          regular: {
                                            fontFamily: RUBIK_REGULAR_FONT,
                                            fontSize: FONT_16,
                                            fontWeight: '400',
                                          },
                                        },
                                      }}
                                    />
                                    {lastNameerror != null &&
                                    lastNameerror !== undefined &&
                                    lastNameerror !== '' ? (
                                      <Text style={styles.errorMesssage}>
                                        {lastNameerror}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.emailView}>
                                    <TextInput
                                      ref={civilIDRef}
                                      label={
                                        <Text
                                          style={{
                                            fontFamily: RUBIK_LIGHT_FONT,
                                            fontWeight: '300',
                                            fontSize: FONT_13,
                                          }}>
                                          {
                                            global.shopOnAppSettings
                                              ?.verifypaciconfigurations
                                              ?.enter_civili_id
                                          }
                                        </Text>
                                      }
                                      mode="outlined"
                                      keyboardType="numeric"
                                      value={civilidtext}
                                      maxLength={12}
                                      onChangeText={text => {
                                        if (
                                          text.length === 12 ||
                                          text.length < 3
                                        ) {
                                          setciviliderror('');
                                        } else {
                                          setciviliderror(t('pevcid'));
                                        }
                                        setcivilidtext(
                                          text.replace(
                                            /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",٫.<>a-zA-Z\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]/g,
                                            ''
                                          )
                                        );
                                        othercivilid.current = text.replace(
                                          /[`~!₹@#$%^€£¥&*₹₩°○●□■♤♡◇♧☆▪︎¤¢™¦©¶¬¶¶§§§®©《》¡¿•×÷()_|+\-=?;:'",٫.<>a-zA-Z\u0660-\u0669\u06F0-\u06F9\{\}\[\]\\\/]/g,
                                          ''
                                        );
                                        const spaceRemove =
                                          othercivilid.current.replace(' ', '');
                                        setcivilidtext(spaceRemove);
                                        othercivilid.current = spaceRemove;
                                        validationCheck();
                                      }}
                                      style={styles.input}
                                      theme={{
                                        colors: {
                                          placeholder:
                                            civiliderror != null &&
                                            civiliderror != undefined &&
                                            civiliderror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                          text: colors.BLACK,
                                          primary:
                                            civiliderror != null &&
                                            civiliderror != undefined &&
                                            civiliderror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                          underlineColor: 'transparent',
                                          background:
                                            civiliderror != null &&
                                            civiliderror != undefined &&
                                            civiliderror != ''
                                              ? colors.OOREDOO_RED
                                              : colors.OOREDDO_GREY,
                                        },
                                        fonts: {
                                          regular: {
                                            fontFamily: RUBIK_REGULAR_FONT,
                                            fontSize: FONT_16,
                                            fontWeight: '400',
                                          },
                                        },
                                      }}
                                    />
                                    {civiliderror != null &&
                                    civiliderror !== undefined &&
                                    civiliderror !== '' ? (
                                      <Text style={styles.errorMesssage}>
                                        {civiliderror}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View style={styles.governorateView}>
                                    {nationalitytext != null &&
                                    nationalitytext != undefined &&
                                    nationalitytext != '' ? (
                                      <TextInput
                                        label={
                                          <Text
                                            style={{
                                              fontFamily: RUBIK_LIGHT_FONT,
                                              fontWeight: '300',
                                              fontSize: FONT_13,
                                            }}>
                                            {
                                              global.shopOnAppSettings
                                                ?.verifypaciconfigurations
                                                ?.nationality_label
                                            }
                                          </Text>
                                        }
                                        mode="outlined"
                                        pointerEvents="none"
                                        value={
                                          nationalitytext ||
                                          global.shopOnAppSettings
                                            ?.verifypaciconfigurations
                                            ?.nationality_label
                                        }
                                        caretHidden={true}
                                        editable={false}
                                        onChangeText={text => {
                                          setnationalitytext(text);
                                          othernationality.current = text;
                                          validationCheck();
                                        }}
                                        style={styles.input}
                                        theme={{
                                          colors: {
                                            placeholder:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            text: colors.BLACK,
                                            primary:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            underlineColor: 'transparent',
                                            background:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                          },
                                          fonts: {
                                            regular: {
                                              fontFamily: RUBIK_REGULAR_FONT,
                                              fontSize: FONT_16,
                                              fontWeight: '400',
                                            },
                                          },
                                        }}
                                      />
                                    ) : (
                                      <TextInput
                                        mode="outlined"
                                        pointerEvents="none"
                                        value={
                                          nationalitytext ||
                                          global.shopOnAppSettings
                                            ?.verifypaciconfigurations
                                            ?.nationality_label
                                        }
                                        caretHidden={true}
                                        editable={false}
                                        onChangeText={text => {
                                          setnationalitytext(text);
                                          othernationality.current = text;
                                          validationCheck();
                                        }}
                                        style={styles.input}
                                        theme={{
                                          colors: {
                                            placeholder:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            text: colors.BLACK,
                                            primary:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            underlineColor: 'transparent',
                                            background:
                                              nationalityerror != null &&
                                              nationalityerror != undefined &&
                                              nationalityerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                          },
                                          fonts: {
                                            regular: {
                                              fontFamily: RUBIK_REGULAR_FONT,
                                              fontSize: FONT_16,
                                              fontWeight: '400',
                                            },
                                          },
                                        }}
                                      />
                                    )}

                                    <View style={styles.inputButton}>
                                      <TouchableOpacity
                                        style={styles.inputOpacity}
                                        onPress={() => {
                                          setisLoader(true);

                                          if (
                                            cachedAPIData &&
                                            cachedAPIData?.length > 0
                                          ) {
                                            const foundObj = findObjectByKey(
                                              cachedAPIData,
                                              'Key',
                                              GetCacheKey('nationalitylist')
                                            );
                                            if (
                                              foundObj != null &&
                                              foundObj != undefined &&
                                              foundObj
                                            ) {
                                              onSuccessAPI(foundObj?.Resp_Obj);
                                            } else {
                                              nationalityApi.mutate();
                                            }
                                          } else {
                                            nationalityApi.mutate();
                                          }
                                        }}>
                                        <Image
                                          source={require('../../assets/DropDown.png')}
                                          style={styles.iconCalender}
                                          resizeMode={'contain'}
                                        />
                                      </TouchableOpacity>
                                    </View>
                                    {nationalityerror != null &&
                                    nationalityerror !== undefined &&
                                    nationalityerror !== '' ? (
                                      <Text style={styles.errorMesssage}>
                                        {nationalityerror}
                                      </Text>
                                    ) : null}
                                  </View>
                                  <View
                                    style={{
                                      marginTop: VERTICAL_20,
                                      height: heightPixel(20),
                                      flexDirection: 'row',
                                      left: 2,
                                    }}>
                                    <TouchableOpacity
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                      onPress={() => {
                                        setgendererror('');
                                        setgender('male');
                                        othergender.current = 'male';
                                        validationCheck();
                                      }}>
                                      <Image
                                        source={
                                          gender === 'male'
                                            ? imageSource
                                            : unselectimageSource
                                        }
                                        style={{
                                          width:
                                            othergender.current == 'male'
                                              ? widthPixel(18)
                                              : widthPixel(16),
                                          height:
                                            othergender.current == 'male'
                                              ? widthPixel(18)
                                              : widthPixel(16),
                                          resizeMode: 'contain',
                                          marginTop:
                                            othergender.current == 'male'
                                              ? 3
                                              : 4,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          flexDirection: 'row',
                                          marginHorizontal: 5,
                                          fontFamily:
                                            gender === 'male'
                                              ? RUBIK_SEMIBOLD_FONT
                                              : RUBIK_REGULAR_FONT,
                                          fontSize: FONT_15,
                                          lineHeight: FONT_25,
                                        }}>
                                        {
                                          global.shopOnAppSettings
                                            ?.verifypaciconfigurations
                                            ?.male_label
                                        }
                                      </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                      style={{
                                        flexDirection: 'row',
                                        left: HORIZONTAL_10,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                      onPress={() => {
                                        setgendererror('');
                                        setgender('female');
                                        othergender.current = 'female';
                                        validationCheck();
                                      }}>
                                      <Image
                                        source={
                                          gender === 'female'
                                            ? imageSource
                                            : unselectimageSource
                                        }
                                        style={{
                                          width:
                                            othergender.current == 'female'
                                              ? widthPixel(18)
                                              : widthPixel(16),
                                          height:
                                            othergender.current == 'female'
                                              ? widthPixel(18)
                                              : widthPixel(16),
                                          resizeMode: 'contain',
                                          marginTop:
                                            othergender.current == 'female'
                                              ? 3
                                              : 4,
                                        }}
                                      />
                                      <Text
                                        style={{
                                          flexDirection: 'row',
                                          marginHorizontal: 5,
                                          fontFamily:
                                            gender === 'female'
                                              ? RUBIK_SEMIBOLD_FONT
                                              : RUBIK_REGULAR_FONT,
                                          fontSize: FONT_15,
                                          lineHeight: FONT_25,
                                        }}>
                                        {
                                          global.shopOnAppSettings
                                            ?.verifypaciconfigurations
                                            ?.female_label
                                        }
                                      </Text>
                                    </TouchableOpacity>
                                  </View>
                                  {gendererror != null &&
                                  gendererror !== undefined &&
                                  gendererror !== '' ? (
                                    <Text style={styles.errorMesssage}>
                                      {gendererror}
                                    </Text>
                                  ) : null}
                                  <View style={styles.textContainer}>
                                    <View style={styles.governorateView}>
                                      <TextInput
                                        label={
                                          <Text
                                            style={{
                                              fontFamily: RUBIK_LIGHT_FONT,
                                              fontWeight: '300',
                                              fontSize: FONT_13,
                                            }}>
                                            {
                                              global.shopOnAppSettings
                                                ?.verifypaciconfigurations
                                                ?.date_of_birth_label
                                            }
                                          </Text>
                                        }
                                        mode="outlined"
                                        caretHidden={true}
                                        editable={false}
                                        value={
                                          dobobj != null &&
                                          dobobj != undefined &&
                                          dobobj != ''
                                            ? dobobj
                                            : t('verifylaterdateformat')
                                        }
                                        onChangeText={text => {
                                          setdobobj(text);
                                          otherdob.current = text;
                                          validationCheck();
                                        }}
                                        style={styles.input}
                                        theme={{
                                          colors: {
                                            placeholder:
                                              doberror != null &&
                                              doberror != undefined &&
                                              doberror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            text: colors.BLACK,
                                            primary:
                                              doberror != null &&
                                              doberror != undefined &&
                                              doberror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            underlineColor: 'transparent',
                                            background:
                                              doberror != null &&
                                              doberror != undefined &&
                                              doberror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                          },
                                          fonts: {
                                            regular: {
                                              fontFamily: RUBIK_REGULAR_FONT,
                                              fontSize: FONT_16,
                                              fontWeight: '400',
                                            },
                                          },
                                        }}
                                      />
                                      <View style={styles.inputButton}>
                                        <TouchableOpacity
                                          style={styles.inputOpacity}
                                          onPress={() => {
                                            setDateSelected(maxDate);
                                            setDateType('dob');
                                            setOpenPicker(true);
                                          }}>
                                          <Image
                                            source={require('../../assets/verificationcalender.png')}
                                            style={styles.iconCalender}
                                            resizeMode={'contain'}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      {doberror != null &&
                                      doberror !== undefined &&
                                      doberror !== '' ? (
                                        <Text style={styles.errorMesssage}>
                                          {doberror}
                                        </Text>
                                      ) : null}
                                    </View>
                                    <View style={styles.governorateView}>
                                      <TextInput
                                        label={
                                          <Text
                                            style={{
                                              fontFamily: RUBIK_LIGHT_FONT,
                                              fontWeight: '300',
                                              fontSize: FONT_13,
                                            }}>
                                            {
                                              global.shopOnAppSettings
                                                ?.verifypaciconfigurations
                                                ?.civilid_expiry_label
                                            }
                                          </Text>
                                        }
                                        mode="outlined"
                                        editable={false}
                                        caretHidden={true}
                                        value={
                                          civilidobj != null &&
                                          civilidobj != undefined &&
                                          civilidobj != ''
                                            ? civilidobj
                                            : t('verifylaterdateformat')
                                        }
                                        style={styles.input}
                                        theme={{
                                          colors: {
                                            placeholder:
                                              civilidexyerror != null &&
                                              civilidexyerror != undefined &&
                                              civilidexyerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            text: colors.BLACK,
                                            primary:
                                              civilidexyerror != null &&
                                              civilidexyerror != undefined &&
                                              civilidexyerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                            underlineColor: 'transparent',
                                            background:
                                              civilidexyerror != null &&
                                              civilidexyerror != undefined &&
                                              civilidexyerror != ''
                                                ? colors.OOREDOO_RED
                                                : colors.OOREDDO_GREY,
                                          },
                                          fonts: {
                                            regular: {
                                              fontFamily: RUBIK_REGULAR_FONT,
                                              fontSize: FONT_16,
                                              fontWeight: '400',
                                            },
                                          },
                                        }}
                                      />
                                      <View style={styles.inputButton}>
                                        <TouchableOpacity
                                          style={styles.inputOpacity}
                                          onPress={() => {
                                            setDateSelected(civilIdAutoDate);
                                            setDateType('civilid');
                                            setOpenPicker(true);
                                          }}>
                                          <Image
                                            source={require('../../assets/verificationcalender.png')}
                                            style={styles.iconCalender}
                                            resizeMode={'contain'}
                                          />
                                        </TouchableOpacity>
                                      </View>
                                      {civilidexyerror != null &&
                                      civilidexyerror !== undefined &&
                                      civilidexyerror !== '' ? (
                                        <Text style={styles.errorMesssage}>
                                          {civilidexyerror}
                                        </Text>
                                      ) : null}
                                    </View>
                                  </View>
                                  {openPicker && (
                                    <DatePicker
                                      modal
                                      textColor={
                                        Appearance.getColorScheme() === 'dark'
                                          ? colors.BLACK
                                          : colors.BLACK
                                      }
                                      mode={'date'}
                                      locale="en"
                                      open={openPicker}
                                      date={
                                        dateType === 'dob'
                                          ? otherdob.current != null &&
                                            otherdob.current != undefined &&
                                            otherdob.current != ''
                                            ? dateSelectedItemConvertion(
                                                otherdob.current
                                              )
                                            : dateSelected
                                          : othercivilexy.current != null &&
                                            othercivilexy.current !=
                                              undefined &&
                                            othercivilexy.current != ''
                                          ? dateSelectedItemConvertion(
                                              othercivilexy.current
                                            )
                                          : dateSelected
                                      }
                                      minimumDate={
                                        dateType === 'dob'
                                          ? minDate
                                          : minDateForCivilID
                                      }
                                      maximumDate={
                                        dateType === 'dob'
                                          ? maxDate
                                          : getMaximumDate()
                                      }
                                      onConfirm={date => {
                                        const newDate =
                                          moment(date).format('DD/MM/yyyy');
                                        setOpenPicker(false);
                                        if (dateType === 'dob') {
                                          setdobobj(newDate);
                                          otherdob.current = newDate;
                                          setdoberror('');
                                          validationCheck();
                                        } else {
                                          setcivilidobj(newDate);
                                          othercivilexy.current = newDate;
                                          setcivilidexyerror('');
                                          validationCheck();
                                        }
                                      }}
                                      onCancel={() => {
                                        setOpenPicker(false);
                                      }}
                                    />
                                  )}
                                  {openNationalityModal && (
                                    <ItemsListModal
                                      type={'nationality'}
                                      value={
                                        othernationalityValue.current || ''
                                      }
                                      onTryAgainClick={selectItem}
                                      itemsList={nationalityItem.current}
                                      onDismiss={() => {
                                        setOpenNationalityModal(false);
                                      }}
                                      itemIndex={nationalityItemIndex.current}
                                    />
                                  )}
                                </View>
                              </CollapseBody>
                            </Collapse>
                          )}
                        {isCollapsed !== '2' && (
                          <View
                            style={{
                              marginTop: heightPixel(10),
                              height: heightPixel(30),
                              backgroundColor: colors.WHITE,
                            }}
                          />
                        )}
                      </View>
                      {isCollapsed !== '2' && <StepsToVerify />}
                      {isTablet ? (
                        <View
                          style={{
                            flex: 1,
                            backgroundColor: colors.BG_LIGHT_GREY,
                          }}
                        />
                      ) : null}
                    </PaperProvider>
                  </View>
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          {showTimeOutPopup && (
            <TimeOutPopup
              visible={showTimeOutPopup}
              onContinue={() => {
                setisLoader(true);
                setItem(SHOP_CART_ID, '');
                setItem(SHOP_ITEM_ID, '');
                setItem(SHOP_ACCOUNT_ID, '');
                setItem(SHOP_CART_TIME, '');
                setshowTimeOutPopup(false);
                setTimeout(() => {
                  setisLoader(false);
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
                                routes: [
                                  {name: ScreenName.ShopOnAppLandingPage},
                                ],
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
                  right: isTablet
                    ? tabletMargin() + widthPixel(14)
                    : widthPixel(14),
                  bottom: widthPixel(10),
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
                    setisLoader(true);
                    setshowPaciPopup(false);
                    setTimeout(() => {
                      setisLoader(false);
                      setshowTimeOutPopup(true);
                    }, 500);
                  }}
                  type={
                    route?.params?.params?.item?.selectedNumMigPortRes?.type ||
                    'onboarding'
                  }
                />
              </View>
            )}
          <View style={styles.bottomPlan}>
            <View
              style={{
                flexDirection: 'row',
                marginTop: VERTICAL_20,
                marginHorizontal: HORIZONTAL_20,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <TouchableOpacity onPress={openBottomPlanModal}>
                <View style={{flexDirection: 'column'}}>
                  <View style={styles.bottomCardView}>
                    <Text style={styles.bottomCardText} numberOfLines={1}>
                      {childProduct != '' &&
                      childProduct != null &&
                      childProduct != undefined
                        ? childProduct?.productname
                        : parentProduct?.productname}
                    </Text>
                    <Image
                      source={require('../../assets/down.png')}
                      resizeMode={'contain'}
                      style={styles.bottomCardArrowImg}
                    />
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.bottomPlanPriceText}>
                      {t('price') + ':' + ' '}
                      {childProduct != '' &&
                      childProduct != null &&
                      childProduct != undefined &&
                      childProduct?.validity != null &&
                      childProduct?.validity != undefined &&
                      childProduct?.validity !== '' &&
                      childProduct?.validity !== '0'
                        ? childProduct?.kdtext +
                          ' ' +
                          childProduct?.price +
                          '/' +
                          childProduct?.validity
                        : parentProduct?.kdtext +
                          ' ' +
                          parentProduct?.price +
                          '/' +
                          parentProduct?.validity}
                    </Text>
                    {/* {childProduct != '' &&
                    childProduct != null &&
                    childProduct != undefined &&
                    childProduct?.validity != null &&
                    childProduct?.validity != undefined &&
                    childProduct.validity !== '' &&
                    childProduct.validity !== '0' ? (
                      <Text style={styles.bottomPlanPriceText}>
                        {childProduct?.kdtext} {childProduct?.price}/
                        {childProduct.validity}
                      </Text>
                    ) : parentProduct != '' &&
                      parentProduct != null &&
                      parentProduct != undefined &&
                      parentProduct?.validity != null &&
                      parentProduct?.validity != undefined &&
                      parentProduct.validity !== '' &&
                      parentProduct.validity !== '0' ? (
                      <Text style={styles.bottomPlanPriceText}>
                        {parentProduct?.kdtext} {parentProduct?.price}/
                        {parentProduct.validity}
                      </Text>
                    ) : (
                      <Text style={styles.bottomPlanPriceText}>
                        {parentProduct?.kdtext} {parentProduct?.price}
                      </Text>
                    )} */}
                  </View>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={continueButtonDisable}
                style={
                  continueButtonDisable
                    ? styles.disablebuttonContinue
                    : styles.buttonContinue
                }
                onPress={continueButtonClick}>
                <Text style={styles.buttonTextContinue}>
                  {
                    global?.shopOnAppSettings?.productdetailsconfigurations
                      ?.continuebtn_popup_label
                  }
                </Text>
              </TouchableOpacity>
            </View>
            {showPaciPopup && (
              <ShopPaciAuthentication
                isOpen={showPaciPopup}
                type={paciModelType}
                selectedNumberType={
                  route?.params?.params?.item?.selectedNumMigPortRes?.type ||
                  'onboarding'
                }
                mobileidRes={modalObj}
                civilid={ctext}
                transid={route?.params?.params?.item?.transid}
                onDismiss={() => {
                  setshowPaciPopup(false);
                  setContinueButtonDisable(false);
                }}
                item={null}
                onUseNumberPress={val => {}}
                onTryAgainClick={() => {
                  setisLoader(true);
                  paciupdatekycApi.mutate();
                }}
                onRefreshTransid={val => {
                  mobileidTransid.current = val;
                }}
              />
            )}
            <BottomSheet
              enableTouchDismiss
              isOpen={openSheet}
              onClose={closePopup}
              openFlex={1}>
              <BottomEmailVerifyDialog
                message={''}
                title={t('verification_successful')}
                btnName={''}
                bottonclosetext={''}
                deactivate_icon={null}
                designmode={2}
                tryagainClick={() => {}}
                onClose={closePopup}
              />
            </BottomSheet>
            {showErrorModal ? (
              <SupportedCountryModal
                popupText={msg}
                onDismiss={data => {
                  setShowErrorModal(false);
                }}
                titleMsg={errorTitle ? errorTitle : ''}
                isFrom={'passwordManagement'}
              />
            ) : null}
          </View>
        </View>
        {isLoader && (
          <Modal statusBarTranslucent transparent visible={isLoader}>
            <LoadingIndicator shouldDismissManual isVisible={isLoader} />
          </Modal>
        )}
      </View>
    </View>
  );
};

export default OrderVerificationScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.WHITE,
  },
  buttonContinue: {
    width: widthPixel(141),
    height: heightPixel(40),
    backgroundColor: '#ED1C24',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_24,
  },
  disablebuttonContinue: {
    width: widthPixel(141),
    height: heightPixel(40),
    backgroundColor: colors.LIGHT_GREY,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BORDER_RADIUS_24,
  },
  buttonTextContinue: {
    color: colors.WHITE,
    fontSize: FONT_13,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontWeight: '600',
  },
  bottomPlan: {
    bottom: 0,
    width: SCREEN_WIDTH,
    height: heightPixel(88),
    backgroundColor: colors.WHITE,
    borderTopLeftRadius: BORDER_RADIUS_16,
    borderTopRightRadius: BORDER_RADIUS_16,
    elevation: 15,
    shadowColor: '#000000',
    // paddingHorizontal: HORIZONTAL_10,
    shadowOffset: {width: 0, height: heightPixel(4)},
    shadowOpacity: 0.25,
    shadowRadius: SCALE_SIZE_10,
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
  loadingContainer: {
    marginTop: heightPixel(300),
    alignContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  errorTextStyle: {
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_26,
    margin: VERTICAL_15,
  },
  flatListShadow: {
    shadowOpacity: 0.25,
    shadowColor: colors.GREY,
    backgroundColor: colors.WHITE,
    shadowRadius: BORDER_RADIUS_10,
    borderRadius: BORDER_RADIUS_10,
    elevation: 15,
    paddingVertical: VERTICAL_10,
    marginHorizontal: HORIZONTAL_10,
    marginVertical: VERTICAL_10,
  },
  itemViewStyle: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginHorizontal: HORIZONTAL_10,
  },
  itemrequestTextStyle: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    textAlign: 'left',
  },

  dateTextStyle: {
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.GRAY_PALE,
    alignSelf: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end',
    textAlign: 'right',
    flex: 1,
  },
  viewStyle: {
    flexDirection: 'row',
  },
  buttonViewStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginHorizontal: HORIZONTAL_10,
  },
  btnTextStyle: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_14,
    lineHeight: FONT_24,
    marginStart: SCALE_SIZE_14,
    marginTop: VERTICAL_15,
    color: colors.OOREDOO_RED,
  },
  itemstatusTextStyle: {
    fontSize: FONT_14,
    lineHeight: FONT_24,
    textAlign: 'left',
  },
  flatlistStyle: {paddingBottom: VERTICAL_10},
  subContainer: {
    // marginTop: VERTICAL_27,
    flex: 1,
    marginHorizontal: tabletMargin(),
    backgroundColor: colors.BG_LIGHT_GREY,
  },
  wariningViewContainer: {
    height: FULL_HEIGHT_PERCENTAGE,
    width: CARD_WIDTH - HORIZONTAL_20,
    alignContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  warningArrowImage: {
    height: HEIGHT_60,
    width: WIDTH_60,
    marginTop: VERTICAL_10,
  },

  subCollapsecontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: BORDER_RADIUS_10,
    marginHorizontal: tabletMargin(),
    paddingBottom: isTablet ? -HEIGHT_50 : HEIGHT_50,
  },
  contentContainer: {
    flexDirection: 'column',
    marginHorizontal: tabletMargin(),
    backgroundColor: '#FFF8F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    // height: heightPixel(50),
    paddingRight: HORIZONTAL_20,
    marginVertical: VERTICAL_10,
    marginBottom: VERTICAL_10,
    marginHorizontal: HORIZONTAL_10,
  },
  headerImage: {
    // marginLeft: HORIZONTAL_13,
  },
  paciView: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    marginLeft: HORIZONTAL_10,
    marginRight: HORIZONTAL_15,
  },
  textLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_16,
    textAlign: 'left',
  },
  textLeftTwo: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_13,
    width: widthPixel(237),
    textAlign: 'left',
    padding: HORIZONTAL_1,
  },
  radioButtonTouch: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
    left: verticalScale(7),
  },
  toggleImage: {
    width: widthPixel(20),
    height: heightPixel(20),
    resizeMode: 'contain',
  },
  verifyPaci: {
    flexDirection: 'column',
    marginLeft: HORIZONTAL_12,
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_20,
  },
  input: {
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(57)
      : SCREEN_WIDTH - widthPixel(57),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  bottomView: {
    backgroundColor: '#B4F6EB',
    borderRadius: BORDER_RADIUS_31,
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(57)
      : SCREEN_WIDTH - widthPixel(52),
    height: heightPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VERTICAL_20,
    // marginBottom: VERTICAL_10,
  },
  bottomText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    color: colors.BLACK,
  },
  lastNameView: {
    marginHorizontal: SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  emailView: {
    marginHorizontal: SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  governorateView: {
    marginHorizontal: SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  areaView: {
    marginHorizontal: SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  additionalView: {
    marginHorizontal: SCALE_SIZE_0,
    marginTop: VERTICAL_20,
  },
  textContainer: {
    flex: 1,
  },
  iconsubStyle: {
    marginRight: HORIZONTAL_10,
    width: widthPixel(30),
    height: widthPixel(30),
    marginTop: HORIZONTAL_15,
  },
  cardView: {
    borderRadius: BORDER_RADIUS_10,
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(26)
      : SCREEN_WIDTH - widthPixel(26),
    borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 5,
    marginHorizontal: HORIZONTAL_13,
    backgroundColor: 'white',
    top: VERTICAL_20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  cardViewLater: {
    borderRadius: BORDER_RADIUS_10,
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(26)
      : SCREEN_WIDTH - widthPixel(26),
    borderWidth: 1,
    borderColor: colors.SILVER,
    elevation: 5,
    marginHorizontal: HORIZONTAL_13,
    backgroundColor: 'white',
    marginVertical: VERTICAL_30,
    top: VERTICAL_10,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
  },
  errorMesssage: {
    flexDirection: 'row',
    textAlign: 'left',
    fontSize: FONT_13,
    lineHeight: FONT_21,
    marginStart: HORIZONTAL_5,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    color: colors.OOREDOO_RED,
    fontFamily: RUBIK_LIGHT_FONT,
    // top: -VERTICAL_20,
  },
  iconCalender: {
    width: widthPixel(18),
    height: heightPixel(20),
    alignSelf: 'flex-end',
    top: VERTICAL_12,
    right: HORIZONTAL_15,
  },
  inputButton: {
    height: heightPixel(45),
    flexDirection: 'row',
    position: 'absolute',
    top: VERTICAL_10,
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(55)
      : SCREEN_WIDTH - widthPixel(55),
    zIndex: 100,
  },
  inputOpacity: {
    height: heightPixel(45),
    width: isTablet
      ? SCREEN_WIDTH / 1.25 - widthPixel(55)
      : SCREEN_WIDTH - widthPixel(55),
  },
  bottomPlanPriceText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
  },
  opactiy: {
    activeOpacity: 1,
  },
  bottomCardView: {
    flexDirection: 'row',
    alignItems: 'center',
    width: isTablet
      ? SCREEN_WIDTH - widthPixel(280)
      : SCREEN_WIDTH - widthPixel(230),
  },
  bottomCardText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_15,
  },
  bottomCardArrowImg: {
    height: heightPixel(16),
    width: widthPixel(16),
    marginStart: HORIZONTAL_5,
  },
});
