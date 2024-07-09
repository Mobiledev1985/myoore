import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  FONT_14,
  FONT_22,
  FONT_24,
  HEIGHT_30,
  HEIGHT_40,
  HORIZONTAL_10,
  HORIZONTAL_15,
  HORIZONTAL_20,
  HORIZONTAL_25,
  HORIZONTAL_5,
  VERTICAL_10,
  VERTICAL_15,
  VERTICAL_30,
  WIDTH_30,
  WIDTH_40,
} from '../resources/styles/responsive';
import {
  HeaderBackButton,
  TransitionPresets,
  createStackNavigator,
} from '@react-navigation/stack';
import {
  Alert,
  I18nManager,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import {NavigationContainer, StackActions} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  capatalize,
  consoleLog,
  debounce,
  getItem,
  getSystemLocale,
  setItem,
} from '../commonHelper/utils';
import {
  heightPixel,
  isTablet,
  widthPixel,
} from '../resources/styles/normalizedimension';
import {useDispatch, useSelector} from 'react-redux';

import ActivationFailure from '../pages/transactionstatus/activateFailure';
import AddAddress from '../pages/more/address/AddAddress';
import AddMember from '../pages/linedetails/internettransfer/addMember';
import AddNumber from '../UIComponent/p_managelines/addNumber';
import AddonsCategory from '../pages/addons/AddonsCategory';
import AddonsDetails from '../pages/addons/AddonsDetails';
import AddonsHomeIndex from '../pages/addons/AddonsHomeIndex';
import AddressList from '../pages/more/address/AddressList';
import BillPayRecharge from '../UIComponent/p_pay/BillPayRecharge';
import BottomTabBar from '../commonHelper/BottomTab';
import BundleCategory from '../pages/bundles/BundleCategory';
import BundleDetails from '../pages/bundles/BundleDetails';
import BundlesHomeIndex from '../pages/bundles/BundlesHomeIndex';
import BuyPointHome from '../pages/Fifawc/BuyPointHome';
import ChangeEmail from '../UIComponent/p_changeEmail/changeEmail';
import ChangePassword from '../pages/more/profile/ChangePassword';
import ChatScreen from '../components/ChatScreen/chat';
import ChooseTeam from '../pages/Fifawc/ChooseTeam';
import CivilIDUpdate from '../UIComponent/p_civilid/updatecivildid';
import CivilidVerified from '../UIComponent/p_civilid/civildidVerified';
import Commonscreen from '../pages/CommonLayout';
import CreateAccount from '../components/signup/create_account';
import DeactivateSuccess from '../pages/transactionstatus/deactivateSuccess';
import DigitalCategory from '../pages/digitalservices/DigitalCategory';
import DigitalServices from '../pages/digitalservices';
import DigitalServicesPreview from '../pages/digitalservices/detailedpage';
import EarnPointsPartnerHome from '../pages/nojoom/earnpoints/EarnPointsPartnerHome';
import EditManageline from '../UIComponent/p_managelines/editmanageline';
import ErrorScreen from '../pages/esim/ErrorScreen';
import EsimCivilIdScreen from '../pages/esim/EsimCivilIdScreen';
import EsimConfirm from '../pages/esim/EsimConfirm';
import EsimHome from '../pages/esim/EsimHomeIndex';
import EsimScan from '../pages/esim/EsimScanCode';
import EsimSelectNumber from '../pages/esim/EsimSelectNumber';
import FAQ from '../UIComponent/p_faq/faq';
import Favourite from '../UIComponent/p_favourite/favourite';
import FifaWCIndex from '../pages/Fifawc/FifaWCIndex';
import ForgotPassword from '../components/forgotpassword';
import HomeScreen from '../pages/home';
import HowToVideos from '../UIComponent/p_videos/howtovideos';
import InternetTransfer from '../pages/linedetails/internettransfer/InternetTransfer';
import InternetTransferReview from '../pages/linedetails/internettransfer/InternetTransferReview';
import LandingScreen from '../components/landingscreen';
import Linedetails from '../pages/linedetails/Linedetails';
import LinkNumber from '../pages/nonumber/linkedNumber';
import LoadBalanceHome from '../pages/pay/xpressProfit/LoadBalanceHome';
import Login from '../components/login';
import LoginOTP from '../components/login/LoginOTP';
import LoginAuthOTP from '../components/login/LoginAuthOTP';
import LoginPassword from '../components/login/LoginPassword';
import LogoutComponent from '../UIComponent/p_more/LogoutComponent';
import LogsComponent from '../pages/showlogs/LogsComponent';
import ManageCardHome from '../pages/managecards/ManageCardHome';
import ManageLines from '../UIComponent/p_managelines/managelines';
import ManageMember from '../pages/linedetails/internettransfer/ManageMember';
import MoreAccounts from '../pages/more/MoreAccounts';
import MoreGuestHome from '../pages/more/guest/MoreGuestHome';
import MoreHome from '../pages/more/MoreHome';
import MyCountryDetail from '../pages/roaming/mycountry/MyCountryDetail';
import MyCountryIndex from '../pages/roaming/mycountry/MyCountriesHomeIndex';
import MyCountryPaymentView from '../pages/roaming/mycountry/MyCountryPaymentView';
import NewPassword from '../components/forgotpassword/newpassword';
import NoJoomDashboardDetails from '../pages/nojoom/details/NoJoomDashboardDetails';
import NoJoomOoredooRewardCategory from '../pages/nojoom/ooredoorewards/NojoomOooredooRewardCat';
import NoJoomPartnerCategory from '../pages/nojoom/partnerrewards/NoJoomPartnerCategory';
import NoJoomPartnerDetails from '../pages/nojoom/partnerrewards/NoJoomPartnerDetails';
import NoJoomTransferPoints from '../UIComponent/nojoom/NoJoomTransferPoints';
import NoNumberIndex from '../pages/nonumber/noNumberIndex';
import NojoomB2CError from '../UIComponent/nojoom/NojoomB2CError';
import NojoomBuyPoints from '../pages/nojoom/buypoints/BuyPoints';
import NojoomDonatepoints from '../pages/nojoom/transferpoints/NojoomDonatepoints';
import NojoomEarnPartnerDetails from '../pages/nojoom/earnpoints/NojoomEarnPartnerDetails';
import NojoomHome from '../pages/nojoom/home/index';
import NojoomLinkedNumbers from '../pages/nojoom/nojoomlinkednumbers/NojoomLinkedNumbers';
import NojoomOoredooRewardsHome from '../pages/nojoom/ooredoorewards';
import NojoomPartnerRewardsHome from '../pages/nojoom/partnerrewards';
import NojoomTransferPointsHome from '../pages/nojoom/transferpoints/NojoomTransferPointsHome';
import NotificationScreen from '../UIComponent/p_notification/notification';
import Notifylinking from './NavigationLinking';
import OAssist from '../pages/oassist/list';
import {OOREDOO_HEAVY_FONT} from '../resources/styles/fonts';
import OTPScreen from '../components/signup/otpsignup';
import Offlinecomponent from '../components/splashscreen/Offlinecomponent';
import OoredooPassportListIndex from '../pages/roaming/OoredooPassportListIndex';
import OoredooServiceBundleDetail from '../pages/nojoom/ooredooservicesbundles/OoredooServiceBundleDetails';
import OoredooSurprise from '../pages/ooredoosurprise/OoredooSurprise';
import PassportCountriesIndex from '../pages/roaming/PassportCountriesIndex';
import PassportMultiCountryIndex from './../pages/roaming/PassportMultiCountryIndex';
import PayGuestHome from '../pages/pay/guest/PayGuestHome';
import PayHome from '../pages/pay/PayHome';
import PayViaVoucher from '../pages/pay/PayViaVoucher';
import PaymentScreen from '../UIComponent/payment';
import PaymentView from '../pages/diy/PaymentView';
import PaymentViewDetailsScreen from '../UIComponent/PaymentViewDetailsScreen';
import PointsHistory from '../pages/nojoom/home/PointsHistory';
import ProfileChangeEmail from '../pages/more/profile/ProfileChangeEmail';
import PushNotification from 'react-native-push-notification';
import PushNotificationLink from '../components/landingscreen/PushNotificationLink';
import RequestCredit from '../UIComponent/p_pay/RequestCredit';
import Requeststatus from '../UIComponent/p_requeststatus/Requeststatus';
import RewardsElementList from '../pages/nojoom/ooredoorewards/RewardsElementList';
import RoamingDealsListIndex from '../pages/roaming/RoamingDealsListIndex';
import RoamingDetails from '../pages/roaming/RoamingDetails';
import RoamingHomeIndex from '../pages/roaming/RoamingHomeIndex';
import RoamingIntlDetailIndex from '../pages/roaming/RoamingIntlRatesDetailIndex';
import RoamingIntlRatesIndex from '../pages/roaming/RoamingIntlRatesIndex';
import RunningInternetDetails from '../pages/runninginternet/RunningInternetDetails';
import {SELECTED_LANG} from '../commonHelper/Constants';
import ScreenName from './ScreenName';
import Settings from '../pages/settings/settings';
import ShamelproDetail from '../UIComponent/p_shamelpro/ShamelproDetail';
import ShopGuestHomeIndex from '../pages/shop/home/ShopGuestHomeIndex';
import ShopHomeIndex from '../pages/shop/home/ShopHomeIndex';
import Signup from '../components/signup';
import SmartPayManage from '../UIComponent/p_pay/SmartPayManage';
import SmartPayPage from '../UIComponent/p_pay/SmartPayPage';
import SmartPaySettings from '../UIComponent/p_pay/smartpay/SmartPaySettings';
import SmartPayManageRenewal from '../UIComponent/p_pay/smartpay/SmartPayManageRenewal';
import SmartPayEditCard from '../UIComponent/p_pay/SmartPayEditCard';
import SocialSignup from '../components/signup/social';
import SpecialDealsDetails from '../pages/specaildeals/SpecailDealsDetails';
import SpecialDealsProductDetail from '../pages/specaildeals/SpecialDealsProductDetail';
import SpinwinStatusIndex from '../pages/spinwinstatus/SpinwinStatusIndex';
import Spinwinpopup from '../pages/transactionstatus//Spinwinpopup';
import SplashScreen from '../components/splashscreen/indexnew';
import SuccessScreen from '../pages/esim/EsimStatus/SuccessScreen';
import TTFollowup from '../UIComponent/p_requeststatus/TTFollowup';
import TransStatus from '../pages/transactionstatus/transstatus';
import TransferBalanceHome from '../pages/pay/xpressProfit/TransferBalanceHome';
import TransferCredit from '../pages/pay/transfercredit/TransferCredit';
import TransferCreditInternationalCountry from '../pages/pay/transfercredit/TransferCreditInternationalCountry';
import TransferCreditReview from '../pages/pay/transfercredit/TransferCreditReview';
import TransferToPartners from '../pages/nojoom/transfertopartners/TransferToPartners';
import {UPDATE_NOTICATIONS_STATUS} from '../resources/route/endpoints';
import UpdateApp from '../components/splashscreen/UpdateApp';
import UpdateProfile from '../pages/more/profile/UpdateProfile';
import Upsell5gDetails from '../pages/upsell5g/Upsell5gDetails';
import Upsell5gHome from '../pages/upsell5g/Upsell5gHome';
import ViewBill from '../pages/viewbill/ViewBill';
import WalkthroughScreen from '../components/walkthrough';
import Webviewfile from '../pages/viewbill/webviewfile';
import XpressProfitHome from '../pages/pay/xpressProfit/XpressProfitHome';
import XpressProfitReview from '../pages/pay/xpressProfit/XpressProfitReview';
import {callQueryapi} from '../commonHelper/middleware/callapi';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {defaultlayout} from '../services/CommonUtils';
import diy from '../pages/diy/diy';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import i18n from '../components/languageselector/i18next';
import messaging from '@react-native-firebase/messaging';
import {setSelectedLangugage} from '../components/walkthrough/actions';
import tnc from '../components/signup/tnc';
import {useMutation} from 'react-query';
import {useNotificationApi} from '../commonHelper/notificationapi';
import {useTranslation} from 'react-i18next';
import webview from '../UIComponent/p_webview/webview';
import webviewPage from '../pages/WebView/webview';
import FifaLeaderboard from '../pages/fifa/fifaleaderboard';
import {UserProvider} from '../services/context/userProvider';
import BottomAuthenticationPopup from '../commonHelper/BottomAuthenticationPopup';
import cvmoffersList from '../pages/specaildeals/cvmoffersList';
import SmartPayAutoNumbers from '../UIComponent/p_pay/SmartPayAutoNumbers';
import SmartPayEditNumbers from '../UIComponent/p_pay/SmartPayEditNumbers';
import RNRestart from 'react-native-restart';
import PaciValidation from '../components/login/PaciValidation';
import PaciManagelines from '../components/login/PaciManagelines';
import RecentPurchases from '../UIComponent/p_home/RecentPurchases';
import TransactionHomeIndex from '../pages/TransactionNew/TransactionHomeIndex';
import TransactionDetails from '../pages/TransactionNew/TransactionDetails';
import TransactionHome from '../pages/TransactionNew/TransactionHome';
import TransactionsCategory from '../pages/TransactionNew/TransactionsCategory';
import TransactionElements from '../pages/TransactionNew/TransactionElements';
import ProductQrScan from '../pages/esim/ProductQrScan';
import FriendsProductDetails from '../pages/friends/FriendsProductDetails';
import Gamification from '../UIComponent/p_home/Quest/Gamification';
import QuestAnimation from '../UIComponent/p_home/Quest/QuestAnimation';
import GamificationProductDetails from '../UIComponent/p_home/Quest/GamificationProductDetails';
import NojoomPersonalisedProdutDetails from '../pages/nojoom/personalizedforyou/NojoomPersonalisedProductDetailes';
import SmartPayEnrollPaymentPage from '../UIComponent/p_pay/smartpay/SmartPayEnrollPaymentPage';
import SmartPayNumbersList from '../UIComponent/p_pay/smartpay/SmartPayNumbersList';
import PromotionsCard from '../pages/Promotions/PromotionsCard';
import PromotionsHomeIndex from '../pages/Promotions/PromotionsHomeIndex';
import SwitchManageLineSheet from '../models/basic/SwitchManageLineSheet';
import ViewPacks from '../pages/roaming/ViewPacks';
import NewLinedetails from '../pages/linedetails/NewLinedetails';
import RoamingChanges from '../pages/roaming/mycountry/RoamingChanges';
import EshopPlanHomeIndex from '../pages/shop/home/EshopPlanHomeIndex';
import UpdatedShop from '../pages/shop/home/UpdatedShop';
import RoamingCountries from '../pages/roaming/RoamingCountries';
import SupportedCountry from '../models/templates/SupportedCountry';
import NotSupportedCountry from '../models/templates/NotSupportedCountry';
import Support from '../UIComponent/ooredooassistancenewdesign/pages/Support';
import SupportHelpArticalLevelOne from '../UIComponent/ooredooassistancenewdesign/pages/SupportHelpArticalLevelOne';
import SupportNeedHelpLevelOne from '../UIComponent/ooredooassistancenewdesign/pages/SupportNeedHelpLevelOne';
import SupportHelpArticlesLevelTwo from '../UIComponent/ooredooassistancenewdesign/pages/SupportHelpArticlesLevelTwo';
import SupportNeedHelpLevelTwo from '../UIComponent/ooredooassistancenewdesign/pages/SupportNeedHelpLevelTwo';
import SupportPayments from '../UIComponent/ooredooassistancenewdesign/pages/SupportPayments';
import TrackComplaints from '../UIComponent/ooredooassistancenewdesign/pages/TrackComplaints';
import SupportOoredooPediaViewall from '../UIComponent/ooredooassistancenewdesign/components/SupportOoredooPediaViewall';
import MoreHomeNew from '../pages/more/MoreHomeNew';
import ProfileInfoNew from '../pages/more/profile/ProfileInfoNew';
import EmailOtpVerify from '../pages/more/profile/EmailOtpVerify';
import MyAccount from '../pages/more/account/MyAccount';
import MyPayment from '../pages/more/payment/MyPayment';
import AccountDeletionForm from '../pages/more/account/AccountDeletionForm';
import PasswordManagement from '../pages/more/passwordManagement';
import MoreGuestHomeNew from '../pages/more/guest/MoreGuestHomeNew';
import ManageCardNewHome from '../pages/more/managecards/ManageCardNewHome';
import MyHistory from '../pages/more/history/MyHistory';
import HistoryDetails from '../pages/more/history/HistoryDetails';
import SupportHome from '../UIComponent/ooredooassistancenewdesign/pages/SupportHome';
import OrderNewSim from '../pages/shopOnApp/OrderNewSim';
import OrderVerification from '../pages/shopOnApp/OrderVerification';
import SupportSubOoredooPediaItem from '../UIComponent/ooredooassistancenewdesign/components/SupportSubOoredooPediaItem';
import TermsAndConditions from '../pages/more/termsAndConditions';
import ShopCart from '../pages/shopOnApp/ShopCart';
import NewSimSelectNumberComponent from '../pages/shopOnApp/NewSimSelectNumberComponent';
import LandingPage from '../pages/shopOnApp/LandingPage';
import PaymentPage from '../pages/shopOnApp/ShopPaymentPage';
import TrackOrders from '../pages/shopOnApp/TrackOrders';
import ConfirmationPage from '../pages/shopOnApp/ConfirmationPage';
import EditAddress from '../pages/shopOnApp/EditAddress';
import TrackOrderGuest from '../pages/shopOnApp/TrackOrderGuest';
// import PersonalisedPopUpScratchCard from '../pages/nojoom/personalizedforyou/PersonalisedPopUpScratchCard';
const key_viewednotifications = `${global.UniqueToken}_VIEWED_NOTIFICATION`;

