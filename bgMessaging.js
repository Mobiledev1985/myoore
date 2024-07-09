import {AppRegistry} from 'react-native';
import firebase from 'react-native-firebase';
// Optional flow type
import {RemoteMessage} from 'react-native-firebase';

const bgMessaging = async (message: RemoteMessage) => {
  // handle your message
  return Promise.resolve();
};

AppRegistry.registerHeadlessTask(
  'RNFirebaseBackgroundMessage',
  () => bgMessaging
);
