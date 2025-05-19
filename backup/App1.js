import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';
import RegisterScreen from './screens/RegisterScreen';
import UploadScreen from './screens/UploadScreen';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [photo, setPhoto] = useState(null);

  const handleRegister = (id) => {
    setUserId(id);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0]);
    }
  };

  const removeUserId = async () => {
  await SecureStore.deleteItemAsync('userId');
  console.log('User ID removed');
};
	
  const uploadImage = async () => {
    if (!photo || !userId) return;

    const formData = new FormData();
    formData.append('photo', {
      uri: photo.uri,
      name: 'upload.jpg',
      type: 'image/jpeg',
    });
    formData.append('userId', userId);

    try {
      await axios.post('https://yourserver.com/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Upload successful');
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    }
  };

  if (!userId) {
    return <RegisterScreen onRegister={handleRegister} />;
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {userId}!</Text>
      <Button title="Pick Photo" onPress={pickImage} />
      {photo && (
        <>
          <Image source={{ uri: photo.uri }} style={styles.image} />
          <Button title="Upload" onPress={uploadImage} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: 200, height: 200, marginVertical: 10 },
});
