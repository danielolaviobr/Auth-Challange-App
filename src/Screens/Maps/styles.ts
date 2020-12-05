import styled from 'styled-components/native';
import MapView, {Coordinate, PROVIDER_GOOGLE, Region} from 'react-native-maps';

export const MapViewStyled = styled(MapView)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  position: relative;
`;
