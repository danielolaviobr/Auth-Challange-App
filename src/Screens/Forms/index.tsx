import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Alert, Image, Platform} from 'react-native';
import {FormHandles} from '@unform/core';
import {Form} from '@unform/mobile';
import ImagePicker from 'react-native-image-picker';
import * as Yup from 'yup';
import NetInfo from '@react-native-community/netinfo';

import Button from '../../components/Button';
import Input from '../../components/Input';
import {Title} from '../Customer/styles';
import {Container} from './styles';

interface FormData {
  name: string;
}

const Forms: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const [imageURI, setImageURI] = useState('');

  const options = {
    title: 'Select image',
    storageOptions: {
      skipBackup: true,
      path: 'images',
    },
  };

  const handleSubmit = useCallback(
    async (formData: FormData) => {
      const formDataWithImage = {name: formData.name, image: imageURI};
      try {
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          image: Yup.string().required('Image is required'),
        });

        await schema.validate(formDataWithImage);

        const subscribeToNetWork = NetInfo.addEventListener((state) => {
          if (state.type === 'wifi') {
            Alert.alert(
              'Form submitted',
              'Your form has been submitted successfully',
            );
            setImageURI('');
            formRef.current?.clearField('name');
            // ! submit form
            return;
          } else {
            Alert.alert(
              'No wifi',
              'Your form has been saved and will be submitted when wifi is available',
            );
          }
        });
        subscribeToNetWork();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          Alert.alert('Invalid form', err.message);
          return;
        }
        Alert.alert('Unexpected error', 'An error ocurred');
        console.log(err);
      }
    },
    [imageURI],
  );

  const handleImagePicker = useCallback(() => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        if (Platform.OS === 'android') {
          const URI = response.uri;
          setImageURI(URI);
        } else {
          const URI = response.uri.split('file://')[1];
          setImageURI(URI);
        }
      }
    });
  }, []);

  return (
    <Container>
      <Title>Form</Title>
      {!!imageURI && (
        <Image
          source={{uri: imageURI}}
          style={{width: 150, height: 150, borderRadius: 5, margin: 16}}
        />
      )}
      <Form ref={formRef} onSubmit={handleSubmit} style={{width: '100%'}}>
        <Input
          name="name"
          icon="user"
          placeholder="Name"
          autoCorrect={false}
          returnKeyType="send"
          onSubmitEditing={() => formRef.current?.submitForm()}
        />
        <Button onPress={handleImagePicker}>Insert image</Button>
        <Button onPress={() => formRef.current?.submitForm()}>Submit</Button>
      </Form>
    </Container>
  );
};

export default Forms;
