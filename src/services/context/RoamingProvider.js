import React, {createContext, useState} from 'react';
const roamingHome = createContext();

const UserProviderIndex = roamingHome.Provider;
const UserConsumerIndex = roamingHome.Consumer;

export {roamingHome, UserProviderIndex, UserConsumerIndex};
