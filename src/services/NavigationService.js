import {
  consoleLog,
  isLinkExternal,
  removeItem,
  TO_UPPER_CASE,
} from '../commonHelper/utils';

import {LOGIN_TYPE, MOBILEID_TIMER_STATUS} from '../commonHelper/Constants';
import {Linking} from 'react-native';
import ScreenName from '../navigator/ScreenName';
import {StackActions} from '@react-navigation/native';

export const NavigateCards = (
  navigation,
  item = null,
  action = null,
  pgname = null,
  params = null,
  templateid = null,
  tomsisdn = null
) => {
  try {
    if (templateid != null) {
      switch (templateid) {
        case '105': {
          NavigateByName(navigation, 'bundledetails', null, item);
          return;
        }
        case '177': {
          NavigateByName(navigation, 'transactiondetails', null, item);
          return;
        }

        case '112':
        case '171': {
          NavigateByName(navigation, 'SpecialDealsProductDetail', params, item);
          return;
        }
        case '122': {
          NavigateByName(navigation, 'roamingdetails', null, item, params);
          return;
        }
        case '400': {
          NavigateByName(navigation, 'ShamelproDetail', null, item);
          return;
        }
      }
    }
    if (pgname != null && pgname != '') {
      if (pgname.indexOf('nojoom') > 0) {
        NavigateByName(navigation, pgname, params, item, tomsisdn);
      } else {
        NavigateByName(navigation, pgname, params, item, tomsisdn);
      }
    } else if (item != null && item !== undefined) {
      if (
        item.navigation != null &&
        item.navigation !== undefined &&
        item.navigation.action != null &&
        item.navigation.action !== undefined &&
        item.navigation.action.length > 2
      ) {
        NavigateCardByAction(navigation, item.navigation);
      } else if (item?.cardtype != null && item?.cardtype !== undefined) {
        if (item?.cardtype === 'RN_Roamingdeals') {
          NavigateByName(navigation, 'roamingdetails', null, item);
        }
      } else {
        if (item.buyurl != null && item.buyurl != undefined) {
          NavigateByName(
            navigation,
            item.buyurl,
            params,
            item,
            null,
            params?.type == 'shop' ? 'T' : null
          );
        } else if (item.redirect != null && item.redirect != undefined) {
          NavigateByName(navigation, item.redirect);
        } else if (item.url != null && item.url != undefined) {
          NavigateByName(navigation, item.url);
        }
      }
    } else if (action != null && action !== undefined) {
      NavigateCardByAction(navigation, action);
    } else {
      if (item.buyurl != null && item.buyurl != undefined) {
        NavigateByName(navigation, item.buyurl, params, item, null, 'T');
      } else if (item.redirect != null && item.redirect != undefined) {
        NavigateByName(navigation, item.redirect);
      } else if (item.url != null && item.url != undefined) {
        NavigateByName(navigation, item.url);
      }
    }
  } catch (e) {}
  return null;
};
function NavigateCardByAction(navigation, action) {
  if (action.type == null || action.type === 'page') {
    navigation.navigate(action.stackName, {
      screen: action.screenName,
      params: action.params,
    });
  }
}

