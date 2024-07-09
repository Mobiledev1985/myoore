import {
  APPLY_TABLET_OR_DEVICE_MARGIN,
  HEIGHT_200,
  VERTICAL_20,
} from '../resources/styles/responsive';
import React, {Suspense} from 'react';

import {ADDONSDETAILS_URL} from '../resources/route/endpoints';
import ANADialogue from '../models/basic/ANADialogue';
import {ActivityIndicator} from 'react-native-paper';
import AddonsHome from '../pages/addons/AddonsHome';
import Banners from '../UIComponent/p_common/banners';
import BasicserviceList from '../UIComponent/p_linedetails/BasicserviceList';
import BundleHome from '../pages/bundles/BundleHome';
import TransactionHome from '../pages/TransactionNew/TransactionHome';
import BuyMorePoint from '../pages/Fifawc/template/BuyMorePoint';
import CircleBanner from '../UIComponent/p_common/CircleBanner';
import DashboardTeams from '../pages/Fifawc/DashboardTeams';
import DashboardWanna from '../UIComponent/p_home/DashboardWanna';
import DigitalServicesHome from '../pages/digitalservices/DigitalServicesHome';
import DynamicListingElements from '../UIComponent/p_more/DynamicListingElements';
import EarnPointsHomeCard from '../pages/nojoom/home/EarnPointsHomeCard';
import GreetingComponent from '../UIComponent/custom/greeting';
import HomeCarousel from '../UIComponent/p_home/HomeCarousel';
import CVMListCarousel from '../UIComponent/p_home/CVMListCarousel';
import HomeDialogue from '../models/basic/HomeDialogue';
import HotDealsOffer from '../pages/nojoom/home/HotDealsOffer';
import LoadBalance from '../pages/pay/xpressProfit/template/LoadBalance';
import MessageTemplate from '../models/templates/MessageTemplate';
import MoreGuestListingElements from '../pages/more/guest/MoreGuestListingElements';
import MultiPassportCountryHome from '../pages/roaming/MultiPassportCountryHome';
import MyCountriesHome from '../pages/roaming/mycountry/MyCountriesHome';
import NoJoomDashboard from '../UIComponent/nojoom/home/NoJoomDashboard';
import NoNumbExist from '../pages/nonumber/noNumberScreen';
import NojoomEarnPointsList from '../UIComponent/nojoom/NojoomEarnPointsList';
import NojoomOoredooRewardsList from '../pages/nojoom/ooredoorewards/NojoomOoredooRewardsList';
import NojoomPartnerRewardsList from '../UIComponent/nojoom/NojoomPartnerRewardsList';
import NojoomTranferPointsList from '../pages/nojoom/transferpoints/NojoomTranferPointsList';
import OoredooAdd from '../UIComponent/p_ooredooadd/OoredooAdd';
import OoredooPassportList from '../pages/roaming/OoredooPassportList';
import OoredooRewards from '../pages/nojoom/home/OoredooRewards';
import OoredooSurpriseBadge from '../pages/ooredoosurprise/OoredooSurpriseBadge';
import OoredooSurpriseList from '../pages/ooredoosurprise/OoredooSurpriseList';
import PageElementFilter from '../UIComponent/custom/PageElementFilter';
import PartnerRewardsCategory from '../pages/nojoom/home/PartnerRewardsCategory';
import PassportCountriesHome from '../pages/roaming/PassportCountriesHome';
import PayGuestListingElements from '../pages/pay/guest/PayGuestListingElements';
import PostpaidPayBalanceCard from '../UIComponent/p_pay/PostpaidPayBalanceCard';
import PrepaidPayBalanceCard from '../UIComponent/p_pay/PrepaidPayBalanceCard';
import Recommendations from '../UIComponent/p_home/Recommendations';
import RoamingDealsList from '../pages/roaming/RoamingDealsList';
import RoamingIntlRatesDetail from '../pages/roaming/RoamingIntlRateDetails';
import RoamingIntlRatesHome from '../pages/roaming/RoamingIntlRatesHome';
import RoamingOffers from '../pages/roaming/RoamingOffers';
import RoamingPopupTemplate from '../pages/roaming/popuptemplate';
import ScreenName from '../navigator/ScreenName';
import SelectTeam from '../pages/Fifawc/SelectTeam';
import ShopCategoryBanner from '../UIComponent/p_shop/ShopCategoryBanner';

