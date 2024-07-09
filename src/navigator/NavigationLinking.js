import {utils} from '@react-native-firebase/app';
import {deepLinkConfig} from './DeepLinkConfig';
import ScreenName from './ScreenName';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {Linking} from 'react-native';
import {getItem} from '../commonHelper/utils';
import {LANGUAGE_SWITCHED} from '../commonHelper/Constants';
const Notifylinking = {
  async getInitialURL() {
    // First, you would need to get the initial URL from your third-party integration
    // The exact usage depend on the third-party SDK you use
    // For example, to get to get the initial URL for Firebase Dynamic Links:
    const {isAvailable} = utils().playServicesAvailability;

    if (isAvailable) {
      const initialLink = await dynamicLinks().getInitialLink();
      getItem(LANGUAGE_SWITCHED).then(val => {
        if (val !== 'T') {
          if (initialLink) {
            global.firebsedynamiclink = initialLink.url;
            return initialLink.url;
          }
        }
      });
    }

    // As a fallback, you may want to do the default deep link handling
    const url = await Linking.getInitialURL();
    console.log('console.log----> 1', url);
    getItem(LANGUAGE_SWITCHED).then(val => {
      if (val !== 'T') {
        if (global.deeplinkurl != undefined && global.deeplinkurl != null) {
          try {
            if (global.isKilledDynamiclink != 'yes') {
              if (url != null && url != undefined && url != '') {
                if (url?.includes('')) {
                  var redirectarray = url.split('page=');
                  global.deeplinkurl = redirectarray[1];
                } else if (url?.includes('')) {
                  var redirectarray = url.split('page=');
                  global.deeplinkurl = redirectarray[1];
                } else {
                  global.deeplinkurl = url;
                }
              }
            } else {
              global.isKilledDynamiclink = null;
              if (url != null && url != undefined && url != '') {
                if (url?.includes('')) {
                  if (url?.includes('')) {
                    var redirectarray = url.split('page=');
                    global.deeplinkurl = redirectarray[1];
                  } else if (url?.includes('')) {
                    var redirectarray = url.split('page=');
                    global.deeplinkurl = redirectarray[1];
                  } else {
                    global.deeplinkurl = url;
                  }
                }
              }
            }
          } catch (error) {}
          return url;
        }
      }
    });
  },
  prefixes: [
    '',
    '',
  ],
  config: deepLinkConfig,
};
export default Notifylinking;
