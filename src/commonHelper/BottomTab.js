import {
  FONT_10,
  FONT_14,
  FONT_18,
  HEIGHT_10,
  HEIGHT_30,
  HEIGHT_60,
  HEIGHT_70,
  VERTICAL_5,
  WIDTH_30,
} from '../resources/styles/responsive';
import {
  Image,
  Keyboard,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';

import {NOTOSANS_REGULAR_FONT} from '../resources/styles/fonts';
import {SCREEN_WIDTH} from '../resources/styles/normalizedimension';
import ScreenName from '../navigator/ScreenName';
import {Shadow} from 'react-native-neomorph-shadows';
import {Surface} from 'react-native-paper';
import colors from '../resources/styles/colors';
import {consoleLog} from './utils';
import {useDispatch, useSelector} from 'react-redux';
import {getMobileNumberHeader} from '../components/home/actions';

const TAB_HOME = require('../assets/tabhome.png');
const TAB_PAY = require('../assets/tabwallet.png');
const TAB_NOJOOM = require('../assets/tabnojoom.png');
const TAB_MORE = require('../assets/tabmore.png');
const TAB_SHOP = require('../assets/tabshop.png');
function getIcon(iconName, tintColor) {
  switch (iconName) {
    case 'home-outline':
      return (
        <Image
          source={TAB_HOME}
          style={[styles.tabimage, {tintColor: tintColor}]}
          resizeMode={'contain'}
        />
      );
    case 'wallet':
      return (
        <Image
          source={TAB_PAY}
          style={[styles.tabimage, {tintColor: tintColor}]}
          resizeMode={'contain'}
        />
      );
    case 'bag':
      return (
        <Image
          source={TAB_SHOP}
          style={[styles.tabimage, {tintColor: tintColor}]}
          resizeMode={'contain'}
        />
      );
    case 'star':
      return (
        <Image
          source={TAB_NOJOOM}
          style={[styles.tabimage, {tintColor: tintColor}]}
          resizeMode={'contain'}
        />
      );
    case 'list':
      return (
        <Image
          source={TAB_MORE}
          style={[styles.tabimage, {tintColor: tintColor}]}
          resizeMode={'contain'}
        />
      );
    default:
      return <View />;
  }
}

function BottomTabBar({state, descriptors, navigation}) {
  // const focusedOptions = descriptors[state.routes[state.index].key].options;
  const [visible, setVisible] = useState(true);
  const dispatch = useDispatch();

  // keyboard disappering in all the screens in android like transfer credit, knet payment etc
  useEffect(() => {
    let keyboardEventListeners;
    if (Platform.OS === 'android') {
      keyboardEventListeners = [
        Keyboard.addListener('keyboardDidShow', () => setVisible(false)),
        Keyboard.addListener('keyboardDidHide', () => setVisible(true)),
      ];
    }
    return () => {
      if (Platform.OS === 'android') {
        keyboardEventListeners &&
          keyboardEventListeners.forEach(eventListener =>
            eventListener.remove()
          );
      }
    };
  }, []);
  const stateuserdata = useSelector(stateObj => stateObj.userData);
  const focusedOptions = state.routes[state.index]
    ? descriptors[state.routes[state.index].key].options
    : null;
  if (focusedOptions?.tabBarVisible === false) {
    return null;
  }
  if (!visible) {
    return null;
  }
  return (
    <View style={styles.shadowView}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route?.name;
        const tabIcons = options.tabBarIcon;
        const isFocused = state.index === index;

        const onPress = () => {
          try {
            // const event = navigation.emit({
            //   type: 'tabPress',
            //   target: route.key,
            //   canPreventDefault: true,
            // });
            // consoleLog('onPress1', event.defaultPrevented);
            dispatch(getMobileNumberHeader(null));
            global.deeplinkKeyword = null;
            global.cvmOfferisSelected = false;
            global.cvmOfferChildMsisdn = null;
            global.autorenvalbuychangedeeplink = '';
            if (
              global.paysdkwidgetisopened != null &&
              global.paysdkwidgetisopened != '' &&
              global.paysdkwidgetisopened != undefined &&
              global.paysdkwidgetisopened == true
            ) {
              return;
            }
            global.assistParentID = 0;
            global.routeName = route?.name;

            // if (!isFocused ) {
            if (route?.name === ScreenName.homeStack) {
              global.roamingpop = null;
              global.timeroaming = 8000;
              if (
                stateuserdata?.isLoggedIn ||
                (global.logintype != null &&
                  global.logintype != '' &&
                  global.logintype != undefined)
              ) {
                global.selectedTabBar = global.routeName;
                // navigation.navigate(ScreenName.homeStack, {
                //   screen: ScreenName.homeScreen,
                // });
                navigation.reset({
                  index: 1,
                  routes: [
                    {
                      name: ScreenName.tabStack,
                      state: {routes: [{name: ScreenName.homeStack}]},
                    },
                  ],
                });
              } else {
                global.navigationTabState = ScreenName.homeScreen;
                navigation.navigate(ScreenName.landingScreen);
              }
            } else if (route?.name === ScreenName.NojoomStack) {
              if (
                stateuserdata?.isLoggedIn ||
                (global.logintype != null &&
                  global.logintype != '' &&
                  global.logintype != undefined)
              ) {
                if (
                  global.isB2BCPR == 'B2BCPR' &&
                  global.selectedTabBar == 'nohoomstack'
                ) {
                } else {
                  global.selectedTabBar = global.routeName;
                  navigation.reset({
                    index: 1,
                    routes: [
                      {
                        name: ScreenName.tabStack,
                        state: {routes: [{name: ScreenName.NojoomStack}]},
                      },
                    ],
                  });
                  // navigation.reset({
                  //   index: 0,
                  //   routes: [
                  //     {
                  //       name: ScreenName.tabStack,
                  //     },
                  //   ],
                  // });
                  // navigation.navigate(ScreenName.NojoomStack, {
                  //   screen: ScreenName.NojoomHome,
                  // });
                }
              } else {
                global.navigationTabState = ScreenName.NojoomStack;
                navigation.navigate(ScreenName.landingScreen);
              }
            } else if (route?.name === ScreenName.PayStack) {
              global.navigationTabState = ScreenName.PayStack;
              if (
                stateuserdata?.isLoggedIn ||
                (global.logintype != null &&
                  global.logintype != '' &&
                  global.logintype != undefined)
              ) {
                global.selectedTabBar = global.routeName;
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: ScreenName.PayStack,
                      state: {routes: [{name: ScreenName.PayHome}]},
                    },
                  ],
                });
                // global.selectedTabBar = global.routeName;
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: ScreenName.tabStack,
                //     },
                //   ],
                // });
                // navigation.navigate(ScreenName.PayStack, {
                //   screen: ScreenName.PayHome,
                // });
              } else {
                navigation.navigate(ScreenName.PayStack, {
                  screen: ScreenName.PayGuestHome,
                });
              }
            } else if (route?.name === ScreenName.MoreStack) {
              if (
                stateuserdata?.isLoggedIn ||
                (global.logintype != null &&
                  global.logintype != '' &&
                  global.logintype != undefined)
              ) {
                global.selectedTabBar = global.routeName;
                // navigation.reset({
                //   index: 0,
                //   routes: [
                //     {
                //       name: ScreenName.tabStack,
                //     },
                //   ],
                // });
                // navigation.navigate(ScreenName.MoreStack, {
                //   screen: ScreenName.MoreHome,
                // });
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: ScreenName.tabStack,
                    },
                  ],
                });
                navigation.navigate(ScreenName.MoreStack, {
                  screen: ScreenName.newmoreScreen,
                });
              } else {
                global.navigationTabState = ScreenName.MoreStack;
                // navigation.navigate(ScreenName.MoreStack, {
                //   screen: ScreenName.MoreGuestHome,
                // });
                navigation.navigate(ScreenName.MoreStack, {
                  screen: ScreenName.MoreGuestHomeNew,
                });
              }
            } else if (route?.name === ScreenName.ShopStack) {
              if (
                stateuserdata?.isLoggedIn ||
                (global.logintype != null &&
                  global.logintype != '' &&
                  global.logintype != undefined)
              ) {
                global.selectedTabBar = global.routeName;
                navigation.navigate(ScreenName.ShopStack, {
                  screen: ScreenName.shopScreen,
                });
              } else {
                global.navigationTabState = ScreenName.ShopStack;
                navigation.navigate(ScreenName.ShopStack, {
                  screen: ScreenName.ShopGuestHome,
                });
              }
            } else {
              navigation.navigate(route?.name);
            }
            // }
          } catch (error) {}
        };

        const tintColor = isFocused ? colors.OOREDOO_RED : colors.GREY;
        return (
          <View style={{flex: 1, backgroundColor: colors.WHITE}} key={index}>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityState={isFocused ? {selected: true} : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              style={styles.touchableIcon}>
              <>
                <View style={styles.iconContainer}>
                  {getIcon(tabIcons, tintColor)}
                </View>
                <View style={styles.iconTextContainer}>
                  <Text
                    style={[styles.label, {color: tintColor}]}
                    numberOfLines={1}>
                    {label}
                  </Text>
                </View>
              </>
            </TouchableOpacity>
            <View style={styles.container} />
          </View>
        );
      })}
    </View>
  );
}

export default React.memo(BottomTabBar);

const styles = StyleSheet.create({
  tabimage: {
    width: WIDTH_30,
    height: HEIGHT_30,
  },
  shadowView: {
    shadowColor: colors.BLACK,
    backgroundColor: colors.WHITE,
    borderRadius: 15,
    width: SCREEN_WIDTH,
    height: HEIGHT_70,
    flexDirection: 'row',
    elevation: 20,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 7,
  },
  container: {
    height: HEIGHT_10,
    position: 'absolute',
    bottom: 0,
    width: SCREEN_WIDTH,
    backgroundColor: colors.WHITE,
  },
  touchableIcon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: VERTICAL_5,
  },
  iconContainer: {flex: 1, justifyContent: 'center'},
  iconTextContainer: {flex: 1},
  label: {
    fontSize: FONT_10,
    fontFamily: NOTOSANS_REGULAR_FONT,
    lineHeight: FONT_18,
  },
});
