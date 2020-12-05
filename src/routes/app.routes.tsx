import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Customer from '../Screens/Customer';
import Forms from '../Screens/Forms';
import Maps from '../Screens/Maps';

const App = createStackNavigator();

const AppRoutes: React.FC = () => (
  <App.Navigator
    screenOptions={{
      headerShown: false,
      cardStyle: {backgroundColor: '#F1F5F9'},
    }}>
    <App.Screen name="Customer" component={Customer} />
    <App.Screen name="Form" component={Forms} />
    <App.Screen name="Maps" component={Maps} />
  </App.Navigator>
);

export default AppRoutes;
