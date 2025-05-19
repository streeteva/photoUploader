import React, { useState } from 'react';
import { Button, Image, View, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';

export default function UploadScreen({ userId, onLogout }) {
  const [image, setImage] = useState(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userId');
    Alert.alert('Logged Out', 'You have been logged out.', [
      { text: 'OK', onPress: onLogout },
    ]);
    onLogout();
  };

  const takePhoto = async () => {
    if (isTakingPhoto) return;
    setIsTakingPhoto(true);

    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is needed.');
        return;
      }

      const result = await ImagePicker.launchCameraAsync({ 
        quality: 1,
        allowsEditing: false,
        aspect: [4, 3],
      });
      
      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage({
          uri: result.assets[0].uri,
          // Add these properties to match the gallery picker structure
          width: result.assets[0].width,
          height: result.assets[0].height,
        });
      }
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ 
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const uploadImage = async () => {
    if (!image || !image.uri) return;

    const formData = new FormData();
    formData.append('userId', userId);
    
    // Extract file extension from URI
    let fileExtension = image.uri.split('.').pop();
    fileExtension = fileExtension.toLowerCase();
    const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;

    formData.append('photo', {
      uri: image.uri,
      name: `photo.${fileExtension}`,
      type: mimeType,
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