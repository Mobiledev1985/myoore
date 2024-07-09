import React from 'react';
import {StyleSheet, View} from 'react-native';

const ContainerView = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default ContainerView;

const styles = StyleSheet.create({
  container: {flex: 1},
});
