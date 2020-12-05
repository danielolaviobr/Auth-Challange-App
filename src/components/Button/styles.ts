import styled, {css} from 'styled-components/native';
import {RectButton} from 'react-native-gesture-handler';
import {Platform} from 'react-native';

export const Container = styled(RectButton)`
  width: 100%;
  height: 60px;
  background-color: #0063c6;
  border-radius: 5px;

  align-items: center;
  justify-content: center;

  margin: 8px 0;
`;

export const ButtonText = styled.Text`
  color: #fff;
  font-size: 22px;
  font-family: 'Inter-Bold';

  ${Platform.OS === 'android' &&
  css`
    font-family: 'Inter-Bold-slnt=0';
  `}
`;
