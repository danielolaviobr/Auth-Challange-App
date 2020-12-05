import React, {useCallback, useEffect, useState} from 'react';
import {
  Alert,
  Platform,
  View,
  PermissionsAndroid,
  Text,
  ActivityIndicator,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {Container, MapViewStyled} from './styles';
import {Region} from 'react-native-maps';

const Maps: React.FC = () => {
  const [location, setLocation] = useState<Region>({} as Region);

  const handleRegionChange = useCallback((region: Region) => {
    console.log(region);
    setLocation({...region});
  }, []);

  const userLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        const {latitude, longitude} = position.coords;
        console.log(latitude, longitude);
        setLocation({
          latitude,
          longitude,
          latitudeDelta: 1,
          longitudeDelta: 1,
        });
      },
      (err) => {
        console.log(err);
      },
    );
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    userLocation();
  }, []);

  if (
    !location.latitude &&
    !location.longitude &&
    !location.latitudeDelta &&
    !location.longitudeDelta
  ) {
    return (
      <Container>
        <ActivityIndicator size="large" color="#0063C6" />
      </Container>
    );
  }

  return (
    <Container>
      <MapViewStyled
        loadingEnabled={true}
        showsUserLocation={true}
        initialRegion={location}></MapViewStyled>
    </Container>
  );
};

export default Maps;