import ShopHomeSearch from '../UIComponent/p_shop/ShopHomeSearch';
import SmartPayCard from '../UIComponent/p_pay/smartpay/SmartPayCard';
import Spinwinpopup from '../pages/transactionstatus/Spinwinpopup';
import TeamScoreTemplate from '../pages/Fifawc/yourTeam/yourTeam';
import TransactionHistory from '../pages/pay/xpressProfit/template/TransactionHistory';
import TransferBalance from '../pages/pay/xpressProfit/template/TransferBalance';
import TransferPointsCards from '../pages/nojoom/home/TransferPointsCards';
import {View} from 'react-native';
import WatchVideo from '../pages/Fifawc/watch/WatchVideos';
import XpressProfitBalance from '../pages/pay/xpressProfit/template/XpressProfitBalance';
import colors from '../resources/styles/colors';
import {consoleLog} from './utils';
import FifaWinners from '../pages/fifa/fifawinners';
import FifaDraw from '../pages/fifa/fifadraw';
import FifaWinnersLeaderboard from '../pages/fifa/fifawinnersleaderboard';
import QuickLinks from '../UIComponent/p_home/QuickLinks';
import DynamicTransactionHistory from '../UIComponent/p_more/TransactionHistory';
import TransferPointsHome from '../pages/TransferPoints/TransferPointsHome';
import RecentPurchases from '../UIComponent/p_home/RecentPurchases';
import {recenttransactionsdata} from './Constants';
import TransactionDetails from '../pages/TransactionNew/TransactionDetails';
import NotificationRenewCard from '../UIComponent/p_home/NotificationRenewCard';
import RenewalHome from '../UIComponent/p_home/RenewalHome';
import CVMHomeCarousel from '../UIComponent/p_home/CVMHomeCarousel';
import Promotionsoffer from '../UIComponent/p_home/Promotionsoffer';
import PromotionsCard from '../pages/Promotions/PromotionsCard';
import NojoomHomeBanner from '../UIComponent/nojoom/NojoomHomeBanner';
import NojoomEarnPointsHome from '../UIComponent/nojoom/NojoomEarnPointsHome';
import ViewPacks from '../pages/roaming/ViewPacks';
import PopularCountriesViewPacks from './PopularCountriesViewPacks';
import NewBasicserviceList from '../UIComponent/p_linedetails/NewBasicserviceList';
import ProfileHeader from '../UIComponent/p_linedetails/profileheader';
import Newbalance from '../UIComponent/p_linedetails/newbalance';
import Newsubscriptions from '../UIComponent/p_linedetails/newsubscriptions';
import CurrentPacks from '../UIComponent/p_linedetails/currentpacks';
import NewRemaininginfo from '../UIComponent/p_linedetails/newremaininginfo';
import {GenerateLineDetails} from '../services/CommonUtils';
import Subscriptions from '../UIComponent/p_linedetails/subscriptions';
import Activepacks from '../UIComponent/p_linedetails/activepacks';
import Goupbutton from '../UIComponent/p_linedetails/goupbutton';
import Headerlinedetails from '../UIComponent/p_linedetails/headerlinedetails';
import Currentpackviewusagedetails from './../UIComponent/p_linedetails/currentpackviewusagedetails';
import Shamelprocontrol from '../UIComponent/p_linedetails/shamelprocontrol';
import UpdatedShop from '../pages/shop/home/UpdatedShop';
import CountrySection from './CountrySection';
import SummerNewCollections from '../UIComponent/p_shop/SummerNewCollections';
import WhatWouldYouLike from '../pages/shop/home/WhatWouldYouLike';
import WhyAna from '../pages/shop/home/WhyAna';
import StaticShopBanner from '../UIComponent/p_shop/StaticShopBanner';
import RoamingCountries from '../pages/roaming/RoamingCountries';
import RoamingBanner from './RoamingBanner';
import ProfileComponent from '../pages/more/components/ProfileComponent';
import LanguageSettings from '../pages/more/components/LanguageSettings';
import LineSeparator from '../pages/more/components/LineSeparator';
import NewInTheApp from '../pages/more/components/NewInTheApp';
import DynamicListingMoreElements from '../UIComponent/p_more/DynamicListingMoreElements';
import SmartPayCardBanner from '../pages/more/smartpay/SmartPayCardBanner';
import SupportBanner from '../UIComponent/ooredooassistancenewdesign/components/SupportBanner';
import Support from '../UIComponent/ooredooassistancenewdesign/pages/Support';
import SupportQuicklinks from '../UIComponent/ooredooassistancenewdesign/components/SupportQuicklinks';
import SupportOoredooPedia from '../UIComponent/ooredooassistancenewdesign/components/SupportOoredooPedia';
import SupportWantToTalk from '../UIComponent/ooredooassistancenewdesign/components/SupportWantToTalk';
import SupportBillPayments from '../UIComponent/ooredooassistancenewdesign/components/SupportBillPayments';
import SupportPaymentsQuiries from '../UIComponent/ooredooassistancenewdesign/components/SupportPaymentsQuiries';
import MyHistory from '../pages/more/history/MyHistory';

