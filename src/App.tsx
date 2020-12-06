import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import {View} from 'react-native';

import AppProvider from './hooks';
import Routes from './routes';

const App: React.FC = () => (
  <NavigationContainer>
    <AppProvider>
      <View style={{backgroundColor: '#F1F5F9', flex: 1}}>
        <Routes />
      </View>
    </AppProvider>
  </NavigationContainer>
);

export default App;
