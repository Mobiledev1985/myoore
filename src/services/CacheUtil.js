import React, {useEffect, useState} from 'react';
import {useQuery} from 'react-query';
import {consoleLog} from '../commonHelper/utils';
export const GetCacheKey = uniqueid => {
  let selectedLang = global.userlanguage;
  if (
    selectedLang == null ||
    selectedLang === undefined ||
    selectedLang === ''
  ) {
    selectedLang = 'en';
  }
  let uniquetstamp = global.UniqueToken;
  let _ukey = uniqueid + '_' + selectedLang + '_' + uniquetstamp;
  if (
    global.setchildmsisdn != null &&
    global.setchildmsisdn != undefined &&
    global.setchildmsisdn.length > 5
  ) {
    _ukey += '_' + global.setchildmsisdn;
  }
  return _ukey;
};

export const GetCacheKeyProfile = uniqueid => {
  let selectedLang = global.userlanguage;
  if (
    selectedLang == null ||
    selectedLang === undefined ||
    selectedLang === ''
  ) {
    selectedLang = 'en';
  }
  let uniquetstamp = global.UniqueToken;
  let _ukey =
    uniqueid +
    '_' +
    selectedLang +
    '_' +
    uniquetstamp +
    '_' +
    global.UniqueTokenProfile;
  if (
    global.setchildmsisdn != null &&
    global.setchildmsisdn != undefined &&
    global.setchildmsisdn.length > 5
  ) {
    _ukey += '_' + global.setchildmsisdn;
  }
  return _ukey;
};
