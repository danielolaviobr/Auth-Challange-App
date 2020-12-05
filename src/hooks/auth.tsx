import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
import axios from 'axios';

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

export const AuthProvider: React.FC = ({children}) => {
  const [authData, setAuthData] = useState<AuthData>({} as AuthData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStoredData(): Promise<void> {
      const [name, email, addressId] = await AsyncStorage.multiGet([
        '@Auth:name',
        '@Auth:email',
        '@Auth:addressID',
      ]);

      if (name[1] && email[1] && addressId[1]) {
        setAuthData({
          name: name[1],
          email: email[1],
          addressId: parseInt(addressId[1]),
        });
      }
      setIsLoading(false);
    }
    loadStoredData();
  }, []);

  const signIn = useCallback(async (loginData) => {
    const response = await api.get('api/getCustomer/1?fields=id,name,email');
    const {name, email, addressId} = response.data;

    console.log(response.data);
    console.log(loginData.email, loginData.id);
    console.log(email === loginData.email);
    console.log(addressId === parseInt(loginData.id));
    if (loginData.email !== email || parseInt(loginData.id) !== addressId) {
      throw new Error('Invalid credentials');
    }
    await AsyncStorage.multiSet([
      ['@Auth:name', name],
      ['@Auth:email', email],
      ['@Auth:addressID', addressId.toString()],
    ]);

    setAuthData({name, email, addressId});
  }, []);

  const signOut = useCallback(async () => {
    await AsyncStorage.multiRemove([
      '@Auth:name',
      '@Auth:email',
      '@Auth:addressId',
    ]);
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

  if (!context) {
    throw new Error('useAuth must be used inside a AuthProvider');
  }
  return context;
}