const styles = StyleSheet.create({
  arrow: {
    width: WIDTH_30,
    height: HEIGHT_40,
    // paddingTop: VERTICAL_10,
    // marginLeft: HORIZONTAL_10,
    marginBottom: HORIZONTAL_25,
    // width: widthPixel(50), height: heightPixel(30),
    // marginTop:isTablet? VERTICAL_30:VERTICAL_15,
    // heightPixel(2),
    // left:HORIZONTAL_10
    // marginRight:isTablet? HORIZONTAL_5:-widthPixel(0.478),
    marginLeft: isTablet ? HORIZONTAL_5 : HORIZONTAL_10,

    transform: [{rotateZ: I18nManager.isRTL ? '180deg' : '0deg'}],
  },
  headerStyle: {
    fontSize: FONT_14,
    lineHeight: FONT_24,
    fontFamily: OOREDOO_HEAVY_FONT,
    marginBottom: HORIZONTAL_25,
    height: heightPixel(30),
    top: heightPixel(5),
  },
  rightImage: {
    // width: WIDTH_30,
    // height: HEIGHT_30,

    height: HEIGHT_30,
    width: WIDTH_30,
    // top: heightPixel(2),
    // left: -widthPixel(0.478),
    marginBottom: HORIZONTAL_25,
    // width: widthPixel(50), height: heightPixel(30),
    // marginTop:isTablet? VERTICAL_30:VERTICAL_15,
    // heightPixel(2),
    // left:HORIZONTAL_10
    marginRight: isTablet ? HORIZONTAL_5 : HORIZONTAL_10,
    // -widthPixel(0.478),

    // backgroundColor:'blue'
  },
});

function ActionBarIcon(props) {
  return (
    <TouchableHighlight
      underlayColor={'transparent'}
      onPress={() => {
        global.assistParentID = 0;
        props.navigate(ScreenName.SupportHome);
      }}>
      <Image
        source={
          I18nManager.isRTL
            ? require('../assets/assist_icon_ar.png')
            : require('../assets/assist_icon.png')
        }
        style={styles.rightImage}
        resizeMode={'contain'}
      />
    </TouchableHighlight>
  );
}

function BackBarIcon(props) {
  const debounceOnChange = React.useCallback(
    debounce(() => {
      props.goBack();
    }, 400),
    []
  );

  return (
    <TouchableOpacity onPress={debounceOnChange}>
      <Image source={require('../assets/backicon.png')} style={styles.arrow} />
    </TouchableOpacity>
  );
}

const RootStack = createStackNavigator();

const AuthStack = createStackNavigator();

const customTransition = {
  gestureDirection: 'horizontal',
  cardStyleInterpolator: ({current, next, layouts}) => {
    const translateX = current.progress.interpolate({
      inputRange: [0, 1],
      outputRange: [
        I18nManager.isRTL ? -layouts.screen.width : layouts.screen.width,
        0,
      ],
    });

    return {
      cardStyle: {
        transform: [{translateX}],
      },
    };
  },
};

