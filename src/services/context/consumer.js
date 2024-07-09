import React from 'react';
import {View} from 'react-native';
import {UserProvider} from './userProvider';
import {UserConsumerIndex} from './RoamingProvider';

export const UserConsumer = props => (
  <UserConsumerIndex>
    {context => {
      return (
        <View>
          {consoleLog('contextData', context)}
          {props.children}
        </View>
      );
    }}
    {/* Another option is:  {context => <Child {...props} context={context}/>}*/}
  </UserConsumerIndex>
);
