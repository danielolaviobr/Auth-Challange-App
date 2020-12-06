import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';

interface AuthData {
  name: string;
  email: string;
  addressId: number;
}

interface SignInCredentials {
  email: string;
  id: number;
}

interface AuthContextData {
  user: AuthData;
  isLoading: boolean;
  signIn(creadentials: SignInCredentials): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// useAuth hook to store and retrieve user data from local storage
// Saving the authentication data in the local storage eneables the app to stay logged in after the app is exited

export const AuthProvider: React.FC = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>({} as AuthData);
  // The loading indicator initialzies as true
  const [isLoading, setIsLoading] = useState(true);

  // When the app loads the loadStoredData is called to check if there is user data saved on local storage
  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [name, email, addressId] = await AsyncStorage.multiGet([
        '@Auth:name',
        '@Auth:email',
        '@Auth:addressID',
      ]);

      // If the user data is stored, this data is saved to the hook state, to be provided to the app
      if (name[1] && email[1] && addressId[1]) {
        setAuthData({
          name: name[1],
          email: email[1],
          addressId: parseInt(addressId[1]),
        });
      }
      // The loading indicator is disabled
      setIsLoading(false);
    }
    loadStoredData();
  }, []);

  // Sign in method that recieves the user email and id authenticate the user
  // useCallback is used to make the method loading more efficient
  const signIn = useCallback(async (loginData) => {
    // Fetches the data from the API
    const response = await api.get('api/getCustomer/1?fields=id,name,email');
    // Desconstructs the recieved data
    const {name, email, addressId} = response.data;

    // If the API data does not match the provided data an error is thrown
    if (loginData.email !== email || parseInt(loginData.id) !== addressId) {
      throw new Error('Invalid credentials');
    }
    // If the data matches, the data is stored in local storage
    await AsyncStorage.multiSet([
      ['@Auth:name', name],
      ['@Auth:email', email],
      ['@Auth:addressID', addressId.toString()],
    ]);

    // Then the data is saved in the hook state
    // This causes the app to change the provided route component to the authenticated user routes (app.routes.tsx)
    setAuthData({name, email, addressId});
  }, []);

  // Sign out method is used to delete the authentication data from the local storage
  // useCallback is used to make the method loading more efficient
  const signOut = useCallback(async () => {
    // Deletes the stored user data
    await AsyncStorage.multiRemove([
      '@Auth:name',
      '@Auth:email',
      '@Auth:addressId',
    ]);

    // Clear the authentication data state
    // This causes the app to change the provided route component to the non authenticated user routes (auth.routes.tsx)
    setAuthData({} as AuthData);
  }, []);

  return (
    <AuthContext.Provider value={{user: authData, signIn, signOut, isLoading}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  // Validates if the app is wrapped in the proper hook provider
  if (!context) {
    throw new Error('useAuth must be used inside a AuthProvider');
  }
  return context;
}