const AuthNavigator = () => {
  const {t} = useTranslation();
  const HeaderHeight = isTablet
    ? {
        height: heightPixel(65),
      }
    : {};
  return (
    <AuthStack.Navigator
      screenOptions={({navigation}) => ({
        gestureEnabled: false,
        headerTitleStyle: styles.headerStyle,
        headerTitleAlign: 'center',
        headerLeftContainerStyle: {
          marginLeft: APPLY_TABLET_OR_DEVICE_MARGIN,
          //  marginBottom:HORIZONTAL_25,
        },
        headerRightContainerStyle: {marginRight: APPLY_TABLET_OR_DEVICE_MARGIN},
        headerStyle: HeaderHeight,
        headerRight: props => <ActionBarIcon {...props} {...navigation} />,
        headerLeft: props => <BackBarIcon {...props} {...navigation} />,
      })}>
      <AuthStack.Screen
        name={ScreenName.signupScreen}
        component={Signup}
        options={{
          title: capatalize(t('signup')),
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.landingScreen}
        component={LandingScreen}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={ScreenName.socialSignupScreen}
        component={SocialSignup}
        options={{title: t('ca'), headerTitleAlign: 'center'}}
      />

      <AuthStack.Screen
        name={ScreenName.createAccount}
        component={CreateAccount}
        options={{title: t('suwe'), headerTitleAlign: 'center'}}
      />
      <AuthStack.Screen
        name={ScreenName.SignupOtpScreen}
        component={OTPScreen}
        options={{title: capatalize(t('otp')), headerTitleAlign: 'center'}}
      />
      <AuthStack.Screen
        name={ScreenName.loginScreen}
        component={Login}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={ScreenName.linkaccount}
        component={Login}
        options={{headerShown: false}}
      />
      <AuthStack.Screen
        name={ScreenName.termsCondScreen}
        component={tnc}
        options={{title: capatalize(t('tnc')), headerTitleAlign: 'center'}}
      />
      <AuthStack.Screen
        name={ScreenName.Chat}
        component={ChatScreen}
        options={({navigation}) => ({
          title: t('onlineChat'),
          headerTitleAlign: 'center',
          headerRight: props => null,
          headerLeft: props => (
            <HeaderBackButton
              onPress={() => {
                if (!navigation.canGoBack() && !global.logintype) {
                  navigation.dispatch(
                    StackActions.replace(ScreenName.landingScreen)
                  );
                } else {
                  navigation.goBack();
                }
              }}
            />
          ),
        })}
      />

      <AuthStack.Screen
        name={ScreenName.OAssist}
        component={OAssist}
        options={{
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name={ScreenName.TrackOrder}
        component={TrackOrders}
        options={{
          tabBarVisible: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.TrackOrderGuest}
        component={TrackOrderGuest}
        options={{
          tabBarVisible: false,
        }}
      />

      <AuthStack.Screen
        name={ScreenName.loginOTPScreen}
        component={LoginOTP}
        options={{
          title: t('login'),
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.loginAuthOTPScreen}
        component={LoginAuthOTP}
        options={{
          title: t('login'),
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.loginPasswordScreen}
        component={LoginPassword}
        options={{
          title: t('login'),
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name={ScreenName.forgotPasswordScreen}
        component={ForgotPassword}
        options={{
          title: capatalize(t('otp')),
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />

      <AuthStack.Screen
        name={ScreenName.newPasswordScreen}
        component={NewPassword}
        options={{
          title: t('newPassword'),
          headerTitleAlign: 'center',
          headerShown: true,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.MoreGuestHome}
        component={MoreGuestHome}
        options={{
          title: t('More'),
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.MoreGuestHomeNew}
        component={MoreGuestHomeNew}
        options={{
          title: t('More'),
          headerTitleAlign: 'center',
          headerShown: false,
        }}
      />

      <AuthStack.Screen
        name={ScreenName.NoNumbExist}
        component={NoNumberIndex}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.PaciValidation}
        component={PaciValidation}
        options={{headerShown: false}}
      />

      <AuthStack.Screen
        name={ScreenName.PaciManagelines}
        component={PaciManagelines}
        options={{
          headerShown: false,
        }}
      />
      <AuthStack.Screen
        name={ScreenName.SupportHome}
        component={SupportHome}
        options={{headerShown: false}}
      />

      <AuthStack.Screen
        name={ScreenName.Linknumber}
        component={LinkNumber}
        options={{
          headerShown: false,
        }}
      />
    </AuthStack.Navigator>
  );
};

const MoreNavigator = createStackNavigator();
const NoJoomNavigator = createStackNavigator();
const PayNavigator = createStackNavigator();
const ShopNavigator = createStackNavigator();
const HomeNavigator = createStackNavigator();
const TabNavigator = createBottomTabNavigator();
const TabStack = () => {
  const {t} = useTranslation();
  return (
    <TabNavigator.Navigator
      path="tab"
      tabBar={props => (
        <BottomTabBar
          {...props}
          state={{...props.state, routes: props.state.routes.slice(0, 5)}}
        />
      )}>
      <TabNavigator.Screen
        name={ScreenName.homeStack}
        path="home"
        component={HomeStack}
        options={{
          tabBarLabel: t('home'),
          tabBarIcon: 'home-outline',
          headerShown: false,
        }}
      />
      <TabNavigator.Screen
        name={ScreenName.PayStack}
        component={PayStack}
        options={{
          tabBarLabel: t('pay'),
          tabBarIcon: 'wallet',
          headerShown: false,
        }}
      />
      <TabNavigator.Screen
        name={ScreenName.ShopStack}
        component={ShopStack}
        options={{
          tabBarLabel: t('shop'),
          tabBarIcon: 'bag',
          headerShown: false,
        }}
      />
      <TabNavigator.Screen
        name={ScreenName.NojoomStack}
        component={NoJoomStack}
        options={{
          tabBarLabel: t('nojoom'),
          tabBarIcon: 'star',
          headerShown: false,
        }}
      />
      <TabNavigator.Screen
        name={ScreenName.MoreStack}
        component={MoreStack}
        options={{
          tabBarLabel: t('more'),
          tabBarIcon: 'list',
          headerShown: false,
        }}
      />
      {/* <TabNavigator.Screen
        name={ScreenName.requeststatusScreen}
        component={Requeststatus}
      /> */}
    </TabNavigator.Navigator>
  );
};
const HomeStack = () => {
  return (
    <UserProvider>
      <HomeNavigator.Navigator
        screenOptions={{
          headerShown: false,
          // gestureEnabled: false,
          // animationEnabled: false,
          cardStyle: {backgroundColor: 'transparent'},
          // transitionSpec: {
          //   open: {
          //     animation: 'timing',
          //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
          //   },
          //   close: {
          //     animation: 'timing',
          //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
          //   },
          // },
          // cardStyleInterpolator: ({
          //   index,
          //   current,
          //   next,
          //   layouts: {screen},
          // }) => {
          //   const translateX = current.progress.interpolate({
          //     inputRange: [index - 1, index, index + 1],
          //     outputRange: [screen.width, 0, 0],
          //   });

          //   const opacity = next?.progress.interpolate({
          //     inputRange: [0, 1, 2],
          //     outputRange: [1, 0, 0],
          //   });

          //   return {cardStyle: {opacity, transform: [{translateX}]}};
          // },
          ...Platform.select({
            ios: {
              // Use SlideFromRightIOS for iOS
              ...TransitionPresets.SlideFromRightIOS,
            },
            android: {
              // Customize transition for Android
              cardStyleInterpolator: ({current, next, layouts}) => {
                const translateX = current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [
                    I18nManager.isRTL
                      ? -layouts.screen.width
                      : layouts.screen.width,
                    0,
                  ],
                });
                return {cardStyle: {transform: [{translateX}]}};
              },
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {duration: 500},
                },
                close: {
                  animation: 'timing',
                  config: {duration: 500},
                },
              },
            },
          }),
        }}
        // options={{
        //   ...TransitionPresets.SlideFromRightIOS,
        // }}
        initialRouteName={ScreenName.homeScreen}>
        <HomeNavigator.Screen
          name={ScreenName.homeScreen}
          component={HomeScreen}
        />
        <HomeNavigator.Screen
          name={ScreenName.CivilIDUpdate}
          component={CivilIDUpdate}
        />
        <HomeNavigator.Screen
          name={ScreenName.CivilidVerified}
          component={CivilidVerified}
        />
        <HomeNavigator.Screen
          name={ScreenName.TransactionHomeIndex}
          component={TransactionHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.TransactionElements}
          component={TransactionElements}
        />
        <HomeNavigator.Screen
          name={ScreenName.RecentPurchases}
          component={RecentPurchases}
        />

        <HomeNavigator.Screen
          name={ScreenName.DigitalServiceHome}
          component={DigitalServices}
        />
        <HomeNavigator.Screen
          name={ScreenName.digitalservice}
          component={DigitalServices}
        />
        <HomeNavigator.Screen
          name={ScreenName.Digialserviceviewall}
          component={DigitalServices}
        />
        <HomeNavigator.Screen
          name={ScreenName.otherservices}
          component={DigitalServices}
        />
        <HomeNavigator.Screen
          name={ScreenName.digitalservices}
          component={DigitalServices}
        />
        <HomeNavigator.Screen
          name={ScreenName.DigitalCategory}
          component={DigitalCategory}
        />
        <HomeNavigator.Screen
          name={ScreenName.DigSerPrev}
          component={DigitalServicesPreview}
        />
        <HomeNavigator.Screen
          name={ScreenName.BundlesHome}
          component={BundlesHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.TransactionHome}
          component={TransactionHome}
        />
        <HomeNavigator.Screen
          name={ScreenName.BundlesHomeViewall}
          component={BundlesHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.Bundlesnaddons}
          component={BundlesHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.BundleCategory}
          component={BundleCategory}
        />
        <HomeNavigator.Screen
          name={ScreenName.BundleDetails}
          component={BundleDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.FriendsProductDetails}
          component={FriendsProductDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.TransactionsCategory}
          component={TransactionsCategory}
        />
        <HomeNavigator.Screen
          name={ScreenName.TransactionDetails}
          component={TransactionDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.runningoutInternet}
          component={RunningInternetDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.SpinwinHome}
          component={SpinwinStatusIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.Spinwinpopup}
          component={Spinwinpopup}
        />
        <HomeNavigator.Screen
          name={ScreenName.FIFAWCHome}
          component={FifaWCIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.AddonsHome}
          component={AddonsHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.addonsviewall}
          component={AddonsHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.addons}
          component={AddonsHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.AddonsCategory}
          component={AddonsCategory}
        />
        <HomeNavigator.Screen
          name={ScreenName.AddonsDetails}
          component={AddonsDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.PromotionsCard}
          component={PromotionsCard}
        />
        <HomeNavigator.Screen
          name={ScreenName.PromotionsHomeIndex}
          component={PromotionsHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.SpecialDealsDetailsScreen}
          component={SpecialDealsDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.cvmoffersList}
          component={cvmoffersList}
        />
        <HomeNavigator.Screen
          name={ScreenName.SpecialDealsProductDetail}
          component={SpecialDealsProductDetail}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingHome}
          component={RoamingHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roamingviewall}
          component={RoamingHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roaming}
          component={RoamingHomeIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayManageRenewal}
          component={SmartPayManageRenewal}
        />
        <HomeNavigator.Screen
          name={ScreenName.ViewPacks}
          component={ViewPacks}
          options={{
            // title: t('roaming'),
            // headerTitleAlign: 'center',
            headerShown: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingCountries}
          component={RoamingCountries}
          options={{
            // title: t('roaming'),
            // headerTitleAlign: 'center',
            headerShown: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportedCountryScreen}
          component={SupportedCountry}
        />
        <HomeNavigator.Screen
          name={ScreenName.NotSupportedCountryScreen}
          component={NotSupportedCountry}
        />
        <HomeNavigator.Screen
          name={ScreenName.notificationSceen}
          component={NotificationScreen}
        />
        <HomeNavigator.Screen
          name={ScreenName.PassportCountries}
          component={PassportCountriesIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.MyCountry}
          component={MyCountryIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.mycountryviewall}
          component={MyCountryIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.mycountrylist}
          component={MyCountryIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.MyCountryDetail}
          component={MyCountryDetail}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingChanges}
          component={RoamingChanges}
        />
        <HomeNavigator.Screen
          name={ScreenName.MyCountryPaymentView}
          component={MyCountryPaymentView}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingDealsList}
          component={RoamingDealsListIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roamingdealsviewallList}
          component={RoamingDealsListIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.OoredooPassportHome}
          component={OoredooPassportListIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roamingpassportviewall}
          component={OoredooPassportListIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.ooredooPassport}
          component={OoredooPassportListIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingIntl}
          component={RoamingIntlRatesIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roamingrates}
          component={RoamingIntlRatesIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.roamingratesList}
          component={RoamingIntlRatesIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingIntlDetails}
          component={RoamingIntlDetailIndex}
        />
        <HomeNavigator.Screen
          name={ScreenName.ShamelproDetail}
          component={ShamelproDetail}
        />
        <HomeNavigator.Screen
          name={ScreenName.lineDetailsScreen}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.NewLinedetailsScreen}
          component={NewLinedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.Gamification}
          component={Gamification}
        />
        <HomeNavigator.Screen
          name={ScreenName.GamificationProductDetails}
          component={GamificationProductDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.QuestAnimation}
          component={QuestAnimation}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.mysubscriptions}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.currentpacks}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.activepacks}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.managepacks}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.internettransfer}
          component={InternetTransfer}
        />
        <HomeNavigator.Screen
          name={ScreenName.manage}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.myplans}
          component={Linedetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.CommonScreen}
          component={Commonscreen}
        />
        <HomeNavigator.Screen
          name={ScreenName.ManageLines}
          component={ManageLines}
          options={{
            ...TransitionPresets.ModalTransition,
            gestureDirection: 'vertical-inverted',
          }}
        />
        <RootStack.Screen name={ScreenName.AddNumber} component={AddNumber} />
        <HomeNavigator.Screen
          name={ScreenName.LogsView}
          component={LogsComponent}
        />
        <HomeNavigator.Screen
          name={ScreenName.RoamingDetails}
          component={RoamingDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.webviewScreen}
          component={webviewPage}
        />
        <HomeNavigator.Screen
          name={ScreenName.OoredooSurpriseScreen}
          component={OoredooSurprise}
        />
        <HomeNavigator.Screen name={ScreenName.DIYScreen} component={diy} />
        <HomeNavigator.Screen
          name={ScreenName.favouriteScreen}
          component={Favourite}
        />
        <HomeNavigator.Screen
          name={ScreenName.PassportMultiCountry}
          component={PassportMultiCountryIndex}
          options={{
            header: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.OoredooSurpriseScreenLink}
          component={OoredooSurprise}
        />
        <HomeNavigator.Screen
          name={ScreenName.Specialoffers}
          component={OoredooSurprise}
        />
        <HomeNavigator.Screen
          name={ScreenName.Specialdeals}
          component={SpecialDealsDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.specialdeal}
          component={SpecialDealsDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.Nojoompartnerrewardscategory}
          component={NoJoomPartnerCategory}
        />
        <HomeNavigator.Screen
          name={ScreenName.NojoomPartnerRewardsDetails}
          component={NoJoomPartnerDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.NojoomDashboardDetails}
          component={NoJoomDashboardDetails}
        />
        <HomeNavigator.Screen
          name={ScreenName.NojoomPersonalisedProdutDetails}
          component={NojoomPersonalisedProdutDetails}
        />

        {/* <HomeNavigator.Screen
          name={ScreenName.PersonalisedPopUpScratchCard}
          component={PersonalisedPopUpScratchCard}
        /> */}
        <HomeNavigator.Screen
          name={ScreenName.UpdateProfile}
          component={UpdateProfile}
        />
        <HomeNavigator.Screen name={ScreenName.OAssist} component={OAssist} />

        <HomeNavigator.Screen
          name={ScreenName.SupportHome}
          component={SupportHome}
        />

        <HomeNavigator.Screen
          name={ScreenName.SupportScreen}
          component={Support}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportHelpArticalLevelOne}
          component={SupportHelpArticalLevelOne}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportSubOoredooPediaItem}
          component={SupportSubOoredooPediaItem}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportNeedHelpLevelOne}
          component={SupportNeedHelpLevelOne}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportHelpArticlesLevelTwo}
          component={SupportHelpArticlesLevelTwo}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportNeedHelpLevelTwo}
          component={SupportNeedHelpLevelTwo}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportPayments}
          component={SupportPayments}
        />
        <HomeNavigator.Screen
          name={ScreenName.TrackComplaints}
          component={TrackComplaints}
        />
        <HomeNavigator.Screen
          name={ScreenName.SupportOoredooPediaViewall}
          component={SupportOoredooPediaViewall}
        />

        <HomeNavigator.Screen
          name={ScreenName.onlinechat}
          component={OAssist}
        />
        <HomeNavigator.Screen
          name={ScreenName.helpsupport}
          component={OAssist}
        />
        <HomeNavigator.Screen
          name={ScreenName.requeststatusScreen}
          component={Requeststatus}
        />
        <HomeNavigator.Screen
          name={ScreenName.DeactivateSuccess}
          component={DeactivateSuccess}
        />
        <HomeNavigator.Screen
          name={ScreenName.TTFollowup}
          component={TTFollowup}
        />
        <HomeNavigator.Screen
          name={ScreenName.PaymentScreen}
          component={PaymentScreen}
        />
        <HomeNavigator.Screen name={ScreenName.ViewBill} component={ViewBill} />
        <HomeNavigator.Screen
          name={ScreenName.WebViewFile}
          component={Webviewfile}
        />
        <HomeNavigator.Screen
          name={ScreenName.BillpayRecharge}
          component={BillPayRecharge}
        />
        <HomeNavigator.Screen
          name={ScreenName.recharge}
          component={BillPayRecharge}
        />
        <HomeNavigator.Screen
          name={ScreenName.payment}
          component={BillPayRecharge}
        />
        <HomeNavigator.Screen
          name={ScreenName.paybill}
          component={BillPayRecharge}
        />
        <HomeNavigator.Screen
          name={ScreenName.InternetTransfer}
          component={InternetTransfer}
        />
        <HomeNavigator.Screen
          name={ScreenName.AddMember}
          component={AddMember}
        />
        <HomeNavigator.Screen
          name={ScreenName.internettransferaddmember}
          component={InternetTransfer}
        />
        <HomeNavigator.Screen
          name={ScreenName.ManageMember}
          component={ManageMember}
        />
        <HomeNavigator.Screen
          name={ScreenName.InternetTransferReview}
          component={InternetTransferReview}
        />
        {/* <HomeNavigator.Screen
        name={ScreenName.TransferCredit}
        component={TransferCredit}
      /> */}
        <HomeNavigator.Screen
          name={ScreenName.PayViaVoucher}
          component={PayViaVoucher}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.Upsell5gHome}
          component={Upsell5gHome}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.Upsell5gDetails}
          component={Upsell5gDetails}
        />
        <HomeNavigator.Screen name={ScreenName.webview} component={webview} />
        <HomeNavigator.Screen name={ScreenName.FAQ} component={FAQ} />
        <HomeNavigator.Screen
          name={ScreenName.FifaLeaderboard}
          component={FifaLeaderboard}
        />
        <HomeNavigator.Screen
          name={ScreenName.ChooseTeam}
          component={ChooseTeam}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPaySettings}
          component={SmartPaySettings}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayDetail}
          component={SmartPayPage}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayNumbersList}
          component={SmartPayNumbersList}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayManage}
          component={SmartPayManage}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayEnrollPayment}
          component={SmartPayEnrollPaymentPage}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayEditCard}
          component={SmartPayEditCard}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayAutoNumbers}
          component={SmartPayAutoNumbers}
        />
        <HomeNavigator.Screen
          name={ScreenName.SmartPayEditNumbers}
          component={SmartPayEditNumbers}
        />
        <HomeNavigator.Screen
          name={ScreenName.BuyMorePoint}
          component={BuyPointHome}
          options={{
            tabBarVisible: false,
          }}
        />
        <HomeNavigator.Screen
          name={ScreenName.ProductQrScan}
          component={ProductQrScan}
        />
        <HomeNavigator.Screen
          name={ScreenName.EmailOtpVerify}
          component={EmailOtpVerify}
        />
        <HomeNavigator.Screen
          name={ScreenName.MyHistory}
          component={MyHistory}
        />
        <HomeNavigator.Screen
          name={ScreenName.HistoryDetails}
          component={HistoryDetails}
        />
      </HomeNavigator.Navigator>
    </UserProvider>
  );
};

