import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {RecordScreenEvent} from '../../analytics/RecordEvents';
import { UnitTestProps } from '../../commonHelper/utils';

const ShopScreen = () => {
  RecordScreenEvent('Shop');
  return (
    <View 
    {...UnitTestProps('shopscreen', 'view', 'mainview')}
    style={styles.container}>
      <Text
      {...UnitTestProps('shopscreen', 'text', 'text1')}
      >Coming soon...</Text>
    </View>
  );
};

export default ShopScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
