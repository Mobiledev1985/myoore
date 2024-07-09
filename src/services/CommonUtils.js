import {
  CHILDMSISDN,
  CUSTOMER_PROFILE,
  DEVICE_UNQUIE_ID,
  HIDE_ROAMING_POPUP,
  IS_LOGGED_IN,
  LOGGEDIN_MSISDN,
  LOGIN_TYPE,
  NO_THANKS,
  PUSH_REGISTER,
  RATE_PLAN_TYPE,
  SELECTED_MSISDN,
  SHOP_CART_TIME,
  SMARTLOGIN,
  SOCIAL_ID_KEY,
  SOCIAL_PROFILE_PIC,
  STATUSBAR_COLOR,
  STORE_FCM_TOKEN,
  TOKEN_ID,
  TOKEN_TIME,
} from '../commonHelper/Constants';
import {
  I18nManager,
  Platform,
  Share,
  //  as LinkShare
} from 'react-native';
// import Share  from 'react-native-share';
import React, {memo, useMemo} from 'react';
import {
  consoleLog,
  doFunct,
  getItem,
  removeItem,
  setItem,
} from '../commonHelper/utils';
import {CommonActions} from '@react-navigation/native';
import {QueryCache} from 'react-query';
import QuickActions from 'react-native-quick-actions';
import RNFetchBlob from 'react-native-blob-util';
import ScreenName from '../navigator/ScreenName';
import colors from '../resources/styles/colors';
import {getImageHeaders} from '../commonHelper/middleware/callapi.android';
import {getTokenAndWalkthough} from '../components/splashscreen/actions';
import {queryClient} from '../../App';
import {setLoggedInUser} from '../components/home/actions';
import Qualtrics from 'react-native-qualtrics';
import AsyncStorage from '@react-native-community/async-storage';
export const OAssistContext = React.createContext();
export const OoredooRewardHomeContext = React.createContext();

export function multiPassportOffer(categeory, data) {
  let array = [];
  try {
    for (let i = 0; i < categeory.length; i++) {
      if (categeory[i].type === 'offerid') {
        let id = categeory[i].id;

        for (let j = 0; j < data?.length; j++) {
          let _avail = data[j]?.data?.filter(x => x.offerid === id);

          if (_avail?.length > 0) {
            var categeoryName;
            _avail.map(i => {
              categeoryName = i?.offerSubGroup;
            });

            let _json = {
              id: categeoryName + '',
              data: _avail,
            };
            array.push(_json);
          }
        }
      }
    }
  } catch (e) {}
  let offerArray = [...data, ...array];

  return offerArray;
}

export function generateLayout(data, numberOfRows) {
  let temp = [];
  try {
    if (data !== null && data != undefined && data.length > 0) {
      for (let a = 0; a < data.length; ) {
        var item = [];
        for (let b = 0; b < numberOfRows; b++) {
          if (a + b < data.length) {
            item.push(data[a + b]);
          }
        }
        temp.push(item);
        a += numberOfRows;
      }
    }
  } catch (e) {
    consoleLog(e);
  }
  return temp;
}

export function generateDashboardLayout(data, numberOfRows) {
  let temp = [];
  try {
    if (data !== null && data != undefined && data.length > 0) {
      var dataAry = [];
      var voiceAry = [];
      var smsAry = [];
      var oVoiceAry = [];
      for (let a = 0; a < data.length; a++) {
        if (
          data[a]?.rnnotation != null &&
          data[a]?.rnnotation != undefined &&
          data[a]?.rnnotation != '' &&
          data[a]?.notation != null &&
          data[a]?.notation != undefined &&
          data[a]?.notation != ''
        ) {
          if (data[a]?.rnnotation === 'Bytes') {
            dataAry.push(data[a]);
          } else if (
            data[a]?.notation === 'Min' &&
            data[a]?.service.toUpperCase() === 'OOREDOO'
          ) {
            oVoiceAry.push(data[a]);
          } else if (data[a]?.rnnotation === 'Units') {
            smsAry.push(data[a]);
          } else {
            voiceAry.push(data[a]);
          }
        }
        // var item = [];
        // for (let b = 0; b < numberOfRows; b++) {
        //   if (a + b < data.length) {
        //     item.push(data[a + b]);
        //   }
        // }
        // temp.push(item);
        // a += numberOfRows;
      }

      var newdataAry = [];
      var newdata1Ary = [];
      for (let i = 0; i < dataAry.length; i++) {
        if (dataAry[i]?.service !== 'Internet') {
          var obj = dataAry[i];
          newdataAry.push(obj);
        } else {
          var obj = dataAry[i];
          newdata1Ary.push(obj);
        }
      }
      dataAry = newdata1Ary.concat(newdataAry);

      var newsmsAry = [];
      var newsms1Ary = [];
      for (let i = 0; i < smsAry.length; i++) {
        if (smsAry[i]?.service !== 'Local') {
          var obj = smsAry[i];
          newsmsAry.push(obj);
        } else {
          var obj = smsAry[i];
          newsms1Ary.push(obj);
        }
      }
      smsAry = newsms1Ary.concat(newsmsAry);

      for (let a = 0; a < data.length; a++) {
        if (
          dataAry.length > 0 ||
          smsAry.length > 0 ||
          voiceAry.length > 0 ||
          oVoiceAry.length > 0
        ) {
          if (dataAry.length > 0 && voiceAry.length > 0) {
            temp.push([dataAry[0], voiceAry[0]]);
            dataAry = dataAry.slice(1);
            voiceAry = voiceAry.slice(1);
          } else if (voiceAry.length > 0 && smsAry.length > 0) {
            temp.push([voiceAry[0], smsAry[0]]);
            voiceAry = voiceAry.slice(1);
            smsAry = smsAry.slice(1);
          } else if (dataAry.length > 0 && smsAry.length > 0) {
            temp.push([dataAry[0], smsAry[0]]);
            dataAry = dataAry.slice(1);
            smsAry = smsAry.slice(1);
          } else if (dataAry.length > 1) {
            temp.push([dataAry[0], dataAry[1]]);
            dataAry = dataAry.slice(1);
            dataAry = dataAry.slice(1);
          } else if (voiceAry.length > 1) {
            temp.push([voiceAry[0], voiceAry[1]]);
            voiceAry = voiceAry.slice(1);
            voiceAry = voiceAry.slice(1);
          } else if (smsAry.length > 1) {
            temp.push([smsAry[0], smsAry[1]]);
            smsAry = smsAry.slice(1);
            smsAry = smsAry.slice(1);
          } else if (dataAry.length > 0 && oVoiceAry.length > 0) {
            temp.push([dataAry[0], oVoiceAry[0]]);
            dataAry = dataAry.slice(1);
            oVoiceAry = oVoiceAry.slice(1);
          } else if (voiceAry.length > 0 && oVoiceAry.length > 0) {
            temp.push([voiceAry[0], oVoiceAry[0]]);
            voiceAry = voiceAry.slice(1);
            oVoiceAry = oVoiceAry.slice(1);
          } else if (smsAry.length > 0 && oVoiceAry.length > 0) {
            temp.push([smsAry[0], oVoiceAry[0]]);
            smsAry = smsAry.slice(1);
            oVoiceAry = oVoiceAry.slice(1);
          } else if (dataAry.length > 0) {
            temp.push([dataAry[0]]);
            dataAry = dataAry.slice(1);
          } else if (voiceAry.length > 0) {
            temp.push([voiceAry[0]]);
            voiceAry = voiceAry.slice(1);
          } else if (smsAry.length > 0) {
            temp.push([smsAry[0]]);
            smsAry = smsAry.slice(1);
          } else if (oVoiceAry.length > 1) {
            temp.push([oVoiceAry[0], oVoiceAry[1]]);
            oVoiceAry = oVoiceAry.slice(1);
            oVoiceAry = oVoiceAry.slice(1);
          } else if (oVoiceAry.length > 0) {
            temp.push([oVoiceAry[0]]);
            oVoiceAry = oVoiceAry.slice(1);
          }
        }
      }
    }
  } catch (e) {
    consoleLog(e);
  }
  return temp;
}

