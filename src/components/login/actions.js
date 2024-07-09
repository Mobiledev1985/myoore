// api call to middleware goes here
import {CALL_POST_API} from '../../commonHelper/middleware/api';

export const validateOTP = ({key, params}) => (dispatch, getState) => {
  return new Promise(function (onSuccess, onError) {
    dispatch({
      [CALL_POST_API]: {
        types: [
          'REQUEST_VALIDATE_OTP_API',
          'VALIDATE_OTP_SUCCESS',
          'VALIDATE_OTP_FAILURE',
        ],
        endpoint: 'sso/rnvalidateotp',
        key: key,
        params: params,
      },
    })
      .then(respone => {
        onSuccess(respone.payload.data);
      })
      .catch(err => {
        onError(err);
      });
  });
};

export const sendOTP = ({key, params}) => (dispatch, getState) => {
  return new Promise(function (onSuccess, onError) {
    dispatch({
      [CALL_POST_API]: {
        types: ['REQUEST_SEND_OTP_API', 'SEND_OTP_SUCCESS', 'SEND_OTP_FAILURE'],
        endpoint: 'sso/rnsendotp',
        key: key,
        params: params,
      },
    })
      .then(respone => {
        onSuccess(respone.payload.data);
      })
      .catch(err => {
        onError(err);
      });
  });
};

export const socialLogin = ({key, params}) => (dispatch, getState) => {
  return new Promise(function (onSuccess, onError) {
    dispatch({
      [CALL_POST_API]: {
        types: [
          'REQUEST_SOCIAL_LOGIN_API',
          'SOCIAL_LOGIN_SUCCESS',
          'SOCIAL_LOGIN_FAILURE',
        ],
        endpoint: 'sso/rnlogin',
        key: key,
        params: params,
      },
    })
      .then(respone => {
        onSuccess(respone.payload.data);
      })
      .catch(err => {
        onError(err);
      });
  });
};

export const userValidate = ({key, params}) => (dispatch, getState) => {
  return new Promise(function (onSuccess, onError) {
    dispatch({
      [CALL_POST_API]: {
        types: ['REQUEST_VAL_USER_API', 'VAL_USER_SUCCESS', 'VAL_USER_FAILURE'],
        endpoint: 'sso/rnisregistered',
        key: key,
        params: params,
      },
    })
      .then(respone => {
        onSuccess(respone.payload.data);
      })
      .catch(err => {
        onError(err);
      });
  });
};

export const updateToken = ({tokenId}) => dispatch => {
  dispatch({type: 'TOKEN_UPDATE', payload: {tokenId}});
};
