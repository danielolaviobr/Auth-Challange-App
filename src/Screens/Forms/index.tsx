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

// The forms screen uses the unform libary, just like the login screen, to handle the form data and validate it
// It uses Yup to validate the form fields
// It uses react native image picker to handle the image retrieving from camera and galery
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
      // Creates an object with the formdata (name) and the image uri from the image picker
      const formDataWithImage = {name: formData.name, image: imageURI};
      try {
        // Creates a schema to validate the formDataWithImage object and sets the error messages
        const schema = Yup.object().shape({
          name: Yup.string().required('Name is required'),
          image: Yup.string().required('Image is required'),
        });

        // Validates the data based on the schema
        await schema.validate(formDataWithImage);

        // Creates a subscrition to the network status, to check if wifi is available
        const subscribeToNetWork = NetInfo.addEventListener((state) => {
          // If wifi is available the form is submited and an alert is displayed informing the sucess
          if (state.type === 'wifi') {
            Alert.alert(
              'Form submitted',
              'Your form has been submitted successfully',
            );
            // Here would be the API call to submit the form to an external server
            // The form is cleared for new submition
            setImageURI('');
            formRef.current?.clearField('name');
            return;
          } else {
            // If not available the an alert is displayed
            Alert.alert(
              'No wifi',
              'Your form has been saved and will be submitted when wifi is available',
            );
          }
        });
        subscribeToNetWork();
      } catch (err) {
        // If the error is of type Yup.ValidationError, it uses the error message the was set up in the schema
        if (err instanceof Yup.ValidationError) {
          Alert.alert('Invalid form', err.message);
          return;
        }
        // If the error comes from unkown source and alert is displayed
        Alert.alert('Unexpected error', 'An error ocurred');
        console.log(err);
      }
    },
    [imageURI],
  );

  // Handles the opening of the image picker component
  const handleImagePicker = useCallback(() => {
    ImagePicker.showImagePicker(options, (response) => {
      // Dynamic behaviour with user interaction
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        // Sets the imageURI state according to the OS and its file location system
        if (Platform.OS === 'android') {
          const URI = response.uri;
          setImageURI(URI);
        } else {
          // Removes the 'file://' string from the start of the uri string
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
