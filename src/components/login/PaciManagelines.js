import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  ActivityIndicator,
  I18nManager,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  BORDER_RADIUS_25,
  FONT_12,
  FONT_13,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_21,
  FONT_22,
  FONT_24,
  FONT_26,
  FONT_30,
  FONT_35,
  FONT_38,
  HEIGHT_10,
  HEIGHT_200,
  HEIGHT_40,
  HEIGHT_55,
  HEIGHT_80,
  HORIZONTAL_10,
  HORIZONTAL_20,
  HORIZONTAL_25,
  HORIZONTAL_5,
  IMG_DIMENSION_30,
  VERTICAL_10,
  VERTICAL_20,
  VERTICAL_27,
  VERTICAL_5,
  VERTICAL_HORIZONTAL_8,
  WIDTH_180,
  WIDTH_20,
} from '../../resources/styles/responsive';
import {
  CHILDMSISDN,
  LOGIN_TYPE,
  SELECTED_MSISDN,
  TOKEN_ID,
} from '../../commonHelper/Constants';
import {
  DEFAULT_USER_IMAGE,
  PACIMANAGELINES_API,
  MANAGELINES_DELETE_NUMBER,
  GETTOKEN_API,
  DEVICE_AUTH_API,
  MOBILEID_STATUS,
} from '../../resources/route/endpoints';
import {
  NOTOSANS_BOLD_FONT,
  NOTOSANS_REGULAR_FONT,
  OOREDOO_HEAVY_FONT,
  OOREDOO_REGULAR_FONT,
} from '../../resources/styles/fonts';
import React, {useEffect, useState, useCallback} from 'react';
import {RecordScreenEvent, RecordlogEvents} from '../../analytics/RecordEvents';
import {StackActions, useFocusEffect} from '@react-navigation/native';
import {
  UnitTestProps,
  consoleLog,
  decodeUnicode,
  doFunct,
  getItem,
  isBiometricSensorAvailable,
  setItem,
} from '../../commonHelper/utils';
import {
  heightPixel,
  isTablet,
  SCREEN_HEIGHT,
  tabletMargin,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {useMutation, useQuery, useQueryClient} from 'react-query';

import AIcon from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';
import BottomDialogue from '../../models/basic/BottomDialogue';
import BottomSheet from '../../models/basic/BottomSheet';
import CustomDialogue from '../../commonHelper/CustomDialogue';
import ErrorComponent from '../../models/basic/ErrorComponent';
import {FlatList} from 'react-native-gesture-handler';
import HeaderComponent from '../../models/basic/HeaderComponent';
import {LandingPageButton} from '../../commonHelper/Button';
import LoadingIndicator from '../../commonHelper/LoadingIndicator';
import ScreenName from '../../navigator/ScreenName';
import Switch from '../../models/basic/switch';
import {callQueryapi} from '../../commonHelper/middleware/callapi';
import colors from '../../resources/styles/colors';
import {useTranslation} from 'react-i18next';
import PageElementSlider from '../../UIComponent/custom/PageElementSlider';
import {setLoggedInUser} from '../home/actions';
import {Biometrics} from 'react-native-biometrics';
import Toast from 'react-native-simple-toast';
import {connect, useDispatch, useSelector} from 'react-redux';
import RNExitApp from 'react-native-exit-app';
import {getGlobalSettingValue} from '../../services/CommonUtils';
const PaciManagelines = ({navigation, route}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const params = {civilid: global.civilAddress}; // 292050300922
  const reduxState = useSelector(state => state);
  const [primaryParams, setParams] = useState('');

  const [isEnabled, setEnabled] = useState(false);

  const [openSheet, setOpenSheet] = useState(false);

  const [info, setInfo] = useState({});

  const [showModal, setshowModal] = useState(false);
  const [isLoader, setisLoader] = useState(false);

  const [popupError, setpopupError] = useState('');

  const [imgerror, setImageError] = useState(false);
  const [isAll, isAllSelected] = useState(true);
  const [selindex, setselIndex] = useState(-1);
  const [recordExist, setrecordExist] = useState(false);
  const [msisdnType, setmsisdnType] = useState([]);
  const [msisdnValue, setmsisdnValue] = useState('');
  const [linkedmsisdnsData, setlinkedmsisdnsData] = useState('');
  const [filterAvailable, setfilterAvailable] = useState(true);
  const [SelectedNumbers, setSelectedNumbers] = useState();
  const [logintypAuth, setlogintypAuth] = useState('');
  const [mobileNo, setmobileNo] = useState('');
  const [cmsisdn, setcmsisdn] = useState('');
  // mobileNo: item.msisdn,
  //                   cmsisdn: item.cmsisdn,

  const queryClient = useQueryClient();

  let timer = null;

  const toggleBottomSheet = () => {
    setOpenSheet(false);
  };
  const onTryAgainClick = deleteFlag => {
    setOpenSheet(false);
    if (deleteFlag) {
      deleteNumber.mutate({mobileNo: info.msisdn_});
    } else {
      callsetremmovePrimaryAPI(info?.isremove, info?.msisdn_);
    }
  };

  const [data, setdata] = useState();

  React.useEffect(() => {
    try {
      paciManage.mutate();
    } catch (r) {}
  }, []);

  const paciManage = useMutation(
    req =>
      callQueryapi({
        queryKey: [{}, 'paci/numberslist', params, {}, true],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata?.data?.status === '0') {
          setdata(udata?.data);
        } else {
          setdata(udata?.data);
        }
      },
      onError: (error, variables, context) => {
        console.log('Error here----', error);
      },
    }
  );

  // const {
  //   data: {data} = {},
  //   isLoading,
  //   msisdn,
  //   isError,
  //   error,
  //   isFetching,
  //   refetch,
  // } = useQuery([{}, 'paci/numberslist', params, {}, true], {
  //   retry: false,
  // });

  useEffect(() => {
    if (data?.status === '-1') {
      Toast.show(t('no_register_numbers'), Toast.SHORT);
      setTimeout(function () {
        navigation.reset({
          index: 0,
          routes: [{name: ScreenName.loginScreen}],
        });
      }, 2000);
    }
  }, [data?.status === '-1']);

  useEffect(() => {
    try {
      global.ispaciloggedin = false;
    } catch (error) {}
  }, []);

  const getToken = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          {},
          GETTOKEN_API,
          {msisdn: req.mobileNo, transid: global.pacitransid},

          // {action: 'GET', pagesize: '20', startindex: '0', rtype: '1'},
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        try {
          if (udata?.data?.status === '0') {
            setItem(TOKEN_ID, udata?.data?.response.tokenid);
            global.tokenid = udata?.data?.response.tokenid;
            setItem(LOGIN_TYPE, 'paci');
            global.loginDeviceType = 'paci';
            setTimeout(() => {
              getItem(LOGIN_TYPE).then(val => {
                setlogintypAuth(val);
              });
            }, 100);

            setTimeout(() => {
              validUserApi.mutate();
            }, 300);
            // refetch();
          } else {
          }
        } catch (e) {}
      },
      onError: (uerror, variables, context) => {
        isBiometricSensorAvailable(dispatch, reduxState, navigation);
      },
    }
  );

  const validUserApi = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          '',
          DEVICE_AUTH_API,
          {dmode: 'pacilogin', dlogintype: logintypAuth},
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            global.ispaciloggedin = null;
            // global.loginPaciScreen = true;
            if (udata?.data?.infomsg === 'NEW') {
              global.loginEventCalled = 'yes';
              dispatch(setLoggedInUser(true));
              callCustomerAPI(mobileNo, cmsisdn);
              isBiometricSensorAvailable(dispatch, reduxState, navigation);
              // Toast.show(udata?.data?.message, 5000);
            } else {
              global.loginEventCalled = 'yes';
              dispatch(setLoggedInUser(true));
              callCustomerAPI(mobileNo, cmsisdn);
              isBiometricSensorAvailable(dispatch, reduxState, navigation);
              //  Toast.show(udata?.data?.message, 5000);
            }
          } else {
            if (udata?.data?.code === '2324005') {
              // Toast.show(t(udata?.data?.message), 5000);
              setTimeout(() => {
                RNExitApp.exitApp();
              }, 3000);
            } else {
              Toast.show(udata?.data?.message);
            }
          }
        }
      },
      onError: (uerror, variables, context) => {},
    }
  );

  // consoleLog("getToken------------------------------------------", getToken);

  useEffect(() => {
    dispatch(setLoggedInUser(false));
    if (data?.status === '0') {
      if (data?.response?.length > 0) {
        let accdata = data?.response;
        if (accdata?.length > 0) {
          const unique = [
            ...new Set(
              accdata.map(item => {
                return item.heading;
              })
            ),
          ]
            .sort()
            .reverse();
          if (unique != null && unique != undefined) {
            let append = [];
            for (let a = 0; a < unique.length; a++) {
              append.push({
                id: a + 1,
                name: unique[a],
              });
            }
            setmsisdnType(append);
          }
        }
        setTimeout(() => {
          setlinkedmsisdnsData(data?.response);
          setselIndex(-1);
        }, 100);
      }
      getItem(SELECTED_MSISDN)
        .then(value => {
          if (value != null && value != undefined && value.length > 0) {
            for (let a = 0; a < data?.response?.length; a++) {
              if (data?.response?.linkedmsisdns[a].msisdn == '965' + value) {
                global.customerprofile_image =
                  data?.response?.linkedmsisdns[a].image;
                break;
              }
            }
          }
        })
        .catch(err => {
          consoleLog(err);
        });
    }
  }, [data, linkedmsisdnsData]);

  const closePopup = () => {
    setOpenSheet(false);
  };

  const changeNumberEventCT = (msisdn, statusdesription) => {
    try {
      RecordlogEvents('Change Number', {
        'Logged Mobile Number': global.customerprofile,
        'Changed Mobile Number': msisdn,
        status: 'Success',
        'Status Description': statusdesription,
      });
    } catch (e) {}
  };

  const callCustomerAPI = (_msisdn, msisdnWithoutCCode) => {
    changeNumberEventCT(_msisdn, data?.message);
    global.userdetails = null;
    global.wanastage = null;
    global.dashboardData = null;
    global.rateplantype = null;
    global.isB2BCPR = null;
    global.ProfileCustomerType = null;
    global.customerprofile = null;
    global.hideanapopup = null;
    // global.loginPaciScreen = true;
    let encMobile = doFunct(_msisdn, 'MOBAPI');
    setItem(CHILDMSISDN, encMobile);
    global.setchildmsisdn = _msisdn;
    setItem(SELECTED_MSISDN, msisdnWithoutCCode);
    global.setchildmsisdn_encrypt = encMobile;
    global.billrechargeitems = null;
    global.notificationsCards = null;
    global.notificationLength = 0;
    global.balancenotify = null;
    global.customerprofile_image = '';
    global.customerprofile = null;
    global.imageheaderslist = null;
    global.dashboardrecom = null;
    global.NojoomDashboard = null;
    global.NojoomDashboardresp = null;
    global.NojoomDashboardColor = null;
    global.UniqueTokenProfile = 't' + new Date().getTime() + 'm';
    global.UniqueToken = 't' + new Date().getTime() + 'm';
    // timer = setTimeout(() => {
    //   navigation.dispatch(
    //     StackActions.replace(ScreenName.tabStack, {
    //       screen: ScreenName.homeStack,
    //     })
    //   );
    // }, 100);
  };

  const callsetremmovePrimaryAPI = (isremove, _msisdn) => {
    const primaryparams = {
      msisdn: _msisdn,
      removeprimary: isremove ? '' : 'y',
    };
    setParams(primaryparams);
  };

  const SetPrimaryEventCT = (statusType, statusdesription, isremove) => {
    try {
      RecordlogEvents('Set Primary', {
        'Mobile Number': global.customerprofile.Msisdn,
        Action: isremove == false ? 'Remove' : 'Set',
        'Login Type': global.logintype,
        status: statusType,
        'Status Description': statusdesription,
      });
    } catch (e) {}
  };

  const renderSeparator = () => {
    selindex == -1 ? (
      <View style={styles.separator} />
    ) : selindex > 0 && recordExist == false ? (
      <View style={styles.separator} />
    ) : null;
  };
  const navigateToEdit = item => {
    navigation.navigate(ScreenName.PaciManagelines, {lineItem: item});
  };

  const key_delete_number = `${global.UniqueToken}_MANAGELINES_DELETE_NUMBER`;

  const deleteNumber = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          key_delete_number,
          MANAGELINES_DELETE_NUMBER,
          {
            childmsisdn: `965${req.mobileNo}`,
          },
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        if (udata != null && udata != undefined && udata.data != null) {
          if (udata?.data?.status === '0') {
            paciManage?.mutate();
          } else {
            setshowModal(true);
            setpopupError(udata?.data?.message);
          }
        }
      },
      onError: (uerror, variables, context) => {
        consoleLog('uerror =', uerror);
      },
    }
  );

  const renderItem = useCallback(({item, index}) => {
    return (
      <>
        {selindex == -1 || item.type == msisdnValue ? (
          <>
            <View
              {...UnitTestProps('pacimanagelines', 'view', 'viewnonaccount')}
              style={styles.container}>
              <TouchableOpacity
                {...UnitTestProps(
                  'pacimanagelines',
                  'touchableopacity',
                  'nonaccounttouch'
                )}
                activeOpacity={item?.NonAccountMsisdn ? 1 : 0}
                style={{
                  flex: 1,
                  marginHorizontal: WIDTH_20,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  setmobileNo(item.msisdn);
                  setcmsisdn(item.cmsisdn);
                  getToken.mutate({
                    mobileNo: item.msisdn,
                    cmsisdn: item.cmsisdn,
                  });
                }}>
                <View
                  {...UnitTestProps(
                    'pacimanagelines',
                    'view',
                    'defaultimageview'
                  )}
                  style={styles.imageContainer}>
                  <Image
                    {...UnitTestProps(
                      'pacimanagelines',
                      'image',
                      'defaultimage'
                    )}
                    source={
                      item?.image != null &&
                      item?.image?.length > 10 &&
                      item?.image?.indexOf('https://') == 0
                        ? {uri: item?.image}
                        : DEFAULT_USER_IMAGE.img
                    }
                    onError={imgerror => {}}
                    resizeMode={'cover'}
                    style={styles.imageBg}
                  />
                </View>
                <View
                  {...UnitTestProps('pacimanagelines', 'view', 'nicknameview')}
                  style={styles.textViewContainer}>
                  <View
                    {...UnitTestProps(
                      'pacimanagelines',
                      'view',
                      'nicknamesubview'
                    )}
                    style={styles.textContainer}>
                    <View
                      {...UnitTestProps(
                        'pacimanagelines',
                        'view',
                        'nicknamesubview'
                      )}>
                      <Text
                        {...UnitTestProps(
                          'pacimanagelines',
                          'text',
                          'nicknametext'
                        )}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={
                          item?.nickname?.length > 0
                            ? styles.name
                            : styles.nickname
                        }>
                        {item?.nickname?.length > 0
                          ? item?.nickname
                          : getGlobalSettingValue('pacinickname')}
                      </Text>
                    </View>
                  </View>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.msisdn}>
                    {item.cmsisdn}
                  </Text>
                  <Text
                    {...UnitTestProps(
                      'pacimanagelines',
                      'text',
                      'currentplantext'
                    )}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.linetype}>
                    {item.currentplan}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              {...UnitTestProps('pacimanagelines', 'view', 'seperatorview')}
              style={styles.separator}
            />
            {index === data?.response?.linkedmsisdns?.length - 1 &&
            data?.response?.enablenonaccountnumbers ? (
              <View
                {...UnitTestProps('pacimanagelines', 'view', 'addanumberview')}
                style={{paddingVertical: 30}}>
                <Text
                  {...UnitTestProps(
                    'pacimanagelines',
                    'text',
                    'addanumbertext'
                  )}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  style={styles.stitle}>
                  {t('add_a_number')}
                </Text>

                <Text
                  {...UnitTestProps('loginotp', 'text', 'addnotenumbertext')}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  style={styles.desc}>
                  {t('add_a_number_note')}
                </Text>

                <View
                  {...UnitTestProps(
                    'pacimanagelines',
                    'view',
                    'linknumberview'
                  )}
                  style={styles.btnContainer}>
                  <LandingPageButton
                    {...UnitTestProps(
                      'pacimanagelines',
                      'landingpagebutton',
                      'linknumbertext'
                    )}
                    title={t('add_a_number').toUpperCase()}
                    onPress={() => {
                      navigation.navigate(ScreenName.AddNumber, {
                        linkedNumber: data?.response?.linkedmsisdns,
                      });
                    }}
                    customStyle={styles.addNumberBtnContainer}
                    customTextStyle={styles.addBtnBtnText}
                  />
                </View>
              </View>
            ) : null}
          </>
        ) : msisdnValue === 'Others' && item?.NonAccountMsisdn ? (
          <>
            <View
              {...UnitTestProps(
                'pacimanagelines',
                'view',
                'nonmsisdnaccountview'
              )}
              style={styles.container}>
              <TouchableOpacity
                {...UnitTestProps(
                  'pacimanagelines',
                  'touchableopacity',
                  'nonaccountmsisdntouch'
                )}
                activeOpacity={item?.NonAccountMsisdn ? 1 : 0}
                style={{
                  flex: 1,
                  marginHorizontal: WIDTH_20,
                  flexDirection: 'row',
                }}
                onPress={() => {
                  !item?.NonAccountMsisdn &&
                    callCustomerAPI(item.msisdn, item.cmsisdn);
                }}>
                <View
                  {...UnitTestProps('pacimanagelines', 'view', 'defaultview')}
                  style={styles.imageContainer}>
                  <Image
                    {...UnitTestProps(
                      'pacimanagelines',
                      'image',
                      'defaultimage'
                    )}
                    source={
                      item?.image != null &&
                      item?.image?.length > 10 &&
                      item?.image?.indexOf('https://') == 0
                        ? {uri: item?.image}
                        : DEFAULT_USER_IMAGE.img
                    }
                    onError={imgerror => {}}
                    resizeMode={'cover'}
                    style={styles.imageBg}
                  />
                </View>
                <View
                  {...UnitTestProps('pacimanagelines', 'view', 'nicknameview2')}
                  style={styles.textViewContainer}>
                  <View
                    {...UnitTestProps(
                      'pacimanagelines',
                      'view',
                      'nicknamesubview23'
                    )}
                    style={styles.textContainer}>
                    <View
                      {...UnitTestProps(
                        'pacimanagelines',
                        'view',
                        'nicknamesubview32'
                      )}>
                      <Text
                        {...UnitTestProps(
                          'pacimanagelines',
                          'text',
                          'nicknametext5'
                        )}
                        numberOfLines={1}
                        ellipsizeMode={'tail'}
                        style={
                          item?.nickname?.length > 0
                            ? styles.name
                            : styles.nickname
                        }>
                        {item?.nickname?.length > 0
                          ? item?.nickname
                          : t('nickname')}
                      </Text>
                    </View>
                    <View
                      {...UnitTestProps('pacimanagelines', 'view', 'editview')}>
                      <TouchableOpacity
                        {...UnitTestProps(
                          'pacimanagelines',
                          'touchableopacity',
                          'edittouch'
                        )}
                        onPress={() => {
                          navigateToEdit(item);
                        }}>
                        <Image
                          {...UnitTestProps(
                            'pacimanagelines',
                            'image',
                            'editimage'
                          )}
                          source={require('../../assets/edit.png')}
                          style={styles.imageEdit}
                          resizeMode={'contain'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <Text
                    {...UnitTestProps('pacimanagelines', 'text', 'cmstext')}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.msisdn}>
                    {item.cmsisdn}
                  </Text>
                  <Text
                    {...UnitTestProps(
                      'pacimanagelines',
                      'text',
                      'linetypetext5'
                    )}
                    numberOfLines={1}
                    ellipsizeMode={'tail'}
                    style={styles.linetype}>
                    {item.currentplan}
                  </Text>
                </View>
              </TouchableOpacity>

              <View
                {...UnitTestProps('pacimanagelines', 'view', 'nonaccount65')}
                style={styles.switchContainer}>
                {item?.NonAccountMsisdn ? (
                  <TouchableOpacity
                    {...UnitTestProps(
                      'pacimanagelines',
                      'touchableopacity',
                      'nonaccounttouch71'
                    )}
                    onPress={() => {
                      setInfo({
                        delete: false,
                        msisdn_: item.cmsisdn,
                        confirmMsg: decodeUnicode(
                          global.rn_delnumber_confirm_msg
                        ).replace('!MSISDN!', item.cmsisdn),
                      });
                      setOpenSheet(true);
                    }}>
                    <AIcon
                      {...UnitTestProps(
                        'pacimanagelines',
                        'aicon',
                        'deleteicon'
                      )}
                      name={'delete'}
                      size={FONT_24}
                      color={colors.GREY}
                      style={
                        {
                          // paddingRight: isTablet ? 0 : HORIZONTAL_25,
                        }
                      }
                    />
                  </TouchableOpacity>
                ) : (
                  <Switch
                    {...UnitTestProps(
                      'pacimanagelines',
                      'switch',
                      'customerprofileswitch'
                    )}
                    isOn={item?.IsPrimary}
                    width={60}
                    height={30}
                    onColor="transparent"
                    offColor="#EEEEEE"
                    onToggle={isOn => {
                      if (item.IsPrimary === true) {
                        if (global.customerprofile?.Msisdn === item?.msisdn) {
                          return;
                        }
                      } else {
                        if (global.isB2BCPR == 'B2BCPR') {
                          if (data?.response?.linkedmsisdns?.length === 1) {
                            return;
                          }
                        }
                        if (
                          data?.response?.primarynumbermarked == true &&
                          item?.IsPrimary == false &&
                          global.customerprofile?.Msisdn === item?.msisdn
                        ) {
                          return;
                        }
                      }
                      setOpenSheet(true);
                      if (I18nManager.isRTL) {
                        if (isOn) {
                          var msg = t('setprimaryno');
                          msg =
                            '\u0644\u0642\u062f \u0627\u062e\u062a\u0631\u062a \u0028\u004d\u0053\u0049\u0053\u0044\u004e\u0029 \u0644\u064a\u0643\u0648\u0646 \u0627\u0644\u0631\u0642\u0645 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u002e \u0643\u0645\u0627 \u0633\u064a\u0645\u0643\u0646\u0643 \u0645\u0634\u0627\u0647\u062f\u0629 \u0648\u0625\u062f\u0627\u0631\u0629 \u0623\u0631\u0642\u0627\u0645\u0643 \u0627\u0644\u0623\u062e\u0631\u0649';
                          msg = msg.replace('(MSISDN)', item.cmsisdn);
                          consoleLog('----setprimaryno', msg);
                          setInfo({
                            isremove: isOn,
                            msisdn_: item.msisdn,
                            confirmMsg: msg,
                          });
                        } else {
                          var msg = t('yratrpfulrus');
                          msg =
                            '\u0623\u0646\u062a \u0639\u0644\u0649 \u0648\u0634\u0643 \u0627\u0644\u063a\u0627\u0621 \u062a\u062d\u062f\u064a\u062f \u0028\u004d\u0053\u0049\u0053\u0044\u004e\u0029 \u0645\u0646 \u0631\u0642\u0645\u0643 \u0627\u0644\u0623\u0633\u0627\u0633\u064a\u060c \u0647\u0644 \u0623\u0646\u062a \u0645\u062a\u0627\u0643\u062f \u0645\u0646 \u0627\u0644\u0645\u062a\u0627\u0628\u0639\u0629\u061f';
                          msg = msg.replace('(MSISDN)', item.cmsisdn);
                          consoleLog('-yratrpfulrus', msg);
                          setInfo({
                            isremove: isOn,
                            msisdn_: item.msisdn,
                            confirmMsg: msg,
                          });
                        }
                      } else {
                        setInfo({
                          isremove: isOn,
                          msisdn_: item.msisdn,
                          confirmMsg: t(
                            isOn ? 'setprimaryno' : 'yratrpfulrus'
                          ).replace('(MSISDN)', item.cmsisdn),
                        });
                      }
                    }}
                  />
                )}
              </View>
            </View>

            {index === data?.response?.linkedmsisdns?.length - 1 &&
            data?.response?.enablenonaccountnumbers ? (
              <View
                {...UnitTestProps(
                  'pacimanagelines',
                  'view',
                  'adddescriptionview32'
                )}
                style={{paddingVertical: 30}}>
                <Text
                  {...UnitTestProps(
                    'pacimanagelines',
                    'text',
                    'adddescriptiontext2'
                  )}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  style={styles.stitle}>
                  {t('add_a_number')}
                </Text>
                <Text
                  {...UnitTestProps(
                    'pacimanagelines',
                    'text',
                    'descriptionsubtext'
                  )}
                  numberOfLines={2}
                  ellipsizeMode={'tail'}
                  style={styles.desc}>
                  {t('add_a_number_note')}
                </Text>

                <View
                  {...UnitTestProps('pacimanagelines', 'view', 'addview')}
                  style={styles.btnContainer}>
                  <LandingPageButton
                    {...UnitTestProps(
                      'pacimanagelines',
                      'landingpagebutton',
                      'addnumberlanding'
                    )}
                    title={t('add_a_number').toUpperCase()}
                    onPress={() => {
                      navigation.navigate(ScreenName.AddNumber, {
                        linkedNumber: data?.response?.linkedmsisdns,
                      });
                    }}
                    customStyle={styles.addNumberBtnContainer}
                    customTextStyle={styles.addBtnBtnText}
                  />
                </View>
              </View>
            ) : null}
          </>
        ) : index === data?.response?.linkedmsisdns?.length - 1 &&
          data?.response?.enablenonaccountnumbers ? (
          <View
            {...UnitTestProps('pacimanagelines', 'view', 'viewaddnumsub')}
            style={{paddingVertical: 30}}>
            <Text
              {...UnitTestProps('pacimanagelines', 'text', 'textaddnum')}
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.stitle}>
              {t('add_a_number')}
            </Text>
            <Text
              {...UnitTestProps(
                'pacimanagelines',
                'text',
                'textdescriptionnote'
              )}
              numberOfLines={2}
              ellipsizeMode={'tail'}
              style={styles.desc}>
              {t('add_a_number_note')}
            </Text>

            <View
              {...UnitTestProps('pacimanagelines', 'view', 'subaddnumberview')}
              style={styles.btnContainer}>
              <LandingPageButton
                {...UnitTestProps(
                  'pacimanagelines',
                  'landingpagebutton',
                  'subaddnumberland'
                )}
                title={t('add_a_number').toUpperCase()}
                onPress={() => {
                  navigation.navigate(ScreenName.AddNumber, {
                    linkedNumber: data?.response?.linkedmsisdns,
                  });
                }}
                customStyle={styles.addNumberBtnContainer}
                customTextStyle={styles.addBtnBtnText}
              />
            </View>
          </View>
        ) : null}
      </>
    );
  });

  const _listEmptyComponent = () => {
    return (
      <Text
        {...UnitTestProps('pacimanagelines', 'text', 'errortext')}
        numberOfLines={2}
        ellipsizeMode={'tail'}
        style={styles.errorText}>
        {data?.message}
      </Text>
    );
  };

  if (
    // UpdateAccount.isFetching ||
    // UpdateAccount.isLoading ||
    deleteNumber.isFetching ||
    deleteNumber.isLoading
  ) {
    return (
      <View
        {...UnitTestProps('pacimanagelines', 'view', 'subviewloading')}
        style={{marginVertical: SCREEN_HEIGHT / 3}}>
        <View
          {...UnitTestProps('pacimanagelines', 'view', 'loadingview')}
          style={styles.loadingContainer}>
          <LoadingIndicator
            {...UnitTestProps(
              'pacimanagelines',
              'loadingindicator',
              'paciloading'
            )}
            shouldDismissManual
            isVisible={deleteNumber.isFetching || deleteNumber.isLoading}
          />
        </View>
      </View>
    );
  }

  if (paciManage?.error) {
    return <ErrorComponent data={paciManage?.error} showcard={true} />;
  }
  return (
    <View
      {...UnitTestProps('pacimanagelines', 'view', 'headerview')}
      style={styles.main}>
      <HeaderComponent
        {...UnitTestProps('pacimanagelines', 'headercomponent', 'paciheader')}
        viewname="pacimanagelines"
        showBackButton={false}
        showChatIcon={true}
        showFavouriteButton={false}
        showBanner={false}
        showAlertIcon={false}
        // showShadow = {false}
        toggleTitlePress
        isHeaderTextPressDisabled={false}
        // statusBarColor={colors.WHITE}
        onTitlePress={() => {
          navigation.goBack();
        }}
      />

      <View
        {...UnitTestProps('pacimanagelines', 'view', 'managelinesview')}
        style={styles.subContainer}>
        <Text
          {...UnitTestProps('pacimanagelines', 'text', 'managelinestext')}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={styles.stitle}>
          {t('managelines')}
        </Text>
        <Text
          {...UnitTestProps('pacimanagelines', 'text', 'descriptiontext')}
          numberOfLines={2}
          ellipsizeMode={'tail'}
          style={styles.desc}>
          {/* {data?.response?.primarymessage} */}
          {
            // t('ctntl')
            getGlobalSettingValue('ctntl')
          }
        </Text>
        {linkedmsisdnsData.length > 0 ? (
          <PageElementSlider
            {...UnitTestProps(
              'pacimanagelines',
              'pageelementslider',
              'pageelement'
            )}
            itemlist={msisdnType}
            isAll={isAll}
            isAllSelected={isAllSelected}
            selindex={selindex}
            setselIndex={setselIndex}
            setmsisdnValue={setmsisdnValue}
            showFilter={false}
            withoutMargin={true}
            filterAvailable={filterAvailable}
            filterColor={true}
            allRecords={linkedmsisdnsData}
            setrecordExist={setrecordExist}
          />
        ) : null}

        {recordExist && selindex > 0 ? (
          <View
            {...UnitTestProps('pacimanagelines', 'view', 'nodataview')}
            style={styles.noDataView}>
            <Text
              {...UnitTestProps('pacimanagelines', 'text', 'nodatatext')}
              style={styles.noData}>
              {t('nodata')}
            </Text>
          </View>
        ) : null}

        {data?.response?.length > 0 ? (
          <FlatList
            {...UnitTestProps('pacimanagelines', 'flatlist', 'flatlistmain')}
            data={data?.response}
            overScrollMode={'always'}
            scrollEventThrottle={16}
            bounces={true}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.flatlist}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={_listEmptyComponent}
            // ItemSeparatorComponent={renderSeparator}
            keyExtractor={(_, index) => String(index)}
            renderItem={renderItem}
          />
        ) : null}

        <BottomSheet
          {...UnitTestProps(
            'pacimanagelines',
            'bottomsheet',
            'confirmbottomsheet'
          )}
          isOpen={openSheet}
          onClose={toggleBottomSheet}
          enableTouchDismiss
          openFlex={1}>
          <BottomDialogue
            {...UnitTestProps(
              'pacimanagelines',
              'bottomdialogue',
              'confirmdialogue'
            )}
            message={info?.confirmMsg}
            btnName={t('confirm')}
            designmode={2}
            tryagainClick={() => {
              onTryAgainClick(info?.delete);
            }}
            onClose={closePopup}
          />
        </BottomSheet>

        <CustomDialogue
          {...UnitTestProps(
            'pacimanagelines',
            'customdialogue',
            'viewdialogue'
          )}
          visible={showModal}
          message={popupError}
          onClose={() => setshowModal(false)}
        />
      </View>
    </View>
  );
};