export function TransformBanners(data, israndom, noofItems) {
  let temp = [];
  try {
    if (data !== null && data.length > 0) {
      let _banneritems = data[0];

      if (
        _banneritems != null &&
        _banneritems.banners != null &&
        _banneritems.banners.length > 0
      ) {
        for (let a = 0; a < _banneritems.banners.length; a++) {
          let _bitem = JSON.parse(JSON.stringify(_banneritems.banners[a]));

          _bitem.title = _banneritems.banners[a].title;
          _bitem.desc = _banneritems.banners[a].description;
          _bitem.subtitle = '';
          _bitem.imagepath = _banneritems.banners[a].path;
          _bitem.id = _banneritems.banners[a].bannerid;

          if (
            _bitem.imagepath != null &&
            _bitem.imagepath !== undefined &&
            _bitem.imagepath.length > 10
          ) {
            temp.push(_bitem);
          }
        }
      }
    }

    if (temp != null && temp.length > 0) {
      if (israndom) {
        let _rr = Math.random() * (temp.length - 0) + 0;
        let _ran = Math.round(_rr);
        let _NewTem = [];

        if (_ran >= temp.length) {
          _NewTem.push(temp[0]);
        } else {
          _NewTem.push(temp[_ran]);
        }
        return _NewTem;
      }
    }
  } catch (e) {}
  return temp;
}
function GenerateAllTab(mdata) {
  try {
    let data = JSON.parse(JSON.stringify(mdata));
    let _firstItem = JSON.parse(JSON.stringify(data[0]));
    let _alis = [];
    _firstItem.alias = '';
    let _newArray = [];
    for (let a = 0; a < data.length; a++) {
      data[a].uniqueid = data[a].alias + '_' + a;
      data[a].itemselected = false;
      if (a === 0) {
        data[a].showall = true;
      } else {
        data[a].showall = false;
      }
      _newArray.push(data[a]);
    }

    return _newArray;
  } catch (e) {}
  return [];
}
export function GenerateDigitalServiceElements(mdata) {
  return GenerateAllTab(mdata);
}
export function GenerateDigitalContent(data, sectionindex) {
  let temp = [];
  try {
    if (data != null && data[sectionindex].sections != null) {
      for (let a = 0; a < data[sectionindex].sections.length; a++) {
        if (
          data[sectionindex].sections[a].services != null &&
          data[sectionindex].sections[a].services.length > 0
        ) {
          for (let b = 0; b < data[0].sections[a].services.length; b++) {
            temp.push(data[sectionindex].sections[a].services[b]);
          }
        }
      }
    }
  } catch (e) {}
  return temp;
}

export function gamificationBanners(data) {
  let cirlcetemp = [];
  try {
    if (data !== null && data.length > 0) {
      let _circlebanneritems = data[0];
      if (
        _circlebanneritems != null &&
        _circlebanneritems.cards != null &&
        _circlebanneritems.cards.length > 0
      ) {
        for (let a = 0; a < _circlebanneritems.cards.length; a++) {
          let _circlebitem = JSON.parse(
            JSON.stringify(_circlebanneritems.cards[a])
          );
          if (
            _circlebitem.imageurl != null &&
            _circlebitem.imageurl !== undefined &&
            _circlebitem.imageurl.length > 10
          ) {
            cirlcetemp.push(_circlebitem);
          }
        }
      }
    }
  } catch (e) {}
  return cirlcetemp;
}

export function TransformData(data, template, moduleid) {
  try {
    switch (template + '') {
      case '3': {
        for (let a = 0; a < data.length; a++) {
          data[a].moretext = data[a].currency + ' ' + data[a].dofferbaseprice;
          if (data[a].validity != null) {
            data[a].moretext += ' /' + data[a].validity;
          }
          if (data[a].currency == null && data[a].actiontext != null) {
            data[a].moretext = data[a].actiontext;
          } else if (
            data[a].dofferbaseprice == null &&
            data[a].actiontext != null
          ) {
            data[a].moretext = data[a].actiontext;
          }
          data[a].imagepath = data[a].imageurl;
        }

        if (data.length > 6) {
          var tt = data.splice(6, data.length - 7);

          return tt;
        }
        return data;
      }
      case '13': {
        if (
          data != null &&
          data.data != null &&
          data.data.length > 0 &&
          data.data[0] != null &&
          data.data[0].data != null
        ) {
          let _tmp13 = data?.data[0]?.data;

          for (let a = 0; a < _tmp13.length; a++) {
            _tmp13[a].moretext =
              _tmp13[a].currency + ' ' + _tmp13[a].dofferbaseprice;
            if (_tmp13[a].validity != null) {
              _tmp13[a].moretext += ' /' + _tmp13[a].validity;
            }
            if (_tmp13[a].currency == null && _tmp13[a].actiontext != null) {
              _tmp13[a].moretext = _tmp13[a].actiontext;
            }
            _tmp13[a].imagepath = _tmp13[a].imageurl;
          }

          if (_tmp13.length > 6) {
            var tt = data.splice(6, _tmp13.length - 7);
            return tt;
          }
          return _tmp13;
        } else {
          return [];
        }
      }
      case '4': {
        for (let a = 0; a < data.length; a++) {
          data[a].moretext =
            data[a].currency + ' ' + data[a].price + ' /' + data[a].validity;
          if (I18nManager.isRTL) {
            data[a].moretext =
              data[a].validity + ' / ' + data[a].currency + ' ' + data[a].price;
          }
          if (
            (data[a].price == null || data[a].price == undefined) &&
            data[a].amount != null &&
            data[a].amount != undefined &&
            data[a].amount != ''
          ) {
            data[a].moretext =
              data[a].currency + ' ' + data[a].amount + ' /' + data[a].validity;
            if (I18nManager.isRTL) {
              data[a].moretext =
                data[a].validity +
                ' / ' +
                data[a].currency +
                ' ' +
                data[a].amount;
            }
          }

          if (
            (data[a].currency == null || data[a].price == null) &&
            data[a].action_button_text != null
          ) {
            if (data[a].currency == null || data[a].amount != null) {
              data[a].moretext = data[a].currency + ' ' + data[a].amount;
            } else {
              data[a].moretext = data[a].action_button_text;
            }
          }
        }

        return data;
      }
      case '6': {
        if (
          data != null &&
          data.length > 0 &&
          data[0].sections != null &&
          data[0].sections.length > 0
        ) {
          data[0].sections[0].services = TransformDigitalServices(
            data[0].sections[0].services
          );
        }
        return data[0].sections[0].services;
      }
      case '10': {
        if (data?.dynamictypes[0]?.cards?.length > 0) {
          let _cards = data?.dynamictypes[0]?.cards;
          // console.log("sai",_cards[0].metadata[0].meta_key=="menutype");
          // console.log("ramesh",moduleid);
          // console.log("ramesh",_cards[0].metadata[0].meta_value_english=="smartpay")
          for (let a = 0; a < _cards.length; a++) {
            if (
              _cards[a].imageurl != null &&
              _cards[a].imageurl != undefined &&
              (_cards[a].imagepath == null || _cards[a].imagepath == undefined)
            ) {
              _cards[a].imagepath = _cards[a].imageurl;
            }

            if (
              _cards[a].displaytext != null &&
              _cards[a].displaytext != undefined &&
              (_cards[a].title == null || _cards[a].title == undefined)
            ) {
              _cards[a].title = _cards[a].displaytext;
            }
            if (
              moduleid == '623' &&
              _cards[a].metadata != null &&
              _cards[a].metadata[0].meta_value_english == 'smartpay' &&
              _cards[a].metadata[0].meta_key == 'menutype'
            ) {
              _cards.splice(a, 1);
            }
          }
          return _cards;
        }
        return [];
      }
      case '12': {
        if (data?.AvailableOffers?.length > 0) {
          return data?.AvailableOffers;
        }
        return [];
      }
      default: {
        return data;
      }
    }
  } catch (e) {}
  return [];
}

function GenerateAddonTabFilter(mdata) {
  try {
  } catch (e) {}
  return [];
}
export function GenerateAddonTab(mdata) {
  return useMemo(() => GenerateAddonTabFilter(mdata), [mdata.transid]);
}

export function convertStringToNumber(val) {
  try {
    if (val != null && val != undefined) {
      return Number(val);
    } else {
      return 0;
    }
  } catch (e) {
    return 0;
  }
}
export function MathRound(val) {
  try {
    let val1 = Math.round(val * 100) / 100;
    if (val1 != null && val1 != undefined) {
      return val1;
    }
  } catch (e) {}
  return val;
}

export function TransformDigitalServices(data) {
  try {
    for (let a = 0; a < data.length; a++) {
      data[a].title = data[a].name;

      data[a].description =
        data[a].currency + ' ' + data[a].price + ' / ' + data[a].validity;
      if (
        data[a].validity == null ||
        data[a].validity == undefined ||
        data[a].validity == ''
      ) {
        data[a].description = data[a].currency + ' ' + data[a].price;
      }
      data[a].moretext = data[a].buttontext;
      data[a].navigation = {
        action: 'page',
        stackName: 'HOME_STACK',
        screenName: ScreenName.DigSerPrev,
        params: {
          serviceid: data[a].id,
          servicename: data[a].alias,
        },
      };
    }
  } catch (e) {}
  return data;
}

