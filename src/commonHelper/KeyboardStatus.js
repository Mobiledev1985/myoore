import React, {useState, useRef, useEffect} from 'react';
import {Keyboard} from 'react-native';

/**
 * Returns if the keyboard is open / closed
 *
 * @return {bool} isOpen
 */
export function useKeyboardStatus() {
  const [isOpen, setIsOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const keyboardShowListener = useRef(null);
  const keyboardHideListener = useRef(null);

  useEffect(() => {
    keyboardShowListener.current = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setIsOpen(true);
        setKeyboardHeight(e.endCoordinates.height);
      }
    );
    keyboardHideListener.current = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setIsOpen(false);
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardShowListener.current.remove();
      keyboardHideListener.current.remove();
    };
  });

  return {isOpen, keyboardHeight};
}