// import TestFile from '../UIComponent/p_home/TestFile';
// import OffersForYou from '../UIComponent/p_home/OffersForYou';
let NotificationCard = null;
let Accordion = null;
let OffersForYou = null;
let SpecialDeals = null;
let Bundles = null;
let DigitalServices = null;
let Roaming = null;
let Dashboard = null;
let CardCarousel = null;
// let NojoomHomeBanner = null;
let TabFilter = null;
export const getTemplate = (
  item,
  type,
  _scrollcallback,
  setrefetchdata = null,
  setNotificationAlert = null,
  nojoom,
  route,
  templatesmartdata = null,
  setData,
  setRaomingOfferData,
  searchData,
  roamingData,
  categeoryNameData = null,
  animatedValue,
  scrollpos,
  scrollLeft
) => {
  // console.log('ramesh', templatesmartdata);
  try {
    let _templateid = item?.templatetype + '';
    if (isWANADisabledTemplate(_templateid)) {
      consoleLog('Disabled_Wanna Template', _templateid);
      return <View />;
    }
    switch (_templateid) {
      case '100': {
        if (NotificationCard == null) {
          NotificationCard =
            require('../UIComponent/p_home/NotificationCard').default;
        }
        return <></>;
      }

      case '178': {
        return (
          <RenewalHome
            sourceitem={item}
            urlKey={item?.name}
            key={item?.uniqueid}
            animatedValue={animatedValue}
            scrollpos={scrollpos}
            scrollLeft={scrollLeft}
          />
        );
      }

      case '102': {
        if (Dashboard == null) {
          Dashboard = require('../UIComponent/p_home/Dashboard').default;
        }
        return (
          <View style={{bottom: VERTICAL_20}}>
            <Dashboard
              sourceitem={item}
              urlKey={item?.name}
              key={item?.uniqueid}
            />
          </View>
        );
      }
      case '103': {
        if (item?.elementmeta?.type === 'roamingaccordion') {
          return <RoamingCountries key={item?.uniqueid} pmsitem={item} />;
        }
        if (item?.elementmeta?.controltype === 'slider') {
          return (
            <PageElementFilter
              sourceitem={item}
              urlKey={item?.name}
              key={item?.uniqueid}
              route={route}
            />
          );
        }

        if (Accordion == null) {
          Accordion = require('../UIComponent/p_home/Accordion').default;
        }
        return (
          <Accordion
            _scrollcallback={_scrollcallback}
            sourceitem={item}
            urlKey={item?.name}
            key={item?.uniqueid}
            route={route}
          />
        );
      }
      case '308': {
        if (OffersForYou == null) {
          OffersForYou = require('../UIComponent/p_home/OffersForYou').default;
        }
        return (
          <OffersForYou
            // _scrollcallback={_scrollcallback}
            sourceitem={item}
            urlKey={item?.name}
            key={item?.uniqueid}
            route={route}
            pmsitem={item}
            cardtype={2}
            imageurl={item?.imageurl}
            title={item?.elementmeta?.title}
          />
        );
      }
      // case '169': {
      //   return <Promotionsoffer key={item?.uniqueid} pmsitem={item} />;
      // }
      case '306': {
        return <QuickLinks key={item?.uniqueid} pmsitem={item} />;
      }
      // case '109': {
      //   if (item?.elementmeta?.nojoomtopbanner == 'T') {
      //     return (
      //       <NojoomHomeBanner
      //         pmsitem={item}
      //         sourceitem={item}
      //         url={item?.method}
      //         urlKey={item?.uniqueid}
      //         templatetype={item?.templatetype}
      //         uniqueid={item?.uniqueid}
      //         category={'0'}
      //         description={item?.description}
      //       />
      //     );
      //   } else {
      //     return (
      //       <Banners
      //         sourceitem={item}
      //         urlKey={item?.uniqueid}
      //         key={item?.uniqueid}
      //         pmsitem={item}
      //         nojoom={nojoom}
      //       />
      //     );
      //   }
      // }
      case '110': {
        if (TabFilter == null) {
          TabFilter = require('../models/templates/TabFilter').default;
        }

        return (
          <TabFilter
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
          />
        );
      }
      case '104': {
        // RN_Special Deals
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '309': {
        // RN_Special Deals
        return (
          <Promotionsoffer
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }

      case '109': {
        if (item?.elementmeta?.type == 'roaming_knowmorebanner') {
          return (
            <RoamingBanner
              pmsitem={item}
              url={item?.method}
              urlKey={item?.uniqueid}
            />
          );
        } else if (item?.elementmeta?.type == 'eshopcarousalbanner') {
          return (
            <UpdatedShop
              key={item?.uniqueid}
              templatetype={2}
              uniqueid={item?.uniqueid}
              url={item?.method}
              datasource={item?.sourceid}
              cardtype={2}
              pmstemplateid={_templateid}
              pmsitem={item}
            />
          );
        } else if (
          item?.elementmeta?.nojoomtopbanner == 'T' ||
          item?.elementmeta?.shoptopcaourselbanner == 'T'
        ) {
          return (
            <NojoomHomeBanner
              pmsitem={item}
              sourceitem={item}
              url={item?.method}
              urlKey={item?.uniqueid}
              templatetype={item?.templatetype}
              uniqueid={item?.uniqueid}
              category={'0'}
              description={item?.description}
            />
          );
        } else if (item?.elementmeta?.type == 'mypaymentsbanner') {
          return (
            <SmartPayCardBanner
              key={item?.uniqueid}
              pmsitem={item}
              type={'pay'}
              templatesmartdata={templatesmartdata}
              // smartmethod={}
            />
          );
        } else {
          return (
            <Banners
              sourceitem={item}
              urlKey={item?.uniqueid}
              key={item?.uniqueid}
              pmsitem={item}
              nojoom={nojoom}
            />
          );
        }
      }
      //Greater value section
      case '312':
      case '313':
      case '314':
      case '315': {
        return (
          <WhatWouldYouLike
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '316': {
        return (
          <WhyAna
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '310': {
        // RN_Special Deals
        return (
          <PromotionsCard
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '311': {
        return (
          <NojoomEarnPointsHome
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            pmsitem={item}
            templatetype={311}
            imageurl={item?.imageurl}
          />
        );
      }
      case '320': {
        return <CountrySection key={item?.uniqueid} pmsitem={item} />;
      }
      case '317': {
        return (
          <PopularCountriesViewPacks key={item?.uniqueid} pmsitem={item} />
        );
      }
      case '319': {
        return (
          <PopularCountriesViewPacks key={item?.uniqueid} pmsitem={item} />
        );
      }
      // case '318': {
      //   return (
      //     <
      //       sourceitem={item}
      //       urlKey={item?.uniqueid}
      //       key={item?.uniqueid}
      //       pmsitem={item}
      //       templatetype={318}
      //       imageurl={item?.imageurl}
      //     />
      //   );
      // }
      // case '319': {
      //   return (
      //     <PopularCountries
      //       sourceitem={item}
      //       urlKey={item?.uniqueid}
      //       key={item?.uniqueid}
      //       pmsitem={item}
      //       templatetype={319}
      //       imageurl={item?.imageurl}
      //     />
      //   );
      // }

      case '313': {
        return (
          <PostPaidCategory
            key={item?.uniqueid}
            templatetype={2}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '112': {
        //Special deals template
        if (
          item?.name == 'RN_Special_Deals_List' &&
          global.cvmapicall &&
          global.cvmapicall != null &&
          global.cvmapicall != undefined &&
          global.homecvmoffers == true &&
          global.cvmapicall != '' &&
          global.rateplantype === 'POSTPAID' &&
          type != 'specialdealsdetail'
        ) {
          return (
            <CVMHomeCarousel
              key={item?.uniqueid}
              templatetype={12}
              uniqueid={item?.uniqueid}
              url={item?.method}
              datasource={item?.sourceid}
              numberOfRows={3}
              cardtype={1}
              pmstemplateid={_templateid}
              type={type}
            />
          );
        } else {
          return (
            <HomeCarousel
              key={item?.uniqueid}
              templatetype={12}
              uniqueid={item?.uniqueid}
              url={item?.method}
              datasource={item?.sourceid}
              numberOfRows={type === 'specialdealsdetail' ? 1000 : 3}
              cardtype={1}
              pmstemplateid={_templateid}
              type={type}
            />
          );
        }
      }
      case '171': {
        //cvm offers list template
        return (
          <CVMListCarousel
            key={item?.uniqueid}
            templatetype={12}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={1000}
            cardtype={1}
            pmstemplateid={_templateid}
            type={'cvmofferslist'}
          />
        );
      }
      case '105': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={3}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={4}
            pmstemplateid={_templateid}
            pmsitem={item}
            detailspage={ScreenName.BundleDetails}
          />
        );
      }
      case '148': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={4}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '106': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={4}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
          />
        );
      }
      case '107': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={6}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={1}
            pmstemplateid={_templateid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
        );
      }
      case '108': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={8}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            cardtype={2}
            pmstemplateid={_templateid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
        );
      }
      case '115': {
        // rn_bundle_home_list
        return (
          <BundleHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '109': {
        // rn_bundle_home_list
        return (
          <TransactionHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
          // <View/>
        );
      }
      case '177': {
        // rn_bundle_home_list
        return (
          <TransactionHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
          // <View/>
        );
      }

      case '114': {
        return (
          <AddonsHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '106': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={4}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={2}
            pmstemplateid={_templateid}
          />
        );
      }
      case '122': {
        ///For Dynamic Cards
        return (
          ///Removed suspence as incase of time out crash are happending
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <HomeCarousel
            showTitle={true}
            HeadingText={item?.metadata?.title}
            key={item?.uniqueid}
            templatetype={4}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={1}
            pmstemplateid={_templateid}
            pmsitem={item}
            type={'roamingDeal'}
            setData={setData}
            searchData={roamingData}
          />
          // </Suspense>
        );
      }
      case '120': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <RoamingOffers
            key={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            pmsitem={item}
            uniqueid={item?.uniqueid}
            title={item?.metadata?.title}
            detailedpage={ScreenName.MyCountryDetail}
            route={route}
            searchData={searchData}
            setData={setRaomingOfferData}
          />
          // </Suspense>
        );
      }
      case '123': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <RoamingOffers
            key={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            pmsitem={item}
            uniqueid={item?.uniqueid}
            title={item?.metadata?.title}
            route={route}
          />
          // </Suspense>
        );
      }
      case '305': {
        return (
          <MultiPassportCountryHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '304': {
        return (
          <RoamingOffers
            key={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            pmsitem={item}
            uniqueid={item?.uniqueid}
            title={item?.elementmeta?.title}
            route={route}
            setData={setRaomingOfferData}
            searchData={searchData}
            categeoryNameData={categeoryNameData}
          />
        );
      }
      case '118': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <PassportCountriesHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
          // </Suspense>
        );
      }
      case '128': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <MyCountriesHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
          />
          // </Suspense>
        );
      }
      case '124': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <Banners
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            showfullbanner={true}
            pmsitem={item}
          />
          // </Suspense>
        );
      }
      case '117': {
        return (
          <HomeCarousel
            key={item?.uniqueid}
            templatetype={3}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={4}
            pmstemplateid={_templateid}
            pmsitem={item}
            detailspage={ScreenName.AddonsDetails}
          />
        );
      }
      case '121': {
        if (global.hideRoamingPopup === '1') {
          return <View />;
        }
        return (
          <RoamingPopupTemplate
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            apibody={item?.sourceid}
            apiurl={item?.method}
            templatetype={item?.templatetype}
          />
        );
      }
      case '126': {
        return (
          <RoamingDealsList
            key={'RoamingDealsList' + item?.uniqueid}
            pmsitem={item}
          />
        );
      }
      case '125': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <OoredooPassportList pmsitem={item} />
          // </Suspense>
        );
      }
      case '127': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <RoamingIntlRatesDetail pmsitem={item} />
          // </Suspense>
        );
      }
      case '111': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <HomeDialogue
            message={item?.metadata?.title}
            url={item?.method}
            imageurl={item?.metadata?.image}
            datasource={item?.sourceid}
          />
          // </Suspense>
        );
      }
      case '119': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <RoamingIntlRatesHome pmsitem={item} route={route} />
          // </Suspense>
        );
      }
      case '131': {
        return (
          <OoredooSurpriseBadge
            key={item?.uniqueid}
            templatetype={3}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={4}
          />
        );
      }
      case '129': {
        return (
          <OoredooSurpriseList
            key={item?.uniqueid}
            templatetype={3}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            numberOfRows={3}
            cardtype={4}
            pmsitem={item}
          />
        );
      }
      case '201': {
        return (
          <GreetingComponent
            pmsitem={item}
            key={item?.uniqueid}
            nojoom={true}
          />
        );
      }
      case '311': {
        return (
          <NojoomEarnPointsHome
            pmsitem={item}
            sourceitem={item}
            url={item?.method}
            urlKey={item?.uniqueid}
            templatetype={item?.templatetype}
            uniqueid={item?.uniqueid}
            // category={"0"}
            description={item?.description}
            type={type}
            key={item?.uniqueid}
          />
        );
      }
      case '202': {
        return <NoJoomDashboard key={item?.uniqueid} />;
      }
      case '163': {
        return <FifaWinners pmsitem={item} key={item?.uniqueid} />;
      }
      case '164': {
        return <FifaDraw pmsitem={item} key={item?.uniqueid} />;
      }
      case '165': {
        return <FifaWinnersLeaderboard pmsitem={item} key={item?.uniqueid} />;
      }
      case '203': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <HotDealsOffer pmsitem={item} _scrollcallback={_scrollcallback} />
          // </Suspense>
        );
      }
      case '204': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <PartnerRewardsCategory
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
          // </Suspense>
        );
      }
      case '205': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <OoredooRewards
            key={item?.uniqueid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
          // </Suspense>
        );
      }
      case '206': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <EarnPointsHomeCard
            key={item?.uniqueid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
          // </Suspense>
        );
      }
      case '207': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <TransferPointsCards
            key={item?.uniqueid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
          // </Suspense>
        );
      }
      case '173': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <TransferPointsCards
            key={item?.uniqueid}
            pmsitem={item}
            _scrollcallback={_scrollcallback}
          />
          // </Suspense>
        );
      }
      case '208': {
        return <NojoomPartnerRewardsList key={item?.uniqueid} pmsitem={item} />;
      }
      case '209': {
        return <NojoomOoredooRewardsList pmsitem={item} key={item?.uniqueid} />;
      }
      case '210': {
        return <NojoomEarnPointsList pmsitem={item} key={item?.uniqueid} />;
      }
      case '211': {
        return <NojoomTranferPointsList pmsitem={item} key={item?.uniqueid} />;
      }
      case '130': {
        return (
          <DigitalServicesHome
            pmsitem={item}
            key={item?.uniqueid}
            route={route}
          />
        );
      }
      case '174': {
        return (
          <TransferPointsHome
            pmsitem={item}
            key={item?.uniqueid}
            route={route}
          />
        );
      }
      case '134': {
        return <MoreGuestListingElements key={item?.uniqueid} pmsitem={item} />;
      }
      case '133': {
        return <PayGuestListingElements key={item?.uniqueid} pmsitem={item} />;
      }
      case '135': {
        return <DynamicListingElements key={item?.uniqueid} pmsitem={item} />;
      }
      case '136': {
        return <PrepaidPayBalanceCard key={item?.uniqueid} pmsitem={item} />;
      }
      case '137': {
        return <PostpaidPayBalanceCard key={item?.uniqueid} pmsitem={item} />;
      }
      case '172': {
        return (
          <SmartPayCard
            key={item?.uniqueid}
            pmsitem={item}
            type={type == 'linedetails' ? 'newlinedetails' : 'pay'}
          />
        );
      }
      case '600': {
        return (
          <ProfileHeader key={item?.uniqueid} pmsitem={item} type={'pay'} />
        );
      }
      case '601': {
        return <Newbalance key={item?.uniqueid} response={null} />;
      }

      case '602': {
        // if( global.rateplantype === 'POSTPAID'){
        return (
          <Currentpackviewusagedetails
            key={item?.uniqueid}
            response={null}
            setNotificationAlert={setNotificationAlert}
            _scrollcallback={_scrollcallback}
          />
        );

        // }
        // else{
        // return <></>
        // }
      }

      //newbasic services
      case '603': {
        return (
          <NewBasicserviceList
            message={item?.metadata?.title}
            url={'/v6/api/basicservices/list'}
            imageurl={item?.metadata?.image}
            datasource={'{"type":"basic","skipsub":"T"}'}
          />
        );
      }

      //subscriptions
      case '605': {
        if (
          global.linedetailssubscriptions != null &&
          global.linedetailssubscriptions != undefined &&
          global.linedetailssubscriptions != ''
        ) {
          return (
            <Newsubscriptions
              key={'545'}
              showresponse={global.linedetailssubscriptions}
              type={'subscriptions'}
              callbackApiMethod={() => {}}
              title={item?.elementmeta?.title}>
              {' '}
            </Newsubscriptions>
          );
        } else {
          return <></>;
        }
      }

      //line details header
      case '606': {
        if (
          (global.internetdata != null &&
            global.internetdata != undefined &&
            global.internetdata != '' &&
            global.internetdata?.Services?.length > 0) ||
          (global.linedetailminutes != null &&
            global.linedetailminutes != undefined &&
            global.linedetailminutes != '' &&
            global.linedetailminutes?.Services?.length > 0) ||
          (global.linedetailsms != null &&
            global.linedetailsms != undefined &&
            global.linedetailsms != '' &&
            global.linedetailsms?.Services?.length > 0) ||
          (global.linedetailroaming != null &&
            global.linedetailroaming != undefined &&
            global.linedetailroaming != '' &&
            global.linedetailroaming?.Services?.length > 0)
        ) {
          return (
            <Headerlinedetails
              title={item?.elementmeta?.title}
              type={'linedetails'}
            />
          );
        } else {
          return <></>;
        }
      }

      //data
      case '607': {
        return (
          <NewRemaininginfo
            key={'1'}
            netData={global.internetcoremynet}
            infoObject={GenerateLineDetails(global.internetdata)}
            data={[
              {
                type: 'internet',
              },
            ]}
            infotype={'data'}
          />
        );
      }

      //voice
      case '608': {
        return (
          <NewRemaininginfo
            key={'11'}
            infoObject={GenerateLineDetails(global.linedetailminutes)}
            data={[
              {
                type: 'voice calls',
              },
            ]}
            infotype={'voice'}
          />
        );
      }
      //sms

      case '609': {
        return (
          <NewRemaininginfo
            key={'13'}
            infoObject={GenerateLineDetails(global.linedetailsms)}
            data={[
              {
                type: 'voice calls',
              },
            ]}
            infotype={'sms'}
          />
        );
      }

      //roaming

      case '610': {
        return (
          <NewRemaininginfo
            key={'42'}
            infoObject={GenerateLineDetails(global.linedetailroaming)}
            data={[
              {
                internet: 1,
              },
            ]}
            infotype={'roaming'}
          />
        );
      }

      //shamel pro control
      //

      case '611': {
        if (
          global.Shamelprocontroles != null &&
          global.Shamelprocontroles != undefined &&
          global.Shamelprocontroles != '' &&
          global.rateplantype === 'POSTPAID'
        ) {
          return (
            // <View>
            <Shamelprocontrol
              detail={global.Shamelprocontroles}
              // isloading={true}
              // setisloading={setisloading}
              setisloading={false}
              setrefetchdata={setrefetchdata}
            />
            // </View>
          );
        } else {
          return <></>;
        }
      }
      //packs and sbscriptions

      // case '612': {
      //   return (
      //     <Headerlinedetails
      //     // message={item?.metadata?.title}
      //     // url={item?.method}
      //     // imageurl={item?.metadata?.image}
      //     // datasource={item?.sourceid}
      //     title={item?.elementmeta?.title}

      //   />

      //   );
      // }

      case '612': {
        if (
          global.linedetailsmycurrentpacks != null &&
          global.linedetailsmycurrentpacks != undefined &&
          global.linedetailsmycurrentpacks != ''
        ) {
          return (
            <Activepacks
              key={'53'}
              showresponse={global.linedetailsmycurrentpacks}
              passportList={global.linedetailspassportlist}
              type={'currentpacks'}
              callbackApiMethod={() => {}}
              elementmeta={item?.elementmeta}>
              {' '}
            </Activepacks>
            // <></>
          );
        } else {
          return <></>;
        }
      }

      case '613': {
        return (
          <Goupbutton
            key={'53'}
            showresponse={global.linedetailsmycurrentpacks}
            passportList={global.linedetailspassportlist}
            type={'currentpacks'}
            _scrollcallback={_scrollcallback}
            title={item?.elementmeta?.title}>
            {' '}
          </Goupbutton>
        );
      }

      case '614': {
        return (
          <ProfileComponent pmsitem={null} key={0} nojoom={0} type={'more'} />
        );
      }
      case '615': {
        return (
          <DynamicListingMoreElements key={item?.uniqueid} pmsitem={item} />
        );
      }

      // case '616': {
      //   return (
      //     <LineSeparator/>
      //   );
      // }
      // case '616': {
      //   if(  global.rnuserdetails==""&&  global.rnuserdetails==undefined&&  global.rnuserdetails==null){
      //     return;
      //   }
      //   return (
      //     <NewInTheApp pmsitem={null} key={0} nojoom={0} />
      //   );
      // }
      case '622': {
        return (
          <DynamicListingMoreElements key={item?.uniqueid} pmsitem={item} />
        );
      }

      case '623': {
        return (
          <DynamicListingMoreElements key={item?.uniqueid} pmsitem={item} />
        );
      }
      case '624': {
        return (
          <DynamicListingMoreElements key={item?.uniqueid} pmsitem={item} />
        );
      }

      case '625': {
        return (
          <ProfileComponent
            pmsitem={item}
            key={item?.uniqueid}
            nojoom={0}
            type={'guest'}
          />
        );
      }
      case '616': {
        return <LanguageSettings pmsitem={item} key={0} nojoom={0} />;
      }

      // <LineSeparator />
      // <NewInTheApp />
      case '139': {
        return <MessageTemplate key={item?.uniqueid} pmsitem={item} />;
      }
      case '303': {
        return <ShopHomeSearch key={item?.uniqueid} pmsitem={item} />;
      }

      case '302': {
        if (item?.elementmeta?.type == 'eshopbanner') {
          return <StaticShopBanner key={item?.uniqueid} pmsitem={item} />;
        } else {
          return <ShopCategoryBanner key={item?.uniqueid} pmsitem={item} />;
        }
      }

      // return <ShopCategoryBanner key={item?.uniqueid} pmsitem={item} />

      case '301': {
        // if (item?.elementmeta?.eshopbannerlist == 'T') {

        return <SummerNewCollections key={item?.uniqueid} pmsitem={item} />;

        // } else {

        //   return (

        //     <SummerNewCollections key={item?.uniqueid} pmsitem={item} />

        //   );

        // }
      }
      case '155': {
        return (
          <CircleBanner
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            showfullbanner={true}
            pmsitem={item}
          />
        );
      }
      case '156': {
        return (
          <Spinwinpopup
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            showfullbanner={true}
            pmsitem={item}
          />
        );
      }
      case '157': {
        return (
          <SelectTeam
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            showfullbanner={true}
            pmsitem={item}
          />
        );
      }
      case '159': {
        return (
          <DashboardTeams
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '160': {
        return (
          <TeamScoreTemplate
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }

      case '161': {
        return (
          <WatchVideo
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            _scrollcallback={_scrollcallback}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '162': {
        return (
          // <Suspense fallback={<Suspeneloader />} key={item?.uniqueid}>
          <HotDealsOffer
            pmsitem={item}
            _scrollcallback={_scrollcallback}
            type={'fifa'}
          />

          // </Suspense>
        );
      }

      case '151': {
        return <Recommendations key={item?.uniqueid} sourceitem={item} />;
      }
      case '149': {
        return (
          <BasicserviceList
            message={item?.metadata?.title}
            url={item?.method}
            imageurl={item?.metadata?.image}
            datasource={item?.sourceid}
          />
        );
      }
      case '141': {
        return (
          <ANADialogue
            message={item?.metadata?.title}
            description={item?.metadata?.desc}
            url={item?.method}
            imageurl={item?.metadata?.icon}
            buttonText={item?.metadata?.button_text}
            button_text1={item?.metadata?.button_text1}
            datasource={item?.sourceid}
            templateID={_templateid}
            showIcon={true}
            pmsitem={item}
          />
        );
      }
      case '142': {
        return (
          <ANADialogue
            message={item?.elementmeta?.title}
            description={item?.elementmeta?.desc}
            url={item?.method}
            imageurl={item?.elementmeta?.icon}
            buttonText={item?.elementmeta?.button_text}
            button_text1={item?.elementmeta?.button_text1}
            datasource={item?.sourceid}
            templateID={_templateid}
            showIcon={true}
            pmsitem={item}
            designtype={item?.elementmeta?.designtype}
          />
        );
      }
      case '153': {
        return <GreetingComponent pmsitem={item} key={item?.uniqueid} />;
      }
      case '152': {
        return (
          <DashboardWanna
            sourceitem={item}
            urlKey={item?.name}
            key={item?.uniqueid}
          />
        );
      }
      case '150': {
        return <NoNumbExist data={item?.metadata} />;
      }
      case '144': {
        return <XpressProfitBalance pmsitem={item} />;
      }
      case '146': {
        return <TransactionHistory pmsitem={item} />;
      }
      case '145': {
        return <TransferBalance pmsitem={item} route={route} />;
      }
      case '147': {
        return <LoadBalance pmsitem={item} route={route} />;
      }
      case '154': {
        return (
          <View style={{}}>
            <HomeCarousel
              showTitle={!(item?.elementmeta?.fulllistview === 'T')}
              HeadingText={item?.elementmeta?.title}
              key={item?.uniqueid}
              templatetype={3}
              uniqueid={'upsellKey'}
              url={item?.method}
              datasource={item?.sourceid}
              numberOfRows={item?.elementmeta?.fulllistview === 'T' ? 100 : 1}
              cardtype={4}
              pmstemplateid={_templateid}
              pmsitem={item}
              detailspage={ScreenName.Upsell5gDetails}
              type={'upsell'} // this will use for styling condition, eg white bg,icon etc
            />
          </View>
        );
      }
      case '304': {
        return (
          <RoamingOffers
            key={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            pmsitem={item}
            uniqueid={item?.uniqueid}
            title={item?.elementmeta?.title}
            route={route}
          />
        );
      }
      case '305': {
        return (
          <MultiPassportCountryHome
            key={item?.uniqueid}
            uniqueid={item?.uniqueid}
            url={item?.method}
            datasource={item?.sourceid}
            item={item}
            category={''}
            pmstemplateid={_templateid}
            route={route}
          />
        );
      }
      case '167': {
        return <BuyMorePoint pmsitem={item} route={route} />;
      }
      case '166': {
        return <OoredooAdd key={item?.uniqueid} pmsitem={item} />;
      }
      case '170': {
        // in pay tab transaction history
        return (
          <DynamicTransactionHistory
            sourceitem={item}
            urlKey={item?.uniqueid}
            key={item?.uniqueid}
            pmsitem={item}
          />
        );
      }

      case '175': {
        return (
          <RecentPurchases
            showTitle={true}
            item={item}
            title={item?.metadata.title}
            key={item?.uniqueid}
            sourceitem={item}
            urlKey={item?.uniqueid}
            pmstemplateid={_templateid}
            url={item?.method}
            datasource={item?.sourceid}
            category={0}
            route={route}
            viewall={item?.metadata.show_viewall}
            imageurl={item?.metadata.icon}
            showIcon={true}
          />
        );
      }

      case '617': {
        return <SupportBanner key={item?.uniqueid} pmsitem={item} />;
      }
      case '626':
      case '618': {
        return <Support key={item?.uniqueid} pmsitem={item} />;
      }
      case '627':
      case '619': {
        return <SupportQuicklinks key={item?.uniqueid} pmsitem={item} />;
      }
      case '620': {
        return <SupportOoredooPedia key={item?.uniqueid} pmsitem={item} />;
      }
      case '621': {
        return <SupportWantToTalk key={item?.uniqueid} pmsitem={item} />;
      }
      case '628': {
        return <SupportBillPayments key={item?.uniqueid} pmsitem={item} />;
      }
      case '629': {
        return (
          <MyHistory key={item?.uniqueid} pmsitem={item} type={'support'} />
        );
      }
      case '630': {
        return <SupportPaymentsQuiries key={item?.uniqueid} pmsitem={item} />;
      }

      default: {
        // consoleLog('Missing', item);
        return <View />;
      }
    }
  } catch (e) {
    return <View />;
  }
};

export const Suspeneloader = () => {
  return (
    <View
      style={{
        flex: 1,
        minHeight: HEIGHT_200,
        justifyContent: 'center',
        alignContent: 'center',
      }}>
      <ActivityIndicator size="small" color={colors.OOREDOO_RED} />
    </View>
  );
};

const isWANADisabledTemplate = _tmpid => {
  try {
    if (global.wanastage != null && global.wanastage === '3') {
      if (global.wanatemplates != null && global.wanatemplates?.length > 5) {
        let _tmp = global.wanatemplates
          .split(',')
          .filter(x => x + '' == _tmpid + '');
        if (_tmp != null && _tmp.length > 0) {
          return true; /// to be enabled for stage 3
        }
      }
    }
  } catch (e) {}
  return false;
};