export function TransFormDashboard(mdata, type) {
  // console.log()
  try {
    var data = JSON.parse(JSON.stringify(mdata));

    if (
      data != null &&
      data.response != null &&
      data.response.myservices != null &&
      data.response.myservices.length > 0
    ) {
      let _offerdata = [];
      let _offerslist = [];
      for (let a = 0; a < data.response.myservices.length; a++) {
        if (_offerslist.indexOf(data.response.myservices[a].offerid) == -1) {
          _offerslist.push({
            offerid: data.response.myservices[a].offerid,
            purchasedate: data.response.myservices[a].purchasedate,
          });
        }
      }
      let _offerslistary = _offerslist.filter(
        (ele, ind) =>
          ind ===
          _offerslist.findIndex(
            elem =>
              elem.offerid === ele.offerid &&
              elem.purchasedate === ele.purchasedate
          )
      );
      _offerslist = _offerslistary;
      for (let a = 0; a < _offerslist.length; a++) {
        let _service = null;
        let _itmservice = data.response.myservices.filter(
          p =>
            p.offerid === _offerslist[a]?.offerid &&
            p.purchasedate === _offerslist[a]?.purchasedate
        );

        if (_itmservice != null) {
          _service = _itmservice[0];
        }
        if (_service != null) {
          _service.balancelist = [];
          for (let b = 0; b < _itmservice.length; b++) {
            let _inner = {
              balance: _itmservice[b].balance,
              dbalance: _itmservice[b].dbalance,
              notation: _itmservice[b].notation + '',
              subofferid: _itmservice[b].subofferid,
              title: _itmservice[b].title,
              daylable: _itmservice[b].daylable,
              days: _itmservice[b].days,
              total: _itmservice[b].total,
              color: _itmservice[b].color,
              isunlimited: _itmservice[b].isunlimited,
              rnlabel: _itmservice[b]?.rnlabel,
              rnnotation: _itmservice[b]?.notation,
              offerqtype: _itmservice[b]?.offerqtype,
              rndsheader: _itmservice[b]?.rndsheader,
              service: _itmservice[b]?.service,
            };
            if (_itmservice[b].notation == 'Bytes') {
              _inner.minvalue = _inner.balance;
              _inner.maxvalue = _inner.total;
              _inner.notation = bytesToTB(_inner.balance);
              _inner.dbalance = bytesToSize(_inner.dbalance);
              _inner.balance = bytesToSize(_inner.balance);
              _inner.totalnotation = bytesToTB(_inner.total);
              _inner.total = bytesToSize(_inner.total);
              const balanceValue = parseFloat(_inner.minvalue);
              const totalValue = parseFloat(_inner.maxvalue);
              if (isNaN(balanceValue) || isNaN(totalValue)) {
                _inner.percentage = ((balanceValue / totalValue) * 100).toFixed(
                  2
                );
              }
              _inner.percentage = ((balanceValue / totalValue) * 100).toFixed(
                2
              );
            } else {
              _inner.notation = _itmservice[b].notation;
              const balanceValue = parseFloat(_inner.balance);
              const totalValue = parseFloat(_inner.total);
              try {
                if (_inner.balance.toString().includes('.')) {
                  let floatValue = parseFloat(_inner.balance);
                  _inner.balance = floatValue.toFixed(2);
                }
                if (_inner.dbalance.toString().includes('.')) {
                  let floatValue = parseFloat(_inner.dbalance);
                  _inner.dbalance = floatValue.toFixed(2);
                }
                if (_inner.total.toString().includes('.')) {
                  let floatValue = parseFloat(_inner.total);
                  _inner.total = floatValue.toFixed(2);
                }
                if (isNaN(balanceValue) || isNaN(totalValue)) {
                  _inner.percentage = (
                    (balanceValue / totalValue) *
                    100
                  ).toFixed(2);
                }
                _inner.percentage = ((balanceValue / totalValue) * 100).toFixed(
                  2
                );
              } catch (error) {}
            }

            _service.balancelist.push(_inner);
          }
          if (type === 'dashboard') {
            _service.balancelist.sort((a, b) =>
              a.position > b.position ? 1 : -1
            );
          }
          _offerdata.push(_service);
        }
      }
      // console.log('_offerdata', _offerdata);
      return _offerdata;
    }
  } catch (e) {
    consoleLog('error', e);
  }
  return [];
}

export function bytesToTB(bytes, decimals = 2) {
  try {
    if (bytes === 0 || bytes === '0') {
      return 'Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const value = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
    if (value === 1024) {
      return sizes[i + 1];
    } else {
      return sizes[i];
    }
  } catch (error) {
    return 'GB';
  }
}

export function GenerateLineDetails(data) {
  try {
    if (data != null) {
      for (let a = 0; a < data.Services.length; a++) {
        if (
          data.Services[a].changed == null ||
          data.Services[a].changed == undefined
        ) {
          if (data.Services[a].notation == 'Bytes') {
            data.Services[a].notation = 'GB';
            data.Services[a].minvalue = data.Services[a].balance;
            data.Services[a].maxvalue = data.Services[a].total;
            data.Services[a].rnnotation = bytesToTB(data.Services[a].balance);
            data.Services[a].rntotalnotation = bytesToTB(
              data.Services[a].total
            );
            data.Services[a].dbalance = bytesToSize(data.Services[a].dbalance);
            data.Services[a].balance = bytesToSize(data.Services[a].balance);
            data.Services[a].total = bytesToSize(data.Services[a].total);
          } else if (data.Services[a].notation == 'Min') {
            data.Services[a].notation = data.Services[a].notation;
            data.Services[a].rnnotation = data.Services[a].notation;
            data.Services[a].rntotalnotation = data.Services[a].notation;
          } else {
            data.Services[a].notation = data.Services[a].notation;
            data.Services[a].rnnotation = data.Services[a].rnnotation;
            data.Services[a].rntotalnotation = data.Services[a].rnnotation;
          }
          data.Services[a].changed = '1';
        }
      }
    }
  } catch (e) {}
  return data;
}
export function CheckIsValidData(data) {
  try {
    if (
      data != null &&
      data != undefined &&
      data.status == '0' &&
      data.response != null &&
      data.response != undefined
    ) {
      return false;
    }
  } catch (e) {}
  return true;
}

export function bytesToSize(bytes) {
  if (bytes < 1024) return bytes;
  let i = Math.floor(Math.log(bytes) / Math.log(1024));
  let num = bytes / Math.pow(1024, i);
  // let round = Math.round(num);
  // num = round < 10 ? num.toFixed(2) : round < 100 ? num.toFixed(1) : round;
  // return num;
  let stringValue = num.toFixed(2).toString();
  if (stringValue.endsWith('.00')) {
    return parseInt(stringValue.replace('.00', ''));
  }
  return num.toFixed(2);
}

export function GetMobileNo(msisdn) {
  try {
    if (msisdn.length == 11 && msisdn.indexOf('965') == 0) {
      return msisdn.substring(3);
    }
  } catch (e) {}
  return msisdn;
}
export function GetGreetText(t) {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return t('goodMorning');
  } else if (currentHour < 18) {
    return t('goodAfternoon');
  } else {
    return t('goodEvening');
  }
}

