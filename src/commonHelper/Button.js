import React, {memo} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  I18nManager,
  Platform,
} from 'react-native';
import colors from '../resources/styles/colors';
import {moderateScale, verticalScale} from './scalingUtils';
import {TouchableOpacity as TouchButton} from 'react-native-gesture-handler';
import {OOREDOO_HEAVY_FONT} from '../resources/styles/fonts';
import {
  FONT_12,
  FONT_16,
  FONT_18,
  FONT_20,
  FONT_24,
  FONT_26,
  HEIGHT_30,
} from '../resources/styles/responsive';
import {UnitTestProps} from './utils';
export const TouchableButton =
  Platform.OS === 'ios' ? TouchButton : TouchableOpacity;
function areEqual(prevProps, nextProps) {
  if (prevProps.title !== nextProps.title) {
    return false;
  }
  return true;
}

function arePropsEqual(prevProps, nextProps) {
  if (
    prevProps.title !== nextProps.title ||
    prevProps.onPress !== nextProps.onPress
  ) {
    return false;
  }
  return true;
}

const Button = ({title, onPress, customStyle, testID}) => {
  return (
    <TouchableOpacity
      {...UnitTestProps('button', 'button', '1')}
      onPress={onPress}
      activeOpacity={0.1}
      style={customStyle}>
      <View
        {...UnitTestProps('button', 'view', '1')}
        style={styles.container}
        testID={testID}
        accessibilityLabel={testID}>
        <Text
          {...UnitTestProps('button', 'button', title)}
          testID={
            testID != null && testID != undefined ? testID + '_text' : null
          }
          accessibilityLabel={
            testID != null && testID != undefined ? testID + '_text' : null
          }
          style={styles.title}>
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default memo(Button, areEqual);

export const LandingPageButton = memo(function LandingPageButton({
  title,
  onPress,
  customStyle,
  customTextStyle,
  testID,
  accessibilityLabel,
  disabled = false,
  numberOfLines=undefined

}) {
  return (
    <TouchableOpacity
      {...UnitTestProps('button', 'landingpagebutton', '1')}
      style={customStyle}
      onPress={onPress}
      activeOpacity={0.9}
      testID={testID}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel}>
      <Text
      numberOfLines={numberOfLines}
        {...UnitTestProps('button', 'text', title)}
        testID={testID != null && testID != undefined ? testID + '_text' : null}
        accessibilityLabel={
          testID != null && testID != undefined ? testID + '_text' : null
        }
        style={customTextStyle}>
        {title}
      </Text>
    </TouchableOpacity>
  );
},
arePropsEqual);

export const ModalPageButton = memo(function ModalPageButton({
  title,
  onPress,
  customStyle,
  customTextStyle,
  disabled = false,
  testID,
  accessibilityLabel,
  numberOfLines,
}) {
  if (Platform.OS === 'ios') {
    return (
      <TouchableButton
        {...UnitTestProps('modalpagebutton', 'touchablebutton', '1')}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={customStyle}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={0.9}>
        <Text
          {...UnitTestProps('modalpagebutton', 'text', title)}
          numberOfLines={numberOfLines}
          style={customTextStyle}>
          {title}
        </Text>
      </TouchableButton>
    );
  } else {
    return (
      <TouchableOpacity
        {...UnitTestProps('modalpagebutton', 'button', '2')}
        testID={testID}
        accessibilityLabel={accessibilityLabel}
        style={customStyle}
        onPressIn={onPress}
        disabled={disabled}
        activeOpacity={0.9}>
        <Text
          {...UnitTestProps('modalpagebutton', 'text', title)}
          numberOfLines={numberOfLines}
          style={customTextStyle}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
},
arePropsEqual);

export const TouchableButtonPress = memo(
  function TouchableButtonPress({
    title,
    onPress,
    style,
    customTextStyle,
    children,
    disabled = false,
    testID,
    accessibilityLabel,
  }) {
    if (Platform.OS === 'ios') {
      return (
        <TouchableButton
          {...UnitTestProps('touchablebuttonpress', 'button', '1')}
          style={style}
          onPress={onPress}
          activeOpacity={0.9}
          disabled={disabled}
          testID={testID}
          accessibilityLabel={accessibilityLabel}>
          {children}
        </TouchableButton>
      );
    } else {
      return (
        <TouchableOpacity
          {...UnitTestProps('touchablebuttonpress', 'button', '1')}
          style={style}
          onPressIn={onPress}
          activeOpacity={0.9}
          disabled={disabled}
          testID={testID}
          accessibilityLabel={accessibilityLabel}>
          {children}
        </TouchableOpacity>
      );
    }
  },

  arePropsEqual
);

export const ContactButtonPress = memo(
  function ContactButtonPress({
    title,
    onPress,
    style,
    customTextStyle,
    children,
  }) {
    if (Platform.OS === 'ios') {
      return (
        <TouchableButton
          {...UnitTestProps('contactbuttonpress', 'button', '1')}
          style={style}
          onPress={onPress}
          activeOpacity={0.9}>
          {children}
        </TouchableButton>
      );
    } else {
      return (
        <TouchableOpacity
          {...UnitTestProps('contactbuttonpress', 'button', '1')}
          style={style}
          onPress={onPress}
          activeOpacity={0.9}>
          {children}
        </TouchableOpacity>
      );
    }
  },

  arePropsEqual
);

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    width: '80%',
    backgroundColor: colors.OOREDOO_RED,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: verticalScale(15),
    paddingVertical: verticalScale(10),
    borderRadius: moderateScale(50),
  },
  title: {
    color: '#fff',
    lineHeight: FONT_26,
    fontSize: FONT_16,
    fontFamily: OOREDOO_HEAVY_FONT,
  },
});
