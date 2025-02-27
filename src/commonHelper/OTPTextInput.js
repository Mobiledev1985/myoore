import React, {Component} from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import { FONT_20, FONT_28 } from '../resources/styles/responsive';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textInput: {
    height: 50,
    width: 50,
    margin: 5,
    textAlign: 'center',
    fontSize: FONT_20,
    lineHeight: FONT_28,
    fontWeight: '500',
    color: '#000000',
  },
});

const getOTPTextChucks = (inputCount, inputCellLength, text) => {
  let otpText =
    text.match(new RegExp('.{1,' + inputCellLength + '}', 'g')) || [];

  otpText = otpText.slice(0, inputCount);

  return otpText;
};

class OTPTextView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedInput: 0,
      otpText: getOTPTextChucks(
        props.inputCount,
        props.inputCellLength,
        props.defaultValue
      ),
    };
    this.count = 0;
    this.inputs = [];
  }

  basicValidation = text => {
    const validText = /^[0-9]+$/;
    return text.match(validText);
  };

  componentDidUpdate() {
    if (
      this.inputs.length > 0 &&
      this.state.otpText.length === 0 &&
      this.count === 0
    ) {
      this.count += 1;
      this.inputs[0].focus();
    }
  }

  onTextChange = (text, i) => {
    const {inputCellLength, inputCount, handleTextChange} = this.props;

    if (text && !this.basicValidation(text)) {
      return;
    }
    if (text.length === 4) {
      this.setValue(text);
      return;
    }
    this.setState(
      prevState => {
        let {otpText} = prevState;

        otpText[i] = text;
        return {
          otpText,
        };
      },
      () => {
        handleTextChange(this.state.otpText.join(''));
        if (text.length === inputCellLength && i !== inputCount - 1) {
          this.inputs[i + 1].focus();
        }
      }
    );
  };

  onInputFocus = i => {
    const {otpText} = this.state;

    const prevIndex = i - 1;

    if (prevIndex > -1 && !otpText[prevIndex] && !otpText.join('')) {
      this.inputs[prevIndex].focus();
      return;
    }

    this.setState({focusedInput: i});
  };

  onKeyPress = (e, i) => {
    const val = this.state.otpText[i] || '';

    if (e.nativeEvent.key === 'Backspace' && i !== 0 && !val.length) {
      this.inputs[i - 1].focus();
    }
  };

  clear = () => {
    this.setState(
      {
        otpText: [],
      },
      () => {
        this.inputs[0].focus();
        this.props.handleTextChange('');
      }
    );
  };

  setValue = value => {
    const {inputCount, inputCellLength} = this.props;
    if (value === '') {
      this.inputs[0].focus();
    }
    const updatedFocusInput = value.length - 1;

    this.setState(
      {
        otpText: getOTPTextChucks(inputCount, inputCellLength, value),
      },
      () => {
        if (this.inputs[updatedFocusInput]) {
          this.inputs[updatedFocusInput].focus();
        }

        this.props.handleTextChange(value);
      }
    );
  };

  render() {
    const {
      inputCount,
      offTintColor,
      tintColor,
      defaultValue,
      inputCellLength,
      containerStyle,
      textInputStyle,
      keyboardType,
      ...textInputProps
    } = this.props;

    const {focusedInput, otpText} = this.state;

    const TextInputs = [];

    for (let i = 0; i < inputCount; i += 1) {
      const inputStyle = [
        styles.textInput,
        textInputStyle,
        {borderColor: offTintColor},
      ];

      if (focusedInput === i) {
        inputStyle.push({borderColor: tintColor});
      }

      TextInputs.push(
        <TextInput
          ref={e => {
            this.inputs[i] = e;
          }}
          key={i}
          autoCorrect={true}
          spellCheck={true}
          keyboardType={keyboardType}
          autoFocus={false}
          secureTextEntry={true}
          value={otpText[i] || ''}
          style={inputStyle}
          returnKeyType={'done'}
          maxLength={1}
          onFocus={() => this.onInputFocus(i)}
          onChangeText={text => this.onTextChange(text, i)}
          multiline={false}
          onKeyPress={e => this.onKeyPress(e, i)}
          {...textInputProps}
        />
      );
    }

    return <View style={[styles.container, containerStyle]}>{TextInputs}</View>;
  }
}

OTPTextView.propTypes = {
  defaultValue: PropTypes.string,
  inputCount: PropTypes.number,
  containerStyle: PropTypes.any,
  textInputStyle: PropTypes.any,
  inputCellLength: PropTypes.number,
  tintColor: PropTypes.string,
  offTintColor: PropTypes.string,
  handleTextChange: PropTypes.func,
  inputType: PropTypes.string,
  keyboardType: PropTypes.string,
};

OTPTextView.defaultProps = {
  defaultValue: '',
  inputCount: 4,
  tintColor: '#3CB371',
  offTintColor: '#DCDCDC',
  inputCellLength: 1,
  containerStyle: {},
  textInputStyle: {},
  handleTextChange: () => {},
  keyboardType: 'numeric',
};

export default OTPTextView;
