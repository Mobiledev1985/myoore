import AsyncStorage from '@react-native-community/async-storage';
import {combineReducers} from 'redux';
import {persistReducer} from 'redux-persist';

import {tokenReducer} from './token';
import {customProfileReducer} from './custprofile';
import {userData} from './user';
import {
  sendOtpReducer,
  validateOtpReducer,
  createAccountReducer,
} from './signup';
import {
  socialLoginReducer,
  uservalReducer,
  userlogindetailReducer,
} from './login';
import {homeNotification} from './homenotification';
import {homeAccordion, accordionTemplate} from './homeaccordion';
import {walkthroughGlobalSettings} from './walkthrough';
import {forgotpwdReducer} from './forgotpwd';
import {customerProfileReducer, userdetailsReducer} from './home';
import {homeLayout} from './masterlayout';
import {tabContent, tabContentDetail} from './templatecontent';
import {cacheReducer} from './cacheReducer';

export const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['userData', 'userlogindetailReducer'],
};

const BaseReducer = combineReducers({
  tokenReducer,
  userData,
  sendOtpReducer,
  validateOtpReducer,
  createAccountReducer,
  walkthroughGlobalSettings,
  socialLoginReducer,
  uservalReducer,
  forgotpwdReducer,
  customerProfileReducer,
  userdetailsReducer,
  homeNotification,
  homeAccordion,
  accordionTemplate,
  homeLayout,
  tabContent,
  tabContentDetail,
  customProfileReducer,
  userlogindetailReducer,
  cacheReducer,
});

const AppReducer = (state, action) => {
  return BaseReducer(state, action);
};

export default persistReducer(persistConfig, AppReducer);
