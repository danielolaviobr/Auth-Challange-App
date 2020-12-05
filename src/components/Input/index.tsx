import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {TextInputProps} from 'react-native';
import {useField} from '@unform/core';

import {Container, InputField, Icon} from './styles';

interface InputProps extends TextInputProps {
  name: string;
  icon: string;
}

interface InputValueReference {
  value: string;
}

interface InputRef {
  focus(): void;
}

const Input: React.ForwardRefRenderFunction<InputRef, InputProps> = (
  {name, icon, ...rest},
  ref,
) => {
  const inputRef = useRef<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isFilled, setIsFilled] = useState(false);
  const {fieldName, defaultValue, registerField, error} = useField(name);
  const inputValueRef = useRef<InputValueReference>({value: defaultValue});

  useEffect(() => {
    inputRef.current.value = defaultValue;
  }, [defaultValue]);

  useImperativeHandle(ref, () => ({
    focus() {
      inputRef.current.focus();
    },
  }));

  const handleFocus = useCallback(() => {
    setIsFocused(true);
  }, []);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    setIsFilled(!!inputValueRef.current.value);
  }, []);

  useEffect(() => {
    registerField<string>({
      name: fieldName,
      path: 'value',
      ref: inputValueRef.current,
      clearValue() {
        inputValueRef.current.value = '';
        inputRef.current.clear();
      },
      setValue(ref, value) {
        inputRef.current.setNativeProps({text: value});
        inputValueRef.current.value = value;
      },
    });
  }, [fieldName, registerField]);

  return (
    <Container isFocused={isFocused}>
      <Icon
        name={icon}
        size={20}
        color={isFocused || isFilled ? '#0063c6' : '#333333'}
      />
      <InputField
        ref={inputRef}
        keyboardAppearance="dark"
        defaultValue={defaultValue}
        onChangeText={(value) => {
          inputValueRef.current.value = value;
        }}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...rest}
      />
    </Container>
  );
};
export default forwardRef(Input);
