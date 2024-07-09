import React from 'react';
import {View, StyleSheet} from 'react-native';
import colors from '../../resources/styles/colors';
import {WIDTH_2} from '../../resources/styles/responsive';
import { heightPixel } from '../../resources/styles/normalizedimension';

const DotsLineView = ({}) => {
  // Array to store dot components
  const dots = [];

  // Function to generate dot components
  const generateDots = () => {
    for (let i = 0; i < 1000; i++) {
      dots.push(<View key={i} style={styles.dot} />);
    }
    return dots;
  };

  return (
    <View style={styles.container}>
      {/* Render dots */}
      {generateDots()}
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dot: {
    width: WIDTH_2,
    height: heightPixel(1),
    borderRadius: 2,
    backgroundColor: colors.LIGHT_SHADOW_GRAY,
    marginHorizontal: 1,
  },
});

export default DotsLineView;