const PayStack = () => {
  return (
    <PayNavigator.Navigator
      screenOptions={{
        headerShown: false,
        // gestureEnabled: false,
        // animationEnabled: false,
        cardStyle: {backgroundColor: 'transparent'},
        // transitionSpec: {
        //   open: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
        //   },
        //   close: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
        //   },
        // },
        // cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
        //   const translateX = current.progress.interpolate({
        //     inputRange: [index - 1, index, index + 1],
        //     outputRange: [screen.width, 0, 0],
        //   });

        //   const opacity = next?.progress.interpolate({
        //     inputRange: [0, 1, 2],
        //     outputRange: [1, 0, 0],
        //   });

        //   return {cardStyle: {opacity, transform: [{translateX}]}};
        // },
        ...Platform.select({
          ios: {
            // Use SlideFromRightIOS for iOS
            ...TransitionPresets.SlideFromRightIOS,
          },
          android: {
            // Customize transition for Android
            cardStyleInterpolator: ({current, next, layouts}) => {
              const translateX = current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  I18nManager.isRTL
                    ? -layouts.screen.width
                    : layouts.screen.width,
                  0,
                ],
              });
              return {cardStyle: {transform: [{translateX}]}};
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {duration: 500},
              },
              close: {
                animation: 'timing',
                config: {duration: 500},
              },
            },
          },
        }),
      }}
      // options={{
      //   ...TransitionPresets.SlideFromRightIOS,
      // }}
      initialRouteName={ScreenName.PayHome}>
      <PayNavigator.Screen name={ScreenName.PayHome} component={PayHome} />
      <PayNavigator.Screen
        name={ScreenName.BillpayRecharge}
        component={BillPayRecharge}
      />
      <PayNavigator.Screen
        name={ScreenName.recharge}
        component={BillPayRecharge}
      />
      <PayNavigator.Screen
        name={ScreenName.payment}
        component={BillPayRecharge}
      />
      <PayNavigator.Screen
        name={ScreenName.paybill}
        component={BillPayRecharge}
      />
      <PayNavigator.Screen name={ScreenName.OAssist} component={OAssist} />
      <PayNavigator.Screen name={ScreenName.onlinechat} component={OAssist} />
      <PayNavigator.Screen name={ScreenName.helpsupport} component={OAssist} />
      <PayNavigator.Screen
        name={ScreenName.SupportHome}
        component={SupportHome}
      />

      <PayNavigator.Screen
        name={ScreenName.SupportScreen}
        component={Support}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportHelpArticalLevelOne}
        component={SupportHelpArticalLevelOne}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportHelpArticlesLevelTwo}
        component={SupportHelpArticlesLevelTwo}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelOne}
        component={SupportNeedHelpLevelOne}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelTwo}
        component={SupportNeedHelpLevelTwo}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportPayments}
        component={SupportPayments}
      />
      <PayNavigator.Screen
        name={ScreenName.TrackComplaints}
        component={TrackComplaints}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportSubOoredooPediaItem}
        component={SupportSubOoredooPediaItem}
      />
      <PayNavigator.Screen
        name={ScreenName.SupportOoredooPediaViewall}
        component={SupportOoredooPediaViewall}
      />
      <PayNavigator.Screen
        name={ScreenName.PayGuestHome}
        component={PayGuestHome}
      />
      <PayNavigator.Screen
        name={ScreenName.notificationSceen}
        component={NotificationScreen}
      />
      <PayNavigator.Screen
        name={ScreenName.lineDetailsScreen}
        component={Linedetails}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferCredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferlocCredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.Transferlocalcredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.localcredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferCreditReview}
        component={TransferCreditReview}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferCreditTabInternationalCountry}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferCreditInternationalCountry}
        component={TransferCreditInternationalCountry}
      />
      <PayNavigator.Screen
        name={ScreenName.Gamification}
        component={Gamification}
      />
      <PayNavigator.Screen
        name={ScreenName.GamificationProductDetails}
        component={GamificationProductDetails}
      />
      <PayNavigator.Screen
        name={ScreenName.QuestAnimation}
        component={QuestAnimation}
        options={{
          tabBarVisible: false,
        }}
      />
      <PayNavigator.Screen
        name={ScreenName.Transferinternationalcredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.internationalcredit}
        component={TransferCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.PayViaVoucher}
        component={PayViaVoucher}
        options={{
          tabBarVisible: false,
        }}
      />

      <PayNavigator.Screen
        name={ScreenName.XpressProfit}
        component={XpressProfitHome}
        options={{
          tabBarVisible: false,
        }}
      />

      <PayNavigator.Screen
        name={ScreenName.xpressprofittransferbalance}
        component={XpressProfitHome}
        options={{
          tabBarVisible: false,
        }}
      />

      <PayNavigator.Screen
        name={ScreenName.LoadBalanceHome}
        component={LoadBalanceHome}
        options={{
          tabBarVisible: false,
        }}
      />
      <PayNavigator.Screen
        name={ScreenName.TransferBalanceHome}
        component={TransferBalanceHome}
        options={{
          tabBarVisible: false,
        }}
      />
      <PayNavigator.Screen
        name={ScreenName.XpressProfitReview}
        component={XpressProfitReview}
        options={{
          tabBarVisible: false,
        }}
      />

      <PayNavigator.Screen
        name={ScreenName.ManageLines}
        component={ManageLines}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureDirection: 'vertical-inverted',
        }}
      />
      <PayNavigator.Screen
        name={ScreenName.PaymentScreen}
        component={PaymentScreen}
      />
      <PayNavigator.Screen name={ScreenName.ViewBill} component={ViewBill} />
      <PayNavigator.Screen name={ScreenName.ebill} component={ViewBill} />
      <PayNavigator.Screen
        name={ScreenName.WebViewFile}
        component={Webviewfile}
      />
      <PayNavigator.Screen
        name={ScreenName.CivilIDUpdate}
        component={CivilIDUpdate}
      />
      <PayNavigator.Screen
        name={ScreenName.CivilidVerified}
        component={CivilidVerified}
      />

      <PayNavigator.Screen
        name={ScreenName.SmartPayDetail}
        component={SmartPayPage}
      />

      <PayNavigator.Screen
        name={ScreenName.SmartPayNumbersList}
        component={SmartPayNumbersList}
      />

      <PayNavigator.Screen
        name={ScreenName.SmartPayManage}
        component={SmartPayManage}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPayManageRenewal}
        component={SmartPayManageRenewal}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPayEnrollPayment}
        component={SmartPayEnrollPaymentPage}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPaySettings}
        component={SmartPaySettings}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPayEditCard}
        component={SmartPayEditCard}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPayAutoNumbers}
        component={SmartPayAutoNumbers}
      />
      <PayNavigator.Screen
        name={ScreenName.SmartPayEditNumbers}
        component={SmartPayEditNumbers}
      />
      <PayNavigator.Screen
        name={ScreenName.RequestCredit}
        component={RequestCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.RequestCreditView}
        component={RequestCredit}
      />
      <PayNavigator.Screen
        name={ScreenName.creditselectoption}
        component={PayHome}
      />
      <PayNavigator.Screen
        name={ScreenName.webviewScreen}
        component={webviewPage}
      />
      <PayNavigator.Screen name={ScreenName.webview} component={webview} />
      <PayNavigator.Screen
        name={ScreenName.requeststatusScreen}
        component={Requeststatus}
      />
      <PayNavigator.Screen
        name={ScreenName.DeactivateSuccess}
        component={DeactivateSuccess}
      />
      <PayNavigator.Screen
        name={ScreenName.TTFollowup}
        component={TTFollowup}
      />
      <PayNavigator.Screen name={ScreenName.FAQ} component={FAQ} />
      <PayNavigator.Screen
        name={ScreenName.NewLinedetailsScreen}
        component={NewLinedetails}
      />
      <PayNavigator.Screen
        name={ScreenName.HistoryDetails}
        component={HistoryDetails}
      />
      <RootStack.Screen name={ScreenName.AddNumber} component={AddNumber} />
      <PayNavigator.Screen name={ScreenName.MyHistory} component={MyHistory} />
    </PayNavigator.Navigator>
  );
};

