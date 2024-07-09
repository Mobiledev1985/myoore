import {applyMiddleware, compose, createStore} from 'redux';
import thunk from 'redux-thunk';
import api from '../commonHelper/middleware/api';
import AppReducer from '../reducers';
import {persistStore} from 'redux-persist';
import {createLogger} from 'redux-logger';

export default function createReduxStore() {
  const middlewareList = [thunk, api];
  const enhancer = compose(applyMiddleware(...middlewareList));
  let store = createStore(AppReducer, enhancer);
  return store;
}
