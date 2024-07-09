import {FONT_18, HORIZONTAL_10, WIDTH_38} from '../resources/styles/responsive';
import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AIcon from 'react-native-vector-icons/AntDesign';
import {DEFAULT_USER_IMAGE} from '../resources/route/endpoints';
import IconFA from 'react-native-vector-icons/FontAwesome';
import React from 'react';
import colors from '../resources/styles/colors';
import {esimStatusStyles} from '../pages/esim/EsimConfirm';
import {useTranslation} from 'react-i18next';
import ImageComponent from '../models/basic/ImageComponent';

const RadioButton = ({isChecked, data, onRadioButtonPress}) => {
  const {t} = useTranslation();

  return (
    <TouchableOpacity onPress={onRadioButtonPress}>
      <View style={styles.statusContainer}>
        {data?.image !== null &&
        data?.image !== '' &&
        data?.image !== undefined ? (
          <ImageComponent
            iwidth={WIDTH_38}
            iheight={WIDTH_38}
            type="image"
            source={data?.image}
            resizeMode={'cover'}
            style={esimStatusStyles.userImage}
          />
        ) : (
          <Image
            style={esimStatusStyles.userImage}
            source={DEFAULT_USER_IMAGE.img}
            resizeMode={'stretch'}
          />
        )}

        <View style={esimStatusStyles.statusSubContainer}>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={esimStatusStyles.username}>
            {data?.nickname ? data?.nickname : data.msisdn}
          </Text>
          {data?.nickname ? (
            <Text
              numberOfLines={1}
              ellipsizeMode="tail"
              style={esimStatusStyles.userNumberText}>
              {data.msisdn}
            </Text>
          ) : (
            <></>
          )}
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={esimStatusStyles.planText}>
            {data?.subscribertype}
          </Text>
        </View>

        <View
          style={{
            justifyContent: 'center',
          }}>
          {isChecked ? (
            <AIcon
              name={'checkcircle'}
              color={colors.OOREDOO_RED}
              size={FONT_18}
            />
          ) : (
            <IconFA
              name={'circle-thin'}
              color={colors.OOREDDO_LIGHT_GREY}
              size={FONT_18}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RadioButton;
const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    paddingVertical: HORIZONTAL_10,
    paddingHorizontal: HORIZONTAL_10,
    borderBottomWidth: 1,
    borderBottomColor: colors.OOREDDO_LIGHT_GREY,
  },
});