const ShopStack = () => {
  return (
    <ShopNavigator.Navigator
      screenOptions={{
        headerShown: false,
        // gestureEnabled: false,
        // animationEnabled: false,
        cardStyle: {backgroundColor: 'transparent'},
        // transitionSpec: {
        //   open: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
        //   },
        //   close: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
        //   },
        // },
        // cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
        //   const translateX = current.progress.interpolate({
        //     inputRange: [index - 1, index, index + 1],
        //     outputRange: [screen.width, 0, 0],
        //   });

        //   const opacity = next?.progress.interpolate({
        //     inputRange: [0, 1, 2],
        //     outputRange: [1, 0, 0],
        //   });

        //   return {cardStyle: {opacity, transform: [{translateX}]}};
        // },
        ...Platform.select({
          ios: {
            // Use SlideFromRightIOS for iOS
            ...TransitionPresets.SlideFromRightIOS,
          },
          android: {
            // Customize transition for Android
            cardStyleInterpolator: ({current, next, layouts}) => {
              const translateX = current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  I18nManager.isRTL
                    ? -layouts.screen.width
                    : layouts.screen.width,
                  0,
                ],
              });
              return {cardStyle: {transform: [{translateX}]}};
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {duration: 500},
              },
              close: {
                animation: 'timing',
                config: {duration: 500},
              },
            },
          },
        }),
      }}
      // options={{
      //   ...TransitionPresets.SlideFromRightIOS,
      // }}
      initialRouteName={ScreenName.shopScreen}>
      <ShopNavigator.Screen
        name={ScreenName.ShopGuestHome}
        component={ShopGuestHomeIndex}
      />
      <ShopNavigator.Screen
        name={ScreenName.shopScreen}
        component={ShopHomeIndex}
      />

      <ShopNavigator.Screen
        name={ScreenName.ShopOnAppLandingPage}
        component={LandingPage}
      />

      <ShopNavigator.Screen
        name={ScreenName.PaymentPage}
        component={PaymentPage}
      />

      <ShopNavigator.Screen
        name={ScreenName.ConfirmationPage}
        component={ConfirmationPage}
      />

      <ShopNavigator.Screen
        name={ScreenName.EshopPlanHomeIndex}
        component={EshopPlanHomeIndex}
      />

      <ShopNavigator.Screen
        name={ScreenName.UpdatedShop}
        component={UpdatedShop}
      />
      <ShopNavigator.Screen name={ScreenName.OAssist} component={OAssist} />
      <ShopNavigator.Screen name={ScreenName.onlinechat} component={OAssist} />
      <ShopNavigator.Screen name={ScreenName.helpsupport} component={OAssist} />
      <ShopNavigator.Screen
        name={ScreenName.OrderNewSimScreen}
        component={OrderNewSim}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.TrackOrder}
        component={TrackOrders}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.ShopOnAppEditAddress}
        component={EditAddress}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.OrderVerificationScreen}
        component={OrderVerification}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportHome}
        component={SupportHome}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportScreen}
        component={Support}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportHelpArticalLevelOne}
        component={SupportHelpArticalLevelOne}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportHelpArticlesLevelTwo}
        component={SupportHelpArticlesLevelTwo}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelOne}
        component={SupportNeedHelpLevelOne}
      />
      <ShopNavigator.Screen
        name={ScreenName.NewSimSelectNumberComponent}
        component={NewSimSelectNumberComponent}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelTwo}
        component={SupportNeedHelpLevelTwo}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportPayments}
        component={SupportPayments}
      />
      <ShopNavigator.Screen
        name={ScreenName.TrackComplaints}
        component={TrackComplaints}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportSubOoredooPediaItem}
        component={SupportSubOoredooPediaItem}
      />
      <ShopNavigator.Screen
        name={ScreenName.SupportOoredooPediaViewall}
        component={SupportOoredooPediaViewall}
      />
      <ShopNavigator.Screen
        name={ScreenName.requeststatusScreen}
        component={Requeststatus}
      />
      <ShopNavigator.Screen
        name={ScreenName.DeactivateSuccess}
        component={DeactivateSuccess}
      />
      <ShopNavigator.Screen
        name={ScreenName.Gamification}
        component={Gamification}
      />
      <ShopNavigator.Screen
        name={ScreenName.GamificationProductDetails}
        component={GamificationProductDetails}
      />
      <ShopNavigator.Screen
        name={ScreenName.QuestAnimation}
        component={QuestAnimation}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.TTFollowup}
        component={TTFollowup}
      />

      <ShopNavigator.Screen
        name={ScreenName.ManageLines}
        component={ManageLines}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureDirection: 'vertical-inverted',
        }}
      />
      {/* <ShopNavigator.Screen
        name={ScreenName.TransferCredit}
        component={TransferCredit}
      />
      <ShopNavigator.Screen
        name={ScreenName.Transferlocalcredit}
        component={TransferCredit}
      /> */}
      <ShopNavigator.Screen
        name={ScreenName.PayViaVoucher}
        component={PayViaVoucher}
        options={{
          tabBarVisible: false,
        }}
      />
      <ShopNavigator.Screen
        name={ScreenName.lineDetailsScreen}
        component={Linedetails}
      />
      <ShopNavigator.Screen
        name={ScreenName.PaymentScreen}
        component={PaymentScreen}
      />
      <ShopNavigator.Screen
        name={ScreenName.webviewScreen}
        component={webviewPage}
      />
      <ShopNavigator.Screen
        name={ScreenName.HistoryDetails}
        component={HistoryDetails}
      />
      <ShopNavigator.Screen name={ScreenName.webview} component={webview} />
      <ShopNavigator.Screen name={ScreenName.ShopCart} component={ShopCart} />
      <ShopNavigator.Screen name={ScreenName.FAQ} component={FAQ} />
      <ShopNavigator.Screen name={ScreenName.MyHistory} component={MyHistory} />
      <RootStack.Screen name={ScreenName.AddNumber} component={AddNumber} />
    </ShopNavigator.Navigator>
  );
};

