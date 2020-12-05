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

const Login: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const idInputRef = useRef<TextInput>(null);
  const {signIn} = useAuth();

  const handleSubmit = useCallback(async (loginData: LoginFormDataProps) => {
    try {
      const schema = Yup.object().shape({
        email: Yup.string()
          .required('E-mail is required')
          .email('Please enter a valid e-mail'),
        id: Yup.string().required('ID is required'),
      });

      await schema.validate(loginData);
      await signIn(loginData);
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        Alert.alert('Authentication failed', err.message);
        return;
      }
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
