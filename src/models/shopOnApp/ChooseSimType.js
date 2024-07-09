import React, {useState, useEffect, createRef, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  I18nManager,
  Alert,
  Platform,
  Keyboard,
  Modal,
  TouchableHighlight,
} from 'react-native';
import {
  TextInput,
  Provider as PaperProvider,
  DefaultTheme,
} from 'react-native-paper';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';
import {
  OOREDOO_HEAVY_FONT,
  RUBIC_LIGHT_FONT,
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
  RUBIK_SEMIBOLD_FONT,
} from '../../../../selfcarern/src/resources/styles/fonts';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import {
  heightPixel,
  widthPixel,
  SCREEN_WIDTH,
  isTablet,
  tabletMargin,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_1,
  BORDER_RADIUS_3,
  BORDER_RADIUS_5,
  BORDER_RADIUS_6,
  BORDER_RADIUS_10,
  BORDER_RADIUS_31,
  BORDER_RADIUS_20,
  BORDER_RADIUS_15,
  FONT_13,
  FONT_16,
  SCALE_SIZE_0,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_5,
  VERTICAL_20,
  FONT_12,
  FONT_20,
  WIDTH_29,
  HEIGHT_29,
  WIDTH_10,
  HEIGHT_10,
  WIDTH_31,
  HEIGHT_21,
  WIDTH_20,
  HEIGHT_20,
  WIDTH_2,
  WIDTH_19,
  HEIGHT_19,
  VERTICAL_250,
  WIDTH_11,
  HEIGHT_11,
  VERTICAL_4,
  HORIZONTAL_2,
  VERTICAL_3,
  VERTICAL_6,
  VERTICAL_8,
  HORIZONTAL_10,
  HORIZONTAL_20,
  HORIZONTAL_15,
  VERTICAL_2,
  FONT_22,
  HORIZONTAL_13,
  VERTICAL_7,
  WIDTH_155,
  WIDTH_200,
  FONT_30,
  HEIGHT_28,
  FONT_24,
  FONT_37,
  FONT_28,
  FONT_10,
  VERTICAL_30,
  HEIGHT_25,
} from '../../../../selfcarern/src/resources/styles/responsive';
import en from '../../../assets/Strings/en.json';
import ar from '../../../assets/Strings/ar.json';
import colors from '../../resources/styles/colors';
import ScreenName from '../../navigator/ScreenName';
import IconFA from 'react-native-vector-icons/FontAwesome';
import {
  StackActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import ItemsListModal from './ItemsListModal';
import ImageComponent from '../basic/ImageComponent';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi.android';
import {
  GETCITY_LIST_API,
  GOVERNORATE_LIST_API,
} from '../../resources/route/endpoints';
import {GetCacheKey} from '../../services/CacheUtil';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import {useDispatch, useSelector} from 'react-redux';
import {findObjectByKey} from '../../commonHelper/utils';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';
import Toast from 'react-native-simple-toast';
import Config from 'react-native-config';
import {isDeviceHuawei} from '../../commonHelper/Constants';
import {output} from '../../commonHelper/ApiHeaders';
let googleApiKey = Config?.GOOGLEAPIKEY?.includes(`';`)
  ? Config?.GOOGLEAPIKEY.replace(`';`, '')
  : Config?.GOOGLEAPIKEY;

const ChooseSimType = ({
  itemValue,
  setitemValue,
  formdataItem,
  ChooseSimTypeData,
  continueButtonDisableBtn,
  saveaddressItem,
  contactinfoNumber,
  latitude,
  longitude,
  parentProduct,
  childProduct,
  reloadList,
  setreloadList,
  datacompleted,
  setdatacompleted,
  physicalSimClick,
  scrollViewRef,
  focusedFun,
  settooglestatuschoosesim,
  formDataValue,
  mapAddress,
  setMapAddress,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [text, setText] = useState('');
  const {t} = useTranslation();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const emailRef = createRef();
  const esimemailRef = createRef();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [esimemail, setesimemail] = useState('');
  const [esimemailError, setesimemailError] = useState('');
  const [governorate, setgovernorate] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [additional, setadditional] = useState('');
  const [governoratePopup, setgovernoratePopup] = useState(false);
  const [area, setArea] = useState('');
  const [type, settype] = useState('');
  const goverenceValue = useRef('');
  const areaValue = useRef('');
  const checked = useRef(false);
  const [showContent, setShowContent] = useState('Left');
  const [isLoader, setisLoader] = useState(false);
  const goverenceSelectValue = useRef('');
  const [keyboardShow, setKeyboardShow] = React.useState();
  const dispatch = useDispatch();
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );

  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email:
      global.contactinfoEmail != null &&
      global.contactinfoEmail != undefined &&
      global.contactinfoEmail != ''
        ? global.contactinfoEmail || formDataValue?.email
        : '',
    esimemail:
      global.contactinfoEmail != null &&
      global.contactinfoEmail != undefined &&
      global.contactinfoEmail != ''
        ? global.contactinfoEmail || formDataValue?.esimemail
        : '',
    governorate: '',
    area: '',
    additional: '',
    street: '',
    saveAddress: false,
    governoratevalue: '',
    areavalue: '',
  });
  const [errors, setErrors] = useState({
    esimemail: '',
    firstname: '',
    lastname: '',
    email: '',
    governorate: '',
    area: '',
    additional: '',
    street: '',
  });
  const checkedBackgroundColor = checked.current
    ? colors.OOREDOO_RED
    : colors.TOO_LIGHT_GREY;
  const checkboxBackgroundStyle = {
    width: WIDTH_19,
    height: WIDTH_19,
    borderRadius: WIDTH_19 / 2,
    borderWidth: checked.current ? WIDTH_2 : 0,
    borderColor: checked.current ? colors.OOREDOO_RED : colors.GRAY,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: checkedBackgroundColor, // Background color based on the checked state
    overflow: 'hidden',
  };

  const [region, setRegion] = useState(null);
  const navigation = useNavigation();
  const areaItem = useRef([]);
  const goverenceItem = useRef([]);
  const areaItemIndex = useRef(0);
  const goverenceItemIndex = useRef(0);

  const lastNameRef = createRef();
  const emailFieldRef = createRef();
  const streetRef = createRef();
  const additionalInfoRef = createRef();

  useFocusEffect(
    React.useCallback(() => {
      if (global.landingtosim === 'true') {
        global.landingtosim = null;
      } else {
        setFormData({
          firstname: global.ShopOnAPPAddressObj?.firstname,
          lastname: global.ShopOnAPPAddressObj?.lastname,
          email: global.ShopOnAPPAddressObj?.email,
          esimemail: global.ShopOnAPPAddressObj?.esimemail,
          governorate: global.ShopOnAPPAddressObj?.governorate,
          area: global.ShopOnAPPAddressObj?.area,
          additional: global.ShopOnAPPAddressObj?.additional,
          street: global.ShopOnAPPAddressObj?.street,
          governoratevalue: global.ShopOnAPPAddressObj?.governoratevalue,
          areavalue: global.ShopOnAPPAddressObj?.areavalue,
        });
      }

      global.chooseSimType = 'true';
    }, [])
  );

  const AreaApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GETCITY_LIST_API,
          {
            governorate: goverenceValue.current || formData?.governorate,
          },
        ],
      }),
    {
      onSuccess: (data, variables, context) => {
        setisLoader(false);
        if (data?.data?.status === '0') {
          if (data?.data?.response != null) {
            areaItem.current = data?.data?.response;
            if (formData.area != '') {
              const index = data?.data?.response.findIndex(
                item => item.value === formData.area
              );

              if (index !== -1) {
                areaItemIndex.current = index;
              } else {
                areaItemIndex.current = 0;
              }
            }
            setgovernoratePopup(true);
          } else {
          }
        } else {
        }
      },
      onError: (error, variables, context) => {
        setisLoader(false);
      },
    }
  );

  const governoratelistapi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, GOVERNORATE_LIST_API, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        onSuccessGovernorate(udata);
        if (cachedAPIData && cachedAPIData?.length > 0) {
          const foundObj = findObjectByKey(
            cachedAPIData,
            'Key',
            GetCacheKey('goverencelist')
          );
          if (foundObj) {
          } else {
            let tempObj = {
              Key: GetCacheKey('goverencelist'),
              Resp_Obj: udata,
            };
            dispatch(setCommonAPIData(tempObj));
          }
        } else {
          let tempObj = {
            Key: GetCacheKey('goverencelist'),
            Resp_Obj: udata,
          };
          dispatch(setCommonAPIData(tempObj));
        }
      },
      onError: (error, variables, context) => {
        setisLoader(false);
      },
    }
  );

  const onSuccessGovernorate = udata => {
    setisLoader(false);
    try {
      if (udata?.data?.status === '0') {
        goverenceValue.current = '';
        areaValue.current = '';
        if (udata?.data?.response != null) {
          goverenceItem.current = udata?.data?.response;
          if (formData.governorate != '') {
            const index = udata?.data?.response.findIndex(
              item => item.value === formData.governorate
            );

            if (index !== -1) {
              goverenceItemIndex.current = index;
            } else {
              goverenceItemIndex.current = 0;
            }
          }
          setgovernoratePopup(true);
        } else {
        }
      } else {
      }
    } catch (e) {}
  };

  // const governoratelistapi = useQuery(
  //   [GetCacheKey('goverencelist'), GOVERNORATE_LIST_API, {}, {}],
  //   {
  //     retry: false,
  //     cacheTime: 300000,
  //     staleTime: 300000,
  //     enabled: false,
  //     onSuccess: (udata, variables, context) => {
  //       setisLoader(false);
  //       try {
  //         if (udata?.data?.status === '0') {
  //           goverenceValue.current = '';
  //           areaValue.current = '';
  //           if (udata?.data?.response != null) {
  //             goverenceItem.current = udata?.data?.response;
  //             if (formData.governorate != '') {
  //               const index = udata?.data?.response.findIndex(
  //                 item => item.value === formData.governorate
  //               );

  //               if (index !== -1) {
  //                 goverenceItemIndex.current = index;
  //               } else {
  //                 goverenceItemIndex.current = 0;
  //               }
  //             }
  //             setgovernoratePopup(true);
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

  const validateField = (name, value) => {
    if (value === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: `${name} required.`,
      }));
    } else {
      setErrors(prevErrors => ({...prevErrors, [name]: ''}));
    }
  };

  const validateFormData = () => {
    const commonFields = [
      'firstname',
      'lastname',
      'governorate',
      'area',
      'street',
    ];

    // Choose the set of required fields based on showContent
    const requiredFields =
      showContent === 'Left' ? ['esimemail'] : [...commonFields, 'email'];

    for (const key in formData) {
      if (
        formData.hasOwnProperty(key) &&
        requiredFields.includes(key) &&
        formData[key] === ''
      ) {
        return `Validation Error: ${key} cannot be empty.`;
      }
    }
    if (
      emailError != null &&
      emailError != undefined &&
      emailError != '' &&
      itemValue != 'esim'
    ) {
      return `Validation Error: ${email} cannot be empty.`;
    }
    return null; // No validation errors
  };

  useEffect(() => {
    if (datacompleted?.selectnumber) {
      setIsCollapsed(true);
      focusedFun('chooseSimExpanded');
      if (
        (childProduct != '' &&
          childProduct != null &&
          childProduct != undefined &&
          childProduct?.simtype?.toLowerCase() === 'physicalsim') ||
        childProduct?.simtype?.toLowerCase() === 'physical'
      ) {
        if (
          global.contactinfoEmail != null &&
          global.contactinfoEmail != undefined &&
          global.contactinfoEmail != ''
        ) {
          handleInputChange('email', global.contactinfoEmail);
        }
        handleRightButtonClick('physicalsim');
      } else if (
        parentProduct != '' &&
        parentProduct != null &&
        parentProduct != undefined &&
        (parentProduct?.simtype?.toLowerCase() === 'physicalsim' ||
          parentProduct?.simtype?.toLowerCase() === 'physical')
      ) {
        if (
          global.contactinfoEmail != null &&
          global.contactinfoEmail != undefined &&
          global.contactinfoEmail != ''
        ) {
          handleInputChange('email', global.contactinfoEmail);
        }
        handleRightButtonClick('physicalsim');
      }
    }
  }, [datacompleted?.selectnumber]);

  // useEffect(() => {
  //   const keyboardDidShowListener = Keyboard.addListener(
  //     Platform.OS == 'android' ? 'keyboardDidShow' : 'keyboardWillShow',
  //     () => {
  //       setKeyboardShow(true);
  //       // focusedFun('keyboardshow');
  //       setreloadList(true);
  //     }
  //   );
  //   const keyboardDidHideListener = Keyboard.addListener(
  //     Platform.OS == 'android' ? 'keyboardDidHide' : 'keyboardWillHide',
  //     () => {
  //       setKeyboardShow(false);
  //       //focusedFun('keyboardhide');
  //       setreloadList(false);
  //     }
  //   );

  //   return () => {
  //     keyboardDidHideListener.remove();
  //     keyboardDidShowListener.remove();
  //   };
  // }, []);

  useEffect(() => {
    // if (checked) {
    //     const validationError = validateFormData(formData);

    //     if (!validationError) {
    //         continueButtonDisableBtn(false);
    //         formdataItem(formData);
    //     } else {
    //         continueButtonDisableBtn(true);
    //     }
    // } else {
    //     continueButtonDisableBtn(false);
    //     formdataItem(formData);
    // }
    const validationError = validateFormData(formData);

    if (showContent === 'Left') {
      if (esimemailError == '' && formData.esimemail != '') {
        if (!validationError) {
          if (contactinfoNumber != '') {
            continueButtonDisableBtn(false);
            setdatacompleted(prevState => ({
              ...prevState,
              choosesim: true,
            }));
            formdataItem(formData, contactinfoNumber);
          } else {
            formdataItem(formData, contactinfoNumber);
            setdatacompleted(prevState => ({
              ...prevState,
              choosesim: false,
            }));
            //continueButtonDisableBtn(true);
          }
        } else {
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: false,
          }));
          // continueButtonDisableBtn(true);
        }
      }
    } else {
      if (!validationError) {
        if (contactinfoNumber != '') {
          continueButtonDisableBtn(false);
          const isValid = validateFormDatacompleted(formData);
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: isValid,
          }));
          formdataItem(formData, contactinfoNumber);
        } else {
          formdataItem(formData, contactinfoNumber);
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: false,
          }));
          //  continueButtonDisableBtn(true);
        }
      } else {
        if (
          global.NewSimNumberSliderItem != null &&
          global.NewSimNumberSliderItem != undefined &&
          global.NewSimNumberSliderItem != ''
        ) {
          const isValid = validateFormDatacompleted(formData);
          if (isValid) {
            setdatacompleted(prevState => ({
              ...prevState,
              choosesim: true,
            }));
          } else {
            setdatacompleted(prevState => ({
              ...prevState,
              choosesim: false,
            }));
          }
        } else {
          setdatacompleted(prevState => ({
            ...prevState,
            choosesim: false,
          }));
        }

        // continueButtonDisableBtn(true);
      }
    }
  }, [formData, formdataItem]);

  const handleLeftButtonClick = name => {
    setitemValue(name);
    setShowContent('Left');
    setErrors(prevErrors => ({
      ...prevErrors,
      firstname: '',
      lastname: '',
      email: '',
      governorate: '',
      area: '',
      additional: '',
      street: '',
    }));
    setdatacompleted(prevState => ({
      ...prevState,
      choosesim:
        !esimemailError && (formData.esimemail || global.contactinfoEmail)
          ? true
          : false,
    }));
    var item = {
      formData: formData,
      itemValue: name,
    };
    global.formData = item;

    // if (
    //   esimemailError != null &&
    //   esimemailError != undefined &&
    //   esimemailError === '' &&
    //   (formData.esimemail != '' ||
    //     (global.contactinfoEmail != null &&
    //       global.contactinfoEmail != undefined &&
    //       global.contactinfoEmail != ''))
    // ) {
    //   setdatacompleted(prevState => ({
    //     ...prevState,
    //     choosesim: true,
    //   }));
    // } else {
    //   setdatacompleted(prevState => ({
    //     ...prevState,
    //     choosesim: false,
    //   }));
    // }
  };
  // Generic handleInputChange function
  const handleInputChange = (name, value) => {
    validateField(name, value);
    if (
      name == 'governorate' &&
      formData.area != '' &&
      value != formData.governorate
    ) {
      setFormData({
        ...formData,
        ['area']: '',
        ['areavalue']: '',
        [name]: value,
        ['governoratevalue']: goverenceSelectValue.current,
      });
    } else if (name == 'governorate') {
      setFormData({
        ...formData,
        ['area']: '',
        ['areavalue']: '',
        [name]: value,
        ['governoratevalue']: goverenceSelectValue.current,
      });
    } else if (name == 'area') {
      setFormData({
        ...formData,
        ['areavalue']: areaValue.current,
        [name]: value,
      });
    } else
      setFormData({
        ...formData,
        [name]: value,
      });
    var item = {
      formData: formData,
      itemValue: itemValue,
    };
    global.formData = item;
  };

  const validateEmail = text => {
    handleInputChange('email', text); // Use the generic function
    if (text != '') {
      if (emailRegex.test(text)) {
        setEmailError('');
      } else {
        setEmailError(t('peve'));
        emailRef?.current?.focus();
      }
    } else {
      setEmailError(t('emailRequired'));
    }
  };

  const eSimvalidateEmail = text => {
    handleInputChange('esimemail', text);
    if (text != '') {
      if (emailRegex.test(text)) {
        setesimemailError('');
      } else {
        setdatacompleted(prevState => ({
          ...prevState,
          choosesim: false,
        }));
        setesimemailError(t('peve')); // Set the error message if email is invalid
        esimemailRef?.current?.focus(); // Focus on the TextInput when there's an error
      }
    } else {
      setesimemailError('');
    }
  };

  function validateFormDatacompleted(formData) {
    const {
      additional,
      area,
      email,
      esimemail,
      firstname,
      governorate,
      lastname,
      saveAddress,
      street,
    } = formData;

    // Check if any of the other required fields are empty
    if (!area || !email || !firstname || !governorate || !lastname || !street) {
      return false; // Return false if any other required field is empty
    }

    return true; // All validations passed
  }

  const handleRightButtonClick = name => {
    physicalSimClick();
    setitemValue(name);
    setShowContent('Right');
    const isValid = validateFormDatacompleted(formData);
    setdatacompleted(prevState => ({
      ...prevState,
      choosesim: isValid,
    }));
    var item = {
      formData: formData,
      itemValue: name,
    };
    global.formData = item;
    // setFormData(prevErrors => ({
    //   ...prevErrors,
    //   esimemail: '', // Clearing only the esimemail field
    // }));
  };

  const onDismiss = () => {
    if (formData.governorate != '') {
      goverenceValue.current = goverenceSelectValue.current;
    }
    setgovernoratePopup(false);
  };

  const selectItem = value => {
    if (type === 'area') {
      areaValue.current = value?.value;
      handleInputChange('area', value?.label);
    } else {
      goverenceValue.current = value?.value;
      goverenceSelectValue.current = value?.value;
      handleInputChange('governorate', value?.label);
      setisLoader(true);
      setTimeout(() => {
        settype('area');
        AreaApi.mutate();
      }, 500);
    }
    setgovernoratePopup(false);
  };

  const fetchAddress = async coords => {
    try {
      await fetch(
        'https://maps.googleapis.com/maps/api/geocode/json?address=' +
          coords.latitude +
          ',' +
          coords.longitude +
          '&key=' +
          googleApiKey
      )
        .then(res => res.json())
        .then(data => {
          setMapAddress(data?.results[0]?.formatted_address);
        });
    } catch (e) {
      console.log(e?.message);
    }
  };

  const activeButtonStyles = {
    borderWidth: BORDER_RADIUS_1,
    borderColor: colors.OOREDOO_RED,
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_3,
  };

  const inactiveButtonStyles = {
    backgroundColor: colors.SILVER,
    borderColor: colors.SILVER,
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

  return (
    <View
      style={[
        styles.container,
        //{top: keyboardShow != true ? 0 : -VERTICAL_250},
      ]}>
      <View style={styles.contentContainer}>
        <PaperProvider theme={theme}>
          {/* <ScrollView
            scrollEnabled={true}
            nestedScrollEnabled={true}
            showsVerticalScrollIndicator={false}> */}
          <Collapse
            style={[styles.cardView]}
            touchableOpacityProps={styles.opactiy}
            isExpanded={isCollapsed}
            onToggle={value => {
              focusedFun({type: 'choosesim', val: itemValue});
              settooglestatuschoosesim(value);
              setIsCollapsed(value);
              if (
                (childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined &&
                  childProduct?.simtype?.toLowerCase() === 'physicalsim') ||
                childProduct?.simtype?.toLowerCase() === 'physical'
              ) {
                if (
                  global.contactinfoEmail != null &&
                  global.contactinfoEmail != undefined &&
                  global.contactinfoEmail != ''
                ) {
                  handleInputChange('email', global.contactinfoEmail);
                }
                handleRightButtonClick('physicalsim');
              } else if (
                parentProduct != '' &&
                parentProduct != null &&
                parentProduct != undefined &&
                (parentProduct?.simtype?.toLowerCase() === 'physicalsim' ||
                  parentProduct?.simtype?.toLowerCase() === 'physical')
              ) {
                if (
                  global.contactinfoEmail != null &&
                  global.contactinfoEmail != undefined &&
                  global.contactinfoEmail != ''
                ) {
                  handleInputChange('email', global.contactinfoEmail);
                }
                handleRightButtonClick('physicalsim');
              } else {
                if (
                  global.contactinfoEmail != null &&
                  global.contactinfoEmail != undefined &&
                  global.contactinfoEmail != ''
                ) {
                  handleInputChange('esimemail', global.contactinfoEmail);
                }
                var item = {
                  formData: formData,
                  itemValue: 'esim',
                };
                global.formData = item;
                if (itemValue == '') {
                  setitemValue('esim');
                }
              }
            }}>
            <CollapseHeader>
              <View style={styles.header}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    height: '100%',
                    justifyContent: 'center',
                  }}
                  activeOpacity={1}
                  onPress={() => {
                    if (
                      !datacompleted?.selectnumber ||
                      !datacompleted?.contactdetail
                    ) {
                      if (!datacompleted?.contactdetail) {
                        Toast.show(t('pecdf'));
                      } else {
                        Toast.show(t('psynf'));
                      }
                      return;
                    } else {
                      focusedFun({type: 'choosesim', val: itemValue});
                      if (
                        global.contactinfoEmail != null &&
                        global.contactinfoEmail != undefined &&
                        global.contactinfoEmail != ''
                      ) {
                        handleInputChange('email', global.contactinfoEmail);
                        handleInputChange('esimemail', global.contactinfoEmail);
                      }
                      settooglestatuschoosesim(!isCollapsed);
                      setIsCollapsed(!isCollapsed);

                      if (
                        (childProduct != '' &&
                          childProduct != null &&
                          childProduct != undefined &&
                          childProduct?.simtype?.toLowerCase() ===
                            'physicalsim') ||
                        childProduct?.simtype?.toLowerCase() === 'physical'
                      ) {
                        handleRightButtonClick('physicalsim');
                      } else if (
                        parentProduct != '' &&
                        parentProduct != null &&
                        parentProduct != undefined &&
                        (parentProduct?.simtype?.toLowerCase() ===
                          'physicalsim' ||
                          parentProduct?.simtype?.toLowerCase() === 'physical')
                      ) {
                        handleRightButtonClick('physicalsim');
                      } else {
                        var item = {
                          formData: formData,
                          itemValue: 'esim',
                        };
                        global.formData = item;
                        if (itemValue == '') {
                          setitemValue('esim');
                        }
                      }
                    }
                  }}>
                  <Text style={styles.textLeft}>
                    {ChooseSimTypeData?.choose_sim_type}
                  </Text>
                </TouchableOpacity>
                <TouchableHighlight
                  style={styles.arrowTouchEffect}
                  underlayColor={colors.OOREDDO_COLLAPSE_UNDERLEY}
                  onPress={() => {
                    if (
                      !datacompleted?.selectnumber ||
                      !datacompleted?.contactdetail
                    ) {
                      if (!datacompleted?.contactdetail) {
                        Toast.show(t('pecdf'));
                      } else {
                        Toast.show(t('psynf'));
                      }
                      return;
                    } else {
                      focusedFun({type: 'choosesim', val: itemValue});
                      if (
                        global.contactinfoEmail != null &&
                        global.contactinfoEmail != undefined &&
                        global.contactinfoEmail != ''
                      ) {
                        handleInputChange('email', global.contactinfoEmail);
                        handleInputChange('esimemail', global.contactinfoEmail);
                      }
                      settooglestatuschoosesim(!isCollapsed);
                      setIsCollapsed(!isCollapsed);

                      if (
                        (childProduct != '' &&
                          childProduct != null &&
                          childProduct != undefined &&
                          childProduct?.simtype?.toLowerCase() ===
                            'physicalsim') ||
                        childProduct?.simtype?.toLowerCase() === 'physical'
                      ) {
                        handleRightButtonClick('physicalsim');
                      } else if (
                        parentProduct != '' &&
                        parentProduct != null &&
                        parentProduct != undefined &&
                        (parentProduct?.simtype?.toLowerCase() ===
                          'physicalsim' ||
                          parentProduct?.simtype?.toLowerCase() === 'physical')
                      ) {
                        handleRightButtonClick('physicalsim');
                      } else {
                        var item = {
                          formData: formData,
                          itemValue: 'esim',
                        };
                        global.formData = item;
                        if (itemValue == '') {
                          setitemValue('esim');
                        }
                      }
                    }
                  }}>
                  <Image
                    source={
                      !isCollapsed
                        ? require('../../assets/up.png')
                        : require('../../assets/down.png')
                    }
                    resizeMode={'contain'}
                    style={styles.vectorIconUp}
                  />
                </TouchableHighlight>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View
                style={
                  childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.simtype?.toLowerCase() === 'both'
                      ? {alignItems: 'center'}
                      : {}
                    : parentProduct != '' &&
                      parentProduct != null &&
                      parentProduct?.simtype?.toLowerCase() === 'both'
                    ? {alignItems: 'center'}
                    : {}
                }>
                <View style={styles.rowEsim}>
                  {(childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.simtype?.toLowerCase() === 'both' ||
                      childProduct?.simtype?.toLowerCase() === 'esim'
                    : parentProduct != '' &&
                      parentProduct != null &&
                      parentProduct != undefined &&
                      (parentProduct?.simtype?.toLowerCase() === 'both' ||
                        parentProduct?.simtype?.toLowerCase() === 'esim')) && (
                    <TouchableOpacity
                      style={[
                        styles.eSimButton,
                        showContent === 'Left'
                          ? activeButtonStyles
                          : inactiveButtonStyles,
                      ]}
                      onPress={() => handleLeftButtonClick('esim')}>
                      <View style={styles.rowEsim2}>
                        <View style={{alignSelf: 'center'}}>
                          <ImageComponent
                            type="image"
                            iwidth={WIDTH_29}
                            iheight={HEIGHT_29}
                            source={ChooseSimTypeData?.esim_icon}
                            resizeMode={'contain'}
                          />
                        </View>
                        <View
                          style={[styles.esimView, {width: widthPixel(105)}]}>
                          <View style={styles.esimView2}>
                            <Text style={styles.buttonTexteSim}>
                              {ChooseSimTypeData?.esim_title}
                            </Text>
                            <View
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                                flex: 1,
                              }}>
                              <ImageComponent
                                type="image"
                                iwidth={WIDTH_11}
                                iheight={WIDTH_11}
                                source={ChooseSimTypeData?.esim_info_icon}
                                resizeMode={'contain'}
                              />
                            </View>
                          </View>
                          <Text numberOfLines={1} style={styles.buttonTextTwo}>
                            {ChooseSimTypeData?.esim_desc}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                  {(childProduct != '' &&
                  childProduct != null &&
                  childProduct != undefined
                    ? childProduct?.simtype?.toLowerCase() === 'both' ||
                      childProduct?.simtype?.toLowerCase() === 'physicalsim' ||
                      childProduct?.simtype?.toLowerCase() === 'physical'
                    : parentProduct != '' &&
                      parentProduct != null &&
                      parentProduct != undefined &&
                      (parentProduct?.simtype?.toLowerCase() === 'both' ||
                        parentProduct?.simtype?.toLowerCase() ===
                          'physicalsim' ||
                        parentProduct?.simtype?.toLowerCase() ===
                          'physical')) && (
                    <TouchableOpacity
                      style={[
                        styles.physicalButton,
                        showContent === 'Right'
                          ? activeButtonStyles
                          : inactiveButtonStyles,
                      ]}
                      onPress={() => {
                        setTimeout(() => {
                          if (global.contactinfoEmail) {
                            validateEmail(
                              global.contactinfoEmail.replace(
                                /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>\{\}\[\]\\\/]/g,
                                ''
                              )
                            );
                          }
                          setErrors(prevErrors => ({
                            ...prevErrors,
                            esimemail: '',
                          }));
                        }, 500);
                        handleRightButtonClick('physicalsim');
                      }}>
                      <View style={styles.physicalView}>
                        <ImageComponent
                          type="image"
                          iwidth={WIDTH_31}
                          iheight={isTablet ? HEIGHT_25 : HEIGHT_21}
                          source={ChooseSimTypeData?.physical_icon}
                          style={styles.physicalesimInfo}
                          // style={styles.whatsappIcon}
                        />
                        {/* <Image
                                                source={require('../../assets/physical_sim.png')}
                                                resizeMode={'contain'}
                                            /> */}
                        <View style={styles.physicalActive}>
                          <Text
                            style={[
                              styles.buttonText,
                              // {left: isTablet ? HORIZONTAL_10 : 0},
                            ]}>
                            {ChooseSimTypeData?.physical_sim}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
                <View>
                  {showContent === 'Left' &&
                    (childProduct != '' &&
                    childProduct != null &&
                    childProduct != undefined
                      ? childProduct?.simtype?.toLowerCase() === 'both' ||
                        childProduct?.simtype?.toLowerCase() === 'esim'
                      : parentProduct != '' &&
                        parentProduct != null &&
                        parentProduct != undefined &&
                        (parentProduct?.simtype?.toLowerCase() === 'both' ||
                          parentProduct?.simtype?.toLowerCase() ===
                            'esim')) && (
                      <View>
                        {!isCollapsed && <View style={styles.cardContent} />}
                        <View style={styles.flatListShadow}>
                          <TextInput
                            refvalue={esimemailRef}
                            label={
                              <Text
                                style={{
                                  fontFamily: RUBIK_LIGHT_FONT,
                                  fontWeight: '300',
                                  fontSize: FONT_13,
                                }}>
                                {ChooseSimTypeData?.esim_email_palceholder}
                              </Text>
                            }
                            mode="outlined"
                            value={
                              global.contactinfoEmail || formData.esimemail
                            }
                            maxLength={50}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 1});
                              setesimemailError('');
                            }}
                            onChangeText={text => {
                              global.contactinfoEmail = null;
                              const sanitizedEmail = text.replace(
                                /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'"<>\{\}\[\]\\\/]+/g,
                                ''
                              ); // Remove special characters
                              const normalizedEmail = sanitizedEmail.replace(
                                /\.+/g,
                                '.'
                              );
                              const spaceRemove = normalizedEmail.replace(
                                ' ',
                                ''
                              );
                              eSimvalidateEmail(spaceRemove);
                            }}
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            error={!!esimemailError}
                            style={styles.input}
                          />
                          {esimemailError != '' ? ( // Only render error message if there's an error
                            <Text style={styles.errorMesssage}>
                              {esimemailError}
                            </Text>
                          ) : null}
                        </View>

                        <View
                          style={[
                            styles.bottomView,
                            {
                              backgroundColor:
                                ChooseSimTypeData?.esim_tooltipbgcolor,
                            },
                          ]}>
                          <Text
                            numberOfLines={1}
                            style={[
                              styles.bottomText,
                              {
                                color: ChooseSimTypeData?.esim_tooltiptextcolor,
                              },
                            ]}>
                            {ChooseSimTypeData?.esim_tooltip}
                          </Text>
                        </View>
                      </View>
                    )}
                </View>
                <View
                  scrollEnabled={true}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}>
                  {showContent === 'Right' &&
                    (childProduct != '' &&
                    childProduct != null &&
                    childProduct != undefined
                      ? childProduct?.simtype?.toLowerCase() === 'both' ||
                        childProduct?.simtype?.toLowerCase() ===
                          'physicalsim' ||
                        childProduct?.simtype?.toLowerCase() === 'physical'
                      : parentProduct != '' &&
                        parentProduct != null &&
                        parentProduct != undefined &&
                        (parentProduct?.simtype?.toLowerCase() === 'both' ||
                          parentProduct?.simtype?.toLowerCase() ===
                            'physicalsim' ||
                          parentProduct?.simtype?.toLowerCase() ===
                            'physical')) && (
                      <View style={{alignItems: 'center'}}>
                        <View style={styles.flatListShadow}>
                          <TextInput
                            label={
                              <Text
                                style={{
                                  fontFamily: RUBIK_LIGHT_FONT,
                                  fontWeight: '300',
                                  fontSize: FONT_13,
                                }}>
                                {
                                  ChooseSimTypeData?.physical_firstname_placeholder
                                }
                              </Text>
                            }
                            mode="outlined"
                            value={formData.firstname}
                            maxLength={30}
                            error={!!errors.firstname}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 1});
                            }}
                            onChangeText={text => {
                              handleInputChange(
                                'firstname',
                                text.replace(
                                  /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'",<>0-9\{\}\[\]\\\/]/g,
                                  ''
                                )
                              );
                            }}
                            onSubmitEditing={() =>
                              lastNameRef?.current?.focus()
                            }
                            // style={styles.firstName}
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            style={[
                              styles.firstName,
                              // errors.firstname ? styles.errorBorder : null,
                            ]}
                          />
                          {errors.firstname != '' ? (
                            <Text style={styles.errorMesssage}>
                              {errors.firstname}
                            </Text>
                          ) : null}
                        </View>

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
                                  ChooseSimTypeData?.physical_lastname_placeholder
                                }
                              </Text>
                            }
                            mode="outlined"
                            value={formData.lastname}
                            maxLength={30}
                            error={!!errors.lastname}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 2});
                            }}
                            onSubmitEditing={() =>
                              emailFieldRef?.current?.focus()
                            }
                            onChangeText={text =>
                              handleInputChange(
                                'lastname',
                                text.replace(
                                  /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'",<>0-9\{\}\[\]\\\/]/g,
                                  ''
                                )
                              )
                            }
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            style={[
                              styles.lastName,
                              // errors.lastname ? styles.errorBorder : null,
                            ]}
                            //style={styles.lastName}
                          />
                          {errors.lastname != '' ? (
                            <Text style={styles.errorMesssage}>
                              {errors.lastname}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.emailView}>
                          <TextInput
                            ref={emailFieldRef}
                            label={
                              <Text
                                style={{
                                  fontFamily: RUBIK_LIGHT_FONT,
                                  fontWeight: '300',
                                  fontSize: FONT_13,
                                }}>
                                {ChooseSimTypeData?.physical_email_placeholder}
                              </Text>
                            }
                            mode="outlined"
                            value={global.contactinfoEmail || formData.email}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 3});
                            }}
                            onSubmitEditing={() => {
                              Keyboard.dismiss();
                              setisLoader(true);
                              settype('governorate');

                              if (cachedAPIData && cachedAPIData?.length > 0) {
                                const foundObj = findObjectByKey(
                                  cachedAPIData,
                                  'Key',
                                  GetCacheKey('goverencelist')
                                );
                                if (
                                  foundObj != null &&
                                  foundObj != undefined &&
                                  foundObj
                                ) {
                                  onSuccessGovernorate(foundObj?.Resp_Obj);
                                } else {
                                  governoratelistapi.mutate();
                                }
                              } else {
                                governoratelistapi.mutate();
                              }
                            }}
                            onChangeText={text => {
                              global.contactinfoEmail = null;
                              const sanitizedEmail = text.replace(
                                /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'"<>\{\}\[\]\\\/]+/g,
                                ''
                              ); // Remove special characters
                              const normalizedEmail = sanitizedEmail.replace(
                                /\.+/g,
                                '.'
                              );
                              const spaceRemove = normalizedEmail.replace(
                                ' ',
                                ''
                              );
                              validateEmail(spaceRemove);
                            }}
                            error={!!emailError}
                            maxLength={50}
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            style={[
                              styles.emailId,
                              // emailError ? styles.errorBorder : null,
                            ]}
                          />
                          {emailError != '' ? (
                            <Text style={styles.errorMesssage}>
                              {emailError}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.governorateView}>
                          <TouchableOpacity
                            onPress={() => {
                              setisLoader(true);
                              settype('governorate');
                              if (cachedAPIData && cachedAPIData?.length > 0) {
                                const foundObj = findObjectByKey(
                                  cachedAPIData,
                                  'Key',
                                  GetCacheKey('goverencelist')
                                );
                                if (
                                  foundObj != null &&
                                  foundObj != undefined &&
                                  foundObj
                                ) {
                                  onSuccessGovernorate(foundObj?.Resp_Obj);
                                } else {
                                  governoratelistapi.mutate();
                                }
                              } else {
                                governoratelistapi.mutate();
                              }
                            }}>
                            <TextInput
                              label={
                                <Text
                                  style={{
                                    fontFamily: RUBIK_LIGHT_FONT,
                                    fontWeight: '300',
                                    fontSize: FONT_13,
                                  }}>
                                  {t('governorate')}
                                </Text>
                              }
                              mode="outlined"
                              editable={false}
                              pointerEvents="none"
                              value={formData.governorate}
                              error={!!errors.governorate}
                              onChangeText={text =>
                                handleInputChange(
                                  'governorate',
                                  text.replace(
                                    /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'",<>0-9\{\}\[\]\\\/]/g,
                                    ''
                                  )
                                )
                              }
                              theme={{
                                fonts: {
                                  regular: {
                                    fontFamily: RUBIK_REGULAR_FONT,
                                    fontSize: FONT_16,
                                    fontWeight: '400',
                                  },
                                },
                              }}
                              style={[
                                styles.governorate,
                                //  errors.governorate ? styles.errorBorder : null,
                              ]}
                              // style={styles.governorate}
                              right={
                                <TextInput.Icon
                                  name="chevron-down"
                                  size={30}
                                  onPress={() => {
                                    setisLoader(true);
                                    settype('governorate');
                                    if (
                                      cachedAPIData &&
                                      cachedAPIData?.length > 0
                                    ) {
                                      const foundObj = findObjectByKey(
                                        cachedAPIData,
                                        'Key',
                                        GetCacheKey('goverencelist')
                                      );
                                      if (
                                        foundObj != null &&
                                        foundObj != undefined &&
                                        foundObj
                                      ) {
                                        onSuccessGovernorate(
                                          foundObj?.Resp_Obj
                                        );
                                      } else {
                                        governoratelistapi.mutate();
                                      }
                                    } else {
                                      governoratelistapi.mutate();
                                    }
                                  }}
                                  style={{top: VERTICAL_3}}
                                />
                              }
                            />
                          </TouchableOpacity>

                          {errors.governorate != '' ? (
                            <Text style={styles.errorMesssage}>
                              {errors.governorate}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.areaView}>
                          <TouchableOpacity
                            onPress={() => {
                              setisLoader(true);
                              settype('area');
                              AreaApi.mutate();
                            }}>
                            <TextInput
                              label={
                                <Text
                                  style={{
                                    fontFamily: RUBIK_LIGHT_FONT,
                                    fontWeight: '300',
                                    fontSize: FONT_13,
                                  }}>
                                  {t('area')}
                                </Text>
                              }
                              mode="outlined"
                              pointerEvents="none"
                              value={formData.area}
                              error={!!errors.area}
                              editable={false}
                              onChangeText={text =>
                                handleInputChange(
                                  'area',
                                  text.replace(
                                    /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'",<>0-9\{\}\[\]\\\/]/g,
                                    ''
                                  )
                                )
                              }
                              onContentSizeChange={() => {
                                if (formData?.area?.length) {
                                  streetRef?.current?.blur();
                                  setTimeout(() => {
                                    streetRef?.current?.focus();
                                  }, 100);
                                }
                              }}
                              //style={styles.area}
                              theme={{
                                fonts: {
                                  regular: {
                                    fontFamily: RUBIK_REGULAR_FONT,
                                    fontSize: FONT_16,
                                    fontWeight: '400',
                                  },
                                },
                              }}
                              style={[
                                styles.area,
                                // errors.area ? styles.errorBorder : null,
                              ]}
                              right={
                                <TextInput.Icon
                                  name="chevron-down"
                                  size={30}
                                  onPress={() => {
                                    setisLoader(true);
                                    settype('area');
                                    AreaApi.mutate();
                                  }}
                                  style={{top: VERTICAL_3}}
                                />
                              }
                            />
                          </TouchableOpacity>
                          {errors.area != '' ? (
                            <Text style={styles.errorMesssage}>
                              {errors.area}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.lastNameView}>
                          <TextInput
                            ref={streetRef}
                            label={
                              <Text
                                style={{
                                  fontFamily: RUBIK_LIGHT_FONT,
                                  fontWeight: '300',
                                  fontSize: FONT_13,
                                }}>
                                {t('street')}
                              </Text>
                            }
                            mode="outlined"
                            maxLength={30}
                            value={formData.street}
                            error={!!errors.street}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 6});
                            }}
                            onChangeText={text =>
                              handleInputChange('street', text)
                            }
                            onSubmitEditing={() => {
                              additionalInfoRef?.current?.focus();
                            }}
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            style={[
                              styles.lastName,
                              // errors.street ? styles.errorBorder : null,
                            ]}
                            //style={styles.lastName}
                          />
                          {errors.street != '' ? (
                            <Text style={styles.errorMesssage}>
                              {errors.street}
                            </Text>
                          ) : null}
                        </View>

                        <View style={styles.additionalView}>
                          <TextInput
                            ref={additionalInfoRef}
                            label={
                              <Text
                                style={{
                                  fontFamily: RUBIK_LIGHT_FONT,
                                  fontWeight: '300',
                                  fontSize: FONT_13,
                                }}>
                                {
                                  ChooseSimTypeData?.physical_additional_placeholder
                                }
                              </Text>
                            }
                            mode="outlined"
                            value={formData.additional}
                            multiline={true}
                            returnKeyType="done"
                            blurOnSubmit={true}
                            maxLength={100}
                            onFocus={() => {
                              focusedFun({type: 'choosesiminput', val: 7});
                            }}
                            onChangeText={text =>
                              handleInputChange(
                                'additional',
                                text.replace(
                                  /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:±¿₹'",<>\{\}\[\]\\\/]/g,
                                  ''
                                )
                              )
                            }
                            theme={{
                              fonts: {
                                regular: {
                                  fontFamily: RUBIK_REGULAR_FONT,
                                  fontSize: FONT_16,
                                  fontWeight: '400',
                                },
                              },
                            }}
                            style={styles.additional}
                            textAlignVertical="top"
                          />
                        </View>
                        {/* {global.logintype == null ||
                        global.logintype == '' ||
                        global.logintype == undefined ? null : ( */}
                        {isDeviceHuawei && !output?.hasGms ? (
                          <View>
                            {global.ssoProfileStatus != null &&
                              global.ssoProfileStatus !== undefined &&
                              global.ssoProfileStatus !== '' &&
                              global.ssoProfileStatus === '0' &&
                              global.logintype != null &&
                              global.logintype != '' &&
                              global.logintype != undefined && (
                                <View style={styles.checkedView}>
                                  {/* <Image
                                                  source={require('../../assets/checkediconnew.png')}
                                                  resizeMode={'contain'}
                                                  style={styles.saveToView}
                                              /> */}
                                  <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => {
                                      saveaddressItem(!checked.current);
                                      checked.current = !checked.current;
                                      // setFormData(prevData => ({
                                      //   ...prevData,
                                      //   saveAddress: !formData.saveAddress,
                                      // }));
                                    }}>
                                    <View
                                      style={[
                                        styles.checkboxBackground,
                                        checkboxBackgroundStyle,
                                      ]}>
                                      {checked.current ? (
                                        <IconFA
                                          name="check"
                                          size={isTablet ? 20 : 12}
                                          color={colors.WHITE}
                                        />
                                      ) : (
                                        <IconFA
                                          name="check"
                                          size={isTablet ? 20 : 12}
                                          color={colors.GREY_HIGH}
                                        />
                                      )}
                                    </View>
                                  </TouchableOpacity>
                                  <Text style={styles.pinText}>
                                    {
                                      ChooseSimTypeData?.physical_sim_save_address
                                    }
                                  </Text>
                                </View>
                              )}
                            {global.ssoProfileStatus != null &&
                              global.ssoProfileStatus !== undefined &&
                              global.ssoProfileStatus !== '' &&
                              global.ssoProfileStatus === '0' &&
                              global.logintype != null &&
                              global.logintype != '' &&
                              global.logintype != undefined && (
                                <View
                                  style={[
                                    styles.bottomView,
                                    {
                                      backgroundColor:
                                        ChooseSimTypeData?.physical_saveaddress_tooltip_bgcolor,
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      styles.bottomText,
                                      {
                                        color:
                                          ChooseSimTypeData?.physical_saveaddress_tooltip_textcolor,
                                      },
                                    ]}>
                                    {
                                      ChooseSimTypeData?.physical_saveaddress_tooltip
                                    }
                                  </Text>
                                </View>
                              )}
                          </View>
                        ) : (
                          <View>
                            <Text
                              style={[
                                styles.pinText,
                                {
                                  marginTop: VERTICAL_15,
                                  marginBottom: VERTICAL_5,
                                },
                              ]}>
                              {ChooseSimTypeData?.physical_map_title}
                            </Text>
                            <View
                              style={{
                                width: isTablet
                                  ? widthPixel(315)
                                  : widthPixel(324),
                              }}>
                              <MapView
                                // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                                style={styles.mapStyle}
                                zoomEnabled={true}
                                zoomControlEnabled={true}
                                region={{
                                  latitude: latitude ? latitude : 0,
                                  longitude: longitude ? longitude : 0,
                                  latitudeDelta: 0.015,
                                  longitudeDelta: 0.0121,
                                }}
                                onRegionChangeComplete={e => {
                                  console.log('Data here to display ----', e);
                                  setRegion({
                                    latitude: e.latitude,
                                    longitude: e.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421,
                                  });
                                }}>
                                <Marker
                                  tracksViewChanges={false}
                                  draggable={true}
                                  onDragEnd={e => {
                                    console.log(
                                      'Here after drag marker------',
                                      e.nativeEvent.coordinate
                                    );
                                    fetchAddress(e.nativeEvent.coordinate);
                                  }}
                                  coordinate={{
                                    latitude: latitude ? latitude : 0,
                                    longitude: longitude ? longitude : 0,
                                  }}
                                />
                              </MapView>
                            </View>

                            <View
                              style={{
                                marginTop: VERTICAL_30,
                                marginBottom: VERTICAL_10,
                              }}>
                              <TextInput
                                label={
                                  <Text
                                    style={{
                                      fontFamily: RUBIK_LIGHT_FONT,
                                      fontWeight: '300',
                                      fontSize: FONT_13,
                                    }}>
                                    {t('complete_add')}
                                  </Text>
                                }
                                mode="outlined"
                                value={mapAddress}
                                // maxLength={30}
                                // error={!!errors.firstname}
                                // onFocus={() => {
                                //   focusedFun({type: 'choosesiminput', val: 1});
                                // }}
                                onChangeText={text => {
                                  setMapAddress(text);
                                }}
                                theme={{
                                  fonts: {
                                    regular: {
                                      fontFamily: RUBIK_REGULAR_FONT,
                                      fontSize: FONT_16,
                                      fontWeight: '400',
                                    },
                                  },
                                }}
                                style={[styles.firstName]}
                              />
                              {/* {errors.firstname != '' ? (
                                <Text style={styles.errorMesssage}>
                                  {errors.firstname}
                                </Text>
                              ) : null} */}
                            </View>
                            {global.ssoProfileStatus != null &&
                              global.ssoProfileStatus !== undefined &&
                              global.ssoProfileStatus !== '' &&
                              global.ssoProfileStatus === '0' &&
                              global.logintype != null &&
                              global.logintype != '' &&
                              global.logintype != undefined && (
                                <View style={styles.checkedView}>
                                  {/* <Image
                                                    source={require('../../assets/checkediconnew.png')}
                                                    resizeMode={'contain'}
                                                    style={styles.saveToView}
                                                /> */}
                                  <TouchableOpacity
                                    style={styles.checkboxContainer}
                                    onPress={() => {
                                      saveaddressItem(!checked.current);
                                      checked.current = !checked.current;
                                      // setFormData(prevData => ({
                                      //   ...prevData,
                                      //   saveAddress: !formData.saveAddress,
                                      // }));
                                    }}>
                                    <View
                                      style={{
                                        width: WIDTH_19,
                                        height: WIDTH_19,
                                        borderRadius: WIDTH_19 / 2,
                                        borderWidth: checked.current
                                          ? WIDTH_2
                                          : 0,
                                        borderColor: checked.current
                                          ? colors.OOREDOO_RED
                                          : colors.GRAY,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        backgroundColor: checked.current
                                          ? colors.OOREDOO_RED
                                          : colors.TOO_LIGHT_GREY, // Background color based on the checked state
                                        overflow: 'hidden',
                                      }}>
                                      <IconFA
                                        name="check"
                                        size={isTablet ? 20 : 12}
                                        color={
                                          checked.current
                                            ? colors.WHITE
                                            : colors.GREY_HIGH
                                        }
                                      />
                                    </View>
                                  </TouchableOpacity>
                                  <Text style={styles.pinText}>
                                    {
                                      ChooseSimTypeData?.physical_sim_save_address
                                    }
                                  </Text>
                                </View>
                              )}
                            {global.ssoProfileStatus != null &&
                              global.ssoProfileStatus !== undefined &&
                              global.ssoProfileStatus !== '' &&
                              global.ssoProfileStatus === '0' &&
                              global.logintype != null &&
                              global.logintype != '' &&
                              global.logintype != undefined && (
                                <View
                                  style={[
                                    styles.bottomView,
                                    {
                                      backgroundColor:
                                        ChooseSimTypeData?.physical_saveaddress_tooltip_bgcolor,
                                    },
                                  ]}>
                                  <Text
                                    style={[
                                      styles.bottomText,
                                      {
                                        color:
                                          ChooseSimTypeData?.physical_saveaddress_tooltip_textcolor,
                                      },
                                    ]}>
                                    {
                                      ChooseSimTypeData?.physical_saveaddress_tooltip
                                    }
                                  </Text>
                                </View>
                              )}
                          </View>
                        )}
                        {/* )} */}
                      </View>
                    )}
                </View>
              </View>
            </CollapseBody>
          </Collapse>
          {/* </ScrollView> */}
        </PaperProvider>
      </View>
      {governoratePopup && global.chooseSimType === 'true' && (
        <ItemsListModal
          onTryAgainClick={selectItem}
          onDismiss={onDismiss}
          type={type}
          governorate={formData.governorate}
          itemsList={type === 'area' ? areaItem.current : goverenceItem.current}
          itemIndex={
            type === 'area' ? areaItemIndex.current : goverenceItemIndex.current
          }
        />
      )}
      {isLoader && (
        <Modal statusBarTranslucent transparent visible={isLoader}>
          <LoadingIndicator shouldDismissManual isVisible={isLoader} />
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    color: colors.BLACK,
    textAlign: 'center',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginTop: I18nManager.isRTL ? 0 : VERTICAL_4,
    marginHorizontal: HORIZONTAL_2,
    fontSize: FONT_13,
  },
  buttonTexteSim: {
    color: colors.BLACK,
    textAlign: 'flex-start',
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginHorizontal: HORIZONTAL_2,
    // marginBottom: 5,
  },
  rowEsim: {
    flexDirection: 'row',
    marginVertical: BORDER_RADIUS_10,
  },
  rowEsim2: {
    flexDirection: 'row',
    // width: widthPixel(140),
  },
  esimView: {
    flexDirection: 'column',
    marginStart: BORDER_RADIUS_3,
    // marginBottom: I18nManager.isRTL ? 20 : 10,
  },
  esimView2: {
    flexDirection: 'row',
  },
  esimInfo: {
    // height: heightPixel(10),
    // width: widthPixel(10),
    // marginTop: I18nManager.isRTL ? 0 : 0,
    //right: I18nManager.isRTL ? 0 : HORIZONTAL_10,
    // left: I18nManager.isRTL
    //   ? Platform.OS == 'android'
    //     ? 0
    //     : HORIZONTAL_10
    //   : 0,
    // marginLeft: isTablet ? Platform.OS == 'android' ?  HORIZONTAL_15 : 0 : 0,
  },
  physicalesimInfo: {
    marginStart: BORDER_RADIUS_3,
    top: isTablet ? VERTICAL_4 : 0,
  },
  buttonTextTwo: {
    color: colors.BLACK,
    // fontWeight: '300',
    textAlign: 'left',
    fontFamily: RUBIC_LIGHT_FONT,
    //maxWidth: widthPixel(110),
    fontSize: FONT_10,
    overflow: 'hidden',
    //textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    marginHorizontal: HORIZONTAL_2,
    top: I18nManager.isRTL ? -VERTICAL_4 : 0,
  },
  physicalView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  physicalActive: {
    flexDirection: 'column',
    marginStart: I18nManager.isRTL ? WIDTH_11 : BORDER_RADIUS_3,
  },
  physicalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS_3,
    width: isTablet
      ? widthPixel(148)
      : (SCREEN_WIDTH - widthPixel(70)) / 2 + tabletMargin(),
    height: heightPixel(50),
    marginHorizontal: widthPixel(8),
  },
  eSimButton: {
    // paddingVertical: BORDER_RADIUS_15,
    // padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BORDER_RADIUS_3,
    width: isTablet
      ? widthPixel(148)
      : (SCREEN_WIDTH - widthPixel(70)) / 2 + tabletMargin(),
    height: heightPixel(50),
    marginHorizontal: widthPixel(8),
    // marginHorizontal: BORDER_RADIUS_5,
  },
  activeButton: {
    borderWidth: 1,
    borderColor: colors.OOREDOO_RED,
    backgroundColor: colors.WHITE,
    borderRadius: BORDER_RADIUS_3,
  },
  deactiveButton: {
    borderWidth: 1,
    borderColor: colors.SILVER,
    backgroundColor: colors.SILVER,
    borderRadius: BORDER_RADIUS_3,
  },
  saveToView: {
    width: widthPixel(19),
    height: heightPixel(19),
    marginTop: BORDER_RADIUS_10,
  },
  pinText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
    //fontWeight: '300',
    marginHorizontal: BORDER_RADIUS_6,
    marginTop: heightPixel(3),
    textAlign: 'left',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: VERTICAL_5,
    right: isTablet ? (Platform.OS == 'android' ? widthPixel(10) : 0) : 0,
  },
  flatListShadow: {
    marginTop: VERTICAL_3,
    //  marginHorizontal: isTablet ? tabletMargin()  : SCALE_SIZE_0,
  },
  lastNameView: {
    // marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  emailView: {
    // marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  governorateView: {
    //  marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  areaView: {
    // marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  additionalView: {
    //  marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
    height: heightPixel(113),
  },

  bottomText: {
    fontFamily: RUBIC_LIGHT_FONT,
    fontSize: FONT_13,
  },
  checkedView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: VERTICAL_15,
  },
  bottomView: {
    // backgroundColor: '#B4F6EB',
    borderRadius: BORDER_RADIUS_31,
    // width: widthPixel(324),
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(324),
    height: heightPixel(28),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VERTICAL_20,
    marginBottom: VERTICAL_10,
  },
  input: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
    fontFamily: RUBIK_REGULAR_FONT,
    fontSize: FONT_16,
  },
  firstName: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  lastName: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  emailId: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  governorate: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  area: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
  },
  additional: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    // height: heightPixel(113),
    height: '100%',
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: I18nManager.isRTL ? FONT_37 : FONT_28,
    textAlign: I18nManager.isRTL ? 'right' : 'left',
  },
  arrowIcon: {
    width: widthPixel(22),
    height: heightPixel(22),
  },
  vectorIconUp: {
    width: widthPixel(22),
    height: heightPixel(22),
  },
  // vectoresimIcon: {
  //     width: widthPixel(29),
  //     height: heightPixel(29),
  // },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: heightPixel(50),
  },
  cardView2: {
    height: widthPixel(359),
  },
  cardView:
    Platform.OS === 'ios'
      ? {
          backgroundColor: colors.BG_COLOR_WHITE,
          borderRadius: BORDER_RADIUS_10,
          padding: VERTICAL_5,
          width: isTablet ? SCREEN_WIDTH / 1.3 : SCREEN_WIDTH - widthPixel(26),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(220),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(800),
          borderWidth: 1,
          borderColor: colors.SILVER,
          elevation: 2,
          marginHorizontal: isTablet ? 0 : HORIZONTAL_13,
          shadowOpacity: 0.25,
          // shadowColor: colors.GREY,
          shadowRadius: BORDER_RADIUS_10,
          right: isTablet ? (Platform.OS == 'android' ? 0 : widthPixel(10)) : 0,
          shadowOffset: {width: 0, height: 2},
          marginBottom: Platform.OS == 'android' ? 10 : null,
          // height: heightPixel(60),
        }
      : {
          backgroundColor: colors.BG_COLOR_WHITE,
          borderRadius: BORDER_RADIUS_10,
          padding: VERTICAL_5,
          width: isTablet ? SCREEN_WIDTH / 1.3 : SCREEN_WIDTH - widthPixel(26),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(220),
          // height: I18nManager.isRTL ? heightPixel(150) : heightPixel(800),
          borderWidth: 0.5,
          borderColor: colors.SILVER,
          elevation: 4,
          marginHorizontal: isTablet ? 0 : HORIZONTAL_13,
          shadowOpacity: 0.25,
          // shadowColor: colors.GREY,
          shadowRadius: BORDER_RADIUS_10,
          right: isTablet ? (Platform.OS == 'android' ? 0 : widthPixel(10)) : 0,
          // shadowOffset: {width: 0, height: 2},
          marginBottom: Platform.OS == 'android' ? 10 : null,
          // height: heightPixel(60),
        },
  cardContent: {
    padding: BORDER_RADIUS_10,
  },
  textLeft: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    marginHorizontal: HORIZONTAL_5,
    fontSize: FONT_16,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'left',
    width: WIDTH_200,
  },
  arrowTouchEffect: {
    alignItems: 'center',
    justifyContent: 'center',
    height: heightPixel(36),
    width: heightPixel(36),
    borderRadius: heightPixel(18),
  },
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    marginTop: VERTICAL_5,
    marginHorizontal: HORIZONTAL_5,
  },
  errorBorder: {
    borderColor: 'red', // Set the border color to red when error exists
  },
  checkedCheckbox: {
    backgroundColor: colors.OOREDOO_RED,
  },
  checkboxContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  opactiy: {
    activeOpacity: 1,
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
  mapStyle: {
    height: heightPixel(291),
    borderRadius: BORDER_RADIUS_10,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default ChooseSimType;
