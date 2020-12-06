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

  // Fetches the user location to center the map around it initialy
  // useCallback is used to make the method loading more efficient
  const userLocation = useCallback(() => {
    Geolocation.getCurrentPosition(
      (position) => {
        // If the data is fetch correctly, the position is deconstructed and saved to location state
        const {latitude, longitude} = position.coords;
        // The latitudeDelta and longitudeDelta are the zoom parameters of the map, they are initialized as 1
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
    // When the app starts and the OS is android, request the fine location permission, to use in the map, to show the user location
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
    }

    userLocation();
  }, []);

  // Validates that the location data object exists and had valid data
  // While it is not available it displays a loading indicator
  if (
    (!location.latitude &&
      !location.longitude &&
      !location.latitudeDelta &&
      !location.longitudeDelta) ||
    !location
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
