import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import {useAuth} from '../hooks/auth';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

const Routes: React.FC = () => {
  const {isLoading, user} = useAuth();
  // Await for the useAuth hook to load the user information
  // While that displays a loading indicator
  if (isLoading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="#0063C6" />
      </View>
    );
  }
  // Routes are separeted between authenticated users and not authenticated users.
  // The authentication data comes from the useAuth hook

  // Having different routing components for authenticated and not authenticated users makes it possible to block
  // unauthorized screens to be displayed
  return user.email && user.addressId ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