export const NavigateByName = (
  navigation,
  screenname,
  params = null,
  item = null,
  tomsisdn = null,
  showfooter = null,
  headerTitle = null,
  isSameFooter = null,
  typeofscreen = null,
  webviewtype = null
) => {
  global.notifyredirect = null;
  global.deeplinkurl = null;
  setTimeout(() => {
    global.isQuestTracker = null;
  }, 5000);
  let newUrl = [];
  if (screenname?.includes('#')) {
    global.deeplinkKeyword = screenname;
    newUrl = screenname.split('#');
    if (newUrl.length > 0) {
      screenname = newUrl[0];
      params = {};
      params.id = newUrl[1];
    }
  }
  try {
    if (screenname.split('|').length == 2) {
      let _catg = screenname.split('|')[1];
      let _screenname = screenname.split('|')[0];
      if (_screenname == 'addonscategory') {
        navigation.navigate(ScreenName.AddonsCategory, {
          screen: ScreenName.AddonsCategory,
          params: {
            categoryid: _catg,
            categorytitle: item?.title != null ? item?.title : _catg,
            imagepath: item?.imagepath != null ? item?.imagepath : '',
          },
        });
        return;
      } else if (_screenname == 'bundlecategory') {
        navigation.navigate(ScreenName.BundleCategory, {
          screen: ScreenName.BundleCategory,
          params: {
            categoryid: _catg,
            categorytitle: item?.title != null ? item?.title : _catg,
            imagepath: item?.imagepath != null ? item?.imagepath : '',
          },
        });
        return;
      } else if (_screenname == 'TransactionsCategory') {
        navigation.navigate(ScreenName.TransactionsCategory, {
          screen: ScreenName.TransactionsCategory,
          params: {
            categoryid: _catg,
            categorytitle: item?.title != null ? item?.title : _catg,
            imagepath: item?.imagepath != null ? item?.imagepath : '',
          },
        });
        return;
      } else if (_screenname == 'OAssist') {
        navigation.navigate(ScreenName.OAssist, {
          screen: ScreenName.OAssist,
          params: {
            innerparentid: _catg,
          },
        });
        return;
      }
    }
  } catch (e) {}
  try {
    switch (screenname) {
      case 'diy':
      case 'diyscreen':
      case 'mysuprise':
      case 'mysurprise':
      case 'https://www.ooredoo.com.kw/portal/ar/mysuprise':
      case 'https://www.ooredoo.com.kw/portal/en/mysuprise': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.DIYScreen,
        });
        return;
      }
      case 'smartpayenroll': {
        if (isSameFooter === 'T') {
          navigation.navigate(ScreenName.SmartPayEnrollPayment, {
            screen: ScreenName.SmartPayEnrollPayment,
            item: {type: 'more'},
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                    },
                  ],
                },
              },
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                      state: {
                        routes: [
                          {
                            name: ScreenName.SmartPayEnrollPayment,
                            params:
                              typeofscreen == 'newlinedetails'
                                ? 'newlinedetails'
                                : '',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            ],
          });
        }
        return;
      }
      // case 'smartpayenroll': {
      //   navigation.reset({
      //     index: 1,
      //     routes: [
      //       {
      //         name: ScreenName.tabStack,
      //         state: {
      //           routes: [
      //             {
      //               name: ScreenName.PayStack,
      //             },
      //           ],
      //         },
      //       },
      //       {
      //         name: ScreenName.tabStack,
      //         state: {
      //           routes: [
      //             {
      //               name: ScreenName.PayStack,
      //               state: {routes: [{name: ScreenName.SmartPayDetail}]},
      //             },
      //           ],
      //         },
      //       },
      //     ],
      //   });
      //   return;
      // }
      case 'eshopprepaid': {
        global.iscleartemplatedata = 'T';
        navigation.navigate(ScreenName.EshopPlanHomeIndex, {
          screen: ScreenName.EshopPlanHomeIndex,
          params: item,
        });
        return;
      }
      case 'eshoppostpaid': {
        global.iscleartemplatedata = 'T';
        navigation.navigate(ScreenName.EshopPlanHomeIndex, {
          screen: ScreenName.EshopPlanHomeIndex,
          params: item,
        });
        return;
      }
      case 'eshopana': {
        global.iscleartemplatedata = 'T';
        navigation.navigate(ScreenName.EshopPlanHomeIndex, {
          screen: ScreenName.EshopPlanHomeIndex,
          params: item,
        });
        return;
      }
      case 'smartpaymanage': {
        if (typeofscreen === 'managecard' || isSameFooter === 'T') {
          navigation.navigate(ScreenName.SmartPayManageRenewal, {
            data: item,
            typeofscreen: typeofscreen,
            isSameFooter: isSameFooter,
          });
          return;
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {name: navigation.navigate(ScreenName.PayStack)},
              {
                name: navigation.navigate(ScreenName.SmartPayManageRenewal),
              },
            ],
          });
        }

        // navigation.navigate(ScreenName.PayStack, {
        //   screen: ScreenName.SmartPayManageRenewal,
        //   // params: params,
        // });
        // navigation.reset({
        //   index: 1,
        //   routes: [
        //     {
        //       name: ScreenName.tabStack,
        //       state: {
        //         routes: [
        //           {
        //             name: ScreenName.PayStack,
        //           },
        //         ],
        //       },
        //     },
        //     {
        //       name: ScreenName.tabStack,
        //       state: {
        //         routes: [
        //           {
        //             name: ScreenName.PayStack,
        //             state: {routes: [{name: ScreenName.SmartPayManageRenewal}]},
        //           },
        //         ],
        //       },
        //     },
        //   ],
        // });

        return;
      }
      // case 'smartpaymanage': {
      //   navigation.reset({
      //     index: 1,
      //     routes: [
      //       {
      //         name: ScreenName.tabStack,
      //         state: {
      //           routes: [
      //             {
      //               name: ScreenName.PayStack,
      //             },
      //           ],
      //         },
      //       },
      //       {\
      //         name: ScreenName.tabStack,
      //         state: {
      //           routes: [
      //             {
      //               name: ScreenName.PayStack,
      //               state: {routes: [{name: ScreenName.SmartPayManage}]},
      //             },
      //           ],
      //         },
      //       },
      //     ],
      //   });

      //   return;
      // }
      case 'smartpayeditnumbers': {
        navigation.navigate(ScreenName.SmartPayEditNumbers, {data: item});
        return;
      }
      case 'smartpayeditcard': {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.SmartPayEditCard,
          params: params,
        });
        return;
      }
      case 'account':
      case 'moreaccounts': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.MyAccount,
          data: item,
        });
        // navigation.navigate(ScreenName.MyAccount, { data: item });
        return;
      }
      case 'profileupdate':
      case 'updateemail':
      case 'editprofile': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.profileinfoScreen,
          data: item,
        });
        // navigation.navigate(ScreenName.profileinfoScreen, { data: item });
        return;
      }
      case 'historyviewdetails': {
        navigation.navigate(ScreenName.HistoryDetails, {
          screen: ScreenName.HistoryDetails,
          data: item,
        });
        // navigation.navigate(ScreenName.HistoryDetails, {data: item});
        return;
      }
      case 'supportpaymenttransactions':
      case 'transactionhistory': {
        navigation.navigate(ScreenName.MyHistory, {
          screen: ScreenName.MyHistory,
          params: item,
        });
        // navigation.navigate(ScreenName.MyHistory, {data: item});
        return;
      }

      case 'morepayments':
      case 'mypayments': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.MyPayment,
          data: item,
        });
        // navigation.navigate(ScreenName.MyPayment, { data: item });
        return;
      }
      case 'supportpayments': {
        navigation.navigate(ScreenName.SupportPayments, {
          screen: ScreenName.SupportPayments,
          params: item,
        });
        return;
      }
      case 'shoponapp': {
        navigation.navigate(ScreenName.ShopStack, {
          screen: ScreenName.ShopOnAppLandingPage,
          params: item,
        });
        return;
      }
      case 'password':
      case 'passwordmanagement': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.PasswordManagement,
          params: item,
        });
        // navigation.navigate(ScreenName.PasswordManagement, { data: item });
        return;
      }
      case 'deleteaccountform': {
        navigation.navigate(ScreenName.AccountDeletionForm, {data: item});
        return;
      }
      case 'passwordmanagement': {
        navigation.navigate(ScreenName.PasswordManagement, {data: item});
        return;
      }
      case 'termsandconditions': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.TermsAndConditions,
          params: item,
        });
        //navigation.navigate(ScreenName.TermsAndConditions, { data: item });
        return;
      }

      case 'personalinfo': {
        navigation.navigate(ScreenName.profileinfoScreen, {data: item});
        return;
      }
      case 'ssoverifyid':
      case 'civilidverification':
      case 'verifycivilid': {
        navigation.navigate(ScreenName.CivilIDUpdate, {
          isPassport: false,
        });
        return;
      }
      case 'verifypassport': {
        navigation.navigate(ScreenName.CivilIDUpdate, {
          isPassport: true,
        });
        return;
      }
      case 'bundlecategory': {
        navigation.navigate(ScreenName.BundleCategory, {
          screen: ScreenName.BundleCategory,
          params: params,
        });
        return;
      }
      case 'TransactionsCategory': {
        navigation.navigate(ScreenName.TransactionsCategory, {
          screen: ScreenName.TransactionsCategory,
          params: params,
        });
        return;
      }
      case 'addonscategory': {
        navigation.navigate(ScreenName.AddonsCategory, {
          screen: ScreenName.AddonsCategory,
          params: params,
        });
        return;
      }
      case 'winnerleaderboard': {
        global.winnerleaderboard = 'winnerleaderboard';
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.FifaLeaderboard,
          params: item,
        });
        return;
      }
      case 'leaderboard':
      case ScreenName.FifaLeaderboard: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.FifaLeaderboard,
          params: item,
        });
        return;
      }
      case ScreenName.SupportedCountryScreen: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.SupportedCountryScreen,
          params: {
            item: item,
            roamingbanners: params,
          },
        });
        return;
      }
      case ScreenName.NotSupportedCountryScreen: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.NotSupportedCountryScreen,
          params: {
            item: item,
          },
        });
        return;
      }
      case 'digitalcategory': {
        navigation.navigate(ScreenName.DigitalCategory, {
          screen: ScreenName.DigitalCategory,
          params: params,
        });
        return;
      }
      case 'digitalProductDetail':
      case 'digitalproductdetail': {
        if (
          global.deeplinkKeyword != null &&
          global.deeplinkKeyword != undefined &&
          global.deeplinkKeyword != ''
        ) {
          try {
            if (global.deeplinkKeyword?.includes('#')) {
              var spiltValue = global.deeplinkKeyword.split('#');
              if (spiltValue != null && spiltValue != undefined) {
                navigation.navigate(ScreenName.homeStack, {
                  screen: ScreenName.DigSerPrev,
                  params: {
                    serviceid: spiltValue[1],
                    servicename: spiltValue[1],
                  },
                });
                return;
              }
            } else {
              navigation.navigate(ScreenName.homeStack, {
                screen: ScreenName.homeScreen,
              });
              return;
            }
          } catch (e) {}
        } else {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.homeScreen,
          });
          return;
        }
      }
      case 'digitalactivation':
      ///case 'digitalProductDetail':
      case 'DigSerPrev': {
        try {
          navigation.navigate(ScreenName.DigSerPrev, {
            serviceid: params?.serviceid || item?.id,
            servicename: params?.servicename || item?.alias,
          });
        } catch (e) {}

        return;
      }

      case 'DigSerPrevDetails': {
        try {
          navigation.navigate(ScreenName.DigSerPrev, {
            serviceid: item.offerid,
            servicename: item.title,
          });
        } catch (e) {}

        return;
      }
      case 'bundledetails': {
        navigation.navigate(ScreenName.BundleDetails, {
          screen: ScreenName.BundleDetails,
          params: {
            offerid: item.offerid,
            category: item.offercategory,
          },
        });
        return;
      }

      case 'friendsproductdetails': {
        navigation.navigate(ScreenName.FriendsProductDetails, {
          screen: ScreenName.FriendsProductDetails,
          params: {
            offerid: item?.offerid,
            category: item?.offercategory,
          },
        });
        return;
      }
      case 'TransactionDetails': {
        navigation.navigate(ScreenName.TransactionDetails, {
          screen: ScreenName.TransactionDetails,
          params: {
            offerid: item.offerid,
            category: item.offercategory,
          },
        });
        return;
      }
      case 'runningoutInternet': {
        global.clickdetails = new Date().getTime();
        navigation.navigate(ScreenName.runningoutInternet, {
          screen: ScreenName.runningoutInternet,
          params: {
            offerid: item.offerid,
            category: item.offercategory,
          },
        });
        return;
      }
      case 'addonsdetails': {
        navigation.navigate(ScreenName.AddonsDetails, {
          screen: ScreenName.AddonsDetails,
          params: {
            offerid: item.offerid,
            category: item.offercategory,
          },
        });
        return;
      }
      case 'specialdeals':
      case ScreenName.specialdeal:
      case ScreenName.Specialdeals: {
        if (
          global.customerprofile != null &&
          global.customerprofile != undefined &&
          global.customerprofile != '' &&
          global.customerprofile?.RatePlanType != null &&
          global.customerprofile?.RatePlanType != undefined &&
          global.customerprofile?.RatePlanType != '' &&
          (global.customerprofile?.RatePlanType === 'POSTPAID' ||
            global.customerprofile?.RatePlanType === 'postpaid' ||
            global.customerprofile?.RatePlanType === 'Postpaid')
        ) {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.Specialdeals,
          });
        } else {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.homeScreen,
          });
        }
        return;
      }
      case 'SpecialDealsProductDetail': {
        navigation.navigate(ScreenName.SpecialDealsProductDetail, {
          screen: ScreenName.SpecialDealsProductDetail,
          params: {
            offerid: item.offerid,
            category: item.category,
            item: item,
            params: params,
          },
        });
        return;
      }
      case 'cvmproductdetail': {
        navigation.navigate(ScreenName.SpecialDealsProductDetail, {
          screen: ScreenName.SpecialDealsProductDetail,
          params: {
            offerid: item.offerid,
            category: item.category,
            item: item,
            params: params,
          },
        });
        return;
      }

      case 'ooredooservicebundleDetail': {
        navigation.navigate(ScreenName.OoredooServiceBundleDetail, {
          screen: ScreenName.OoredooServiceBundleDetail,
          params: {
            id: item.id,
            name: item.name,
            item: item,
            params: params,
            tomsisdn: tomsisdn,
          },
        });
        return;
      }
      case ScreenName.roaming:
      case 'roamingviewall':
      case 'viewallroaming':
      case ScreenName.roamingviewall:
      case 'roaminghomenew':
      case 'roaminghome':
      case 'roamingpacks': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.ViewPacks,
        });
        return;
      }
      case 'passport':
      case 'regionalpassport':
      case 'globalpassport':
      case 'passportmulticountry': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.PassportMultiCountry,
          params: {
            id: item?.id || params?.id,
          },
        });
        return;
      }

      case 'viewpacks': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.ViewPacks,
        });
        return;
      }
      case 'passportcountries': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.PassportCountries,
          params: {
            id: item?.id || params?.id,
          },
        });
        return;
      }
      case 'mycountryviewall':
      case 'mycountry':
      case 'mycountry viewall':
      case ScreenName.MyCountry:
      case 'mycountryhome': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.ViewPacks,
        });
        return;
      }
      case 'checklogs': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.LogsView,
        });
        return;
      }
      case 'mycountrydetails':
      case 'mycountrydetail': {
        if (
          global.deeplinkKeyword != null &&
          global.deeplinkKeyword != undefined &&
          global.deeplinkKeyword != ''
        ) {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.ViewPacks,
          });
          return;
        } else {
          navigation.navigate(ScreenName.MyCountryDetail, {
            screen: ScreenName.MyCountryDetail,
            item: {
              title: item.title,
              imageurl: item.imageurl,
              countrydailingcode: item.countrydailingcode,
              supported_operators_label: item.supported_operators_label,
              supported_operators: item.supported_operators,
              description: item.description,
              alttitle: item.alttitle,
              offerbaseprice: item.offerbaseprice,
              item: item,
            },
          });
          return;
        }
      }
      case 'mycountrypaymentview': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.MyCountryPaymentView,
        });
        return;
      }
      case 'roaming deals':
      case 'roamingdeals':
      case 'roamingdeals viewall':
      case 'roamingdealsviewall': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.RoamingDealsList,
        });
        return;
      }
      case 'roamingRates':
      case 'roamingrates':
      case 'roamingIntRates': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.roamingrates,
        });
        return;
      }
      case 'roaming passport':
      case 'roamingpassport':
      case 'roamingpassportviewall':
      case 'roaming passport viewall':
      case 'ooredoopassporthome':
      case 'ooredoopassport':
      case 'ooredoo passport': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.PassportMultiCountry,
        });
        return;
      }
      case 'roamingdealdetails':
      case 'roamingdetails': {
        if (
          global.deeplinkKeyword != null &&
          global.deeplinkKeyword != undefined &&
          global.deeplinkKeyword != ''
        ) {
          if (
            (global.deeplinkKeyword?.includes('#') ||
              global.deeplinkKeyword == 'roamingdetails') &&
            (item?.offerid == '' ||
              item?.offerid == null ||
              item?.offerid == undefined ||
              item == null ||
              item == undefined)
          ) {
            navigation.navigate(ScreenName.homeStack, {
              screen: ScreenName.ViewPacks,
            });
            //global.deeplinkKeyword = null;
            return;
          } else {
            navigation.navigate(ScreenName.RoamingDetails, {
              screen: ScreenName.RoamingDetails,
              params: {
                offerid: item.offerid,
                category: item.offercategory,
                item: item,
                totaldata: params,
              },
            });
            return;
          }
        } else {
          navigation.navigate(ScreenName.RoamingDetails, {
            screen: ScreenName.RoamingDetails,
            params: {
              offerid: item.offerid,
              category: item.offercategory,
              item: item,
              totaldata: params,
            },
          });
          return;
        }
      }
      case ScreenName.OoredooSurpriseScreen:
      case 'specialOffer':
      case 'specialoffers':
      case ScreenName.Specialoffers:
      case 'ooredoosurprise': {
        navigation.reset({
          index: 1,
          routes: [
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.homeStack,
                  },
                ],
              },
            },
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.homeStack,
                    state: {
                      routes: [
                        {
                          name: ScreenName.OoredooSurpriseScreen,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        });
        return;
      }
      case 'roamingintl': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.RoamingIntl,
        });
        return;
      }
      case 'roaming':
      case 'home': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.homeScreen,
          params: {
            id: params?.id || item?.id,
          },
        });

        return;
      }
      case 'wallet':
      case 'creditselectoption':
      case 'payhome': {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.PayHome,
        });
        return;
      }
      case 'moremenu':
      case 'rn_more_v3':
      case 'more':
      case 'More':
      case 'morehome': {
        if (
          global.logintype == null ||
          global.logintype === '' ||
          global.logintype === undefined
        ) {
          navigation.navigate(ScreenName.MoreStack, {
            screen: ScreenName.MoreGuestHomeNew,
          });
        } else {
          navigation.navigate(ScreenName.MoreStack, {
            screen: ScreenName.moreScreen,
          });
        }

        return;
      }
      case ScreenName.RoamingIntlDetails: {
        navigation.navigate(ScreenName.RoamingIntlDetails, {
          itemData: item,
        });
        return;
      }
      case ScreenName.NojoomDashboardDetails: {
        navigation.navigate(ScreenName.NojoomDashboardDetails, {
          itemData: item,
        });
        return;
      }
      case 'nojoompartners':
      case ScreenName.NojoomPartnerRewardsHome: {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomPartnerRewardsHome,
        });
        return;
      }
      case ScreenName.Nojoompartnerrewardscategory: {
        navigation.navigate(ScreenName.Nojoompartnerrewardscategory, {
          screen: ScreenName.Nojoompartnerrewardscategory,
          params: params,
        });
        return;
      }
      case ScreenName.Nojoomooredoorewardscategory: {
        navigation.navigate(ScreenName.Nojoomooredoorewardscategory, {
          screen: ScreenName.Nojoomooredoorewardscategory,
          params: params,
        });
        return;
      }
      case ScreenName.NojoomPartnerRewardsDetails: {
        navigation.navigate(ScreenName.NojoomPartnerRewardsDetails, {
          screen: ScreenName.NojoomPartnerRewardsDetails,
          params: {
            offerid: item.id,
            category: item.id,
            item: item,
          },
        });
        return;
      }

      case ScreenName.NojoomOoredooRewardsHome: {
        navigation.navigate(ScreenName.NojoomOoredooRewardsHome, {
          ...params,
        });
        return;
      }
      case 'nojoomservices': {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomOoredooRewardsHome,
          params: params,
        });
        return;
      }
      case ScreenName.NojoomOoredooRewardsElementList: {
        navigation.navigate(ScreenName.NojoomOoredooRewardsElementList, {
          ...params,
        });
        return;
      }
      case 'transfertopartner': {
        removeItem(MOBILEID_TIMER_STATUS);
        global.modaltransfercredit = true;
        global.authType = 'transfertopartner';
        global.categoryData = params;
        setTimeout(() => {
          navigation.navigate('Modal');
        }, 100);
        return;
      }
      case 'transfertopartnerpoints':
      case 'nojoomtransferpoints': {
        removeItem(MOBILEID_TIMER_STATUS);
        global.modaltransfercredit = true;
        global.authType = 'transfertopartner';
        setTimeout(() => {
          navigation.navigate('Modal');
        }, 100);
        return;
      }
      case 'nojoomtransferfriends':
      case ScreenName.NoJoomTransferFriends: {
        removeItem(MOBILEID_TIMER_STATUS);
        global.modaltransfercredit = true;
        global.authType = 'nojoomtransferfriends';
        navigation.navigate(ScreenName.NojoomStack);
        setTimeout(
          () => {
            global.isQuestTracker = null;
            navigation.navigate('Modal');
          },
          global.isQuestTracker === 'true' ? 20000 : 100
        );

        return;
      }
      case 'pointhistory':
      case 'nojoomhistory':
      case 'nojoompointshistory':
      case ScreenName.NojoomPointsALLHistory:
      case ScreenName.NojoomPointsHistory: {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomPointsHistory,
          params: params,
        });
        return;
      }
      case 'nojoommynumbers':
      case ScreenName.NojoomLinkedNumbers: {
        navigation.reset({
          index: 1,
          routes: [
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.NojoomStack,
                  },
                ],
              },
            },
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.NojoomStack,
                    state: {
                      routes: [
                        {
                          name: ScreenName.NojoomLinkedNumbers,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        });
        return;
      }
      case ScreenName.EarnPoints:
      case ScreenName.EarnPartners: {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.EarnPointsPartnerHome,
          params: params,
        });
        return;
      }
      case ScreenName.EarnPointsPartnerHome: {
        navigation.navigate(ScreenName.EarnPointsPartnerHome, {
          screen: ScreenName.EarnPointsPartnerHome,
          params: params,
        });
        return;
      }
      case 'nojoom':
      case 'nojoomdeals':
      case ScreenName.NojoomHome:
      case ScreenName.nojoomdeals: {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomHome,
          params: params,
        });
        return;
      }
      case ScreenName.EarnPointsPartnerDetails: {
        navigation.navigate(ScreenName.EarnPointsPartnerDetails, {
          screen: ScreenName.EarnPointsPartnerDetails,
          params: {
            offerid: item.name,
          },
        });
        return;
      }
      case ScreenName.webviewScreen: {
        navigation.navigate(ScreenName.webviewScreen, params);
        return;
      }
      case 'nojoomdonate':
      case 'transferyourpoints':
      case ScreenName.NojoomDonatepoints: {
        removeItem(MOBILEID_TIMER_STATUS);
        global.modaltransfercredit = true;
        global.authType = 'nojoomdonate';
        global.categoryData = params;
        navigation.navigate(ScreenName.NojoomStack);
        setTimeout(
          () => {
            global.isQuestTracker = null;
            navigation.navigate('Modal');
          },
          global.isQuestTracker === 'true' ? 20000 : 100
        );
        return;
      }
      case 'nojoomtransferpointshome': {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomTransferPointsHome,
        });
        return;
      }
      case 'rn_account_v3':
      case 'account':
      case ScreenName.MoreAccounts: {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.MoreAccounts,
        });
        return;
      }
      case 'profileupdate': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.profileupdate,
        });
        return;
      }
      case 'setting':
      case ScreenName.MoreSettings: {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.moreScreen,
        });
        // navigation.navigate(ScreenName.MoreStack, {
        //   screen: ScreenName.MoreSettings,
        // });
        return;
      }
      case ScreenName.EsimConfirm: {
        navigation.navigate(ScreenName.EsimConfirm, {
          screen: ScreenName.EsimConfirm,
        });
        return;
      }
      case ScreenName.EsimScanCode: {
        navigation.navigate(ScreenName.EsimScanCode, {
          screen: ScreenName.EsimScanCode,
        });
        return;
      }
      case ScreenName.EsimErrorScreen: {
        navigation.navigate(ScreenName.EsimErrorScreen, {
          screen: ScreenName.EsimErrorScreen,
        });
        return;
      }
      case ScreenName.EsimCivilScreen: {
        navigation.navigate(ScreenName.EsimCivilScreen, {
          screen: ScreenName.EsimCivilScreen,
        });
        return;
      }
      case ScreenName.EsimSelectNumber: {
        navigation.navigate(ScreenName.EsimSelectNumber, {
          screen: ScreenName.EsimSelectNumber,
        });
        return;
      }
      case ScreenName.SuccessScreen: {
        navigation.navigate(ScreenName.SuccessScreen, {
          screen: ScreenName.SuccessScreen,
        });
        return;
      }
      //** */
      case 'esimActivate': {
        global.esimDeeplink = 'yes';
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.newmoreScreen,
        });
        return;
      }
      case ScreenName.MoreEsimHome: {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.MoreEsimHome,
        });
        return;
      }
      //** */
      case 'buynojoompoints':
      case 'nojoombuypoints':
      case ScreenName.NojoomBuyPoints: {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomBuyPoints,
        });
        return;
      }
      case 'transfertopartners': {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.TransferToPartners,
          params: params,
        });
        return;
      }
      case 'login': {
        if (
          global.logintype != null &&
          global.logintype != '' &&
          global.logintype != undefined
        ) {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.homeScreen,
          });
          return;
        } else {
          global.navigationTabState = null;
          navigation.navigate(ScreenName.landingScreen);
          return;
        }
      }
      case 'signup': {
        if (
          global.logintype != null &&
          global.logintype != '' &&
          global.logintype != undefined
        ) {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.homeScreen,
          });
          return;
        } else {
          navigation.navigate(ScreenName.landingScreen);
          return;
        }
      }
      case 'addfavourites': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.favouriteScreen,
        });
        return;
      }
      case 'remaininginternet':
      case 'remainingminutes':
      case 'remainingsms':
      case 'remainingroaming':
      case 'currentpacks':
      case 'scheduledrenewal':
      case 'mysubscriptions':
      case 'linedetails': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.NewLinedetailsScreen,
        });
        return;
      }
      case 'roamingrates':
      case 'roaming&int.rates':
      case ScreenName.roamingrates: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.roamingrates,
        });
        return;
      }
      case ScreenName.TrackComplaints:
      case 'trackcomplaints': {
        navigation.navigate(ScreenName.TrackComplaints, {
          screen: ScreenName.TrackComplaints,
          params: {
            itemlist: params,
            OnGoingItem: params?.OnGoingItem,
            ClosedItem: params?.ClosedItem,
          },
        });
        return;
      }
      case ScreenName.SupportHelpArticalLevelOne:
      case 'supporthelparticallevelone': {
        navigation.navigate(ScreenName.SupportHelpArticalLevelOne, {
          screen: ScreenName.SupportHelpArticalLevelOne,
          params: {
            viewlistdata: params?.viewlistdata,
            fullitem: params?.fullitem,
          },
        });
        return;
      }
      case ScreenName.SupportSubOoredooPediaItem:
      case 'supportsubooredoopediaitem': {
        navigation.navigate(ScreenName.SupportSubOoredooPediaItem, {
          screen: ScreenName.SupportSubOoredooPediaItem,
          params: {
            videoItem: params?.videoItem,
          },
        });
        return;
      }
      case ScreenName.OrderNewSimScreen:
      case 'ordernewsim': {
        navigation.navigate(ScreenName.OrderNewSimScreen, {
          screen: ScreenName.OrderNewSimScreen,
          params: params,
        });
        return;
      }
      case ScreenName.OrderVerificationScreen:
      case 'orderverification': {
        navigation.navigate(ScreenName.OrderVerificationScreen, {
          screen: ScreenName.OrderVerificationScreen,
          params: {
            item: params,
          },
        });
        return;
      }
      case ScreenName.PaymentPage: {
        navigation.navigate(ScreenName.PaymentPage, {
          screen: ScreenName.PaymentPage,
          params: params,
        });
        return;
      }
      case ScreenName.TrackOrder:
      case 'trackorder': {
        if (
          global.logintype != null &&
          global.logintype != '' &&
          global.logintype != undefined
        ) {
          navigation.navigate(ScreenName.MoreStack, {
            screen: ScreenName.TrackOrder,
            params: params,
          });
        } else {
          navigation.navigate(ScreenName.TrackOrderGuest, {
            screen: ScreenName.TrackOrderGuest,
            params: params,
          });
        }

        return;
      }
      case ScreenName.SupportOoredooPediaViewall:
      case 'supportooredoopediaviewall': {
        navigation.navigate(ScreenName.SupportOoredooPediaViewall, {
          screen: ScreenName.SupportOoredooPediaViewall,
          params: {
            videoItem: params,
          },
        });
        return;
      }
      case ScreenName.SupportNeedHelpLevelOne:
      case 'supportneedhelplevelone': {
        navigation.navigate(ScreenName.SupportNeedHelpLevelOne, {
          screen: ScreenName.SupportNeedHelpLevelOne,
          params: {
            viewlistdata: params?.viewlistdata,
            fullitem: params?.fullitem,
            needHelpTitle: params?.needHelpTitle,
          },
        });
        return;
      }
      case 'assistant':
      case 'needhelp':
      case 'helpsupport':
      case 'helparticles':
      case 'ooredoopediavideosviewall':
      case 'howtovideos': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.SupportHome,
        });
        // global.openChatPopup = true;
        // navigation.navigate(ScreenName.homeStack, {
        //   screen: ScreenName.OAssist,
        //   params: {
        //     id: params?.id || item?.id,
        //   },
        // });
        return;
      }
      case 'onlinechat': {
        if (isSameFooter == 'T') {
          navigation.navigate(ScreenName.SupportHome, {
            screen: ScreenName.SupportHome,
          });
        } else {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.SupportHome,
          });
        }

        // global.openChatPopup = true;
        // navigation.navigate(ScreenName.homeStack, {
        //   screen: ScreenName.OAssist,
        //   params: {
        //     id: params?.id || item?.id,
        //   },
        // });
        return;
      }
      case ScreenName.TransferCreditTabInternationalCountry:
      case ScreenName.TransferlocCredit:
      case ScreenName.Transferlocalcredit:
      case ScreenName.localcredit:
      case 'balancetransfer':
      case ScreenName.TransferCredit:
      case 'Transferlocalcredit':
      case 'Transferinternationalcredit':
      case 'paytransfercredits': {
        if (screenname === 'balancetransfer') {
          removeItem(MOBILEID_TIMER_STATUS);
          global.modaltransfercredit = true;
          global.authType = 'transfercredit';
          navigation.reset({
            index: 1,
            routes: [
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                    },
                  ],
                },
              },
            ],
          });
        } else {
          removeItem(MOBILEID_TIMER_STATUS);
          global.modaltransfercredit = true;
          global.authType = 'transfercredit';
          navigation.navigate(ScreenName.PayStack);
          setTimeout(
            () => {
              global.isQuestTracker = null;
              navigation.navigate('Modal');
            },
            global.isQuestTracker === 'true' ? 35000 : 100
          );
        }

        return;
      }
      case 'profileupdate':
      case ScreenName.UpdateProfile: {
        navigation.navigate(ScreenName.UpdateProfile);
        return;
      }
      case 'inbox':
      case ScreenName.notificationSceen: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.notificationSceen,
        });
        return;
      }
      case 'forgotpassword':
      // case 'updateemail':
      case 'ssoemail': {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.ProfileChangeEmail,
        });
        return;
      }
      case 'update email':
      case ScreenName.ProfileChangeEmail: {
        navigation.navigate(ScreenName.ProfileChangeEmail);
        return;
      }
      case 'transfercreditreview': {
        navigation.navigate(ScreenName.TransferCreditReview, {
          screen: ScreenName.TransferCreditReview,
          params: item,
        });
        return;
      }
      case ScreenName.Transferinternationalcredit:
      case ScreenName.internationalcredit:
      case 'internationalcredit':
      case 'transferinternationalcredit':
      case ScreenName.TransferCreditTabInternationalCountry: {
        global.transferInternationalCredit = 'yes';
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.TransferCredit,
        });
        return;
      }
      case 'transfercreditinternationalcountry': {
        navigation.navigate(ScreenName.TransferCreditInternationalCountry, {
          screen: ScreenName.TransferCreditInternationalCountry,
          params: item,
        });
        return;
      }
      // case 'password':
      case ScreenName.ProfileChangePassword: {
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.ProfileChangePassword,
        });
        return;
      }
      case 'voucher':
      case ScreenName.PayViaVoucher: {
        if (showfooter) {
          navigation.reset({
            index: 1,
            routes: [
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                    },
                  ],
                },
              },
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                      state: {routes: [{name: ScreenName.PayViaVoucher}]},
                    },
                  ],
                },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {name: navigation.navigate(ScreenName.PayStack)},
              {name: navigation.navigate(ScreenName.PayViaVoucher)},
            ],
          });
        }
        return;
      }
      case 'xpressprofit':
      case ScreenName.XpressProfit: {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.XpressProfit,
        });
        return;
      }
      case 'xpressprofitload':
      case ScreenName.LoadBalanceHome: {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.LoadBalanceHome,
        });
        return;
      }
      case 'xpressprofittransferbalance':
      case ScreenName.xpressprofittransferbalance: {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.xpressprofittransferbalance,
        });
        return;
      }
      case 'questtracker': {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.Gamification,
        });
        return;
      }
      case ScreenName.TransferBalanceHome: {
        navigation.navigate(ScreenName.TransferBalanceHome);
        return;
      }
      case ScreenName.XpressProfitReview: {
        navigation.navigate(ScreenName.XpressProfitReview);
        return;
      }
      case 'billpayment':
      case 'recharge': {
        if (
          global.routeName == null ||
          global.routeName == undefined ||
          global.routeName == '' ||
          global.routeName == ScreenName.homeStack ||
          global.routeName == ScreenName.PayStack
        ) {
          navigation.navigate(ScreenName.BillpayRecharge, {
            // params: {
            //   pgsource: 'recharge',
            // },
            pgsource: 'recharge',
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {name: navigation.navigate(ScreenName.PayStack)},
              {
                name: navigation.navigate(ScreenName.BillpayRecharge, {
                  pgsource: screenname,
                  item,
                }),
              },
            ],
          });
        }

        return;
      }
      case 'rechargebillpaymentmynumbers':
      case 'rechargebillpayment':
      case 'payment':
      case 'pay':
      case 'paypostpaid':
      case 'payprepaid':
      case 'Pay': {
        if (showfooter) {
          navigation.reset({
            index: 1,
            routes: [
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,
                    },
                  ],
                },
              },
              {
                name: ScreenName.tabStack,
                state: {
                  routes: [
                    {
                      name: ScreenName.PayStack,

                      state: {routes: [{name: ScreenName.BillpayRecharge}]},
                    },
                  ],
                },
              },
            ],
          });
        } else {
          navigation.reset({
            index: 1,
            routes: [
              {name: navigation.navigate(ScreenName.PayStack)},
              {
                name: navigation.navigate(ScreenName.BillpayRecharge, {
                  pgsource: screenname,
                  item,
                }),
              },
            ],
          });
        }
        return;
      }
      case 'ShamelproDetail': {
        try {
          navigation.navigate(ScreenName.ShamelproDetail, {
            serviceid: item?.id,
            servicename: item?.alias,
            params: item,
          });
        } catch (e) {}

        return;
      }
      case ScreenName.SmartPayDetail: {
        navigation.navigate(ScreenName.SmartPayDetail, {
          screen: ScreenName.SmartPayDetail,
        });
        return;
      }
      case ScreenName.ManageCards:
      case 'managecards': {
        // navigation.navigate(ScreenName.ManageCards, {
        //   screen: ScreenName.ManageCards,
        //   params: item,
        // });

        navigation.navigate(ScreenName.ManageCardsNew, {
          screen: ScreenName.ManageCardsNew,
          params: item,
        });

        return;
      }
      case ScreenName.SmartPayManage: {
        navigation.navigate(ScreenName.SmartPayManage, {
          screen: ScreenName.SmartPayManage,
        });
        return;
      }
      case 'payviewbill':
      case 'viewbill':
      case 'ebill':
      case ScreenName.ViewBill: {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.ViewBill,
        });
        return;
      }
      case ScreenName.digitalservice:
      // case 'digitalproductdetail':
      case ScreenName.digitalservices:
      case 'Digialservice viewall':
      case 'digialserviceviewall':
      case ScreenName.DigitalServiceHome:
      case 'Digitalservice':
      case 'Digialservice viewall':
      case 'digitalservicehome': {
        try {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.DigitalServiceHome,
            params: {
              id: item?.id || params?.id,
            },
          });
        } catch (e) {}

        return;
      }
      case ScreenName.addons:
      case ScreenName.addonsviewall:
      case 'addons viewall':
      case 'addonsviewall':
      case 'addondetails':
      case ScreenName.AddonsHome: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.AddonsHome,
        });

        return;
      }
      case 'bundles':
      case 'buybundles':
      case 'bundles viewall':
      case 'bundlesviewall':
      case 'bundleproductdetail':
      case 'buybundle':
      case 'changeplan':
      case ScreenName.BundlesHome: {
        if (
          global.logintype != null &&
          global.logintype != '' &&
          global.logintype != undefined
        ) {
          navigation.navigate(ScreenName.homeStack, {
            screen: ScreenName.BundlesHome,
          });
          return;
        } else {
          global.navigationTabState = null;
          navigation.navigate(ScreenName.landingScreen);
          return;
        }
      }
      case 'transactionproductdetail':
      case ScreenName.TransactionHome: {
        navigation.navigate(ScreenName.homeStack, {
          screen: ScreenName.TransactionHome,
        });
        return;
      }
      case 'transferyourpoints': {
        navigation.navigate(ScreenName.NojoomStack, {
          screen: ScreenName.NojoomDonatepoints,
        });
        return;
      }
      case 'shop':
      case ScreenName.ShopHome:
      case ScreenName.shopScreen: {
        navigation.navigate(ScreenName.ShopStack, {
          screen: ScreenName.shopScreen,
        });
        return;
      }
      case 'requestcredit':
      case ScreenName.RequestCredit: {
        navigation.navigate(ScreenName.PayStack, {
          screen: ScreenName.RequestCredit,
        });
        return;
      }
      case 'internetTransfer':
      case ScreenName.internettransferaddmember:
      case ScreenName.InternetTransfer: {
        navigation.navigate(ScreenName.InternetTransfer, {
          screen: ScreenName.InternetTransfer,
          netData: global.dashboardData,
        });
        return;
      }
      case ScreenName.AddMember: {
        navigation.navigate(ScreenName.AddMember, {
          screen: ScreenName.AddMember,
        });
        return;
      }
      case ScreenName.ManageMember: {
        navigation.navigate(ScreenName.ManageMember, {
          screen: ScreenName.ManageMember,
        });
        return;
      }
      case ScreenName.InternetTransferReview: {
        navigation.navigate(ScreenName.InternetTransferReview, {
          screen: ScreenName.InternetTransferReview,
        });
        return;
      }
      case 'linkaccount':
      case ScreenName.AddNumber: {
        navigation.navigate(ScreenName.AddNumber, {
          screen: ScreenName.AddNumber,
        });
        return;
      }
      case ScreenName.AddAddress: {
        navigation.navigate(ScreenName.AddAddress, {
          screen: ScreenName.AddAddress,
        });
        return;
      }
      case 'savedaddress':
      case ScreenName.AddressList: {
        navigation.navigate(ScreenName.AddressList, {
          screen: ScreenName.AddressList,
        });
        return;
      }
      case 'upsell':
      case ScreenName.Upsell5gHome: {
        navigation.navigate(ScreenName.Upsell5gHome, {
          screen: ScreenName.Upsell5gHome,
        });
        return;
      }
      case 'passportmulticountry': {
        navigation.navigate(ScreenName.PassportMultiCountry, {
          screen: ScreenName.PassportMultiCountry,
        });
        return;
      }
      case 'mycountrypaymentview': {
        navigation.navigate(ScreenName.MyCountryPaymentView, {
          screen: ScreenName.MyCountryPaymentView,
        });
        return;
      }
      case ScreenName.Upsell5gDetails: {
        navigation.navigate(ScreenName.Upsell5gDetails, {
          screen: ScreenName.Upsell5gDetails,
          params: {
            offerid: item.offerid,
            category: item.offercategory,
          },
        });
        return;
      }
      case 'mysubscriptions': {
        navigation.navigate(ScreenName.NewLinedetailsScreen, {
          screen: ScreenName.NewLinedetailsScreen,
        });
        return;
      }
      case 'currentpacks':
      case 'manage':
      case 'managepacks':
      case 'activepacks':
      case 'mysubscriptions': {
        navigation.navigate(ScreenName.NewLinedetailsScreen, {
          screen: ScreenName.NewLinedetailsScreen,
        });
        return;
      }
      case 'mycountry viewall': {
        navigation.navigate(ScreenName.MyCountry, {
          screen: ScreenName.MyCountry,
        });
        return;
      }
      case 'mycards':
      case 'paymentmethod': {
        // navigation.navigate(ScreenName.MoreStack, {
        //   screen: ScreenName.ManageCards,
        // });
        navigation.navigate(ScreenName.MoreStack, {
          screen: ScreenName.ManageCardsNew,
        });

        return;
      }
      case 'profileUpdate': {
        navigation.navigate(ScreenName.profileupdate, {
          screen: ScreenName.profileupdate,
        });
        return;
      }
      case 'shopcart': {
        navigation.navigate(ScreenName.ShopStack, {
          screen: ScreenName.ShopCart,
        });
        return;
      }
      case 'termsandcondition': {
        navigation.navigate(ScreenName.termsCondScreen, {
          screen: ScreenName.termsCondScreen,
        });
        return;
      }
      case 'paybill': {
        navigation.navigate(ScreenName.paybill, {
          screen: ScreenName.paybill,
        });
        return;
      }
      case 'buyrewardpoints':
      case ScreenName.BuyMorePoint: {
        navigation.navigate(ScreenName.BuyMorePoint, {
          screen: ScreenName.BuyMorePoint,
        });
        return;
      }
      case ScreenName.FIFAWCHome:
      case 'rewardearnpoint':
      case 'rewardwatchvideo':
      case 'worldcupreward': {
        navigation.reset({
          index: 1,
          routes: [
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.homeStack,
                  },
                ],
              },
            },
            {
              name: ScreenName.tabStack,
              state: {
                routes: [
                  {
                    name: ScreenName.homeStack,
                    state: {
                      routes: [
                        {
                          name: ScreenName.FIFAWCHome,
                        },
                      ],
                    },
                  },
                ],
              },
            },
          ],
        });
        return;
      }
      case 'chooseteam':
      case ScreenName.ChooseTeam: {
        navigation.navigate(ScreenName.ChooseTeam, {
          screen: ScreenName.ChooseTeam,
        });
        return;
      }
      default: {
        try {
          if (
            screenname.indexOf('http://') == 0 ||
            screenname.indexOf('https://') == 0
          ) {
            if (isLinkExternal(item?.external)) {
              try {
                Linking.openURL(screenname);
              } catch (error) {}
            } else {
              let _fullview = 'F';
              try {
                if (item != null && item.metadata != null) {
                  let _fullviewlist = item.metadata.filter(
                    x => x.meta_key == 'fullview'
                  );
                  if (
                    _fullviewlist != null &&
                    _fullviewlist.length > 0 &&
                    _fullviewlist[0].meta_value_english == 'T'
                  ) {
                    _fullview = 'T';
                  }
                }
              } catch (e) {}
              if (showfooter) {
                if (screenname.indexOf('nojoom') > 0) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {name: navigation.navigate(ScreenName.tabStack)},
                      {
                        name: navigation.navigate(ScreenName.NojoomStack, {
                          screen: ScreenName.webviewScreen,
                          initial: false,
                          params: {
                            type: '',
                            url: screenname,
                            item: item,
                            params: params,
                            showfooter: 'T',
                            fullview: _fullview,
                            isLoggedIn:
                              global.logintype == null ||
                              global.logintype == '' ||
                              global.logintype == undefined
                                ? false
                                : true,
                          },
                        }),
                      },
                    ],
                  });
                } else {
                  if (
                    global.logintype != null &&
                    global.logintype != '' &&
                    global.logintype != undefined
                  ) {
                    if (params?.type == 'shop') {
                      navigation.navigate(ScreenName.webviewScreen, {
                        type: '',
                        url: screenname,
                        item: item,
                        params: params,
                        showfooter: 'T',
                        fullview: _fullview,
                        isLoggedIn:
                          global.logintype == null ||
                          global.logintype == '' ||
                          global.logintype == undefined
                            ? false
                            : true,
                      });
                    } else {
                      navigation.navigate(ScreenName.homeStack, {
                        screen: ScreenName.webviewScreen,
                        params: {
                          type: '',
                          url: screenname,
                          item: item,
                          params: params,
                          showfooter: 'T',
                          fullview: _fullview,
                          isLoggedIn:
                            global.logintype == null ||
                            global.logintype == '' ||
                            global.logintype == undefined
                              ? false
                              : true,
                        },
                      });
                    }
                  } else {
                    navigation.navigate(ScreenName.webviewScreen, {
                      type: '',
                      url: screenname,
                      item: item,
                      params: params,
                      showfooter: 'T',
                      fullview: _fullview,
                      isLoggedIn:
                        global.logintype == null ||
                        global.logintype == '' ||
                        global.logintype == undefined
                          ? false
                          : true,
                    });
                  }
                }
              } else {
                if (screenname.indexOf('nojoom') > 0) {
                  navigation.reset({
                    index: 0,
                    routes: [
                      {name: navigation.navigate(ScreenName.tabStack)},
                      {
                        name: navigation.navigate(ScreenName.NojoomStack, {
                          screen: ScreenName.webviewScreen,
                          initial: false,
                          params: {
                            type: '',
                            url: screenname,
                            item: item,
                            params: params,
                            showfooter: 'T',
                            fullview: _fullview,
                            isLoggedIn:
                              global.logintype == null ||
                              global.logintype == '' ||
                              global.logintype == undefined
                                ? false
                                : true,
                          },
                        }),
                      },
                    ],
                  });
                  return;
                } else if (params?.type == 'shop') {
                  navigation.navigate(ScreenName.webviewScreen, {
                    type: '',
                    url: screenname,
                    item: item,
                    params: params,
                    fullview: _fullview,
                    headerTitle:
                      headerTitle != null && headerTitle != undefined
                        ? headerTitle
                        : item?.title || null,
                    isLoggedIn:
                      global.logintype == null ||
                      global.logintype == '' ||
                      global.logintype == undefined
                        ? false
                        : true,
                  });
                } else if (webviewtype === 'same') {
                  navigation.navigate(ScreenName.webviewScreen, {
                    type: '',
                    url: screenname,
                    item: item,
                    params: params,
                    fullview: _fullview,
                    headerTitle:
                      headerTitle != null && headerTitle != undefined
                        ? headerTitle
                        : item?.title || null,
                    isLoggedIn:
                      global.logintype == null ||
                      global.logintype == '' ||
                      global.logintype == undefined
                        ? false
                        : true,
                  });
                } else if (isSameFooter === 'T') {
                  navigation.navigate(ScreenName.webviewScreen, {
                    type: typeofscreen || '',
                    url: screenname,
                    item: item,
                    params: params,
                    fullview: _fullview,
                    isSameFooter: isSameFooter,
                    isLoggedIn:
                      global.logintype == null ||
                      global.logintype == '' ||
                      global.logintype == undefined
                        ? false
                        : true,
                  });
                  return;
                } else {
                  navigation.reset({
                    index: 1,
                    routes: [
                      {
                        name: ScreenName.tabStack,
                        state: {
                          routes: [
                            {
                              name: ScreenName.homeStack,
                            },
                          ],
                        },
                      },
                      {
                        name: ScreenName.tabStack,
                        state: {
                          routes: [
                            {
                              name: ScreenName.homeStack,
                              state: {
                                routes: [
                                  {
                                    name: ScreenName.webviewScreen,
                                    params: {
                                      type: '',
                                      url: screenname,
                                      item: item,
                                      params: params,
                                      fullview: _fullview,
                                      headerTitle:
                                        headerTitle != null &&
                                        headerTitle != undefined
                                          ? headerTitle
                                          : null,
                                      isLoggedIn:
                                        global.logintype == null ||
                                        global.logintype == '' ||
                                        global.logintype == undefined
                                          ? false
                                          : true,
                                    },
                                  },
                                ],
                              },
                            },
                          ],
                        },
                      },
                    ],
                  });
                }
              }
            }
          } else {
            if (screenname == null && screenname == undefined) {
              if (
                global.logintype != null &&
                global.logintype != '' &&
                global.logintype != undefined
              ) {
                navigation.navigate(ScreenName.homeStack, {
                  screen: ScreenName.homeScreen,
                });
              } else {
                global.navigationTabState = null;
                navigation.navigate(ScreenName.landingScreen);
              }
            } else {
              if (
                global.logintype != null &&
                global.logintype != '' &&
                global.logintype != undefined
              ) {
                navigation.navigate(ScreenName.homeStack, {
                  screen: ScreenName.homeScreen,
                });
              } else {
                global.navigationTabState = null;
                navigation.navigate(ScreenName.landingScreen);
              }
            }
          }
        } catch (e) {
          consoleLog(e);
        }
        break;
      }
    }
  } catch (e) {
    consoleLog(e);
  }
};

