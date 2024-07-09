import {
  SHOP_HOME_PAGE,
} from '../../../resources/route/endpoints';
import {useFocusEffect, useIsFocused} from '@react-navigation/core';

import {BackHandler} from 'react-native';
import DrawerLayout from '../../../models/basic/DrawerLayout';
import PageLayoutComponent from '../../masterlayout/PageLayoutComponent';
import React from 'react';
import ScreenName from '../../../navigator/ScreenName';
import colors from '../../../resources/styles/colors';
import {useToggleTabBar} from '../../../models/hooks/showHideBottomTab';
const ShopHomeIndex = ({navigation, route}) => {
  useToggleTabBar({
    navigation,
    route,
    screenName: ScreenName.shopScreen,
    show: true,
  });
  const isFocused = useIsFocused();
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
    <DrawerLayout>
      <PageLayoutComponent
        showFavouriteButton={true}
        showBackButton={false}
        pagename={'shophome'}
        pageid={SHOP_HOME_PAGE}
        ShowCenterLogo={true}
        showAlertIcon={false}
        statusbarcolor={colors.WHITE}
        enablescroll={false}
        checkfocused={true}
      />
    </DrawerLayout>
  );
};

export default ShopHomeIndex;
