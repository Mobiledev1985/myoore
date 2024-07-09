import {Dimensions, I18nManager} from 'react-native';

import CleverTap from 'clevertap-react-native';

import {output} from '../commonHelper/ApiHeaders';
import DeviceInfo from 'react-native-device-info';
import {consoleLog, getItem} from '../commonHelper/utils';
import {ZDefendTroubleshoot} from 'zdefend';
import {CODEPUSH_VERSION} from '../commonHelper/Constants';

export {logEvents, setUserProperty, screenRecordEvent, setNewUserProperty};

const logEvents = (eventname, obj) => {
  try {
    CleverTap.recordEvent(eventname, obj);
    // CleverTap.setDebugLevel(3);
  } catch (e) {}
};
const screenRecordEvent = eventname => {
  try {
    consoleLog('screenRecordEvent- ' + eventname, {
      screen_name: eventname,
      LoginType: global.logintype || '',
      Status: 'Success',
      'Mobile Number': global?.customerprofile?.Msisdn || '',
      'Status Description': '',
    });
    getItem(CODEPUSH_VERSION).then(val => {
      CleverTap.recordEvent('screenview', {
        screen_name: eventname,
        LoginType: global.logintype || '',
        Status: 'Success',
        'Mobile Number': global?.customerprofile?.Msisdn || '',
        'Status Description': '',
        'CodePush Version': global.codepushversion || '',
      });
    });
    // CleverTap.setDebugLevel(3);
  } catch (e) {}
};

const setUserProperty = ({
  email,
  name,
  ContractID,
  mobileNo,
  isdigital,
  rateplantype,
  custtype,
  language,
  voiceline,
}) => {
  var userRatePlanType = '';
  var zimperiumId = '';
  if (voiceline === true) {
    userRatePlanType = rateplantype + ' VOICE';
  } else {
    userRatePlanType = rateplantype + ' WBB';
  }

  try {
    // let _getinfo = ZDetection.getDetectionDetailedInfo();
    // _getinfo.then(actitms => {
    //   try {
    //     zimperiumId = _getinfo?._W?.zDeviceID;
    //     setNewUserProperty({'Zimperium Device ID': zimperiumId});
    //   } catch (e) {}
    // });
    ZDefendTroubleshoot.getTroubleshootDetails({
      callback: troubleshootDetails => {
        // Assuming troubleshootDetails is iterable
        for (const element of troubleshootDetails) {
          if (element.key === 'Device ID') {
            // No need for JSON.stringify if element.val is already a string
            let DeviceID = element.val;
            setNewUserProperty({'Zimperium Device ID': DeviceID});
          }
        }
      },
    });
  } catch (e) {}
  try {
    CleverTap.onUserLogin({
      'SSO Details': email,
      Email: email,
      Identity: ContractID,
      Name: name,
      'Mobile Number':
        mobileNo == null || mobileNo == undefined || mobileNo == ''
          ? ''
          : mobileNo,
      Phone:
        mobileNo == null || mobileNo == undefined || mobileNo == ''
          ? ''
          : '+' + mobileNo,
      isdigitalcustomer: isdigital,
      PlanType: rateplantype,
      RatePlanType: rateplantype,
      UserRatePlanType: userRatePlanType,
      CustomerType: custtype,
      'Push notification': 'yes',
      'Smart Login': 'yes',
      'Device Name': output?.devcieName,
      ContractID: ContractID,
      Platform: DeviceInfo.getSystemName(),
      AppVersion: DeviceInfo.getVersion(),
      Language: language,
      'Updated on': new Date().toISOString(),
      'CodePush Version': global.codepushversion,
    });
  } catch (error) {}
};

const setNewUserProperty = props => {
  consoleLog('User Prop--', props);
  CleverTap.onUserLogin(props);
};