export function GenerateNotification(mdata, t, userdata) {
  try {
    global.notificationLength = 0;
    let data = [];
    let data1 = [];
    let data2 = [];
    if (global.smartpaynotify != null && global.smartpaynotify != undefined) {
      let smartpaydata = global.smartpaynotify;
      let _tmp = {};
      _tmp.item = smartpaydata;
      _tmp.desc = smartpaydata?.desc;
      _tmp.redirecturl = smartpaydata?.redirect;
      _tmp.metadata = '';
      _tmp.button = smartpaydata?.button;
      _tmp.title = smartpaydata?.title;
      _tmp.type = smartpaydata?.notificationtype;
      _tmp.msisdn = '';
      _tmp.isSalert = true;
      data2.push(_tmp);
      global.notificationLength = data2.length;
    }
    // if (
    //   global.renewOffersnotify != null &&
    //   global.renewOffersnotify != undefined &&
    //   global.cvmdataexist != true
    // ) {
    //   try {
    //     let renewdata = global.renewOffersnotify;
    //     renewdata?.map((item, index) => {
    //       item?.AvailableOffers?.map((item1, index) => {
    //         let _tmp = {};
    //         _tmp.item = item1;
    //         _tmp.desc = item1?.description;
    //         _tmp.redirecturl = 'renew';
    //         _tmp.metadata = item.metadata;
    //         _tmp.button = item?.buttontext;
    //         _tmp.title = item?.heading;
    //         _tmp.type = 'renew';
    //         _tmp.msisdn = item?.msisdn;
    //         _tmp.isSalert = true;
    //         data1.push(_tmp);
    //       });
    //     });
    //     global.notificationLength = data1.length;
    //   } catch (error) {}
    // }
    if (mdata != null && mdata != undefined && mdata.length > 0) {
      global.notificationLength = mdata.length;
      data = JSON.parse(JSON.stringify(mdata));
      let _user = GetGreetText(t);

      if (
        userdata != null &&
        userdata != undefined &&
        userdata.nickname != null &&
        userdata.nickname != undefined
      ) {
        // comma in arabic is different
        const replaceChar = I18nManager.isRTL ? '،' : ' ,';
        _user += replaceChar + ' ' + userdata.nickname;
        global.currentusername = userdata.nickname;
      } else {
        try {
          if (
            global.linkedmsisdns != null &&
            global.linkedmsisdns != undefined &&
            global.linkedmsisdns.length > 0
          ) {
            for (let a = 0; a < global.linkedmsisdns.length; a++) {
              if (
                global.customerprofile?.Msisdn == global.linkedmsisdns[a].msisdn
              ) {
                const replaceChar = I18nManager.isRTL ? '،' : ' ,';
                _user += replaceChar + ' ' + global.linkedmsisdns[a].nickname;
                global.currentusername = global.linkedmsisdns[a].nickname;
                break;
              }
            }
          }
        } catch (e) {}
      }
      consoleLog('-----------_user', _user);
      for (let a = 0; a < data.length; a++) {
        data[a].title = data[a].title
          .replace('!USERTEXT!', _user)
          .replace('!', '');
      }
    }
    if (global.balancenotify != null && global.balancenotify != undefined) {
      let _tmp = JSON.parse(JSON.stringify(global.balancenotify));
      _tmp.img = _tmp.img;
      _tmp.desc = _tmp.alert;
      _tmp.button = _tmp.title + '';
      _tmp.title = _tmp.popuptitle;
      data.push(_tmp);
      global.notificationLength = data.length;
    }
    if (global.dashboardnotify != null && global.dashboardnotify != undefined) {
      let _tmp = JSON.parse(JSON.stringify(global.dashboardnotify));
      _tmp.img = '';
      _tmp.desc = _tmp.alert;
      _tmp.button = _tmp.title + '';
      _tmp.title = _tmp.popuptitle;
      data.push(_tmp);
      global.notificationLength = data.length;
    }
    if (
      global.gamificationnotify != null &&
      global.gamificationnotify != undefined
    ) {
      try {
        let gamificationdata = global.gamificationnotify;
        gamificationdata?.map((item, index) => {
          let _tmp = {};
          _tmp.item = item;
          _tmp.desc = item?.salert?.alert;
          _tmp.redirecturl = item.redirecturl;
          _tmp.metadata = item.metadata;
          _tmp.button = item?.salert?.title;
          _tmp.title = item?.salert?.popuptitle;
          _tmp.isSalert = true;
          _tmp.img = item?.salert?.img;

          data.push(_tmp);
        });
        global.notificationLength = data.length;
      } catch (error) {}
    }
    const finaldata = data1.concat(data);
    const finaldata1 = data2.concat(finaldata);
    global.notificationLength = finaldata1.length;
    return finaldata1;
  } catch (e) {}
  return null;
}

export function GenerateRenewNotification(mdata, t, userdata) {
  try {
    global.notificationLength = 0;
    let data = [];
    let data1 = [];
    if (
      global.renewOffersnotify != null &&
      global.renewOffersnotify != undefined
    ) {
      try {
        let renewdata = global.renewOffersnotify;
        renewdata?.filter((item, index) => {
          item?.AvailableOffers?.map((item1, index) => {
            let _tmp = {};
            _tmp.item = item1;
            _tmp.desc = item1?.description;
            _tmp.redirecturl = 'renew';
            _tmp.metadata = item.metadata;
            _tmp.button = item?.buttontext;
            _tmp.title = item?.heading;
            _tmp.type = 'renew';
            _tmp.msisdn = item?.msisdn;
            _tmp.isSalert = true;
            data1.push(_tmp);
          });
        });
        global.notificationLength = data1.length;
      } catch (error) {}
    }
    const finaldata = data1.concat(data);
    global.notificationLength = finaldata.length;
    consoleLog('finaldata:rams'.finaldata);
    return finaldata;
  } catch (e) {}
  return null;
}

export const GetPrice = card => {
  if (
    card?.validity != null &&
    card?.validity != undefined &&
    card?.validity != ''
  ) {
    return card.currency + ' ' + card.price + '/' + card.validity;
  } else {
    return card.currency + ' ' + card.price;
  }
};

export const ToUpperCase = val => {
  try {
    if (val != null && val != undefined && val.length > 1) {
      return val.toUpperCase();
    }
  } catch (e) {}
  return '';
};

// logic to evenly distibute items in column and spacing
export const formatData = (data, numColumns) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({key: `blank-${numberOfElementsLastRow}`, empty: true});
    numberOfElementsLastRow++;
  }

  return data;
};

export function compareDates(d1, d2) {
  var parts = d1.split('-');
  var d1 = Number(parts[2] + parts[1] + parts[0]);
  parts = d2.split('-');
  var d2 = Number(parts[2] + parts[1] + parts[0]);
  return d1 <= d2;
}

export const clearGlobalData = () => {
  global.userdetailsTap = null;
  global.dashboardData = null;
  global.dashboardrecom = null;
  global.imageheaderslist = null;
  global.NojoomDashboard = null;
  global.isB2BCPR = null;
  global.ProfileCustomerType = null;
  global.NojoomDashboardresp = null;
  global.NojoomDashboardColor = null;
  global.notPrimaryMessage = null;
  global.dashboardapievent = null;
  global.globalSettResponse = null;
  global.reloadnotify = null;
  global.customerprofile = null;
  global.currentusername = null;
  global.balancenotify = null;
  global.customerprofile = null;
  global.reloadonview = null;
  global.setchildmsisdn = null;
  global.setchildmsisdn_encrypt = null;
  global.currentusername = null;
  global.customerprofile_image = null;
  global.notificationLength = null;
  global.passportList = null;
  global.userdetails = null;
  global.linkedmsisdns = null;
  global.isChildNumberAvailable = null;
  global.balanceprepaid = null;
  global.hideRoamingPopup = null;
  global.hideHomePopup = null;
  global.rateplantype = null;
  global.pushNotificationRegister = null;
  global.guestuserbgcolor = null;
  global.notPrimaryMessage = null;
  global.loginEventCalled = null;
  global.dashboardData = null;
  global.dashboardResponse = null;
  global.gamificationnotify = null;
  global.dashboardnotify = null;
  global.smartpaynotify = null;
  global.managelinesdata = null;

  try {
    const queryCache = new QueryCache();
    queryCache.clear();
    consoleLog('success clearing cache');
  } catch (error) {
    consoleLog('error clearing cache');
  }
  return '';
};

export const clearGlobalDataExceptGlobalSettings = () => {
  global.userdetailsTap = null;
  global.dashboardData = null;
  global.dashboardrecom = null;
  global.imageheaderslist = null;
  global.NojoomDashboard = null;
  global.isB2BCPR = null;
  global.ProfileCustomerType = null;
  global.NojoomDashboardresp = null;
  global.NojoomDashboardColor = null;
  global.notPrimaryMessage = null;
  global.dashboardapievent = null;
  global.reloadnotify = null;
  global.customerprofile = null;
  global.currentusername = null;
  global.balancenotify = null;
  global.customerprofile = null;
  global.reloadonview = null;
  global.setchildmsisdn = null;
  global.setchildmsisdn_encrypt = null;
  global.currentusername = null;
  global.customerprofile_image = null;
  global.notificationLength = null;
  global.passportList = null;
  global.userdetails = null;
  global.linkedmsisdns = null;
  global.isChildNumberAvailable = null;
  global.balanceprepaid = null;
  global.hideRoamingPopup = null;
  global.hideHomePopup = null;
  global.rateplantype = null;
  global.pushNotificationRegister = null;
  global.guestuserbgcolor = null;
  global.notPrimaryMessage = null;
  global.loginEventCalled = null;
  global.dashboardData = null;
  global.dashboardResponse = null;
  global.gamificationnotify = null;
  global.dashboardnotify = null;
  global.smartpaynotify = null;
  global.managelinesdata = null;

  try {
    const queryCache = new QueryCache();
    queryCache.clear();
    consoleLog('success clearing cache');
  } catch (error) {
    consoleLog('error clearing cache');
  }
  return '';
};

export const ClearStore = () => {
  removeItem(SOCIAL_PROFILE_PIC);
  removeItem(TOKEN_ID);
  removeItem(TOKEN_TIME);
  removeItem(CUSTOMER_PROFILE);
  removeItem(SELECTED_MSISDN);
  removeItem(CHILDMSISDN);
  removeItem(IS_LOGGED_IN);
  removeItem(NO_THANKS);
  removeItem(HIDE_ROAMING_POPUP);
  removeItem(PUSH_REGISTER);
  removeItem(STORE_FCM_TOKEN);
  removeItem(RATE_PLAN_TYPE);
  removeItem(STATUSBAR_COLOR);
  removeItem(LOGIN_TYPE);
  removeItem(SOCIAL_ID_KEY);
  removeItem(LOGGEDIN_MSISDN);
};

