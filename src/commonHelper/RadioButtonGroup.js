import React, {useState} from 'react';

import RadioButton from './RadioButton';
import {View} from 'react-native';

const RadioButtonGroup = ({values, onPress}) => {
  const [currentSelectedItem, setCurrentSelectedItem] = useState();

  const _onPress = item => {
    onPress(item);
    setCurrentSelectedItem(item?.msisdn);
  };

  return (
    <View>
      {values &&
        values.map((listItem, idx) => {
          return (
            <RadioButton
              key={idx}
              onRadioButtonPress={() => _onPress(listItem)}
              isChecked={currentSelectedItem === listItem.msisdn}
              data={listItem}
            />
          );
        })}
    </View>
  );
};

export default RadioButtonGroup;
