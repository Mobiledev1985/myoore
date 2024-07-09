import {
  Collapse,
  CollapseBody,
  CollapseHeader,
} from 'accordion-collapse-react-native';
import CleverTap from 'clevertap-react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import Geolocation from 'react-native-geolocation-service';
import {useTranslation} from 'react-i18next';
import {
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import {
  ActivityIndicator,
  FlatList,
  I18nManager,
  Image,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  PermissionsAndroid,
  TouchableOpacity,
  Keyboard,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Entypo';
import {
  RUBIK_SEMIBOLD_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
} from '../../../../selfcarern/src/resources/styles/fonts';
import {
  FULL_HEIGHT_PERCENTAGE,
  SCALE_SIZE_10,
  SCALE_SIZE_14,
  SHOP_ACCOUNT_ID,
  SHOP_CART_ID,
  SHOP_CART_TIME,
  SHOP_ITEM_ID,
  SHOP_PROGRESS_TIME,
} from '../../commonHelper/Constants';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import NotificationApi, {
  useNotificationApi,
} from '../../commonHelper/notificationapi';
import {
  UnitTestProps,
  consoleLog,
  getItem,
  setItem,
} from '../../commonHelper/utils';
import BottomDialogue from '../../models/basic/BottomDialogue';
import BottomSheet from '../../models/basic/BottomSheet';
import HeaderComponent from '../../models/basic/HeaderComponent';
import ScreenName from '../../navigator/ScreenName';
import {
  GET_NOTICATIONS_API,
  SIMNUMBER_RESERVE_API,
  SIM_VERIFYLATER_API,
  UPDATE_NOTICATIONS_STATUS,
} from '../../resources/route/endpoints';
import colors from '../../resources/styles/colors';
import {
  NOTOSANS_BOLD_FONT,
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
  HORIZONTAL_22,
  HORIZONTAL_20,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_16,
  VERTICAL_20,
  VERTICAL_27,
  WIDTH_60,
  WIDTH_110,
  BORDER_RADIUS_6,
  BORDER_RADIUS_10,
  BORDER_RADIUS_16,
  BORDER_RADIUS_24,
  VERTICAL_5,
  FONT_22,
  FONT_15,
  HORIZONTAL_1,
} from '../../resources/styles/responsive';
import {reject} from 'lodash';
import {NavigateByName, NavigateCards} from '../../services/NavigationService';
import {useRoute} from '@react-navigation/core';
import moment from 'moment';
import {
  FULL_WIDTH_PERCENTAGE,
  SCALE_SIZE_25,
} from '../../commonHelper/Constants';
import LinearGradient from 'react-native-linear-gradient';
import ContactDetails from '../../../src/models/shopOnApp/ContactDetails';
import {LandingPageButton} from '../../commonHelper/Button';
import SelectPlan from '../../models/shopOnApp/SelectPlan';
import BottomPlan from '../../models/shopOnApp/BottomPlan';
import ChooseSimType from '../../models/shopOnApp/ChooseSimType';
import en from '../../../assets/Strings/ar.json';
import ar from '../../../assets/Strings/ar.json';
import NewSimSelectNumberComponent from '../../pages/shopOnApp/NewSimSelectNumberComponent';
import {useMutation} from 'react-query';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import HeaderStatusbar from '../../components/shopOnApp/HeaderStatusBar';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import BottomPopUp from '../../components/shopOnApp/BottomPopUp';
import Rating from '../../models/shopOnApp/RatingUs';
import {RecordScreenEvent, RecordlogEvents} from '../../analytics/RecordEvents';
import {
  shopPriceCalculation,
  storeCurrentDate,
} from '../../services/CommonUtils';
import BottomRenewDialogue from '../../models/basic/BottomRenewDialogue';
const OrderNewSimScreen = ({
  navigation,
  route,
  visible,
  isFrom,
  response,
  productInfo,
}) => {
  const {t} = useTranslation();
  const routelocal = useRoute();
  const [text, setText] = useState('');
  const [itemValue, setitemValue] = useState('esim');
  const [reloadList, setreloadList] = useState(false);
  const {parentProduct, childProduct} = route?.params?.params;

  const key_getnotifications = `${global.UniqueToken}_GET_NOTIFICATIONS_API`;

  const key_delnotifications = `${global.UniqueToken}_DELETE_NOTIFICATION`;

  const key_viewednotifications = `${global.UniqueToken}_VIEWED_NOTIFICATION`;

  const [bottomPlanVisible, setBottomPlanVisible] = useState(false);
  const [openSheet, setOpenSheet] = useState(false);
  const [item_ct, setCTItem] = useState('');
  const [descLines, setDescLines] = useState(1);
  const [showModal, setshowModal] = useState(false);
  const [refflag, setrefflag] = useState(false);
  const [clickIndex, setclickIndex] = useState();
  const [continueButtonDisable, setcontinueButtonDisable] = useState(true);
  const [physicalsimdata, setphysicalsimdata] = useState(null);
  const [saveAddeess, setsaveAddeess] = useState(false);
  const [contactinfoNumber, setcontactinfoNumber] = useState('');
  const [contactinfoEmail, setcontactinfoEmail] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [mapAddress, setMapAddress] = useState('');
  const [contactwhatsapp, setcontactwhatsapp] = useState(false);
  const [onboardingtype, setonboardingtype] = useState('');
  const [modalmsg, setmodalmsg] = useState('');
  const AllItemDeatils = useRef(null);
  const scrollViewRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoaderapi, setisLoaderapi] = useState(false);
  const [hideChooseSim, sethideChooseSim] = useState(false);
  const [contacterror, setcontacterror] = useState('');
  const [enteredNumberRes, setenteredNumberRes] = useState(null);
  const [tooglestatusnumber, settooglestatusnumber] = useState(false);
  const [tooglestatuschoosesim, settooglestatuschoosesim] = useState(false);
  const [datacompleted, setdatacompleted] = useState({
    contactdetail: false,
    selectnumber: false,
    choosesim: false,
    // choosesimhide: false,
  });
  const [portInOption, setPortInOption] = useState('');
  const [isTNCAccepted, setIsTNCAccepted] = useState(false);
  const [openBottomSheet, setopenBottomSheet] = useState(false);
  const [continueButtonDisableClick, setcontinueButtonDisableClick] =
    useState(false);

  const isButtonDisabled =
    enteredNumberRes?.type === 'portin'
      ? Object.values(datacompleted).some(value => value === false) ||
        portInOption == '' ||
        !isTNCAccepted
      : Object.values(datacompleted).some(value => value === false);

  const {gotData, refetch, count, apiresp} = useNotificationApi();
  const toggleBottomSheet = () => {
    setOpenSheet(prevState => !prevState);
  };
  const [viewHeight, setViewHeight] = useState(60);
  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.OrderNewSimScreen,
    show: false,
  });

  const openBottomPlanModal = () => {
    setBottomPlanVisible(true);
  };

  const formdataItem = useCallback(
    (value, contactinfoNumber) => {
      if (
        contactinfoNumber == '' &&
        (global.contactNumber == null ||
          global.contactNumber == undefined ||
          global.contactNumber == '')
      ) {
        setcontacterror(t('peavmn'));
      } else {
        setphysicalsimdata(value);
      }
    },
    [contacterror]
  );

  const focusedFun = value => {
    if (scrollViewRef.current) {
      if (value?.type === 'choosesiminput') {
        if (Platform.OS != 'ios') {
          scrollViewRef.current?.scrollTo({
            y:
              value?.val === 7
                ? value?.val * 65 + viewHeight + 300
                : tooglestatusnumber
                ? value?.val * 65 + viewHeight + 160
                : value?.val * 65 + viewHeight + 250,
            animated: true,
          });
        } else if (Platform.OS === 'ios') {
          if (value?.val === 7) {
            scrollViewRef.current?.scrollTo({
              y: value?.val * 65 + viewHeight + 300,
              animated: true,
            });
          } else if (value?.val === 6) {
            scrollViewRef.current?.scrollTo({
              y: value?.val * 65 + viewHeight + 250,
              animated: true,
            });
          } else {
            scrollViewRef.current?.scrollTo({
              y: value?.val * 65 + viewHeight + 200,
              animated: true,
            });
          }
        }
      } else if (value == 'selectnumberExpanded') {
        setTimeout(() => {
          scrollViewRef.current?.scrollTo({
            y: 20 + viewHeight,
            animated: true,
          });
        }, 200);
      } else if (value == 'chooseSimExpanded') {
        scrollViewRef.current?.scrollTo({
          y: 20 + viewHeight,
          animated: true,
        });
      } else if (!tooglestatusnumber && value == 'selectnumber') {
        scrollViewRef.current?.scrollTo({
          y: value == 'selectnumber' ? heightPixel(400) : heightPixel(300),
          animated: true,
        });
      } else if (
        tooglestatusnumber &&
        (value == 'selectnumber' ||
          value == 'selectnumbervaluetwo' ||
          value == 'selectnumbervaluethree')
      ) {
        scrollViewRef.current?.scrollTo({
          y: value == 'selectnumber' ? heightPixel(400) : heightPixel(300),
          animated: true,
        });
      } else if (
        tooglestatusnumber &&
        value?.type == 'choosesim' &&
        tooglestatuschoosesim
      ) {
        Keyboard.dismiss();
      } else if (
        (!tooglestatusnumber || tooglestatusnumber) &&
        value?.type == 'choosesim' &&
        (value?.val == null ||
          value?.val == undefined ||
          value?.val == '' ||
          value?.val == 'esim') &&
        !tooglestatuschoosesim
      ) {
        Keyboard.dismiss();
        scrollViewRef.current?.scrollTo({
          y: 150 + viewHeight,
          animated: true,
        });
      } else if (
        (!tooglestatusnumber || tooglestatusnumber) &&
        value?.type == 'choosesim' &&
        value?.val != 'esim' &&
        !tooglestatuschoosesim
      ) {
        Keyboard.dismiss();
        scrollViewRef.current?.scrollTo({
          y: tooglestatusnumber ? 200 + viewHeight : 100 + viewHeight,
          animated: true,
        });
      } else if (
        !tooglestatusnumber &&
        value?.type == 'choosesim' &&
        !tooglestatuschoosesim
      ) {
        scrollViewRef.current?.scrollTo({
          y: heightPixel(400),
          animated: true,
        });
      } else if (
        value === 'onboarding' ||
        value === 'migration' ||
        value === 'portin'
      ) {
        scrollViewRef.current?.scrollTo({
          y: heightPixel(350),
          animated: true,
        });
      } else {
      }
    }
  };
  const closeBottomPlanModal = () => {
    setBottomPlanVisible(false);
  };

  React.useEffect(() => {
    RecordScreenEvent('Shop SIM Selection');
  }, []);

  useEffect(() => {
    if (Platform.OS !== 'ios') {
      const keyboardDidShowListener = Keyboard.addListener(
        Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
        () => {
          // setKeyboardShow(true);
          // focusedFun('keyboardshow');
          // setreloadList(true);
        }
      );
      const keyboardDidHideListener = Keyboard.addListener(
        Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
        () => {
          // Keyboard.dismiss();
          // setKeyboardShow(false);
          //focusedFun('keyboardhide');
          // setreloadList(false);
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }
  }, []);

  const continueButtonDisableBtn = value => {
    setcontinueButtonDisable(value);
  };

  const iosLocationPermission = async () => {
    try {
      const response = await Geolocation.requestAuthorization('whenInUse');
      if (response === 'granted') {
        getUserCurrentLocation();
        return true;
      } else {
        setmodalmsg(t('palc'));
        setopenBottomSheet(true);
        Geolocation.requestAuthorization('always');
        return false;
      }
    } catch (error) {}
  };

  const androidLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        'android.permission.ACCESS_FINE_LOCATION'
      );
      if (granted === 'granted') {
        getUserCurrentLocation();
        return true;
      } else {
        setmodalmsg(t('palc'));
        setopenBottomSheet(true);

        return false;
      }
    } catch (error) {}
  };

  //Geoloaction permission
  const getUserCurrentLocation = () => {
    try {
      Geolocation.getCurrentPosition(
        position => {
          setLatitude(position?.coords?.latitude);
          setLongitude(position?.coords?.longitude);
        },
        error => {
          reject(error.message);
        },
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 10000}
      );
    } catch (error) {
      setmodalmsg(t('palc'));
      setopenBottomSheet(true);
    }
  };

  const getCurrentLocation = () => {
    try {
      let hasPermission =
        Platform.OS === 'ios'
          ? iosLocationPermission()
          : androidLocationPermission();
      return new Promise((resolve, reject) => {
        if (hasPermission) {
          getUserCurrentLocation();
        }
      });
    } catch (error) {}
  };

  const saveaddressItem = value => {
    setsaveAddeess(value);
  };

  const viewdetailsmodal = value => {
    setOpenModal(value);
  };

  const contactInfoFunc = (number, email, whatsapp) => {
    if (number == '') {
      setcontinueButtonDisable(true);
    } else {
      setcontacterror('');
      setcontactinfoNumber(number);
      setcontactinfoEmail(email);
      setcontactwhatsapp(whatsapp);
      global.contactinfoEmail =
        email != null && email != undefined && email != ''
          ? email
          : global.contactinfoEmail || '';
      if (
        global.contactinfoEmail != null &&
        global.contactinfoEmail != undefined &&
        global.contactinfoEmail != ''
      ) {
        // setdatacompleted(prevState => ({
        //   ...prevState,
        //   choosesim: true,
        // }));
        if (
          global.formData != null &&
          global.formData != undefined &&
          global.formData != '' &&
          global.formData.itemValue == 'physicalsim'
        ) {
          if (
            global.formData?.formData.firstname == null ||
            global.formData?.formData.firstname == undefined ||
            global.formData?.formData.firstname == ''
          ) {
            setdatacompleted(prevState => ({
              ...prevState,
              choosesim: false,
            }));
          }
        } else {
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: true,
          }));
        }
      } else {
        if (
          global.contactinfoEmail == null ||
          global.contactinfoEmail === undefined ||
          global.contactinfoEmail === ''
        ) {
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: false,
          }));
        }
      }
    }
  };

  const ChooseSimtypeCTevent = () => {
    try {
      RecordlogEvents('Choose Simtype', {
        'Mobile Number': global.customerprofile.Msisdn,
        'Login Type': global.logintype,
        simtype: itemValue,
        email:
          itemValue == 'esim'
            ? global.contactinfoEmail != null &&
              global.contactinfoEmail != undefined &&
              global.contactinfoEmail != ''
              ? global.contactinfoEmail
              : physicalsimdata?.esimemail
            : global.contactinfoEmail != null &&
              global.contactinfoEmail != undefined &&
              global.contactinfoEmail != ''
            ? global.contactinfoEmail
            : physicalsimdata?.email,
        'first name': physicalsimdata?.firstname,
        'last name': physicalsimdata?.lastname,
        governorate: physicalsimdata?.governorate,
        Area: physicalsimdata?.area,
        street: physicalsimdata?.street,
      });
    } catch (e) {}
  };

  const handleOrderVerification = () => {
    // if (itemValue == 'physicalsim') {
    //   simverifyApi.mutate()
    // }
    setcontinueButtonDisableClick(true);
    if (itemValue == 'physicalsim' || itemValue == 'esim') {
      global.ShopOnAPPAddressObj = physicalsimdata;
      global.contactNumber = contactinfoNumber;
      global.contactwhatsapp = contactwhatsapp;
      var AllItem = {
        msisdn: '965' + global.NewSimNumberSliderItem?.MSISDN,
        productid:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct.id
            : parentProduct?.id,
        onboardingtype: onboardingtype,
        type: parentProduct.type,
        commitment:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct?.plancommitment
            : parentProduct?.plancommitment,
        configpid: parentProduct.id,
        simtype: itemValue,
        saveaddress: saveAddeess,
        longitude: longitude,
        lattitude: latitude,
        avenue: mapAddress,
        mapaddress: '',
        contactnumber: contactinfoNumber,
        contactemail: contactinfoEmail,
        isWhatspp: contactwhatsapp,
        physicalsimdata: physicalsimdata,
        parentProduct: parentProduct,
        childProduct: childProduct,
        selectednumberobject: global.NewSimNumberSliderItem,
      };
      var AllItemForPortin = {
        msisdn: '965' + enteredNumberRes?.enteredNumber,
        productid:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct.id
            : parentProduct?.id,
        onboardingtype: 'portin',
        type: parentProduct.type,
        commitment:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct?.plancommitment
            : parentProduct?.plancommitment,
        configpid: parentProduct.id,
        simtype: itemValue,
        saveaddress: saveAddeess,
        longitude: longitude,
        lattitude: latitude,
        avenue: mapAddress,
        mapaddress: '',
        contactnumber: contactinfoNumber,
        contactemail: contactinfoEmail,
        isWhatspp: contactwhatsapp,
        physicalsimdata: physicalsimdata,
        parentProduct: parentProduct,
        childProduct: childProduct,
        selectednumberobject: enteredNumberRes,
        selectedPortinOperator: portInOption,
      };
      AllItemDeatils.current =
        enteredNumberRes?.type === 'portin' ? AllItemForPortin : AllItem;
      setisLoaderapi(true);
      simnumberreverseApi.mutate();
    } else if (enteredNumberRes?.type === 'migration') {
      var AllItem = {
        msisdn: '965' + enteredNumberRes?.enteredNumber,
        productid:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct.id
            : parentProduct?.id,
        onboardingtype: 'migration',
        type: parentProduct.type,
        commitment:
          childProduct != '' &&
          childProduct != null &&
          childProduct != undefined
            ? childProduct?.plancommitment
            : parentProduct?.plancommitment,
        configpid: parentProduct.id,
        simtype: itemValue,
        contactnumber: contactinfoNumber,
        contactemail: contactinfoEmail,
        isWhatspp: contactwhatsapp,
        physicalsimdata: physicalsimdata,
        parentProduct: parentProduct,
        childProduct: childProduct,
        selectednumberobject: enteredNumberRes,
      };
      AllItemDeatils.current = AllItem;
      setisLoaderapi(true);
      simnumberreverseApi.mutate();
    } else {
    }

    // if (itemValue == 1) {
    //   simnumberreverseApi.mutate();
    // }
    // navigation.navigate(ScreenName.ShopStack, {
    //   screen: ScreenName.OrderVerificationScreen,
    // });
  };
  const simnumberreverseApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          SIMNUMBER_RESERVE_API,
          enteredNumberRes?.type === 'migration'
            ? {
                msisdn: '965' + enteredNumberRes?.enteredNumber,
                productid:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct.id
                    : parentProduct?.id,
                onboardingtype: 'migration',
                type: parentProduct.type,
                commitment:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.plancommitment
                    : parentProduct?.plancommitment,
                configpid: parentProduct.id,
                contactnumber: contactinfoNumber,
                contactemail: contactinfoEmail,
                linetype:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.linetype
                    : parentProduct?.linetype,
                mlinetype: enteredNumberRes?.res?.rateplantype,
                oamount: enteredNumberRes?.res?.oamount,
                isregisterwhatsapp: contactwhatsapp ? '1' : '0',
              }
            : enteredNumberRes?.type === 'portin'
            ? {
                msisdn: '965' + enteredNumberRes?.enteredNumber,
                productid:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct.id
                    : parentProduct?.id,
                onboardingtype: 'portin',
                type: parentProduct.type,
                commitment:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.plancommitment
                    : parentProduct?.plancommitment,
                configpid: parentProduct.id,
                simtype: itemValue,
                portinop: portInOption,
                saveaddress: saveAddeess,
                governorate: physicalsimdata?.governorate,
                governorateid: physicalsimdata?.governorate,
                area: physicalsimdata?.area,
                longitude: '',
                lattitude: '',
                avenue: mapAddress,
                email:
                  itemValue == 'esim'
                    ? global.contactinfoEmail != null &&
                      global.contactinfoEmail != undefined &&
                      global.contactinfoEmail != ''
                      ? global.contactinfoEmail
                      : physicalsimdata?.esimemail
                    : global.contactinfoEmail != null &&
                      global.contactinfoEmail != undefined &&
                      global.contactinfoEmail != ''
                    ? global.contactinfoEmail
                    : physicalsimdata?.email,
                firstname: physicalsimdata?.firstname,
                lastname: physicalsimdata?.lastname,
                street: physicalsimdata?.street,
                contactnumber: contactinfoNumber,
                contactemail: contactinfoEmail,
                mapaddress: '',
                additionaladress: physicalsimdata?.additional,
                numberclass: '',
                linetype:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.linetype
                    : parentProduct?.linetype,
                isregisterwhatsapp: contactwhatsapp ? '1' : '0',
              }
            : {
                msisdn: '965' + global.NewSimNumberSliderItem?.MSISDN,
                productid:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct.id
                    : parentProduct?.id,
                onboardingtype: onboardingtype,
                type: parentProduct.type,
                commitment:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.plancommitment
                    : parentProduct?.plancommitment,
                configpid: parentProduct?.id,
                simtype: itemValue,
                saveaddress: saveAddeess,
                governorate: physicalsimdata?.governorate,
                governorateid: physicalsimdata?.governorate,
                area: physicalsimdata?.area,
                longitude: '',
                lattitude: '',
                avenue: mapAddress,
                email:
                  itemValue == 'esim'
                    ? global.contactinfoEmail != null &&
                      global.contactinfoEmail != undefined &&
                      global.contactinfoEmail != ''
                      ? global.contactinfoEmail
                      : physicalsimdata?.esimemail
                    : global.contactinfoEmail != null &&
                      global.contactinfoEmail != undefined &&
                      global.contactinfoEmail != ''
                    ? global.contactinfoEmail
                    : physicalsimdata?.email,
                firstname: physicalsimdata?.firstname,
                lastname: physicalsimdata?.lastname,
                street: physicalsimdata?.street,
                contactnumber: contactinfoNumber,
                contactemail: contactinfoEmail,
                mapaddress: '',
                numberclass: global.NewSimNumberSliderItem?.className,
                additionaladress: physicalsimdata?.additional,
                linetype:
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.linetype
                    : parentProduct?.linetype,
                isregisterwhatsapp: contactwhatsapp ? '1' : '0',
              },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setcontinueButtonDisableClick(false);
        if (data?.data?.status === '0') {
          // Append transid key
          AllItemDeatils.current.addcartresponse =
            data?.data?.response?.addcartresponse;
          AllItemDeatils.current.transid = data?.data?.response?.transid;
          AllItemDeatils.current.saveAddressID =
            data?.data?.response?.saveaddressid;
          AllItemDeatils.current.cartID = data?.data?.response?.cartid;
          AllItemDeatils.current.itemID = data?.data?.response?.itemid;
          AllItemDeatils.current.accountID = data?.data?.response?.accountid;
          AllItemDeatils.current.pmsisdn = data?.data?.response?.pmsisdn;
          AllItemDeatils.current.selectedNumMigPortRes = enteredNumberRes;
          setItem(SHOP_CART_ID, data?.data?.response?.cartid);
          setItem(SHOP_ITEM_ID, data?.data?.response?.itemid);
          setItem(SHOP_ACCOUNT_ID, data?.data?.response?.accountid);
          setItem(
            SHOP_PROGRESS_TIME,
            global.shopOnAppSettings?.planpurchaseconfigurations
              ?.number_reservation_time_in_minutes
          );
          storeCurrentDate();
          global.prevTime = null;
          global.shoptransactionStatus = 'notcompleted';
          ChooseSimtypeCTevent();
          setTimeout(() => {
            NavigateByName(
              navigation,
              ScreenName.OrderVerificationScreen,
              AllItemDeatils.current,
              null,
              null
            );
            setisLoaderapi(false);
          }, 500);
        } else {
          setisLoaderapi(false);
          setshowModal(true);
          setmodalmsg(data?.data?.message);
        }
      },
      onError: (error, variables, context) => {
        setisLoaderapi(false);
      },
    }
  );

  // const simverifyApi = useMutation(
  //   req =>
  //     callQueryapi({
  //       queryKey: [
  //         {},
  //         SIM_VERIFYLATER_API,
  //         {
  //           otransid: '',
  //           msisdn: '',
  //           firstname: physicalsimdata?.firstname,
  //           lastname: physicalsimdata?.lastname,
  //           civilid: '',
  //           nationality: '',
  //           gender: '',
  //           dob: '',
  //           civilidexpiry: '',
  //           iscommitment: ''
  //         },
  //       ],
  //     }),
  //   {
  //     onSuccess: (data, variables, context) => {
  //       if (data?.data?.status === '0') {
  //       }
  //       else {
  //       }
  //     },
  //     onError: (error, variables, context) => {

  //     },
  //   }
  // );

  const verificationCompleted = data => {
    if (data?.transaction) {
      if (data?.type === 'migration') {
        setenteredNumberRes(data);
        sethideChooseSim(true);
      } else if (data?.type === 'portin') {
        setenteredNumberRes(data);
      } else {
        setenteredNumberRes(null);
        sethideChooseSim(false);
      }
    } else {
      sethideChooseSim(false);
      setenteredNumberRes(null);
    }
  };

  return (
    <View style={styles.container}>
      <HeaderComponent
        showBackButton
        headerTitle={t('order_new_sim')}
        statusBarColor={colors.WHITE}
        isHeaderTextPressDisabled
        showBanner={false}
        notificationunreadCount={
          global.notificationsUnreadCount == null ||
          global.notificationsUnreadCount === ''
            ? count
            : global.notificationsUnreadCount
        }
        type={'shoponapp'}
      />
      <View>
        <HeaderStatusbar
          elementMeta={global.shopOnAppSettings.productdetailsconfigurations}
        />
      </View>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={Platform.OS === 'ios' ? 'padding' : null}>
        <ScrollView
          bounces={false}
          ref={scrollViewRef}
          contentInsetAdjustmentBehavior="automatic"
          keyboardShouldPersistTaps={'always'}
          scrollToOverflowEnabled={true}
          // onScroll={event => {
          //   Keyboard.dismiss();
          // }}
          contentContainerStyle={{
            flex: 0,
            top:
              reloadList == 'searchnumber'
                ? null
                : reloadList != true
                ? null
                : -heightPixel(300),
          }}>
          <View style={styles.subContainer}>
            <View style={styles.selectPlanCard}>
              <SelectPlan
                text={text}
                setText={setText}
                selectedPlandata={
                  global.shopOnAppSettings?.productdetailsconfigurations
                }
                parentProduct={parentProduct}
                childProduct={childProduct}
                viewdetailsmodal={viewdetailsmodal}
              />
              <ContactDetails
                text={text}
                setText={setText}
                ContactDetailsData={
                  global.shopOnAppSettings?.productdetailsconfigurations
                }
                contactInfoFunc={contactInfoFunc}
                continueButtonDisableBtn={continueButtonDisableBtn}
                contacterror={contacterror}
                datacompleted={datacompleted}
                contactinfoNumber={contactinfoNumber}
                contactinfoEmail={contactinfoEmail}
                setdatacompleted={setdatacompleted}
              />
              <View
                onLayout={event => {
                  const {height} = event.nativeEvent.layout;
                  setViewHeight(height);
                }}>
                <NewSimSelectNumberComponent
                  itemValue={itemValue}
                  setitemValue={setitemValue}
                  NewSimSelectNumberComponentData={
                    global.shopOnAppSettings?.productdetailsconfigurations
                  }
                  onboardingtype={onboardingtype}
                  setonboardingtype={setonboardingtype}
                  parentProduct={parentProduct}
                  childProduct={childProduct}
                  datacompleted={datacompleted}
                  setdatacompleted={setdatacompleted}
                  scrollViewRef={scrollViewRef}
                  focusedFun={focusedFun}
                  verificationCompleted={verificationCompleted}
                  enteredNumberRes={enteredNumberRes}
                  settooglestatusnumber={settooglestatusnumber}
                  reloadList={reloadList}
                  setreloadList={setreloadList}
                  setPortInOption={setPortInOption}
                  portInOption={portInOption}
                  setIsTNCAccepted={setIsTNCAccepted}
                  isTNCAccepted={isTNCAccepted}
                  setenteredNumberRes={setenteredNumberRes}
                />
              </View>
              {!hideChooseSim && (
                <ChooseSimType
                  itemValue={itemValue}
                  setitemValue={setitemValue}
                  formdataItem={formdataItem}
                  ChooseSimTypeData={
                    global.shopOnAppSettings?.productdetailsconfigurations
                  }
                  continueButtonDisableBtn={continueButtonDisableBtn}
                  saveaddressItem={saveaddressItem}
                  contactinfoNumber={contactinfoNumber}
                  latitude={latitude}
                  longitude={longitude}
                  parentProduct={parentProduct}
                  childProduct={childProduct}
                  reloadList={reloadList}
                  setreloadList={setreloadList}
                  datacompleted={datacompleted}
                  setdatacompleted={setdatacompleted}
                  scrollViewRef={scrollViewRef}
                  focusedFun={focusedFun}
                  formDataValue={global.formData?.formData}
                  physicalSimClick={() => {
                    // if (global.logintype) {
                    try {
                      getCurrentLocation();
                      if (routelocal.name != null && !global.splashlaunch) {
                        global.notifyredirect = routelocal.name;
                        setTimeout(() => {
                          navigation.navigate(ScreenName.splashScreen);
                        }, 500);
                      }
                    } catch (e) {}
                    // }
                  }}
                  settooglestatuschoosesim={settooglestatuschoosesim}
                  mapAddress={mapAddress}
                  setMapAddress={setMapAddress}
                />
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View style={styles.bottomPlanView}>
        <View style={styles.bottomPlanContent}>
          <TouchableOpacity activeOpacity={1} onPress={openBottomPlanModal}>
            <View style={styles.bottomPlanTextContainer}>
              <View style={styles.bottomPlanTextWrapper}>
                <Text style={styles.bottomPlanText} numberOfLines={1}>
                  {childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.productname
                    : parentProduct?.productname}
                </Text>
                <Image
                  source={require('../../assets/down.png')}
                  resizeMode={'contain'}
                  style={styles.bottomPlanImage}
                />
              </View>
              <View style={{flexDirection: 'row'}}>
                <Text style={styles.bottomPlanPriceText}>
                  {t('price') + ':' + ' '}{' '}
                  {childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined &&
                  childProduct?.validity != null &&
                  childProduct?.validity != undefined &&
                  childProduct.validity !== '' &&
                  childProduct.validity !== '0'
                    ? childProduct?.kdtext +
                      ' ' +
                      childProduct?.price +
                      '/' +
                      childProduct.validity
                    : parentProduct?.kdtext +
                      ' ' +
                      parentProduct?.price +
                      '/' +
                      parentProduct.validity}
                  {/* {parentProduct?.type === 'configurable' &&
                  childProduct?.duetoday != null &&
                  childProduct?.duetoday !== undefined &&
                  childProduct?.duetoday !== ''
                    ? Number(childProduct?.duetoday || 0) +
                      Number(global.NewSimNumberSliderItem?.Price || 0) +
                      Number(
                        itemValue != null &&
                          itemValue !== undefined &&
                          itemValue !== '' &&
                          itemValue === 'esim'
                          ? Number(childProduct?.esimprice || 0)
                          : 0
                      ) +
                      '/' +
                      childProduct?.validity
                    : parentProduct?.type === 'simple' &&
                      parentProduct?.duetoday != null &&
                      parentProduct?.duetoday !== undefined &&
                      parentProduct?.duetoday !== ''
                    ? Number(parentProduct?.duetoday || 0) +
                      Number(global.NewSimNumberSliderItem?.Price || 0) +
                      Number(
                        itemValue != null &&
                          itemValue !== undefined &&
                          itemValue !== '' &&
                          itemValue === 'esim'
                          ? Number(parentProduct?.esimprice || 0)
                          : 0
                      ) +
                      '/' +
                      parentProduct?.validity
                    : childProduct != '' &&
                      childProduct != null &&
                      childProduct != undefined
                    ? Number(childProduct.price || 0) +
                      Number(global.NewSimNumberSliderItem?.Price || 0) +
                      Number(
                        itemValue != null &&
                          itemValue !== undefined &&
                          itemValue !== '' &&
                          itemValue === 'esim'
                          ? Number(childProduct?.esimprice || 0)
                          : 0
                      ) +
                      '/' +
                      childProduct?.validity
                    : Number(parentProduct?.price || 0) +
                      Number(global.NewSimNumberSliderItem?.Price || 0) +
                      Number(
                        itemValue != null &&
                          itemValue !== undefined &&
                          itemValue !== '' &&
                          itemValue === 'esim'
                          ? Number(parentProduct?.esimprice || 0)
                          : 0
                      ) +
                      '/' +
                      parentProduct?.validity} */}
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
            activeOpacity={1}
            disabled={
              continueButtonDisableClick
                ? true
                : isButtonDisabled
                ? true
                : false
            }
            style={[
              styles.buttonContinue,
              {
                backgroundColor:
                  isButtonDisabled || continueButtonDisableClick
                    ? colors.OOREDDO_LIGHT_GREY
                    : colors.OOREDOO_RED,
              },
            ]}
            onPress={handleOrderVerification}>
            <Text style={styles.buttonTextContinue}>
              {
                global?.shopOnAppSettings?.productdetailsconfigurations
                  ?.continuebtn_popup_label
              }
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomPlan
        visible={bottomPlanVisible}
        onClose={closeBottomPlanModal}
        selectedPlandata={global.shopOnAppSettings.productdetailsconfigurations}
        parentProduct={parentProduct}
        childProduct={childProduct}
        simType={itemValue || ''}
        type={onboardingtype}
        outstandingamount={enteredNumberRes?.res?.oamount || 0}
        numberSelected={enteredNumberRes?.enteredNumber || ''}
      />
      {openModal && (
        <BottomPopUp
          visible={openModal}
          onClose={() => {
            setOpenModal(false);
          }}
          isFrom={'ViewDetail'}
          response={''}
          onContinue={() => {
            setOpenModal(false);
            // navigation.navigate(ScreenName.ShopStack, {
            //   screen: ScreenName.OrderNewSimScreen,
            //   // screen: ScreenName.OrderVerificationScreen,
            // });
          }}
          productInfo={parentProduct}
        />
      )}
      <CustomDialogue
        visible={showModal}
        message={modalmsg}
        onClose={() => {
          setshowModal(false);
          setmodalmsg('');
        }}
        // onCancel={() => setshowModal(false)}
      />
      <BottomSheet
        {...UnitTestProps('basicservices', 'bottomsheet', 'confirmpopupsheet')}
        enableTouchDismiss
        isOpen={openBottomSheet}
        onClose={() => {
          setmodalmsg('');
          setopenBottomSheet(false);
        }}
        openFlex={1}>
        <BottomRenewDialogue
          message={t('palc')}
          title={
            ''
            // selectedItem?.oppopup?.deactivate_title
            // || t('unsubscribe_title')
          }
          btnName={t('okuper')}
          bottonclosetext={t('cancel')}
          isFrom={'ordernewsimlocation'}
          designmode={3}
          // tryagainClick={()=>{

          // }}
          tryagainClick={() => {
            setmodalmsg('');
            setopenBottomSheet(false);
          }}
          onClose={() => {
            setmodalmsg('');
            setopenBottomSheet(false);
          }}
        />
      </BottomSheet>
      {/* <BottomSheet
        enableTouchDismiss
        isOpen={openBottomSheet}
        onClose={() => {
          setmodalmsg('');
          setopenBottomSheet(false);
        }}
        openFlex={1}>
        <BottomDialogue
          showIcon
          designmode={2}
          btnName={t('capcontinue')}
          message={t('palc')}
          onClose={() => {
            setmodalmsg('');
            setopenBottomSheet(false);
          }}
          tryagainClick={() => {
            setmodalmsg('');
            setopenBottomSheet(false);
          }}
        /> */}
      {/* </BottomSheet> */}
      {isLoaderapi && (
        <Modal statusBarTranslucent transparent visible={isLoaderapi}>
          <LoadingIndicator
            shouldDismissManual={true}
            isVisible={isLoaderapi}
          />
        </Modal>
      )}
    </View>
  );
};

export default OrderNewSimScreen;
const styles = StyleSheet.create({
  container: {
    // position: 'absolute',
    backgroundColor: colors.BG_COLOR_WHITE,
    flex: 1,
    // alignItems: 'center',
    justifyContent: 'space-between',
  },

  buttonContinue: {
    width: widthPixel(141),
    height: heightPixel(40),
    // backgroundColor: '#ED1C24',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: HORIZONTAL_22,
    borderRadius: BORDER_RADIUS_24,
  },
  buttonTextContinue: {
    color: colors.WHITE,
    fontSize: FONT_13,
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontWeight: '600',
  },
  bottomPlanView: {
    //  position: 'absolute',
    // bottom: 0,
    width: SCREEN_WIDTH,
    height: heightPixel(88),
    // backgroundColor: colors.WHITE,
    borderTopLeftRadius: BORDER_RADIUS_16,
    borderTopRightRadius: BORDER_RADIUS_16,
    borderWidth: 1,
    shadowOpacity: 0.25,
    shadowColor: colors.GREY,
    shadowRadius: BORDER_RADIUS_10,
    borderColor: colors.SILVER,
    elevation: 10,
    backgroundColor: colors.BG_COLOR_WHITE,
    borderRadius: BORDER_RADIUS_10,
    // elevation: 20,
    // shadowColor: '#000000',
    // // paddingHorizontal: HORIZONTAL_10,
    // shadowOffset: {width: 0, height: heightPixel(4)},
    // shadowOpacity: 2,
    // shadowRadius: BORDER_RADIUS_10,
    // marginTop: VERTICAL_5,
  },
  bottomPlanContent: {
    flexDirection: 'row',
    marginTop: VERTICAL_20,
    marginStart: HORIZONTAL_20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomPlanTextContainer: {
    flexDirection: 'column',
  },
  bottomPlanTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: isTablet
      ? SCREEN_WIDTH - widthPixel(300)
      : SCREEN_WIDTH - widthPixel(250),
  },
  bottomPlanText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    lineHeight: I18nManager.isRTL ? FONT_22 : FONT_15,
  },
  bottomPlanImage: {
    height: heightPixel(16),
    width: widthPixel(16),
    marginStart: HORIZONTAL_1,
  },
  bottomPlanPriceText: {
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_13,
    // fontWeight: '400',
  },
  selectPlanCard: {
    flex: 2,
  },
  subContainer: {
    flex: 1,
    marginHorizontal: tabletMargin(),
    // paddingHorizontal: tabletMargin(),
  },
  loading: {
    ...StyleSheet.absoluteFill,
    zIndex: 2,
    borderTopLeftRadius: BORDER_RADIUS_10,
    borderTopRightRadius: BORDER_RADIUS_10,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'rgba(0,0,0,0.2)',
  },
});
