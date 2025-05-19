import React, { useState } from 'react';
import { View, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


export default function UploadScreen({ userId, onLogout }) {
  const [image, setImage] = useState(null);

  // Function to remove the stored user ID
  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userId');
    Alert.alert('Logged Out', 'You have been logged out.', [
      { text: 'OK', onPress: onLogout }, // after pressing OK, go to RegisterScreen
    ]);
    onLogout(); // update parent state to null
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ base64: true });
    if (!result.canceled) setImage(result.assets[0]);
  };

  const takePhoto = async () => {
    // Ask for camera permission
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Camera permission is required!');
      return;
    }
  }

  const uploadImage = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('photo', {
      uri: image.uri,
      name: 'photo.jpg',
      type: 'image/jpeg',
    });

    try {
      const res = await fetch('http://172.17.170.142:3000/upload', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const data = await res.json();
      Alert.alert('Upload Success', JSON.stringify(data));
    } catch (err) {
      Alert.alert('Upload Failed', err.message);
    }
  };

  return (
    <View style={{ padding: 100 }}>
      <Button title="Pick from Gallery" onPress={pickImage} />
      <Button title="Take Photo" onPress={takePhoto} />
      <Button title="Logout" onPress={handleLogout} />
      {image && (
        <>
          <Image source={{ uri: image.uri }} style={{ width: 200, height: 200, marginVertical: 10 }} />
          <Button title="Upload" onPress={uploadImage} />
        </>
      )}
    </View>
  );
}
