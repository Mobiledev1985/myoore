import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text, I18nManager} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  heightPixel,
  isTablet,
  widthPixel,
} from '../../resources/styles/normalizedimension';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import {RUBIK_SEMIBOLD_FONT} from '../../resources/styles/fonts';
import {FONT_13, WIDTH_26} from '../../resources/styles/responsive';
import colors from '../../resources/styles/colors';
import {
  NavigationContainer,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import ProductList from './ProductList';
import {NavigateByName} from '../../services/NavigationService';
import ScreenName from '../../navigator/ScreenName';

const ProductCategories = ({
  categories,
  products,
  setLoading,
  ordernowbtn,
  viewdetailsbtn,
  viewdetailspopupbtn,
  categoryRoutename,
}) => {
  const Tab = createMaterialTopTabNavigator();
  const [routeNameKey, setRouteNameKey] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const navigation = useNavigation();
  const navigationMethod = item => {
    try {
      global.contactinfoEmail = null;
      global.contactNumber = null;
      global.contactwhatsapp = null;
      global.summaryedittosim = null;
      NavigateByName(navigation, ScreenName.OrderNewSimScreen, item, null);
    } catch (error) {}
  };

  useFocusEffect(
    React.useCallback(() => {
      try {
        setRouteNameKey(prevKey => prevKey + 1);
      } catch (e) {}
    }, [])
  );

  // useEffect(() => {
  //   console.log('prevKey', categoryRoutename);
  //   setRouteNameKey(prevKey => prevKey + 1);
  //   global.deeplinkKeyword = null;
  // }, [categoryRoutename]);

  const buyOnlinebuttonClicked = item => {
    try {
      NavigateByName(
        navigation,
        item?.redirecturl,
        null,
        item,
        null,
        null,
        null
      );
    } catch (error) {}
  };

  const whyOordeoobuttonClicked = item => {
    try {
      NavigateByName(
        navigation,
        item?.redirecturl,
        null,
        item,
        null,
        null,
        null
      );
    } catch (error) {}
  };

  return (
    <>
      {categories && categories != null ? (
        <View style={styles.mainContainer}>
          {categories && categories != null && (
            <NavigationContainer key={routeNameKey} independent={true}>
              <Tab.Navigator
                initialRouteName={categoryRoutename}
                backBehavior={'none'}
                scrollEnabled={false}
                screenOptions={{
                  tabBarActiveTintColor: colors.OOREDOO_RED,
                  tabBarInactiveTintColor: colors.BLACK,
                  tabBarStyle: {
                    elevation: 0,
                    backgroundColor: colors.BG_PINK,
                    borderBottomWidth: 0.8,
                    borderColor: colors.OOREDDO_LIGHT_GREY,
                  },
                  tabBarIndicatorStyle: {
                    backgroundColor: colors.OOREDOO_RED,
                    height: showIndicator ? heightPixel(4) : 0,
                    borderRadius: 4,
                    bottom: -2,
                  },
                  tabBarScrollEnabled: true,
                  swipeEnabled: false,
                  tabBarPressColor: colors.LINE_LIGHT_GRAY,
                }}
                sceneContainerStyle={{
                  backgroundColor: colors.BG_COLOR_WHITE,
                }}>
                {categories?.map((items, index) => {
                  return (
                    <Tab.Screen
                      name={items?.name}
                      component={({navigation}) => (
                        <ProductList
                          productList={products}
                          navigation={navigation}
                          category={categories[index]}
                          products={products?.filter(
                            item => item?.catgid === categories[index]?.id
                          )}
                          index={index}
                          ordernowbtn={ordernowbtn}
                          viewdetailsbtn={viewdetailsbtn}
                          viewdetailspopupbtn={viewdetailspopupbtn}
                          orderNowButtonClick={value => {
                            navigationMethod(value);
                          }}
                          buyOnlinebuttonClicked={buyOnlinebuttonClicked}
                          whyOordeoobuttonClicked={whyOordeoobuttonClicked}
                        />
                      )}
                      options={{
                        tabBarLabel: ({focused}) => {
                          return (
                            <>
                              {focused ? (
                                <Text
                                  onLayout={e => {
                                    setShowIndicator(true);
                                  }}
                                  style={styles.categoryText}
                                  numberOfLines={1}>
                                  {items?.name}
                                </Text>
                              ) : (
                                <Text
                                  style={styles.unFocusedText}
                                  numberOfLines={1}>
                                  {items?.name}
                                </Text>
                              )}
                            </>
                          );
                        },
                      }}
                    />
                  );
                })}
              </Tab.Navigator>
            </NavigationContainer>
          )}
        </View>
      ) : null}
    </>
  );
};

export default ProductCategories;

const styles = StyleSheet.create({
  screenOptions: {
    tabBarActiveTintColor: colors.OOREDOO_RED,
    tabBarInactiveTintColor: colors.BLACK,
    tabBarStyle: {
      elevation: 0,
      backgroundColor: colors.BG_PINK,
      borderBottomWidth: 0.8,
      borderColor: colors.OOREDDO_LIGHT_GREY,
    },
    tabBarItemStyle: {
      width: isTablet
        ? widthPixel(130)
        : I18nManager.isRTL
        ? widthPixel(170)
        : widthPixel(130),
    },
    tabBarIndicatorStyle: {
      backgroundColor: colors.OOREDOO_RED,
      height: heightPixel(4),
      borderRadius: 4,
      bottom: -2,
    },
    tabBarScrollEnabled: true,
    swipeEnabled: false,
    tabBarPressColor: colors.LINE_LIGHT_GRAY,
  },
  mainContainer: {
    width: FULL_WIDTH_PERCENTAGE,
    flex: 1,
  },
  categoryText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
    color: colors.OOREDOO_RED,
  },
  unFocusedText: {
    fontFamily: RUBIK_SEMIBOLD_FONT,
    fontSize: FONT_13,
  },
});
