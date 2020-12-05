import {Platform} from 'react-native';
import styled, {css} from 'styled-components/native';
import FeatherIcon from 'react-native-vector-icons/Feather';

interface InputContainerProps {
  isFocused: boolean;
}

export const Container = styled.View<InputContainerProps>`
  background-color: #fff;
  width: 100%;
  height: 60px;
  padding: 0 16px;
  border-radius: 5px;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
  border-width: 2px;
  border-color: #fff;
  ${(props) =>
    props.isFocused &&
    css`
      border-color: #0063c6;
    `};
`;

export const InputField = styled.TextInput`
  flex: 1;
  color: #333333;
  font-family: 'Inter-Medium';

  ${Platform.OS === 'android' &&
  css`
    font-family: 'Inter-Medium-slnt=0';
  `}
  font-size: 16px;
`;

export const Icon = styled(FeatherIcon)`
  margin-right: 16px;
`;
