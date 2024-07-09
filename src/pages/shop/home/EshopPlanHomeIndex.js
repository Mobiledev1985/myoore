import { POSTPAID_HOME_PAGE, PREPAID_HOME_PAGE, ANAPAID_HOME_PAGE } from '../../../resources/route/endpoints';
  import {useFocusEffect, useIsFocused} from '@react-navigation/core';
  
  import {BackHandler} from 'react-native';
  import DrawerLayout from '../../../models/basic/DrawerLayout';
  import PageLayoutComponent from '../../masterlayout/PageLayoutComponent';
  import React from 'react';
  import ScreenName from '../../../navigator/ScreenName';
  import colors from '../../../resources/styles/colors';
  import {useToggleTabBar} from '../../../models/hooks/showHideBottomTab';
  const EshopPlanHomeIndex = ({navigation, route}) => {
   

    useToggleTabBar({
      navigation,
      route,
     screenName: ScreenName.EshopPlanHomeIndex,
      show: true,
         
    });
    const isFocused = useIsFocused();
    const {params} = route.params;
    
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
    try {
      switch (params.redirecturl) {
        case 'eshopprepaid':
          
            return(
              <DrawerLayout>
       
      <PageLayoutComponent
        showFavouriteButton={true}
        showBackButton={true}
        pagename={'EshopPlanHomeIndex'}
        type={'EshopPlanHomeIndex'}
        pageid= {PREPAID_HOME_PAGE}
        // pageid={params.redirecturl == 'eshopprepaid' ? PREPAID_HOME_PAGE : params.redirecturl == 'eshopana' ? ANAPAID_HOME_PAGE : POSTPAID_HOME_PAGE }
        ShowCenterLogo={true}
        showAlertIcon={false}
        statusbarcolor={colors.WHITE}
        enablescroll={false}
        checkfocused={true}
        enablecache={false}
      /> 
    </DrawerLayout>
            )
          
          case 'eshopana':
            
              return(
                <DrawerLayout>
         
        <PageLayoutComponent
          showFavouriteButton={true}
          showBackButton={true}
          pagename={'EshopPlanHomeIndex'}
          type={'EshopPlanHomeIndex'}
          pageid= {ANAPAID_HOME_PAGE}
          // pageid={params.redirecturl == 'eshopprepaid' ? PREPAID_HOME_PAGE : params.redirecturl == 'eshopana' ? ANAPAID_HOME_PAGE : POSTPAID_HOME_PAGE }
          ShowCenterLogo={true}
          showAlertIcon={false}
          statusbarcolor={colors.WHITE}
          enablescroll={false}
          checkfocused={true}
          enablecache={false}
        /> 
      </DrawerLayout>
              )
             
            case 'eshoppostpaid':
              
                return(
                  <DrawerLayout>
           
          <PageLayoutComponent
            showFavouriteButton={true}
            showBackButton={true}
            pagename={'EshopPlanHomeIndex'}
            type={'EshopPlanHomeIndex'}
            pageid= {POSTPAID_HOME_PAGE}
            // pageid={params.redirecturl == 'eshopprepaid' ? PREPAID_HOME_PAGE : params.redirecturl == 'eshopana' ? ANAPAID_HOME_PAGE : POSTPAID_HOME_PAGE }
            ShowCenterLogo={true}
            showAlertIcon={false}
            statusbarcolor={colors.WHITE}
            enablescroll={false}
            checkfocused={true}
            enablecache={false}
          /> 
        </DrawerLayout>
                )
            default:
              return <></>;
       
      }
    } catch (e) {
      return (
          <></>
      );
    }

//     return (
      
//         <DrawerLayout>
 
// <PageLayoutComponent
//   showFavouriteButton={true}
//   showBackButton={false}
//   pagename={'EshopPlanHomeIndex'}
//   pageid= {POSTPAID_HOME_PAGE}
//   // pageid={params.redirecturl == 'eshopprepaid' ? PREPAID_HOME_PAGE : params.redirecturl == 'eshopana' ? ANAPAID_HOME_PAGE : POSTPAID_HOME_PAGE }
//   ShowCenterLogo={true}
//   showAlertIcon={false}
//   statusbarcolor={colors.WHITE}
//   enablescroll={false}
//   checkfocused={true}
// /> 
// </DrawerLayout>
      

//     );
  };
  
  export default EshopPlanHomeIndex;
  