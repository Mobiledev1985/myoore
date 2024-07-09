import {
  CHILDMSISDN,
  CUSTOMER_PROFILE,
  DO_NOT_SHOW_FIFA_INSTANT,
  LANGUAGE_CHANGE,
  LOGGEDIN_MSISDN,
  MOBILEID_TIMER_STATUS,
  NMFLOW_TOKEN_ID,
  SELECTED_MSISDN,
} from '../commonHelper/Constants';
import {ClearStore, clearGlobalData} from './CommonUtils';
import {consoleLog, removeItem, setItem} from '../commonHelper/utils';

import ScreenName from '../navigator/ScreenName';
import colors from '../resources/styles/colors';
import {getTokenAndWalkthough} from '../components/splashscreen/actions';
import {
  setCVMPostpaidoffers,
  setLoggedInUser,
  setPostpaidSimHeaderColor,
  setPostpaidSimHeaderTintColor,
  storeOpacitycvm,
  storeScrollingValue,
  getMobileNumberHeader,
} from '../components/home/actions';

export const logoutAPP = (dispatch, reduxState, navigation) => {
  navigation.reset({
    index: 0,
    routes: [{name: ScreenName.LogoutPage}],
  });
};
export const ProcessLogout = (dispatch, reduxState, navigation) => {
  global.notifyredirect = null;
  global.spinwinmessage = null;
  global.hideanapopup = null;
  global.deeplinkurl = null;
  global.iswannauser = false;
  global.wanastage = null;
  global.ipaddress = null;
  global.categoryData = null;
  global.peciTosatmessage = null;
  global.allMobileNumberData = null;
  global.openChatPopup = false;
  global.dashboardData = null;
  global.dashboardResponse = null;
  global.isinternalredirect = 'T';
  global.globalbackgroundcolor = null;
  global.guestuserbgcolor = null;
  global.tokenid = null;
  global.notificationsUnreadCount = null;
  global.userid = null;
  global.UniqueToken = 't' + Date.now() + 'm';
  global.UniqueTokenProfile = 't' + Date.now() + 'm';
  global.apicardsave = true;
  global.Isprimary = null;
  global.welecometext = null;
  global.customerprofile_image = '';
  global.logintype = null;
  global.notificationsCards = null;
  clearGlobalData();
  ClearStore();
  removeItem(SELECTED_MSISDN);
  removeItem(CHILDMSISDN);
  removeItem(CUSTOMER_PROFILE);
  removeItem(LANGUAGE_CHANGE);
  removeItem('selectedMSISDN');
  removeItem(MOBILEID_TIMER_STATUS);
  removeItem('childMSISDN');
  removeItem('customerprofile');
  removeItem(NMFLOW_TOKEN_ID);
  removeItem(LOGGEDIN_MSISDN);
  global.questNojoomDailyEvent = null;
  global.questSmartPayDailyEvent = null;
  global.questAppDailyEvent = null;
  global.defaultpagebackgroundcolor = colors.YELLOW;
  global.startupredirection = null;
  global.requesttime = '';
  global.customerprofile_image = '';
  global.customerprofile = null;
  global.userdetailsTap = null;
  global.rateplantype = null;
  global.setchildmsisdn = '';
  global.setchildmsisdn_encrypt = null;
  global.navigationTabState = null;
  global.isChildNumberAvailable = false;
  global.globalbackgroundcolor = null;
  global.notificationsUnreadCount = null;
  global.ProfileCustomerType = null;
  global.isB2BCPR = null;
  global.dashboardData = null;
  global.requestermsisdn = null;
  global.requesterofferid = null;
  global.productpaymenttype = null;
  global.friendsandfamilypurchase = null;
  global.roamingpop = null;
  global.firbasedeeplinkurl = null;
  global.giftnumber = null;
  global.cvmdataexist = false;
  global.recommendationflagcount = 0;
  global.recommendationYflagcount = null;
  global.themebgcolor = null;
  global.headertintcolor = null;
  global.EnableStatusApiTimer = false;
  global.searchRoamingHome = [];
  global.searchRoamingdealsRoamingHome = [];
  global.smartalertsdata = null;
  global.defaultamount = null;
  global.contactNumber = null;
  global.contactwhatsapp = null;
  global.summaryedittosim = null;

  dispatch({
    type: 'BG_COLOR',
    payload: {bgcolor: colors.OOREDOO_RED, routeName: ScreenName.moreScreen},
  });
  dispatch({type: 'CLEAR_USER_TOKEN'});
  dispatch(setLoggedInUser(false));
  dispatch({type: 'USER_LOGGEDIN', payload: false});
  dispatch({type: DO_NOT_SHOW_FIFA_INSTANT, payload: 'F'});
  dispatch(setPostpaidSimHeaderColor(null));
  dispatch(setPostpaidSimHeaderTintColor(null));
  dispatch(setCVMPostpaidoffers(null));
  dispatch(getMobileNumberHeader(null));

  setTimeout(function () {
    getTokenAndWalkthough(navigation, dispatch, reduxState, 'T').then(
      ({url, type}) => {
        // consoleLog('getTokenAndWalkthough', url);
        // setTimeout(function () {
        navigation.reset({
          index: 0,
          routes: [{name: ScreenName.landingScreen}],
        });
        // }, 1000);
      }
    );
  }, 2000);
};
export const ClearPaciProcessLogout = (dispatch, reduxState, navigation) => {
  ClearStore();
  removeItem(SELECTED_MSISDN);
  removeItem(CHILDMSISDN);
  removeItem(LOGGEDIN_MSISDN);
  removeItem(CUSTOMER_PROFILE);
  removeItem(LANGUAGE_CHANGE);
  removeItem('selectedMSISDN');
  removeItem(MOBILEID_TIMER_STATUS);
  removeItem('childMSISDN');
  removeItem('customerprofile');
  global.Isprimary = null;
  dispatch({
    type: 'BG_COLOR',
    payload: {bgcolor: colors.OOREDOO_RED, routeName: ScreenName.moreScreen},
  });
  dispatch({type: 'CLEAR_USER_TOKEN'});
  dispatch(setLoggedInUser(false));
  dispatch({type: 'USER_LOGGEDIN', payload: false});
  dispatch({type: DO_NOT_SHOW_FIFA_INSTANT, payload: 'F'});
  // dispatch(storeScrollingValue(0));
  // dispatch(storeOpacitycvm(1));
  setTimeout(function () {
    getTokenAndWalkthough(navigation, dispatch, reduxState, 'T').then(
      ({url, type}) => {
        consoleLog('getTokenAndWalkthough', url);
        global.pacinavigation = true;
        setTimeout(() => {
          navigation.navigate(ScreenName.authStack, {
            screen: ScreenName.PaciValidation,
            params: {},
          });
        }, 5000);
      }
    );
  }, 2000);
};
