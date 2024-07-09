import {useFocusEffect, useNavigation} from '@react-navigation/native';
import RNGoSell from '@tap-payments/gosell-sdk-react-native';
import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {
  I18nManager,
  ScrollView,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  DefaultTheme,
  Provider as PaperProvider,
  TextInput,
} from 'react-native-paper';
import ItemsListModal from '../../models/shopOnApp/ItemsListModal';
import BottomButton from '../../components/shopOnApp/BottomButton';
import HeaderComponent from '../../models/basic/HeaderComponent';
import {useToggleTabBar} from '../../models/hooks/showHideBottomTab';
import ScreenName from '../../navigator/ScreenName';
import colors from '../../resources/styles/colors';
import LinearGradient from 'react-native-linear-gradient';
// import MapView from 'react-native-maps';
import {
  RUBIK_LIGHT_FONT,
  RUBIK_REGULAR_FONT,
} from '../../resources/styles/fonts';
import {
  SCREEN_WIDTH,
  heightPixel,
  isTablet,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {
  BORDER_RADIUS_1,
  BORDER_RADIUS_3,
  BORDER_RADIUS_6,
  FONT_12,
  FONT_13,
  FONT_20,
  HEIGHT_100,
  HORIZONTAL_5,
  HORIZONTAL_20,
  SCALE_SIZE_0,
  VERTICAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_20,
  WIDTH_40,
  VERTICAL_3,
  BORDER_RADIUS_10,
  FONT_16,
} from '../../resources/styles/responsive';
import Rating from '../../models/shopOnApp/RatingUs';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import {GetCacheKey} from '../../services/CacheUtil';
import {
  GETCITY_LIST_API,
  GOVERNORATE_LIST_API,
  SAVE_ADDRESS,
} from '../../resources/route/endpoints';
import {useMutation, useQuery} from 'react-query';
import {callQueryapi} from '../../commonHelper/middleware/callapi.android';
import Geolocation from 'react-native-geolocation-service';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import {reject} from 'lodash';
import {useDispatch, useSelector} from 'react-redux';
import {findObjectByKey} from '../../commonHelper/utils';
import {setCommonAPIData} from '../../reducers/actions/cacheAction';
import {isDeviceHuawei} from '../../commonHelper/Constants';
import {output} from '../../commonHelper/ApiHeaders';

const EditAddress = ({route}) => {
  const [text, setText] = useState('');
  const {t} = useTranslation();
  const areaItem = useRef([]);
  const goverenceItem = useRef([]);
  const areaItemIndex = useRef(0);
  const goverenceItemIndex = useRef(0);
  const goverenceValue = useRef('');
  const areaValue = useRef('');
  const navigation = useNavigation();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const [isLoader, setisLoader] = useState(false);
  const [type, settype] = useState('');
  const [governoratePopup, setgovernoratePopup] = useState(false);
  const [modalmsg, setmodalmsg] = useState('');
  const [showModal, setshowModal] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [textError, setTextError] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [isPayMethodSelected, setIsPayMethodSelected] = useState(false);
  const [showErrorModal, setshowErrorModal] = useState(false);
  const [msg, setmsg] = useState('');
  const [emailError, setEmailError] = useState('');
  const [region, setRegion] = useState(null);
  const dispatch = useDispatch();
  const cachedAPIData = useSelector(
    stateObj => stateObj?.cacheReducer?.commonAPI_Array
  );
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    esimemail: '',
    governorate: '',
    area: '',
    additional: '',
    street: '',
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

  useFocusEffect(
    React.useCallback(() => {
      global.chooseSimType = 'false';
    }, [])
  );

  const AreaApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GETCITY_LIST_API,
          {
            governorate: goverenceValue.current || formData.governorate,
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

  const onSuccessAPI = udata => {
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

  // React.useEffect(() => {
  //   try {
  //     governoratelistapi.mutate();
  //   } catch (r) {}
  // }, []);

  const governoratelistapi = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, GOVERNORATE_LIST_API, {}],
      }),
    {
      onSuccess: (udata, variables, context) => {
        onSuccessAPI(udata);
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

  const saveAddressApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          '',
          SAVE_ADDRESS,
          {
            id: route?.params?.addressId || '', // this id you have to  carryforward form the previous page(from numreserv api response you will get this id),
            governorate: formData.governorate,
            governorateid: formData.governorate,
            street: formData.street,
            msisdn: `965${route.params.numberData.MSISDN}`,
            firstname: formData.firstname,
            lastname: formData.lastname,
            email: formData.email,
            area: formData.area,
            mode: 'shop',
          },
        ],
      }),
    {
      onSuccess: udata => {
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            setShowLoader(false);
          } else {
            setShowLoader(false);
          }
        }
      },
      onError: (uerror, variables, context) => {
        setShowLoader(false);
      },
    }
  );

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
        [name]: value,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validateField = (name, value) => {
    if (value === '') {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: `${name} cannot be empty.`,
      }));
    } else {
      setErrors(prevErrors => ({...prevErrors, [name]: ''}));
    }
  };

  const validateEmail = text => {
    handleInputChange('email', text); // Use the generic function
    if (text != '') {
      if (emailRegex.test(text)) {
        setEmailError('');
      } else {
        setEmailError(t('peve'));
      }
    } else {
      setEmailError('');
    }
  };

  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.EditAddress,
    show: false,
  });

  useEffect(() => {
    RecordScreenEvent('Shop Edit Address');
  }, []);

  useEffect(() => {
    let prevData = route.params.userData;
    setFormData({
      firstname: prevData.firstname,
      lastname: prevData.lastname,
      email: prevData.email,
      esimemail: prevData.esimemail,
      governorate: prevData.governorate,
      area: prevData.area,
      additional: prevData.additional,
      street: prevData.street,
    });
    goverenceValue.current = prevData.governorate;
    if (Platform.OS == 'ios') {
      getCurrentLocation();
    }
  }, []);

  const iosLocationPermission = async () => {
    try {
      const response = await Geolocation.requestAuthorization('whenInUse');
      if (response === 'granted') {
        getUserCurrentLocation();
        return true;
      } else {
        setmodalmsg(t('palc'));
        setshowModal(true);
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
        setshowModal(true);

        return false;
      }
    } catch (error) {}
  };

  //Geoloaction permission
  const getUserCurrentLocation = async () => {
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
      setshowModal(true);
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

  const onDismiss = () => {
    setgovernoratePopup(false);
  };

  const selectItem = value => {
    if (type === 'area') {
      areaValue.current = value?.value;
      handleInputChange('area', value?.label);
    } else {
      goverenceValue.current = value?.value;
      handleInputChange('governorate', value?.label);
    }
    setgovernoratePopup(false);
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
    <View style={styles.mainContainer}>
      <ScrollView
        contentContainerStyle={styles.scrollView}
        showsVerticalScrollIndicator={false}
        alwaysBounceVertical={true}
        bounces={true}>
        <PaperProvider theme={theme}>
          <HeaderComponent
            showAlertIcon={false}
            showChatIcon={false}
            showHeaderTitle={false}
            showFavouriteButton={false}
            showBanner={false}
            statusBarColor={colors.WHITE}
            headerTitle={t('edit_address')}
            isHeaderTextPressDisabled={true}
            type={'ShopOnAppDiscover'}
          />
          {/* <LinearGradient
            start={{x: 1, y: 1}}
            end={{x: 1, y: 0}}
            colors={[colors.OOREDDO_GRADIENT_ONE, colors.OOREDDO_GRADIENT_TWO]}
            style={styles.gradientContainer}>
            <View><Rating /></View>
          </LinearGradient> */}
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
                    {t('first_name')}
                  </Text>
                }
                mode="outlined"
                value={formData.firstname}
                maxLength={30}
                style={styles.firstName}
                onChangeText={text =>
                  handleInputChange(
                    'firstname',
                    text.replace(
                      /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>0-9\{\}\[\]\\\/]/g,
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
              />
              {errors.firstname != '' ? (
                <Text style={styles.errorMesssage}>{errors.firstname}</Text>
              ) : null}
            </View>
            <View style={styles.lastNameView}>
              <TextInput
                label={
                  <Text
                    style={{
                      fontFamily: RUBIK_LIGHT_FONT,
                      fontWeight: '300',
                      fontSize: FONT_13,
                    }}>
                    {t('last_name')}
                  </Text>
                }
                mode="outlined"
                value={formData.lastname}
                maxLength={30}
                style={styles.lastName}
                onChangeText={text =>
                  handleInputChange(
                    'lastname',
                    text.replace(
                      /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>0-9\{\}\[\]\\\/]/g,
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
              />
              {errors.lastname != '' ? (
                <Text style={styles.errorMesssage}>{errors.lastname}</Text>
              ) : null}
            </View>
            <View style={styles.emailView}>
              <TextInput
                label={
                  <Text
                    style={{
                      fontFamily: RUBIK_LIGHT_FONT,
                      fontWeight: '300',
                      fontSize: FONT_13,
                    }}>
                    {t('email')}
                  </Text>
                }
                mode="outlined"
                value={global.contactinfoEmail || formData.email}
                onChangeText={text => {
                  global.contactinfoEmail = null;
                  const sanitizedEmail = text.replace(
                    /[`~!#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'"<>\{\}\[\]\\\/]+/g,
                    ''
                  ); // Remove special characters
                  const normalizedEmail = sanitizedEmail.replace(/\.+/g, '.');
                  const spaceRemove = normalizedEmail.replace(' ', '');
                  validateEmail(spaceRemove);
                }}
                error={!!emailError}
                maxLength={50}
                style={styles.emailId}
                theme={{
                  fonts: {
                    regular: {
                      fontFamily: RUBIK_REGULAR_FONT,
                      fontSize: FONT_16,
                      fontWeight: '400',
                    },
                  },
                }}
              />
              {emailError != '' ? (
                <Text style={styles.errorMesssage}>{emailError}</Text>
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
                    if (foundObj != null && foundObj != undefined && foundObj) {
                      onSuccessAPI(foundObj?.Resp_Obj);
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
                  pointerEvents="none"
                  editable={false}
                  value={formData.governorate}
                  style={[styles.governorate]}
                  onChangeText={text =>
                    handleInputChange(
                      'governorate',
                      text.replace(
                        /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>0-9\{\}\[\]\\\/]/g,
                        ''
                      )
                    )
                  }
                  right={
                    <TextInput.Icon
                      name="chevron-down"
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
                            onSuccessAPI(foundObj?.Resp_Obj);
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
                <Text style={styles.errorMesssage}>{errors.governorate}</Text>
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
                  editable={false}
                  onChangeText={text =>
                    handleInputChange(
                      'area',
                      text.replace(
                        /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>0-9\{\}\[\]\\\/]/g,
                        ''
                      )
                    )
                  }
                  style={[styles.area]}
                  right={
                    <TextInput.Icon
                      name="chevron-down"
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
                <Text style={styles.errorMesssage}>{errors.area}</Text>
              ) : null}
            </View>
            <View style={styles.lastNameView}>
              <TextInput
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
                maxLength={50}
                value={formData.street}
                onChangeText={text => handleInputChange('street', text)}
                style={styles.lastName}
                theme={{
                  fonts: {
                    regular: {
                      fontFamily: RUBIK_REGULAR_FONT,
                      fontSize: FONT_16,
                      fontWeight: '400',
                    },
                  },
                }}
              />
              {errors.street != '' ? (
                <Text style={styles.errorMesssage}>{errors.street}</Text>
              ) : null}
            </View>
            <View style={styles.additionalView}>
              <TextInput
                label={
                  <Text
                    style={{
                      fontFamily: RUBIK_LIGHT_FONT,
                      fontWeight: '300',
                      fontSize: FONT_13,
                    }}>
                    {t('additional')}
                  </Text>
                }
                mode="outlined"
                value={formData.additional}
                multiline={true}
                maxLength={100}
                onChangeText={text =>
                  handleInputChange(
                    'additional',
                    text.replace(
                      /[`~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",<>0-9\{\}\[\]\\\/]/g,
                      ''
                    )
                  )
                }
                style={styles.additional}
                theme={{
                  fonts: {
                    regular: {
                      fontFamily: RUBIK_REGULAR_FONT,
                      fontSize: FONT_16,
                      fontWeight: '400',
                    },
                  },
                }}
              />
            </View>
            {isDeviceHuawei && !output?.hasGms ? (
              <></>
            ) : (
              <View style={styles.mapViewContainer}>
                <Text style={styles.pinText}>{t('pin_on_map_text')}</Text>
                {latitude != '' && latitude && longitude != '' && longitude && (
                  <MapView
                    // provider={PROVIDER_GOOGLE} // remove if not using Google Maps
                    style={styles.mapStyle}
                    zoomEnabled={true}
                    zoomControlEnabled={true}
                    region={{
                      latitude: latitude,
                      longitude: longitude,
                      latitudeDelta: 0.015,
                      longitudeDelta: 0.0121,
                    }}
                    onRegionChangeComplete={e => {
                      setRegion({
                        latitude: e.latitude,
                        longitude: e.longitude,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                      });
                    }}>
                    <Marker
                      tracksViewChanges={false}
                      coordinate={{
                        latitude: latitude,
                        longitude: longitude,
                      }}
                    />
                  </MapView>
                )}
              </View>
            )}
            <CustomDialogue
              visible={showModal}
              message={modalmsg}
              onClose={() => {
                setshowModal(false);
                setmodalmsg('');
              }}
            />
          </View>
        </PaperProvider>
      </ScrollView>
      {governoratePopup && (
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
      <BottomButton
        text={t('save_address_button')}
        disable={
          formData?.firstname === null ||
          formData?.firstname === undefined ||
          formData?.firstname === '' ||
          formData?.lastname === null ||
          formData?.lastname === undefined ||
          formData?.lastname === '' ||
          formData?.email === null ||
          formData?.email === undefined ||
          formData?.email === '' ||
          formData?.governorate === null ||
          formData?.governorate === undefined ||
          formData?.governorate === '' ||
          formData?.area === null ||
          formData?.area === undefined ||
          formData?.area === '' ||
          formData?.street === null ||
          formData?.street === undefined ||
          formData?.street === '' ||
          emailError
            ? true
            : false
        }
        onPress={() => {
          route.params.setUserDetails(prevState => ({
            ...prevState,
            firstname: formData?.firstname,
            lastname: formData?.lastname,
            email: formData?.email,
            esimemail: formData?.esimemail,
            governorate: formData?.governorate,
            area: formData?.area,
            additional: formData?.additional,
            street: formData?.street,
          }));
          let isSaveAddress = global.ShopOnAPPAddressObj;
          if (isSaveAddress.saveAddress) {
            saveAddressApi.mutate();
          }
          navigation.goBack();
        }}
      />
    </View>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: colors.BG_COLOR_WHITE,
  },
  gradientContainer: {
    height: heightPixel(106),
    width: widthPixel(375),
  },
  // map: {
  //   marginHorizontal: HORIZONTAL_20,
  //   marginTop: VERTICAL_10,
  //   height: I18nManager.isRTL ? heightPixel(268) : heightPixel(291),
  // },
  pinText: {
    fontFamily: RUBIK_LIGHT_FONT,
    fontSize: FONT_13,
    //fontWeight: '300',
    marginHorizontal: BORDER_RADIUS_6,
    marginTop: heightPixel(3),
    textAlign: 'left',
  },
  flatListShadow: {
    marginTop: VERTICAL_3,
  },
  firstName: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  lastNameView: {
    marginTop: heightPixel(20),
  },
  lastName: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  emailView: {
    marginTop: heightPixel(20),
  },
  emailId: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  governorate: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  governorateView: {
    marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  area: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(50),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  areaView: {
    // marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },
  additionalView: {
    //  marginHorizontal: isTablet ? tabletMargin() : SCALE_SIZE_0,
    marginTop: heightPixel(20),
  },

  additional: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    height: heightPixel(113),
    marginStart: BORDER_RADIUS_3,
    backgroundColor: colors.WHITE,
    lineHeight: FONT_20,
  },
  scrollView: {paddingBottom: HEIGHT_100, flexGrow: 1},
  errorMesssage: {
    textAlign: 'left',
    color: colors.OOREDOO_RED,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    fontFamily: RUBIK_REGULAR_FONT,
    marginTop: VERTICAL_5,
    marginHorizontal: HORIZONTAL_5,
  },
  mapViewContainer: {
    width: isTablet ? SCREEN_WIDTH / 1.3 - widthPixel(50) : widthPixel(320),
    marginTop: heightPixel(20),
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
