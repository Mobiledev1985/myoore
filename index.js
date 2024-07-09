/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {enableScreens} from 'react-native-screens';
import messaging from '@react-native-firebase/messaging';
import {initMeQualtrics} from './src/services/CommonUtils';
import {consoleLog} from './src/commonHelper/utils';
import {
  Instrumentation
} from '@appdynamics/react-native-agent';

try {
  Instrumentation.start({
    appKey: '',
    collectorURL: '',
    anrDetectionEnabled: true,
    excludedURLPatterns: [
      '',
    ]
  });
} catch (error) {}

try {
  global.notificationrenewalrefresh = true;
  initMeQualtrics();
} catch (error) {}

messaging().setBackgroundMessageHandler(async remoteMessage => {
  consoleLog('Message handled in the background!', remoteMessage);
});

enableScreens();
AppRegistry.registerComponent(appName, () => App);