export default PaciManagelines;
const styles = StyleSheet.create({
  loadingContainer: {
    marginTop: heightPixel(100),
    alignContent: 'center',
    alignItems: 'center',
  },
  separator: {
    backgroundColor: colors.SILVER,
    height: 1,
    marginHorizontal: HORIZONTAL_20,
  },
  container: {
    height: HEIGHT_80,
    marginVertical: VERTICAL_HORIZONTAL_8,
    borderRadius: VERTICAL_10,
    flexDirection: 'row',
  },
  textViewContainer: {
    flex: 0.6,
    paddingHorizontal: HORIZONTAL_5,
    justifyContent: 'center',
  },
  imageContainer: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  imageEdit: {
    width: IMG_DIMENSION_30,
    height: IMG_DIMENSION_30,
    marginStart: HORIZONTAL_5,
  },

  textContainer: {
    flexDirection: 'row',
    maxWidth: WIDTH_180,
  },
  subContainer: {
    paddingTop: VERTICAL_27,
    flex: 1,
    paddingHorizontal: tabletMargin(),
  },
  main: {
    flex: 1,
    flexDirection: 'column',
    paddingBottom: VERTICAL_10,
    backgroundColor: colors.WHITE,
  },
  flatlist: {
    paddingBottom: HEIGHT_55,
    marginVertical: HEIGHT_10,
  },
  imageBg: {
    width: widthPixel(36),
    height: widthPixel(36),
    borderRadius: widthPixel(36),
  },

  name: {
    fontFamily: OOREDOO_HEAVY_FONT,
    color: colors.BLACK,
    fontSize: FONT_18,
    lineHeight: FONT_30,
  },
  nickname: {
    fontFamily: NOTOSANS_REGULAR_FONT,
    color: colors.BLACK,
    fontSize: FONT_18,
    lineHeight: FONT_30,
    maxWidth: widthPixel(200),
  },
  msisdn: {
    fontFamily: NOTOSANS_BOLD_FONT,
    color: colors.BLACK,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    textAlign: 'left',
  },
  linetype: {
    color: colors.LIGHT_GREY,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    textAlign: 'left',
  },
  stitle: {
    marginStart: HORIZONTAL_20,
    marginVertical: VERTICAL_5,
    fontFamily: NOTOSANS_REGULAR_FONT,
    color: colors.BLACK,
    fontSize: FONT_22,
    lineHeight: FONT_38,
    textAlign: 'left',
  },
  desc: {
    marginStart: HORIZONTAL_20,
    marginEnd: HORIZONTAL_20,
    color: colors.BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_13,
    lineHeight: FONT_21,
    textAlign: 'left',
  },
  errorText: {
    alignSelf: 'center',
    textAlign: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    color: colors.BLACK,
    fontFamily: NOTOSANS_REGULAR_FONT,
    fontSize: FONT_16,
    lineHeight: FONT_26,
  },
  switchContainer: {
    flex: isTablet ? 0.26 : 0.2,
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginEnd: isTablet ? HORIZONTAL_10 : 0,
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
  btnContainer: {
    paddingHorizontal: HORIZONTAL_20,
    paddingVertical: HORIZONTAL_20,
  },
  addNumberBtnContainer: {
    backgroundColor: colors.OOREDOO_RED,
    borderRadius: BORDER_RADIUS_25,
    height: HEIGHT_40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnBtnText: {
    fontFamily: OOREDOO_HEAVY_FONT,
    fontSize: FONT_12,
    lineHeight: FONT_20,
    color: colors.WHITE,
  },
  loaderContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: VERTICAL_20,
  },
  noData: {
    fontFamily: OOREDOO_REGULAR_FONT,
    fontSize: FONT_18,
    lineHeight: FONT_30,
    color: colors.OOREDOO_BLACK,
  },
});