const NoJoomStack = () => {
  return (
    <NoJoomNavigator.Navigator
      screenOptions={{
        headerShown: false,
        // gestureEnabled: false,
        // animationEnabled: false,
        cardStyle: {backgroundColor: 'transparent'},
        // transitionSpec: {
        //   open: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
        //   },
        //   close: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
        //   },
        // },
        // cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
        //   const translateX = current.progress.interpolate({
        //     inputRange: [index - 1, index, index + 1],
        //     outputRange: [screen.width, 0, 0],
        //   });

        //   const opacity = next?.progress.interpolate({
        //     inputRange: [0, 1, 2],
        //     outputRange: [1, 0, 0],
        //   });

        //   return {cardStyle: {opacity, transform: [{translateX}]}};
        // },
        ...Platform.select({
          ios: {
            // Use SlideFromRightIOS for iOS
            ...TransitionPresets.SlideFromRightIOS,
          },
          android: {
            // Customize transition for Android
            cardStyleInterpolator: ({current, next, layouts}) => {
              const translateX = current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  I18nManager.isRTL
                    ? -layouts.screen.width
                    : layouts.screen.width,
                  0,
                ],
              });
              return {cardStyle: {transform: [{translateX}]}};
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {duration: 500},
              },
              close: {
                animation: 'timing',
                config: {duration: 500},
              },
            },
          },
        }),
      }}
      // options={{
      //   ...TransitionPresets.SlideFromRightIOS,
      // }}
      initialRouteName={ScreenName.NojoomHome}>
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomHome}
        component={NojoomHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.nojoomdeals}
        component={NojoomHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomB2CError}
        component={NojoomB2CError}
      />
      <NoJoomNavigator.Screen name={ScreenName.OAssist} component={OAssist} />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportHome}
        component={SupportHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportScreen}
        component={Support}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportHelpArticalLevelOne}
        component={SupportHelpArticalLevelOne}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportHelpArticlesLevelTwo}
        component={SupportHelpArticlesLevelTwo}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelOne}
        component={SupportNeedHelpLevelOne}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelTwo}
        component={SupportNeedHelpLevelTwo}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportPayments}
        component={SupportPayments}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.TrackComplaints}
        component={TrackComplaints}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportSubOoredooPediaItem}
        component={SupportSubOoredooPediaItem}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.SupportOoredooPediaViewall}
        component={SupportOoredooPediaViewall}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.onlinechat}
        component={OAssist}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.helpsupport}
        component={OAssist}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomHome2}
        component={NojoomHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.notificationSceen}
        component={NotificationScreen}
      />
      {/* <NoJoomNavigator.Screen
        name={ScreenName.TransferCredit}
        component={TransferCredit}
      /> */}
      <NoJoomNavigator.Screen
        name={ScreenName.PayViaVoucher}
        component={PayViaVoucher}
        options={{
          tabBarVisible: false,
        }}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomPartnerRewardsHome}
        component={NojoomPartnerRewardsHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.Nojoompartnerrewardscategory}
        component={NoJoomPartnerCategory}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.lineDetailsScreen}
        component={Linedetails}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomPartnerRewardsDetails}
        component={NoJoomPartnerDetails}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.Nojoomooredoorewardscategory}
        component={NoJoomOoredooRewardCategory}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomOoredooRewardsHome}
        component={NojoomOoredooRewardsHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomOoredooRewardsElementList}
        component={RewardsElementList}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.Gamification}
        component={Gamification}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.GamificationProductDetails}
        component={GamificationProductDetails}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.QuestAnimation}
        component={QuestAnimation}
        options={{
          tabBarVisible: false,
        }}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomDashboardDetails}
        component={NoJoomDashboardDetails}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NoJoomTransferFriends}
        component={NoJoomTransferPoints}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.EarnPointsPartnerHome}
        component={EarnPointsPartnerHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.EarnPoints}
        component={EarnPointsPartnerHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.EarnPartners}
        component={EarnPointsPartnerHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.EarnPointsPartnerDetails}
        component={NojoomEarnPartnerDetails}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.webviewScreen}
        component={webviewPage}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomDonatepoints}
        component={NojoomDonatepoints}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.TransferToPartners}
        component={TransferToPartners}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomLinkedNumbers}
        component={NojoomLinkedNumbers}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomPointsHistory}
        component={PointsHistory}
      />

      <NoJoomNavigator.Screen
        name={ScreenName.NojoomPointsALLHistory}
        component={PointsHistory}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomTransferPointsHome}
        component={NojoomTransferPointsHome}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.NojoomBuyPoints}
        component={NojoomBuyPoints}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.OoredooServiceBundleDetail}
        component={OoredooServiceBundleDetail}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.ManageLines}
        component={ManageLines}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureDirection: 'vertical-inverted',
        }}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.PaymentScreen}
        component={PaymentScreen}
      />
      <NoJoomNavigator.Screen name={ScreenName.webview} component={webview} />
      <NoJoomNavigator.Screen
        name={ScreenName.requeststatusScreen}
        component={Requeststatus}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.DeactivateSuccess}
        component={DeactivateSuccess}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.TTFollowup}
        component={TTFollowup}
      />
      <NoJoomNavigator.Screen name={ScreenName.FAQ} component={FAQ} />
      <RootStack.Screen name={ScreenName.AddNumber} component={AddNumber} />
      <NoJoomNavigator.Screen
        name={ScreenName.MyHistory}
        component={MyHistory}
      />
      <NoJoomNavigator.Screen
        name={ScreenName.HistoryDetails}
        component={HistoryDetails}
      />
    </NoJoomNavigator.Navigator>
  );
};

