import React, {useCallback, useRef} from 'react';
import {Alert, KeyboardAvoidingView, TextInput} from 'react-native';
import {Form} from '@unform/mobile';
import {ScrollView} from 'react-native-gesture-handler';
import * as Yup from 'yup';

import Input from '../../components/Input';
import Button from '../../components/Button';
import {Container, Title} from './styles';
import {FormHandles} from '@unform/core';
import {useAuth} from '../../hooks/auth';

interface LoginFormDataProps {
  email: string;
  id: number;
}

// Login screen uses the unform libary to handle the form data
// It uses Yup to validate the form fields
// It uses the useAuth hook to submit the login data
const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const idInputRef = useRef<TextInput>(null);
  const {signIn} = useAuth();

  // useCallback is used to make the method loading more efficient
  const handleSubmit = useCallback(async (loginData: LoginFormDataProps) => {
    try {
      // Creates a validation screma to validate the fields and set proper error messaging
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail is required')
          .email('Please enter a valid e-mail'),
        id: Yup.string().required('ID is required'),
      });

      // Validates the data with the previously create schema
      // If invalid an error is thrown
      await schema.validate(loginData);

      // If the data is valid the signIn method is called to validate the provided data with the API data
      await signIn(loginData);
    } catch (err) {
      // If the error is of type Yup.ValidationError, it uses the error message the was set up in the schema
      if (err instanceof Yup.ValidationError) {
        Alert.alert('Authentication failed', err.message);
        return;
      }

      // The only other possible error oring is the signIn method. Meaning that the credentials are invalid
      // A proper message is displayed in an alert to the user
      Alert.alert('Invalid credentials', 'Please check your e-mail and/or id.');
      console.log(err);
    }
  }, []);

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{flex: 1}}>
      <Container>
        <Title>Login Screen</Title>
        <Form ref={formRef} onSubmit={handleSubmit} style={{width: '100%'}}>
          <Input
            name="email"
            icon="mail"
            autoCorrect={false}
            placeholder="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            returnKeyType="next"
            onSubmitEditing={() => idInputRef.current?.focus()}
          />
          <Input
            name="id"
            icon="lock"
            placeholder="ID"
            autoCorrect={false}
            returnKeyType="send"
            ref={idInputRef}
            onSubmitEditing={() => formRef.current?.submitForm()}
            secureTextEntry
          />
          <Button onPress={() => formRef.current?.submitForm()}>Login</Button>
        </Form>
      </Container>
    </ScrollView>
  );
};

export default Login;