export const navigationBeforeLogin = (
  navigation,
  StackActions,
  name,
  item = null
) => {
  global.notifyredirect = null;
  try {
    let newUrl = [];
    let params = {};
    if (name?.includes('#')) {
      newUrl = name.split('#');
      if (newUrl.length > 0) {
        global.deeplinkurl = newUrl[0];
        global.deeplinkKeyword = name;
        name = newUrl[0];
        params.id = newUrl[1];
      }
    }
    switch (name) {
      case 'payhome':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.PayStack,
            params: {
              screen: ScreenName.PayGuestHome,
            },
          })
        );
        break;
      case 'shop':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.ShopStack,
            params: {
              screen: ScreenName.ShopGuestHome,
            },
          })
        );
        break;
      case 'signup':
        navigation.dispatch(StackActions.replace(ScreenName.authStack));
        break;
      case 'login':
        navigation.dispatch(
          StackActions.replace(ScreenName.authStack, {
            screen: ScreenName.loginScreen,
          })
        );
        break;
      case 'forgotpassword':
        navigation.dispatch(
          StackActions.replace(ScreenName.authStack, {
            screen: ScreenName.loginScreen,
          })
        );
        break;
      case 'more':
      case 'More':
      case 'account':
      case 'updateemail':
      case 'profileupdate':
      case 'password':
      case 'setting':
        // navigation.dispatch(
        //   StackActions.replace(ScreenName.tabStack, {
        //     screen: ScreenName.MoreStack,
        //     params: {
        //       screen: ScreenName.MoreGuestHome,
        //     },
        //   })
        // );
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.MoreStack,
            params: {
              screen: ScreenName.MoreGuestHomeNew,
            },
          })
        );
        break;
      case 'termsandconditions':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.MoreStack,
            params: {
              screen: ScreenName.TermsAndConditions,
            },
          })
        );
        break;
      case 'rechargebillpaymentmynumbers':
      case 'rechargebillpayment':
      case 'recharge':
      case 'paybill':
      case 'payment':
      case 'billpayment':
      case 'Pay':
      case 'pay':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.PayStack,
            params: {
              screen: ScreenName.BillpayRecharge,
            },
          })
        );
        break;
      case 'voucher':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.PayStack,
            params: {
              screen: ScreenName.PayViaVoucher,
            },
          })
        );
        break;
      case 'request credit':
        navigation.dispatch(
          StackActions.replace(ScreenName.tabStack, {
            screen: ScreenName.PayStack,
            params: {
              screen: ScreenName.RequestCredit,
            },
          })
        );
        break;
      case 'assistant':
      case 'needhelp':
      case 'howtovideos':
        navigation.dispatch(
          StackActions.replace(ScreenName.authStack, {
            screen: ScreenName.SupportHome,
            // params: {
            //   id: params?.id,
            // },
          })
        );

        // global.openChatPopup = true;
        // navigation.dispatch(
        //   StackActions.replace(ScreenName.authStack, {
        //     screen: ScreenName.OAssist,
        //     params: {
        //       id: params?.id,
        //     },
        //   })
        // );
        break;
      case 'onlinechat':
        global.openChatPopup = true;
        navigation.dispatch(
          StackActions.replace(ScreenName.authStack, {
            screen: ScreenName.Chat,
          })
        );
        break;
      default:
        if (name.indexOf('http://') == 0 || name.indexOf('https://') == 0) {
          if (isLinkExternal(item?.external)) {
            try {
              Linking.openURL(name);
              return;
            } catch (error) {}
          }
        }
        navigation.dispatch(
          StackActions.replace(ScreenName.authStack, {
            screen: ScreenName.landingScreen,
          })
        );
        break;
    }
  } catch (error) {}
};