const MoreStack = () => {
  const {t} = useTranslation();
  return (
    <MoreNavigator.Navigator
      screenOptions={{
        headerShown: false,
        // gestureEnabled: false,
        // animationEnabled: false,
        cardStyle: {backgroundColor: 'transparent'},
        // transitionSpec: {
        //   open: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
        //   },
        //   close: {
        //     animation: 'timing',
        //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
        //   },
        // },
        // cardStyleInterpolator: ({index, current, next, layouts: {screen}}) => {
        //   const translateX = current.progress.interpolate({
        //     inputRange: [index - 1, index, index + 1],
        //     outputRange: [screen.width, 0, 0],
        //   });

        //   const opacity = next?.progress.interpolate({
        //     inputRange: [0, 1, 2],
        //     outputRange: [1, 0, 0],
        //   });

        //   return {cardStyle: {opacity, transform: [{translateX}]}};
        // },
        ...Platform.select({
          ios: {
            // Use SlideFromRightIOS for iOS
            ...TransitionPresets.SlideFromRightIOS,
          },
          android: {
            // Customize transition for Android
            cardStyleInterpolator: ({current, next, layouts}) => {
              const translateX = current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [
                  I18nManager.isRTL
                    ? -layouts.screen.width
                    : layouts.screen.width,
                  0,
                ],
              });
              return {cardStyle: {transform: [{translateX}]}};
            },
            transitionSpec: {
              open: {
                animation: 'timing',
                config: {duration: 500},
              },
              close: {
                animation: 'timing',
                config: {duration: 500},
              },
            },
          },
        }),
      }}
      // options={{
      //   ...TransitionPresets.SlideFromRightIOS,
      // }}
      initialRouteName={ScreenName.moreScreen}>
      <MoreNavigator.Screen
        name={ScreenName.newmoreScreen}
        component={MoreHomeNew}
      />
      <MoreNavigator.Screen
        name={ScreenName.TrackOrder}
        component={TrackOrders}
        options={{
          tabBarVisible: false,
        }}
      />
      <MoreNavigator.Screen
        name={ScreenName.TrackOrderGuest}
        component={TrackOrderGuest}
        options={{
          tabBarVisible: false,
        }}
      />

      <MoreNavigator.Screen name={ScreenName.moreScreen} component={MoreHome} />
      <MoreNavigator.Screen name={ScreenName.moremenu} component={MoreHome} />
      <MoreNavigator.Screen
        name={ScreenName.MoreGuestHome}
        component={MoreGuestHome}
      />
      <MoreNavigator.Screen
        name={ScreenName.MoreGuestHomeNew}
        component={MoreGuestHomeNew}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayNumbersList}
        component={SmartPayNumbersList}
      />
      <MoreNavigator.Screen name={ScreenName.OAssist} component={OAssist} />
      <MoreNavigator.Screen name={ScreenName.onlinechat} component={OAssist} />
      <MoreNavigator.Screen name={ScreenName.helpsupport} component={OAssist} />
      <MoreNavigator.Screen
        name={ScreenName.SupportHome}
        component={SupportHome}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportScreen}
        component={Support}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportHelpArticalLevelOne}
        component={SupportHelpArticalLevelOne}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportHelpArticlesLevelTwo}
        component={SupportHelpArticlesLevelTwo}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelOne}
        component={SupportNeedHelpLevelOne}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayEnrollPayment}
        component={SmartPayEnrollPaymentPage}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportNeedHelpLevelTwo}
        component={SupportNeedHelpLevelTwo}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportPayments}
        component={SupportPayments}
      />
      <MoreNavigator.Screen
        name={ScreenName.TrackComplaints}
        component={TrackComplaints}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportSubOoredooPediaItem}
        component={SupportSubOoredooPediaItem}
      />
      <MoreNavigator.Screen
        name={ScreenName.SupportOoredooPediaViewall}
        component={SupportOoredooPediaViewall}
      />

      <MoreNavigator.Screen
        name={ScreenName.notificationSceen}
        component={NotificationScreen}
      />
      <MoreNavigator.Screen
        name={ScreenName.MoreAccounts}
        component={MoreAccounts}
      />
      <MoreNavigator.Screen
        name={ScreenName.lineDetailsScreen}
        component={Linedetails}
      />
      <MoreNavigator.Screen
        name={ScreenName.MoreSettings}
        component={Settings}
      />
      <MoreNavigator.Screen
        name={ScreenName.EsimConfirm}
        component={EsimConfirm}
      />
      <MoreNavigator.Screen
        name={ScreenName.EsimCivilScreen}
        component={EsimCivilIdScreen}
      />
      <MoreNavigator.Screen
        name={ScreenName.EsimSelectNumber}
        component={EsimSelectNumber}
      />
      <MoreNavigator.Screen name={ScreenName.PayHome} component={PayHome} />
      <MoreNavigator.Screen
        name={ScreenName.termsCondScreen}
        component={tnc}
        options={{
          title: capatalize(t('tnc')),
          header: false,
          headerTitleAlign: 'center',
        }}
      />
      <MoreNavigator.Screen
        name={ScreenName.UpdateProfile}
        component={UpdateProfile}
      />
      <MoreNavigator.Screen
        name={ScreenName.AddressList}
        component={AddressList}
      />
      <MoreNavigator.Screen
        name={ScreenName.AddAddress}
        component={AddAddress}
      />
      <MoreNavigator.Screen
        name={ScreenName.ProfileChangeEmail}
        component={ProfileChangeEmail}
      />
      <MoreNavigator.Screen
        name={ScreenName.profileupdate}
        component={ProfileChangeEmail}
      />
      <MoreNavigator.Screen
        name={ScreenName.updateemail}
        component={ProfileChangeEmail}
      />
      <MoreNavigator.Screen
        name={ScreenName.Gamification}
        component={Gamification}
      />
      <MoreNavigator.Screen
        name={ScreenName.GamificationProductDetails}
        component={GamificationProductDetails}
      />
      <MoreNavigator.Screen
        name={ScreenName.QuestAnimation}
        component={QuestAnimation}
        options={{
          tabBarVisible: false,
        }}
      />
      <MoreNavigator.Screen
        name={ScreenName.webviewScreen}
        component={webviewPage}
      />
      <MoreNavigator.Screen
        name={ScreenName.ProfileChangePassword}
        component={ChangePassword}
      />
      <MoreNavigator.Screen
        name={ScreenName.MoreEsimHome}
        component={EsimHome}
      />

      <MoreNavigator.Screen
        name={ScreenName.EsimScanCode}
        component={EsimScan}
      />
      <MoreNavigator.Screen
        name={ScreenName.EsimErrorScreen}
        component={ErrorScreen}
      />

      <MoreNavigator.Screen
        name={ScreenName.ManageLines}
        component={ManageLines}
        options={{
          ...TransitionPresets.ModalTransition,
          gestureDirection: 'vertical-inverted',
        }}
      />
      <MoreNavigator.Screen
        name={ScreenName.PaymentScreen}
        component={PaymentScreen}
      />
      <MoreNavigator.Screen name={ScreenName.webview} component={webview} />
      {/* <MoreNavigator.Screen
        name={ScreenName.TransferCredit}
        component={TransferCredit}
      /> */}
      <MoreNavigator.Screen
        name={ScreenName.PayViaVoucher}
        component={PayViaVoucher}
        options={{
          tabBarVisible: false,
        }}
      />
      <MoreNavigator.Screen
        name={ScreenName.InternetTransfer}
        component={InternetTransfer}
      />
      <MoreNavigator.Screen name={ScreenName.AddMember} component={AddMember} />
      <MoreNavigator.Screen
        name={ScreenName.ManageMember}
        component={ManageMember}
      />
      <MoreNavigator.Screen
        name={ScreenName.InternetTransferReview}
        component={InternetTransferReview}
      />
      <MoreNavigator.Screen
        name={ScreenName.requeststatusScreen}
        component={Requeststatus}
      />
      <MoreNavigator.Screen
        name={ScreenName.DeactivateSuccess}
        component={DeactivateSuccess}
      />
      <MoreNavigator.Screen
        name={ScreenName.TTFollowup}
        component={TTFollowup}
      />
      <MoreNavigator.Screen
        name={ScreenName.ManageCards}
        component={ManageCardHome}
      />
      <MoreNavigator.Screen
        name={ScreenName.ManageCardsNew}
        component={ManageCardNewHome}
      />
      <MoreNavigator.Screen
        name={ScreenName.profileinfoScreen}
        component={ProfileInfoNew}
      />
      <MoreNavigator.Screen
        name={ScreenName.EmailOtpVerify}
        component={EmailOtpVerify}
      />
      {/* Password Management Screen  */}
      <MoreNavigator.Screen
        name={ScreenName.PasswordManagement}
        component={PasswordManagement}
      />
      <MoreNavigator.Screen
        name={ScreenName.newPasswordScreen}
        component={NewPassword}
      />
      <MoreNavigator.Screen
        name={ScreenName.TermsAndConditions}
        component={TermsAndConditions}
      />
      <MoreNavigator.Screen name={ScreenName.MyAccount} component={MyAccount} />
      <MoreNavigator.Screen name={ScreenName.MyPayment} component={MyPayment} />
      <MoreNavigator.Screen name={ScreenName.MyHistory} component={MyHistory} />
      <MoreNavigator.Screen
        name={ScreenName.HistoryDetails}
        component={HistoryDetails}
      />
      <MoreNavigator.Screen
        name={ScreenName.AccountDeletionForm}
        component={AccountDeletionForm}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayManageRenewal}
        component={SmartPayManageRenewal}
      />
      <MoreNavigator.Screen name={ScreenName.FAQ} component={FAQ} />
      <RootStack.Screen name={ScreenName.AddNumber} component={AddNumber} />

      <MoreNavigator.Screen
        name={ScreenName.SmartPayDetail}
        component={SmartPayPage}
      />

      <MoreNavigator.Screen
        name={ScreenName.SmartPayManage}
        component={SmartPayManage}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPaySettings}
        component={SmartPaySettings}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayEditCard}
        component={SmartPayEditCard}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayAutoNumbers}
        component={SmartPayAutoNumbers}
      />
      <MoreNavigator.Screen
        name={ScreenName.SmartPayEditNumbers}
        component={SmartPayEditNumbers}
      />
    </MoreNavigator.Navigator>
  );
};

