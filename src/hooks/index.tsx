import React from 'react';

import {AuthProvider} from './auth';

// Centralizes all the hooks imports in one single file
const AppProvider: React.FC = ({children}) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default AppProvider;
