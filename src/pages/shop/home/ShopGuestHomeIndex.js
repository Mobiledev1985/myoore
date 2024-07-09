import {useFocusEffect, useIsFocused} from '@react-navigation/core';
import React from 'react';
import {BackHandler} from 'react-native';
import ScreenName from '../../../navigator/ScreenName';
import {
  SHOP_GUESTHOME_PAGE,
  SHOP_HOME_PAGE,
} from '../../../resources/route/endpoints';
import PageLayoutComponent from '../../masterlayout/PageLayoutComponent';
const ShopGuestHomeIndex = ({navigation, route}) => {
  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      try {
        const parent = navigation.getParent();
        parent.setOptions({tabBarVisible: true});
      } catch (error) {
        consoleLog(error);
      }
    }, [navigation, route?.name])
  );

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (isFocused) {
          return true;
        } else {
          return false;
        }
      };
      BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () =>
        BackHandler.removeEventListener('hardwareBackPress', onBackPress);
    }, [isFocused])
  );
  return (
    <PageLayoutComponent
      showFavouriteButton={false}
      showBackButton={false}
      ShowCenterLogo={true}
      showAlertIcon={false}
      checkfocused={true}
      pagename={'shopguesthome'}
      pageid={SHOP_GUESTHOME_PAGE}
      shop={true}
    />
  );
};

export default ShopGuestHomeIndex;
