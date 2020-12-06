import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import Button from '../../components/Button';
import {useAuth} from '../../hooks/auth';
import {Container, Title, TextBody} from './styles';

const Customer: React.FC = () => {
  // Retrieves the signOut method and user property from the useAuth hook
  const {signOut, user} = useAuth();
  const navigation = useNavigation();

  // Navigates to the Form screen
  const handleGoToForm = useCallback(() => {
    navigation.navigate('Form');
  }, []);

  // Navigate to the Maps screen
  const handleGoToMaps = useCallback(() => {
    navigation.navigate('Maps');
  }, [navigation]);

  // Calls the signOut method
  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <Container>
      <Title>Home Screen</Title>
      {/* Displays the user info in the screen */}
      <TextBody>{user.name}</TextBody>
      <TextBody>{user.email}</TextBody>
      <TextBody>{user.addressId}</TextBody>
      <Button onPress={handleGoToForm}>Form</Button>
      <Button onPress={handleGoToMaps}>Maps</Button>
      <Button onPress={handleSignOut}>Logout</Button>
    </Container>
  );
};

export default Customer;
