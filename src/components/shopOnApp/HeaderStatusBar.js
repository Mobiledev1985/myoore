import React from 'react';
import {StyleSheet, View} from 'react-native';
import ImageComponent from '../../models/basic/ImageComponent';
import colors from '../../resources/styles/colors';
import {FULL_WIDTH_PERCENTAGE} from '../../commonHelper/Constants';
import {
  HEIGHT_12,
  HEIGHT_16,
  HEIGHT_28,
  HEIGHT_4,
  WIDTH_27,
  WIDTH_28,
} from '../../resources/styles/responsive';
import {isTablet} from '../../resources/styles/normalizedimension';

const HeaderStatusbar = ({elementMeta}) => {
  const Bar = ({isActive, additionStyle = {}}) => {
    return (
      <View
        style={[
          styles.bar,

          {
            backgroundColor:
              isActive == 'true' ? colors.RED_COLOR : colors.INACTIVEDOT,
            zIndex: 999,
            ...additionStyle,
          },
        ]}></View>
    );
  };

  return (
    <View style={styles.mainView}>
      <ImageComponent
        type="image"
        iwidth={WIDTH_28}
        iheight={WIDTH_28}
        source={elementMeta?.step1img}
        resizeMode={'contain'}
      />
      <Bar isActive={elementMeta?.step1active} />
      <ImageComponent
        type="image"
        iwidth={WIDTH_28}
        iheight={WIDTH_28}
        source={elementMeta?.step2img}
        resizeMode={'contain'}
      />
      <Bar isActive={elementMeta?.step2active} />
      <ImageComponent
        type="image"
        iwidth={WIDTH_28}
        iheight={WIDTH_28}
        source={elementMeta?.step3img}
        resizeMode={'contain'}
      />
      <Bar isActive={elementMeta?.step3active} />
      <ImageComponent
        type="image"
        iwidth={WIDTH_28}
        iheight={WIDTH_28}
        source={elementMeta?.step4img}
        resizeMode={'contain'}
      />
    </View>
  );
};

export default HeaderStatusbar;

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    backgroundColor: colors.BG_COLOR_WHITE,
    width: FULL_WIDTH_PERCENTAGE,
    paddingTop: HEIGHT_12,
    paddingBottom: HEIGHT_16,
  },
  bar: {
    height: HEIGHT_4,
    width: WIDTH_27,
    alignSelf: 'center',
  },
});
