import React from 'react';
import {View, ActivityIndicator} from 'react-native';

import {useAuth} from '../hooks/auth';
import AppRoutes from './app.routes';
import AuthRoutes from './auth.routes';

const Routes: React.FC = () => {
  const {isLoading, user} = useAuth();
  if (isLoading) {
    return (
      <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <ActivityIndicator size="large" color="#0063C6" />
      </View>
    );
  }
  return user.email && user.addressId ? <AppRoutes /> : <AuthRoutes />;
};

export default Routes;
