import Config from 'react-native-config';
import {consoleLog} from './utils';
import {Platform} from 'react-native';

/**
 * It's use to encrypted value by RC4 Encryption
 * @param text
 */
export const RC4Encrypt = text => {
  let Password = '';
  Password = '';
  var N = 256;
  var cipher = '';
  a;
  var sbox;
  try {
    sbox = [];
    let key = [];
    let n11 = Password.length;
    for (let a = 0; a < N; a++) {
      let ac = Password[a % n11];
      key[a] = ac.charCodeAt(0);
      sbox[a] = a;
    }
    let b = 0;
    for (let a = 0; a < N; a++) {
      b = (b + sbox[a] + key[a]) % N;
      let tempSwap = sbox[a];
      sbox[a] = sbox[b];
      sbox[b] = tempSwap;
    }

    var cipher = '';
    var i = 0,
      j = 0,
      k = 0;
    for (var a = 0; a < text.length; a++) {
      i = (i + 1) % N;
      j = (j + sbox[i]) % N;
      var tempSwap = sbox[i];
      sbox[i] = sbox[j];
      sbox[j] = tempSwap;

      k = sbox[(sbox[i] + sbox[j]) % N];

      var cipherBy = text[a].charCodeAt(0) ^ k;

      var _tmp1 = String.fromCharCode(cipherBy);
      cipher += _tmp1 + '';
    }

    var enctxt = '';
    for (var i = 0; i < cipher.length; i++) {
      var v = cipher[i].charCodeAt(0);
      var _cc = v.toString(16);
      if (_cc.length == 1) _cc = '0' + _cc;
      enctxt += _cc;
    }
    return enctxt;
  } catch (e) {}
  return '';
};

/**
 * It's use to decrypted value by RC4 decryption
 * @param text
 */
export const RC4Decrypt = text => {
  var hex = text.toString();
  var str = '';
  for (var n = 0; n < hex.length; n += 2) {
    str += String.fromCharCode(parseInt(hex.substr(n, 2), 16));
  }
  text = str;
  let Password = '';
  Password = '';
  var N = 256;
  var cipher = '';
  a;
  var sbox;
  try {
    sbox = [];
    let key = [];
    let n11 = Password.length;
    for (let a = 0; a < N; a++) {
      let ac = Password[a % n11];
      key[a] = ac.charCodeAt(0);
      sbox[a] = a;
    }
    let b = 0;
    for (let a = 0; a < N; a++) {
      b = (b + sbox[a] + key[a]) % N;
      let tempSwap = sbox[a];
      sbox[a] = sbox[b];
      sbox[b] = tempSwap;
    }

    var cipher = '';
    var i = 0,
      j = 0,
      k = 0;
    for (var a = 0; a < text.length; a++) {
      i = (i + 1) % N;
      j = (j + sbox[i]) % N;
      var tempSwap = sbox[i];
      sbox[i] = sbox[j];
      sbox[j] = tempSwap;

      k = sbox[(sbox[i] + sbox[j]) % N];

      var cipherBy = text[a].charCodeAt(0) ^ k;

      var _tmp1 = String.fromCharCode(cipherBy);
      cipher += _tmp1 + '';
    }
    return cipher;
  } catch (e) {}
  return '';
};