export const removeAllItems = async () => {
  try {
    // Get all keys from AsyncStorage
    const keys = await AsyncStorage.getAllKeys();
    // Remove all items corresponding to the keys
    await AsyncStorage.multiRemove(keys);
    console.log('All items removed from AsyncStorage');
  } catch (error) {
    console.error('Error removing items from AsyncStorage:', error);
  }
};
export const clearDataMethod = (dispatch, reduxState, navigation) => {
  try {
    setTimeout(function () {
      navigation.reset({
        index: 0,
        routes: [{name: ScreenName.landingScreen}],
      });
    }, 500);
    global.isinternalredirect = 'T';
    global.globalbackgroundcolor = null;
    global.guestuserbgcolor = null;
    global.tokenid = null;
    global.notificationsUnreadCount = null;
    global.userid = null;
    global.UniqueToken = 't' + Date.now() + 'm';
    global.UniqueTokenProfile = 't' + Date.now() + 'm';

    global.welecometext = null;
    global.customerprofile_image = '';
    global.logintype = '';
    global.notificationsCards = null;
    clearGlobalData();
    ClearStore();
    ///Spalsh
    removeItem('selectedMSISDN');
    removeItem('childMSISDN');
    removeItem('customerprofile');
    global.defaultpagebackgroundcolor = colors.YELLOW;
    global.startupredirection = null;
    global.requesttime = '';
    global.customerprofile_image = '';
    global.customerprofile = null;
    global.setchildmsisdn = '';
    global.navigationTabState = null;
    global.isChildNumberAvailable = false;
    global.globalbackgroundcolor = null;
    global.notificationsUnreadCount = null;
    global.ProfileCustomerType = null;
    global.userdetailsTap = null;
    global.gamificationnotify = null;
    global.dashboardnotify = null;
    global.smartpaynotify = null;
    global.ssoProfileStatus = null;

    dispatch({
      type: 'BG_COLOR',
      payload: {bgcolor: colors.OOREDOO_RED, routeName: ScreenName.moreScreen},
    });
    dispatch({type: 'CLEAR_USER_TOKEN'});
    dispatch(setLoggedInUser(false));
    dispatch({type: 'USER_LOGGEDIN', payload: false});
    setTimeout(function () {
      getTokenAndWalkthough(navigation, dispatch, reduxState, 'T').then(
        ({url, type}) => {
          consoleLog('getTokenAndWalkthough', url);
          try {
            const queryCache = new QueryCache();
            queryCache.clear();
            consoleLog('success clearing cache token');
          } catch (error) {
            consoleLog('error clearing cache token');
          }
        }
      );
    }, 1000);
  } catch (error) {}
};

export const clearAccountData = (dispatch, navigation) => {
  dispatch({type: 'CLEAR_USER_TOKEN'});
  dispatch(setLoggedInUser(false));
  global.tokenid = null;
  global.notificationsUnreadCount = null;
  global.userid = null;
  global.UniqueToken = null;
  global.welecometext = null;
  global.customerprofile_image = '';
  global.emailAddress = '';
  global.notificationsCards = null;
  global.logintype = '';
  clearGlobalData();
  removeItem(SOCIAL_PROFILE_PIC);
  removeItem(TOKEN_ID);
  removeItem(TOKEN_TIME);
  removeItem(CUSTOMER_PROFILE);
  removeItem(SELECTED_MSISDN);
  removeItem(CHILDMSISDN);
  removeItem(LOGGEDIN_MSISDN);
  removeItem(IS_LOGGED_IN);
  removeItem(NO_THANKS);
  removeItem(HIDE_ROAMING_POPUP);
  removeItem(PUSH_REGISTER);
  removeItem(LOGIN_TYPE);
  removeItem(SOCIAL_ID_KEY);
  removeItem(SMARTLOGIN);
  dispatch({type: 'CLEAR_USER_TOKEN'});
  queryClient.clear();
  setTimeout(function () {
    dispatch({type: 'USER_LOGGEDIN', payload: false});
    navigation.reset({
      index: 0,
      routes: [{name: ScreenName.landingScreen}],
    });
  }, 3000);
};

export const ValidateMobileNoText = _msisdn => {
  try {
    let msisdn = parseInt(_msisdn);
    if (msisdn < 1000000) {
      return false;
    } else if (_msisdn.length < 7 && _msisdn.length > 11) {
      return false;
    } else if (_msisdn.indexOf('965') == 0) {
      if (_msisdn.length >= 10) {
        return true;
      }
    } else if (_msisdn.length == 7 || _msisdn.length == 8) {
      return true;
    }
  } catch (e) {
    consoleLog(e);
  }
  return false;
};

export const ValidateVoucherText = _voucher => {
  try {
    let voucher = parseInt(_voucher);
    if (voucher < 1) {
      return false;
    } else if (_voucher.length < 14) {
      return false;
    } else {
      return true;
    }
  } catch (e) {
    consoleLog(e);
  }
  return false;
};

