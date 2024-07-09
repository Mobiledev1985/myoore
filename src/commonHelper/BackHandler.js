import {useFocusEffect} from '@react-navigation/core';
import {useCallback, useEffect} from 'react';
import {Alert, BackHandler} from 'react-native';
import i18n from '../components/languageselector/i18next';

const useBackHandler = () => {
 

  useEffect(() => {
   
  }, []);

  const handler = () => {
    BackHandler.exitApp();
  };

  const backAction = () => {
    Alert.alert('Hold on!', 'Are you sure you want to close the application?', [
      {
        text: 'Cancel',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'OK', onPress: () => BackHandler.exitApp()},
    ]);
    return true;
  };
};

export default useBackHandler;

export const backActionAlert = () => {
  Alert.alert(i18n.t('logoutmsg'), null, [
    {
      text: i18n.t('Cancel').toUpperCase(),
      onPress: () => {},
      style: 'cancel',
    },
    {
      text: i18n.t('ok').toUpperCase(),
      onPress: () => {
        BackHandler.exitApp();
      },
    },
  ]);
};
