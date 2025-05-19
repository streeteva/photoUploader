import React, { useState } from 'react';
import { TouchableOpacity, Button, Image, View, Text, ScrollView, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons'; // or FontAwesome, MaterialIcons, etc.


export default function UploadScreen({ userId, onLogout }) {
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);

  const IconButton = ({ title, icon, onPress, color = '#d3d69c' }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={40} color="#fff" style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  
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
        setImages((prevImages) => [...prevImages, result.assets[0]]);
      }
    } finally {
      setIsTakingPhoto(false);
    }
  };

  const pickImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImages(result.assets);
      setMessage(`${result.assets.length} image(s) selected`);
    }
  };

  const clearImages = () => {
    setImages([]);
    setMessage('Photos cleared.');
  };

  const uploadImages = async () => {
    if (images.length === 0) return;

    const formData = new FormData();
    formData.append('userId', userId); // Attach userId

    images.forEach((img, index) => {
      const fileType = img.uri.split('.').pop(); // Get file extension
      formData.append('photos[]', {
        uri: img.uri,
        name: `photo_${index + 1}.${fileType}`, // Dynamically set the file name
        type: `image/${fileType}`,
      });
    });

      try {
        const res = await fetch('https://7dc9-202-12-94-240.ngrok-free.app/uploads', {
          method: 'POST',
          body: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        const data = await res.json();
        console.log('Upload response:', data);
    
      } catch (err) {
        console.error('Upload failed:', err.message);
        setMessage(`Upload failed for one or more images`);
      }
    

    setMessage(`Uploaded ${images.length} image(s)`);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userId');
    setMessage('Logged out');
    onLogout();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}></Text>
      <View style={styles.buttonGroup}>
        <IconButton title="Pick Images" icon="images" onPress={pickImages} />
        <IconButton title="Take Photo" icon="camera" onPress={takePhoto} />
        <IconButton title="Logout" icon="log-out-outline" onPress={handleLogout}/>
    </View>

      {images.length > 0 && (
        <>
          <ScrollView horizontal style={{ marginVertical: 10 }}>
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
            ))}
          </ScrollView>
          <Button title="Upload" onPress={uploadImages} />
          <Button title="Clear Photos" onPress={clearImages}/>
        </>
      )}
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginTop: 20,
    color: '#333',
  },
  buttonGroup: {
    alignItems: 'center',
    marginVertical: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    width: 250,
    justifyContent: 'center',
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});