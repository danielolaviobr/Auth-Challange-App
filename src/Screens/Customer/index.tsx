import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';

import Button from '../../components/Button';
import {useAuth} from '../../hooks/auth';
import {Container, Title, TextBody} from './styles';

const Customer: React.FC = () => {
  const {signOut, user} = useAuth();
  const navigation = useNavigation();

  const handleGoToForm = useCallback(() => {
    navigation.navigate('Form');
  }, []);

  const handleGoToMaps = useCallback(() => {
    navigation.navigate('Maps');
  }, [navigation]);

  const handleSignOut = useCallback(async () => {
    await signOut();
  }, []);

  return (
    <Container>
      <Title>Home Screen</Title>
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
