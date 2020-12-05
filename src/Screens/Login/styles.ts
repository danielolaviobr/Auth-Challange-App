import styled, {css} from 'styled-components/native';
import {Platform} from 'react-native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 0 30px ${Platform.OS === 'android' ? 150 : 40}px;
`;

export const Title = styled.Text`
  font-family: 'Inter-Bold';

  ${Platform.OS === 'android' &&
  css`
    font-family: 'Inter-Bold-slnt=0';
  `}
  font-size: 48px;
  color: #000;
  margin-bottom: 24px;
`;
