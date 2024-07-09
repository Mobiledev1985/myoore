import React from 'react';
import {KeyboardAvoidingView} from 'react-native';

const ContainerView = ({children}) => {
  return (
    <KeyboardAvoidingView style={{flex: 1}} behavior={'padding'}>
      {children}
    </KeyboardAvoidingView>
  );
};

export default ContainerView;
