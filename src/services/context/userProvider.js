import React, {createContext, useState} from 'react';
import {roamingHome, UserProviderIndex} from './RoamingProvider';

const UserProvider = ({children}) => {
  const [roamingData, setRoamingData] = useState([]);
  const [roamingDealData, setRoamingDealData] = useState([]);

  const [raomingOfferData, setRaomingOfferData] = useState([]);
  const [searchedData, setSearchedData] = useState([]);

  const data = {
    roamingData,
    setRoamingData,
    raomingOfferData,
    setRaomingOfferData,
    searchedData,
    setSearchedData,
    roamingDealData,
    setRoamingDealData,
  };
  return <UserProviderIndex value={data}>{children}</UserProviderIndex>;
};
export {UserProvider};