const AppNavigator = () => {
  const [transectionId, setTransectionId] = useState('');
  const [language, setLanguage] = useState('en');
  const [appLanguage, setAppLanguage] = useState(null);
  const {t, i18n} = useTranslation();

  // TODO: render auth stack or home screen based on isloggedin prop
  const initLang = getSystemLocale();
  const dispatch = useDispatch();
  const state = useSelector(stateObj => stateObj.userData);
  const isLoggedIn = state.isLoggedIn;
  const currTimeInMS = Date.now();

  useEffect(() => {
    accessNotificationPerm();
  }, []);

  const accessNotificationPerm = async () => {
    await messaging()
      .hasPermission()
      .then(enabled => {
        if (enabled) {
        } else {
          Alert.alert(t('npr'), t('panpfbe'), [
            {
              text: t('aml'),
              onPress: () => console.log('Cancel Pressed'),
            },
            {
              text: t('gp'),
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.canOpenURL('app-settings:')
                    .then(supported => {
                      Linking.openURL('app-settings:');
                    })
                    .catch(error => {});
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]);
        }
      })
      .catch();
  };

  try {
    if (global.UniqueToken == null || global.UniqueToken === undefined) {
      global.UniqueToken = 't' + currTimeInMS + 'm';
    }
  } catch (e) {}
  // read saved lang. from async
  const readData = async () => {
    try {
      const _devLanguage = getSystemLocale();
      const selectedLang = await getItem(SELECTED_LANG);
      if (selectedLang !== null && selectedLang != '') {
        global.userlanguage = selectedLang;
        if (_devLanguage == 'ar') {
          if (selectedLang == 'en' && I18nManager.isRTL) {
            defaultlayout(false);
          } else if (selectedLang == 'ar' && !I18nManager.isRTL) {
            defaultlayout(true);
          }
        }
        return selectedLang;
      } else {
        global.userlanguage = _devLanguage;
        setItem(SELECTED_LANG, global.userlanguage);
        if (_devLanguage == 'ar') {
          if (!I18nManager.isRTL) {
            I18nManager.forceRTL('ar');
            dispatch(setSelectedLangugage('ar'));
            defaultlayout('ar');
            setTimeout(() => {
              RNRestart.Restart();
            }, 100);
            defaultlayout(true);
          }
        } else {
          if (_devLanguage != 'en') {
            setTimeout(() => {
              RNRestart.Restart();
            }, 100);
            I18nManager.forceRTL(false);
            defaultlayout(false);
          }
          dispatch(setSelectedLangugage(_devLanguage));
          return _devLanguage;
        }
      }
    } catch (e) {
      return null;
    }
  };

  useEffect(() => {
    readData().then(response => {
      if (response) {
        dispatch(setSelectedLangugage(response));
      } else {
        setItem(SELECTED_LANG, initLang);
        dispatch(setSelectedLangugage(initLang));
      }
    });
  }, [initLang]);
  //** READ NOTIFICATION API CALL */
  const readNotification = useMutation(
    req =>
      callQueryapi({
        queryKey: [
          key_viewednotifications,
          UPDATE_NOTICATIONS_STATUS,
          {transid: transectionId},
        ],
      }),
    {
      onSuccess: (udata, variables, context) => {
        consoleLog('resp success', udata);
      },
      onError: (uerror, variables, context) => {
        consoleLog('resp error', uerror);
      },
    }
  );

  //** Foreground Notification  */
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      PushNotification.localNotification({
        message: remoteMessage?.notification?.body,
        title: remoteMessage?.notification?.title,
        data: remoteMessage?.data,
        userInfo: remoteMessage.data,
        channelId: 'local_notification',
        playSound: false,
        soundName: 'default',
      });
      let url = remoteMessage?.data?.wzrk_dl;

      let newUrl = url.replace('+', ' ');
    });

    return unsubscribe;
  }, []);

  //** Push notification configuration */
  useEffect(() => {
    PushNotification.createChannel({
      channelId: 'local_notification',
      channelName: 'My channel',
      channelDescription: 'A channel to categorise your notifications',
      soundName: 'default',
      importance: 4,
      vibrate: true,
    });
    PushNotification.configure({
      onRegister: function (token) {},
      onNotification: function (notification) {
        const Url = notification?.data?.url;
        global.pushchildnumber = notification?.data?.childmsisdn;
        global.pushischildnumber = notification?.data?.switchnumber;
        global.deeplinkurl = Url;
        if (Platform.OS == 'ios') {
          if (
            notification?.action == null ||
            notification?.action == undefined ||
            notification?.action == ''
          ) {
            return;
          }
          if (Url.startsWith('https') || Url.startsWith('http')) {
            Linking.openURL(Url);
            return;
          }
          Linking.openURL('ooredookw://com.wataniya.app?page=' + Url);
        } else {
          if (Url.startsWith('https') || Url.startsWith('http')) {
            Linking.openURL(Url);
            return;
          }
          Linking.openURL('ooredookw://com.wataniya.app?page=' + Url);
        }

        return;
      },
      onAction: function (notification) {
        const Url = notification?.data?.url;
        global.pushchildnumber = notification?.data?.childmsisdn;
        global.pushischildnumber = notification?.data?.switchnumber;
        if (Url.startsWith('https') || Url.startsWith('http')) {
          Linking.openURL(Url);
          return;
        }
        setTransectionId(notification?.data?.transid);
        if (Url) {
          Linking.openURL(
            'https://www.ooredoo.com.kw/portalapis/api/notification/sms?page=' +
              Url
          );
        }
        readNotification.mutate();
      },
    });
  }, []);

  return (
    <NavigationContainer linking={Notifylinking}>
      <RootStack.Navigator
        screenOptions={{
          animationEnabled: false,
          headerShown: false,
          gestureEnabled: false,
          // transitionSpec: {
          //   open: {
          //     animation: 'timing',
          //     config: {duration: 500}, // Set the transition duration here (500 milliseconds in this example)
          //   },
          //   close: {
          //     animation: 'timing',
          //     config: {duration: 500}, // Set the transition duration for closing here (500 milliseconds in this example)
          //   },
          // },
          // ...TransitionPresets.SlideFromRightIOS,
          // cardStyleInterpolator: ({
          //   index,
          //   current,
          //   next,
          //   layouts: {screen},
          // }) => {
          //   const translateX = current.progress.interpolate({
          //     inputRange: [index - 1, index, index + 1],
          //     outputRange: [screen.width, 0, 0],
          //   });

          //   const opacity = next?.progress.interpolate({
          //     inputRange: [0, 1, 2],
          //     outputRange: [1, 0, 0],
          //   });

          //   return {cardStyle: {opacity, transform: [{translateX}]}};
          // },
        }}
        mode="modal">
        <RootStack.Screen
          name={ScreenName.splashScreen}
          component={SplashScreen}
        />
        <RootStack.Screen
          name={ScreenName.loginAuthOTPScreen}
          component={LoginAuthOTP}
          options={{
            title: t('login'),
            headerTitleAlign: 'center',
            headerShown: false,
          }}
        />
        <RootStack.Screen
          name={ScreenName.PushLink}
          component={PushNotificationLink}
        />
        <RootStack.Screen
          name={ScreenName.walkthoughScreen}
          component={WalkthroughScreen}
        />
        <RootStack.Screen
          name={ScreenName.landingScreen}
          component={LandingScreen}
        />
        <RootStack.Screen
          name={ScreenName.authStack}
          component={AuthNavigator}
          options={{
            animationEnabled: false,
            headerShown: false,
            gestureEnabled: false,
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen name={ScreenName.OAssist} component={OAssist} />
        <RootStack.Screen name={ScreenName.onlinechat} component={OAssist} />
        <RootStack.Screen name={ScreenName.helpsupport} component={OAssist} />
        <RootStack.Screen name={ScreenName.FAQ} component={FAQ} />
        <RootStack.Screen name={ScreenName.SupportScreen} component={Support} />
        <RootStack.Screen
          name={ScreenName.SupportHome}
          component={SupportHome}
        />
        <RootStack.Screen
          name={ScreenName.TrackOrder}
          component={TrackOrders}
          options={{
            tabBarVisible: false,
          }}
        />
        <RootStack.Screen
          name={ScreenName.TrackOrderGuest}
          component={TrackOrderGuest}
          options={{
            tabBarVisible: false,
          }}
        />
        <RootStack.Screen
          name={ScreenName.SupportHelpArticalLevelOne}
          component={SupportHelpArticalLevelOne}
        />
        <RootStack.Screen
          name={ScreenName.SupportHelpArticlesLevelTwo}
          component={SupportHelpArticlesLevelTwo}
        />
        <RootStack.Screen
          name={ScreenName.SupportNeedHelpLevelOne}
          component={SupportNeedHelpLevelOne}
        />
        <RootStack.Screen
          name={ScreenName.SupportNeedHelpLevelTwo}
          component={SupportNeedHelpLevelTwo}
        />
        <RootStack.Screen
          name={ScreenName.SupportPayments}
          component={SupportPayments}
        />
        <RootStack.Screen
          name={ScreenName.TrackComplaints}
          component={TrackComplaints}
        />
        <RootStack.Screen
          name={ScreenName.SupportOoredooPediaViewall}
          component={SupportOoredooPediaViewall}
        />

        <RootStack.Screen
          name={ScreenName.DeactivateSuccess}
          component={DeactivateSuccess}
        />
        <RootStack.Screen
          name={ScreenName.PaymentViewDetailsScreen}
          component={PaymentViewDetailsScreen}
        />
        <RootStack.Screen name={ScreenName.webview} component={webview} />
        <RootStack.Screen
          name={ScreenName.howToVideos}
          component={HowToVideos}
        />

        <RootStack.Screen name={ScreenName.tabStack} component={TabStack} />
        <RootStack.Screen
          name={ScreenName.SupportSubOoredooPediaItem}
          component={SupportSubOoredooPediaItem}
        />
        <RootStack.Screen
          name={ScreenName.favouriteScreen}
          component={Favourite}
          options={{
            gestureDirection: 'horizontal-inverted',
          }}
        />
        <RootStack.Screen
          name={ScreenName.TransStatus}
          component={TransStatus}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />
        <RootStack.Screen
          name={ScreenName.ActivationFailure}
          component={ActivationFailure}
          options={{
            ...TransitionPresets.SlideFromRightIOS,
          }}
        />

        <RootStack.Screen
          name={ScreenName.requeststatusScreen}
          component={Requeststatus}
        />
        <RootStack.Screen name={ScreenName.TTFollowup} component={TTFollowup} />
        <RootStack.Screen
          name={ScreenName.EditManageLine}
          component={EditManageline}
        />
        <RootStack.Screen
          name={ScreenName.changeEmail}
          component={ChangeEmail}
        />
        {/* <RootStack.Screen
          name={ScreenName.CivilIDUpdate}
          component={CivilIDUpdate}
        />
        <RootStack.Screen
          name={ScreenName.CivilidVerified}
          component={CivilidVerified}
        /> */}

        <RootStack.Screen
          name={ScreenName.PaymentDiy}
          component={PaymentView}
        />
        <RootStack.Screen
          name={ScreenName.PaymentScreen}
          component={PaymentScreen}
        />
        <RootStack.Screen
          name={ScreenName.webviewScreen}
          component={webviewPage}
          options={{
            gestureEnabled: false,
            gestureDirection: 'horizontal',
            ...TransitionPresets.ModalTransition,
          }}
        />
        <RootStack.Screen name={ScreenName.DIYScreen} component={diy} />
        <RootStack.Screen
          name={ScreenName.SuccessScreen}
          component={SuccessScreen}
        />
        <RootStack.Screen
          name={ScreenName.OfflineComponent}
          component={Offlinecomponent}
        />
        <RootStack.Screen name={ScreenName.UpdateApp} component={UpdateApp} />

        <RootStack.Screen
          name={ScreenName.LogoutPage}
          component={LogoutComponent}
          options={{
            ...TransitionPresets.ModalTransition,
            gestureDirection: 'vertical-inverted',
          }}
        />
        {/* {global.authType != null ? ( */}
        <RootStack.Screen
          name="Modal"
          component={BottomAuthenticationPopup}
          options={{
            animationEnabled: true,
            cardStyle: {backgroundColor: 'rgba(0, 0, 0, 0.05)'},
            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 0.9, 1],
                    outputRange: [0, 0.25, 0.7, 1],
                  }),
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              };
            },
          }}
        />
        <RootStack.Screen
          name={ScreenName.SwitchManageModal}
          component={SwitchManageLineSheet}
          options={{
            animationEnabled: true,
            cardStyle: {backgroundColor: 'transparent'},
            // cardStyle: {    backgroundColor: 'rgba(0,0,0,0.6)', },
            // backgroundColor: 'rgba(0,0,0,0.8)',

            presentation: 'transparentModal',

            cardStyleInterpolator: ({current: {progress}}) => {
              return {
                cardStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 0.5, 0.9, 1],
                    outputRange: [0, 0.25, 0.7, 1],
                  }),
                },
                overlayStyle: {
                  opacity: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 0.5],
                    extrapolate: 'clamp',
                  }),
                },
              };
            },
          }}
        />

        {/* ) : null} */}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