export const regexNumberTest = word => {
  let validText = word.replace(
    /[`\D~!@#$%^&*()_|+\-=?;•√π÷×¶∆£¢€¥°©®™✓:'",.<> \{\}\[\]\\\/]/g,
    ''
  );
  return validText;
};

export const isTextArabic = value => {
  let arabic = /[\u0600-\u06FF]/;
  return arabic.test(value);
};
export const DeeplinkRedirection = navigation => {
  try {
    if (global.startupredirection != null) {
      let _redirect = global.startupredirection + '';
      global.startupredirection = null;
      RedirectItem(navigation, _redirect);
    }
  } catch (e) {}
};
export const RedirectItem = (navigation, _redirect) => {
  try {
    if (_redirect == ScreenName.OAssist) {
      setTimeout(() => {
        // navigation.dispatch(
        //   CommonActions.reset({
        //     index: 1,
        //     routes: [
        //       {name: ScreenName.tabStack},
        //       {
        //         name: ScreenName.OAssist,
        //       },
        //     ],
        //   })
        // );
        navigation.dispatch(
          CommonActions.reset({
            index: 1,
            routes: [
              {name: ScreenName.tabStack},
              {
                name: ScreenName.SupportHome,
              },
            ],
          })
        );
      }, 500);
    }
  } catch (e) {
    consoleLog('Redirect error');
    consoleLog(e);
  }
};

export const compareVersion = (version1, version2) => {
  try {
    const levels1 = version1.split('.');
    const levels2 = version2.split('.');

    const length = Math.max(levels1.length, levels2.length);

    for (let i = 0; i < length; i++) {
      const v1 = i < levels1.length ? parseInt(levels1[i]) : 0;
      const v2 = i < levels2.length ? parseInt(levels2[i]) : 0;

      if (v1 > v2) {
        return 1;
      }
      if (v2 > v1) {
        return -1;
      }
    }
  } catch (e) {}
  return 0;
};
export const ValidateFloatNumber = num => {
  try {
    let _n = parseFloat(num);
    if (_n > 0) {
      return _n + '';
    }
  } catch (e) {}
  return '0';
};

export const UpdateDetailsOfCustProfile = data => {
  try {
    if (data?.status === '0') {
      setItem(CUSTOMER_PROFILE, JSON.stringify(data.response));
      setItem(RATE_PLAN_TYPE, data?.response?.RatePlanType);
      global.rateplantype = data?.response?.RatePlanType;
      global.customerprofile = data.response;
      global.ProfileCustomerType = isB2CNumber(data?.response);
      global.isB2BCPR = isB2BCPRNumber(data?.response);
      consoleLog('UpdateDetailsOfCustProfile', global.ProfileCustomerType);
    }
  } catch (e) {}
};

export function IsNullorUndefined(itm) {
  try {
    if (itm == null || itm == undefined) {
      return true;
    }
  } catch (e) {}
  return false;
}
function SortBycountry(x, y) {
  return x.country == y.country ? 0 : x.country > y.country ? 1 : -1;
}
function SortByTitle(x, y) {
  return x.title == y.title ? 0 : x.title > y.title ? 1 : -1;
}
function uniqueByKey(array, key) {
  return [...new Map(array.map(x => [x[key], x])).values()];
}
export const GenerateAllNode = (data, t, sortBy) => {
  try {
    let _tmp = JSON.parse(JSON.stringify(data));
    _tmp.category.unshift({
      id: 'all',
      name: t('All'),
      image: '',
    });
    let _node = {
      id: 'all',
      data: [],
    };
    for (let a = 0; a < _tmp.data.length; a++) {
      _node.data.push(..._tmp.data[a].data);
    }
    try {
      let _t = uniqueByKey(_node.data, 'offerid');

      if (_t != null && _t.length > 10) {
        _node.data = _t;
      }
    } catch (e) {}
    _node.data.sort(sortBy === 'title' ? SortByTitle : SortBycountry);
    _tmp.data.unshift(_node);

    return _tmp;
  } catch (e) {
    consoleLog(e);
  }
  return data;
};

export function isB2CNumber(data) {
  try {
    if (data.CustomerType == 'B2B' && data.PaymentResponsible == 'X') {
      return '';
    } else if (data.CustomerType == 'B2B' && data.PaymentResponsible == '') {
      return 'B2B';
    }
  } catch (e) {}
  return null;
}
//CPR Number
export function isB2BCPRNumber(data) {
  try {
    if (data.CustomerType == 'B2B' && data.PaymentResponsible == '') {
      return 'B2BCPR';
    }
  } catch (e) {}
  return null;
}

export function getPaymentResponsibleValue(data) {
  try {
    if (data?.RatePlanType === 'POSTPAID') {
      if (data.CustomerType == 'B2B' && data.PaymentResponsible == 'X') {
        return 'EPR';
      } else if (data.CustomerType == 'B2B' && data.PaymentResponsible == '') {
        return 'CPR';
      }
    }
  } catch (e) {}
  return '';
}

export const UpdateProfileInfo = data => {
  try {
    global.rateplantype = data?.RatePlanType;
    global.customerprofile = data;
    global.ProfileCustomerType = isB2CNumber(data);
    global.isB2BCPR = isB2BCPRNumber(data);
    global.iswannauser = data?.IsDigitalCustomer;
    global.wanastage = data?.wanastage;
  } catch (e) {}
};

export const regexEmoji =
  /\uD83C\uDFF4(?:\uDB40\uDC67\uDB40\uDC62(?:\uDB40\uDC65\uDB40\uDC6E\uDB40\uDC67|\uDB40\uDC77\uDB40\uDC6C\uDB40\uDC73|\uDB40\uDC73\uDB40\uDC63\uDB40\uDC74)\uDB40\uDC7F|\u200D\u2620\uFE0F)|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC68(?:\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D)?\uD83D\uDC68|(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67]))|\uD83D\uDC66\u200D\uD83D\uDC66|\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3]))|\uD83D\uDC69\u200D(?:\u2764\uFE0F\u200D(?:\uD83D\uDC8B\u200D(?:\uD83D[\uDC68\uDC69])|\uD83D[\uDC68\uDC69])|\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66\u200D\uD83D\uDC66|(?:\uD83D\uDC41\uFE0F\u200D\uD83D\uDDE8|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\uD83D\uDC68(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2695\u2696\u2708]|\u200D[\u2695\u2696\u2708])|(?:(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)\uFE0F|\uD83D\uDC6F|\uD83E[\uDD3C\uDDDE\uDDDF])\u200D[\u2640\u2642]|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:(?:\uD83C[\uDFFB-\uDFFF])\u200D[\u2640\u2642]|\u200D[\u2640\u2642])|\uD83D\uDC69\u200D[\u2695\u2696\u2708])\uFE0F|\uD83D\uDC69\u200D\uD83D\uDC67\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC69\u200D\uD83D\uDC69\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D\uDC68(?:\u200D(?:(?:\uD83D[\uDC68\uDC69])\u200D(?:\uD83D[\uDC66\uDC67])|\uD83D[\uDC66\uDC67])|\uD83C[\uDFFB-\uDFFF])|\uD83C\uDFF3\uFE0F\u200D\uD83C\uDF08|\uD83D\uDC69\u200D\uD83D\uDC67|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])\u200D(?:\uD83C[\uDF3E\uDF73\uDF93\uDFA4\uDFA8\uDFEB\uDFED]|\uD83D[\uDCBB\uDCBC\uDD27\uDD2C\uDE80\uDE92]|\uD83E[\uDDB0-\uDDB3])|\uD83D\uDC69\u200D\uD83D\uDC66|\uD83C\uDDF6\uD83C\uDDE6|\uD83C\uDDFD\uD83C\uDDF0|\uD83C\uDDF4\uD83C\uDDF2|\uD83D\uDC69(?:\uD83C[\uDFFB-\uDFFF])|\uD83C\uDDED(?:\uD83C[\uDDF0\uDDF2\uDDF3\uDDF7\uDDF9\uDDFA])|\uD83C\uDDEC(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEE\uDDF1-\uDDF3\uDDF5-\uDDFA\uDDFC\uDDFE])|\uD83C\uDDEA(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDED\uDDF7-\uDDFA])|\uD83C\uDDE8(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDEE\uDDF0-\uDDF5\uDDF7\uDDFA-\uDDFF])|\uD83C\uDDF2(?:\uD83C[\uDDE6\uDDE8-\uDDED\uDDF0-\uDDFF])|\uD83C\uDDF3(?:\uD83C[\uDDE6\uDDE8\uDDEA-\uDDEC\uDDEE\uDDF1\uDDF4\uDDF5\uDDF7\uDDFA\uDDFF])|\uD83C\uDDFC(?:\uD83C[\uDDEB\uDDF8])|\uD83C\uDDFA(?:\uD83C[\uDDE6\uDDEC\uDDF2\uDDF3\uDDF8\uDDFE\uDDFF])|\uD83C\uDDF0(?:\uD83C[\uDDEA\uDDEC-\uDDEE\uDDF2\uDDF3\uDDF5\uDDF7\uDDFC\uDDFE\uDDFF])|\uD83C\uDDEF(?:\uD83C[\uDDEA\uDDF2\uDDF4\uDDF5])|\uD83C\uDDF8(?:\uD83C[\uDDE6-\uDDEA\uDDEC-\uDDF4\uDDF7-\uDDF9\uDDFB\uDDFD-\uDDFF])|\uD83C\uDDEE(?:\uD83C[\uDDE8-\uDDEA\uDDF1-\uDDF4\uDDF6-\uDDF9])|\uD83C\uDDFF(?:\uD83C[\uDDE6\uDDF2\uDDFC])|\uD83C\uDDEB(?:\uD83C[\uDDEE-\uDDF0\uDDF2\uDDF4\uDDF7])|\uD83C\uDDF5(?:\uD83C[\uDDE6\uDDEA-\uDDED\uDDF0-\uDDF3\uDDF7-\uDDF9\uDDFC\uDDFE])|\uD83C\uDDE9(?:\uD83C[\uDDEA\uDDEC\uDDEF\uDDF0\uDDF2\uDDF4\uDDFF])|\uD83C\uDDF9(?:\uD83C[\uDDE6\uDDE8\uDDE9\uDDEB-\uDDED\uDDEF-\uDDF4\uDDF7\uDDF9\uDDFB\uDDFC\uDDFF])|\uD83C\uDDE7(?:\uD83C[\uDDE6\uDDE7\uDDE9-\uDDEF\uDDF1-\uDDF4\uDDF6-\uDDF9\uDDFB\uDDFC\uDDFE\uDDFF])|[#\*0-9]\uFE0F\u20E3|\uD83C\uDDF1(?:\uD83C[\uDDE6-\uDDE8\uDDEE\uDDF0\uDDF7-\uDDFB\uDDFE])|\uD83C\uDDE6(?:\uD83C[\uDDE8-\uDDEC\uDDEE\uDDF1\uDDF2\uDDF4\uDDF6-\uDDFA\uDDFC\uDDFD\uDDFF])|\uD83C\uDDF7(?:\uD83C[\uDDEA\uDDF4\uDDF8\uDDFA\uDDFC])|\uD83C\uDDFB(?:\uD83C[\uDDE6\uDDE8\uDDEA\uDDEC\uDDEE\uDDF3\uDDFA])|\uD83C\uDDFE(?:\uD83C[\uDDEA\uDDF9])|(?:\uD83C[\uDFC3\uDFC4\uDFCA]|\uD83D[\uDC6E\uDC71\uDC73\uDC77\uDC81\uDC82\uDC86\uDC87\uDE45-\uDE47\uDE4B\uDE4D\uDE4E\uDEA3\uDEB4-\uDEB6]|\uD83E[\uDD26\uDD37-\uDD39\uDD3D\uDD3E\uDDB8\uDDB9\uDDD6-\uDDDD])(?:\uD83C[\uDFFB-\uDFFF])|(?:\u26F9|\uD83C[\uDFCB\uDFCC]|\uD83D\uDD75)(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u261D\u270A-\u270D]|\uD83C[\uDF85\uDFC2\uDFC7]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66\uDC67\uDC70\uDC72\uDC74-\uDC76\uDC78\uDC7C\uDC83\uDC85\uDCAA\uDD74\uDD7A\uDD90\uDD95\uDD96\uDE4C\uDE4F\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD30-\uDD36\uDDB5\uDDB6\uDDD1-\uDDD5])(?:\uD83C[\uDFFB-\uDFFF])|(?:[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55]|\uD83C[\uDC04\uDCCF\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE1A\uDE2F\uDE32-\uDE36\uDE38-\uDE3A\uDE50\uDE51\uDF00-\uDF20\uDF2D-\uDF35\uDF37-\uDF7C\uDF7E-\uDF93\uDFA0-\uDFCA\uDFCF-\uDFD3\uDFE0-\uDFF0\uDFF4\uDFF8-\uDFFF]|\uD83D[\uDC00-\uDC3E\uDC40\uDC42-\uDCFC\uDCFF-\uDD3D\uDD4B-\uDD4E\uDD50-\uDD67\uDD7A\uDD95\uDD96\uDDA4\uDDFB-\uDE4F\uDE80-\uDEC5\uDECC\uDED0-\uDED2\uDEEB\uDEEC\uDEF4-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])|(?:[#*0-9\xA9\xAE\u203C\u2049\u2122\u2139\u2194-\u2199\u21A9\u21AA\u231A\u231B\u2328\u23CF\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2604\u260E\u2611\u2614\u2615\u2618\u261D\u2620\u2622\u2623\u2626\u262A\u262E\u262F\u2638-\u263A\u2640\u2642\u2648-\u2653\u265F\u2660\u2663\u2665\u2666\u2668\u267B\u267E\u267F\u2692-\u2697\u2699\u269B\u269C\u26A0\u26A1\u26AA\u26AB\u26B0\u26B1\u26BD\u26BE\u26C4\u26C5\u26C8\u26CE\u26CF\u26D1\u26D3\u26D4\u26E9\u26EA\u26F0-\u26F5\u26F7-\u26FA\u26FD\u2702\u2705\u2708-\u270D\u270F\u2712\u2714\u2716\u271D\u2721\u2728\u2733\u2734\u2744\u2747\u274C\u274E\u2753-\u2755\u2757\u2763\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934\u2935\u2B05-\u2B07\u2B1B\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC04\uDCCF\uDD70\uDD71\uDD7E\uDD7F\uDD8E\uDD91-\uDD9A\uDDE6-\uDDFF\uDE01\uDE02\uDE1A\uDE2F\uDE32-\uDE3A\uDE50\uDE51\uDF00-\uDF21\uDF24-\uDF93\uDF96\uDF97\uDF99-\uDF9B\uDF9E-\uDFF0\uDFF3-\uDFF5\uDFF7-\uDFFF]|\uD83D[\uDC00-\uDCFD\uDCFF-\uDD3D\uDD49-\uDD4E\uDD50-\uDD67\uDD6F\uDD70\uDD73-\uDD7A\uDD87\uDD8A-\uDD8D\uDD90\uDD95\uDD96\uDDA4\uDDA5\uDDA8\uDDB1\uDDB2\uDDBC\uDDC2-\uDDC4\uDDD1-\uDDD3\uDDDC-\uDDDE\uDDE1\uDDE3\uDDE8\uDDEF\uDDF3\uDDFA-\uDE4F\uDE80-\uDEC5\uDECB-\uDED2\uDEE0-\uDEE5\uDEE9\uDEEB\uDEEC\uDEF0\uDEF3-\uDEF9]|\uD83E[\uDD10-\uDD3A\uDD3C-\uDD3E\uDD40-\uDD45\uDD47-\uDD70\uDD73-\uDD76\uDD7A\uDD7C-\uDDA2\uDDB0-\uDDB9\uDDC0-\uDDC2\uDDD0-\uDDFF])\uFE0F|(?:[\u261D\u26F9\u270A-\u270D]|\uD83C[\uDF85\uDFC2-\uDFC4\uDFC7\uDFCA-\uDFCC]|\uD83D[\uDC42\uDC43\uDC46-\uDC50\uDC66-\uDC69\uDC6E\uDC70-\uDC78\uDC7C\uDC81-\uDC83\uDC85-\uDC87\uDCAA\uDD74\uDD75\uDD7A\uDD90\uDD95\uDD96\uDE45-\uDE47\uDE4B-\uDE4F\uDEA3\uDEB4-\uDEB6\uDEC0\uDECC]|\uD83E[\uDD18-\uDD1C\uDD1E\uDD1F\uDD26\uDD30-\uDD39\uDD3D\uDD3E\uDDB5\uDDB6\uDDB8\uDDB9\uDDD1-\uDDDD])/g;

export const defaultlayout = async val => {
  if (val) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);
  } else {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
  }
};

export const GetTextColorByBG = (c, d) => {
  try {
    consoleLog('GetTextColorByBG', c);
    if (c === '#00416A') {
      return colors.WHITE;
    }
  } catch (e) {}
  return d;
};

export const GetNojoomError = () => {
  let _msg = '';

  try {
    if (
      global.globalSettResponse != null &&
      global.globalSettResponse?.Globalsettings != null
    ) {
      let thme =
        global.globalSettResponse?.Globalsettings[0].items[0].metadata.filter(
          x => x.meta_key === 'b2bcpr_nojoom_message'
        );

      if (thme != null) {
        _msg = thme[0].meta_value_english;
        if (global.userlanguage != 'en') {
          _msg = thme[0].meta_value_arabic;
        }
      }
    }
  } catch (e) {}

  return _msg;
};

export const GetUpdateMessages = key => {
  let _msg = '';

  try {
    if (
      global.globalSettResponse != null &&
      global.globalSettResponse?.Globalsettings != null
    ) {
      let thme =
        global.globalSettResponse?.Globalsettings[0].items[0].metadata.filter(
          x => x.meta_key === key ///'app_forceupdate_message'
        );

      if (thme != null) {
        _msg = thme[0].meta_value_english;
        if (global.userlanguage != 'en') {
          _msg = thme[0].meta_value_arabic;
        }
      }
    }
  } catch (e) {}

  return _msg;
};

export const replaceAll = (str, mapObj) => {
  var re = new RegExp(Object.keys(mapObj).join('|'), 'gi');

  return str.replace(re, function (matched) {
    return mapObj[matched];
  });
};

export const regexPasswordTest = password => {
  let validPassword = password.replace(/\s/g, '');
  return validPassword;
};

export const loginTypeValue = () => {
  try {
    getItem(LOGIN_TYPE).then(val => {
      if (val === 'otp') {
        global.logintype = 'otp';
      } else if (val === 'he') {
        global.logintype = 'HE';
      } else if (val === 'Facebook') {
        global.logintype = 'Facebook';
      } else if (val === 'gmail') {
        global.logintype = 'gmail';
      } else if (val === 'appleid') {
        global.logintype = 'appleid';
      } else if (val === 'email' || val === 'pass') {
        global.logintype = 'email';
      } else {
        global.logintype = val;
      }
    });
  } catch (error) {}
};

/**
 * Its use to build app shortcuts array
 * @param {object} quickActionData
 */
export const setQuickAction = quickActionData => {
  try {
    if (
      quickActionData != null &&
      quickActionData?.dynamictypes?.length > 0 &&
      quickActionData?.dynamictypes[0]?.cards?.length > 0
    ) {
      const buildQuickAction = quickActionData?.dynamictypes[0]?.cards.map(
        val => ({
          type: val?.displaytext,
          title: val?.displaytext,
          subtitle: val?.description,
          icon: val?.icon_name
            ? val?.icon_name
            : val?.metadata?.icon_name
            ? val?.metadata?.icon_name
            : getIconName(val?.redirecturl),
          userInfo: {
            url: val?.redirecturl,
          },
        })
      );

      setQuickActionItem(buildQuickAction);
    }
  } catch (e) {}
};

/**
 * check redirect url and return respective iconname
 * @param {string} redirecturl
 * @returns
 */
const getIconName = redirecturl => {
  switch (redirecturl) {
    case 'login':
      return 'ql_login_icon';
    case 'shop':
      return 'ql_shop_icon';
    case 'rechargebillpayment':
      return 'ql_recharge_icon';
    case 'addons':
      return 'ql_addons_icon';
    case 'specialoffers':
      return 'ql_offer_icon';
    case 'ooredoosurprise':
      return 'ql_surprise_icon';
    default:
      return 'ic_launcher';
  }
};

export const GetMetaDataValue = (data, key) => {
  let _msg = React.useMemo(() => {
    try {
      if (data != null) {
        let thme = data.filter(
          x => x.meta_key === key ///'app_forceupdate_message'
        );
        if (thme != null) {
          _msg = thme[0].meta_value_english;
          if (global.userlanguage != 'en') {
            _msg = thme[0].meta_value_arabic;
          }
        }
      }
    } catch (e) {}
  });
  return _msg;
};

export const GetMetaDataFullViewValue = (data, key) => {
  let _msg = '';

  try {
    if (data != null) {
      let thme = data.filter(
        x => x.meta_key === key ///'app_forceupdate_message'
      );

      if (thme != null) {
        _msg = thme[0].meta_value_english;
        if (global.userlanguage != 'en') {
          _msg = thme[0].meta_value_arabic;
        }
      }
    }
  } catch (e) {}

  return _msg;
};

/**
 * use to set quick action item
 * @param {array} data quick action items
 */
export const setQuickActionItem = data => {
  try {
    QuickActions.setShortcutItems(data);
  } catch (e) {}
};

export const urlToBase64 = url => {
  const headers = getImageHeaders(global.tokenid, global.userlanguage);
  const fs = RNFetchBlob.fs;
  let imagePath = null;
  return (
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch('GET', url, headers)
      // the image is now dowloaded to device's storage
      .then(resp => {
        imagePath = resp.path();
        return resp.readFile('base64');
      })
      .then(base64Data => {
        fs.unlink(imagePath);
        return `data:image/png;base64,${base64Data}`;
      })
  );
};

export const onShare = async data => {
  try {
    const replaceObj = {
      '!DEEPLINKURL!': data?.deeplinkurl,
    };

    const sharedText = replaceAll(data?.sharedtext, replaceObj);

    const result = await Share.share({
      message: `${sharedText}`,
    });
  } catch (error) {
    consoleLog('err', error);
  }
};

// export const onShareWithImage = async shareImageData => {
//   try {
//     Share.open(shareImageData)
//     .then((res) => {
//     consoleLog("res",res);
//     })
//     .catch((err) => {
//       err && consoleLog(err);
//     });

//   } catch (error) {
//     consoleLog("err",error)
//   }
// };

export const GetMessagelength = data => {
  try {
    if (data?.status === '0') {
      if (data?.response == null || data?.response.length == 0) {
        return '';
      } else {
        for (let i = 0; i < data?.response?.length; i++) {
          if (
            data?.response[i].description != undefined ||
            data?.response[i].description != null ||
            data?.response[i].description != ''
          ) {
            return data?.response[i].description;
          }
        }
      }
    }
  } catch (e) {}

  return '';
};

export const getGlobalSettingValue = key => {
  try {
    let settValue =
      global.globalSettResponse?.Globalsettings[0]?.items[0]?.metadata.filter(
        x => x?.meta_key === key
      );
    if (settValue != null) {
      if (
        global.userlanguage != null &&
        global.userlanguage !== undefined &&
        global.userlanguage !== '' &&
        global.userlanguage === 'ar'
      ) {
        return settValue[0]?.meta_value_arabic;
      } else {
        return settValue[0]?.meta_value_english;
      }
    } else {
      return '';
    }
    return '';
  } catch (error) {}
};

export const shopPriceCalculation = (
  parentProduct,
  childProduct,
  simtype,
  packvalidity,
  type,
  outstanding_amount
) => {
  const isConfigurable = parentProduct?.type === 'configurable';
  const isSimple = parentProduct?.type === 'simple';
  const duetoday = isConfigurable
    ? childProduct?.duetoday
    : isSimple
    ? parentProduct?.duetoday
    : 0;
  const price =
    childProduct !== '' && childProduct != null && childProduct !== undefined
      ? childProduct?.price
      : parentProduct?.price;

  if (type === 'migration' || type === 'portin') {
    const validity = isConfigurable
      ? childProduct?.validity
      : isSimple
      ? parentProduct?.validity
      : null;

    const total =
      packvalidity &&
      validity != null &&
      validity != undefined &&
      validity != ''
        ? Number(duetoday || 0) +
          Number(outstanding_amount || 0) +
          '/' +
          validity
        : Number(duetoday || 0) + Number(outstanding_amount || 0);

    const condition =
      isConfigurable ||
      (childProduct !== '' &&
        childProduct != null &&
        childProduct !== undefined);

    const result = condition
      ? total
      : packvalidity
      ? Number(price || 0) +
        Number(outstanding_amount || 0) +
        '/' +
        parentProduct?.validity
      : Number(price || 0) + Number(outstanding_amount || 0);

    return result;
  } else {
    const esimPrice =
      simtype === 'esim'
        ? isConfigurable
          ? childProduct?.esimprice
          : isSimple
          ? parentProduct?.esimprice
          : 0
        : 0;
    const validity = isConfigurable
      ? childProduct?.validity
      : isSimple
      ? parentProduct?.validity
      : null;

    const total =
      packvalidity &&
      validity != null &&
      validity != undefined &&
      validity != ''
        ? Number(duetoday || 0) +
          Number(
            (childProduct && childProduct?.linetype == 'Postpaid') ||
              (parentProduct && parentProduct?.linetype == 'Postpaid')
              ? 0
              : global.NewSimNumberSliderItem?.Price || 0
          ) +
          Number(esimPrice || 0) +
          '/' +
          validity
        : Number(duetoday || 0) +
          Number(
            (childProduct && childProduct?.linetype == 'Postpaid') ||
              (parentProduct && parentProduct?.linetype == 'Postpaid')
              ? 0
              : global.NewSimNumberSliderItem?.Price || 0
          ) +
          Number(esimPrice || 0);

    const condition =
      isConfigurable ||
      (childProduct !== '' &&
        childProduct != null &&
        childProduct !== undefined);

    const result = condition
      ? total
      : packvalidity
      ? Number(price || 0) +
        Number(
          (childProduct && childProduct?.linetype == 'Postpaid') ||
            (parentProduct && parentProduct?.linetype == 'Postpaid')
            ? 0
            : global.NewSimNumberSliderItem?.Price || 0
        ) +
        Number(esimPrice || 0) +
        '/' +
        parentProduct?.validity
      : Number(price || 0) +
        Number(
          (childProduct && childProduct?.linetype == 'Postpaid') ||
            (parentProduct && parentProduct?.linetype == 'Postpaid')
            ? 0
            : global.NewSimNumberSliderItem?.Price || 0
        ) +
        Number(esimPrice || 0);

    return result;
  }
};

export const getGlobalSettingValueflag = key => {
  try {
    let settValue =
      global.globalSettResponse?.Globalsettings[0]?.items[0]?.metadata.filter(
        x => x?.meta_key === key
      );
    if (settValue != null) {
      if (global.userlanguage != 'en') {
        return {
          imageurl: settValue[0]?.meta_value_arabic,
          active: settValue[0]?.active,
        };
      } else {
        return {
          imageurl: settValue[0]?.meta_value_english,
          active: settValue[0]?.active,
        };
      }
    } else {
      return null;
    }
  } catch (error) {}
};

export const generateUUID = digits => {
  try {
    getItem(DEVICE_UNQUIE_ID).then(val => {
      if (val == null || val === undefined || val === '') {
        let str =
          '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVXZ';
        let uuid = [];
        for (let i = 0; i < digits; i++) {
          uuid.push(str[Math.floor(Math.random() * str.length)]);
        }
        setItem(DEVICE_UNQUIE_ID, uuid.join(''));
        return uuid.join('');
      } else {
        return val;
      }
    });
  } catch (error) {}
};

export const initMeQualtrics = () => {
  Qualtrics.initializeProjectWithExtRefId(
    'ooredoogroup',
    'ZN_9mhuxCs96dQY1im',
    '',
    initializationResults => {
      consoleLog(initializationResults);
    }
  );
};

export const eveluateMeQualtrics = (
  screenName,
  logginType,
  nmflowtokenid = ''
) => {
  Qualtrics.evaluateProject(targetingResults => {
    consoleLog('targetingResults', targetingResults);
    Qualtrics.setString('OPCO_ID', 'OK');
    // Qualtrics.setString('env', 'dev');
    Qualtrics.setString(
      'Language',
      global.userlanguage != 'en' ? 'AR-KU' : 'EN'
    );
    Qualtrics.setString('ScreenName', screenName);
    Qualtrics.setString('LoginType', logginType);
    if (nmflowtokenid != '') {
      Qualtrics.setString('nmfloId', nmflowtokenid);
    }
    for (var intercept in targetingResults) {
      let result = targetingResults[intercept];
      if (result.passed) {
        Qualtrics.display();
      }
    }
    consoleLog('Evaluation Done');
  });
};

export const storeCurrentDate = async () => {
  try {
    const currentDate = new Date();
    await AsyncStorage.setItem(SHOP_CART_TIME, currentDate.toISOString());
    console.log('Current date stored successfully:', currentDate);
  } catch (error) {
    console.error('Error storing current date:', error);
  }
};

export const getCurrentDate = async () => {
  try {
    const storedDate = await AsyncStorage.getItem(SHOP_CART_TIME);
    if (storedDate !== null) {
      const currentDate = new Date(storedDate);
      console.log('Retrieved current date:', currentDate);
      return currentDate;
    } else {
      console.log('No stored date found.');
    }
  } catch (error) {
    console.error('Error retrieving current date:', error);
  }
};
