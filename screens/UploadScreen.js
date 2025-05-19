import React, { useState,useEffect } from 'react';
import { TouchableOpacity, Button, Image, View, Text, ScrollView, StyleSheet, Alert,ActivityIndicator, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons'; // or FontAwesome, MaterialIcons, etc.
import Checkbox from 'expo-checkbox';

export default function UploadScreen({ userId,token, onLogout }) {

  useEffect(() => {
    if (!token) {
      Alert.alert('Error', 'You must log in first');
      return;
    }
  }, [token]);

  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  // Add checked checkbox labels infected or noninfected infrared or non infrared
  const [row1Selection, setRow1Selection] = useState(null); // 'infected' or 'noninfected'
  const [row2Selection, setRow2Selection] = useState(null); // 'infrared' or 'noninfrared'
  const [uploading, setUploading] = useState(false);

  

  const IconButton = ({ title, icon, onPress, color = '#d3d69c' }) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={40} color="#fff" style={styles.icon} />
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
  
  const UploadButton = ({ title, icon, onPress, color = '#d3d69c' }) => (
    <TouchableOpacity style={[styles.button1, { backgroundColor: color }]} onPress={onPress}>
      <Ionicons name={icon} size={10} color="#fff" style={styles.icon} />
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
    if (!row1Selection || !row2Selection) {
      Alert.alert('Selection Required', 'Please select one option from each row before uploading.');
    return;
    }
    setUploading(true);
    if (images.length === 0) return;

    const formData = new FormData();
    formData.append('userId', userId); // Attach userId
    
    formData.append('row1Selection', row1Selection);// Attach checkbox selection
    formData.append('row2Selection', row2Selection);

    images.forEach((img, index) => {
      const fileType = img.uri.split('.').pop(); // Get file extension
      formData.append('photos[]', {
        uri: img.uri,
        name: `photo_${index + 1}.${fileType}`, // Dynamically set the file name
        type: `image/${fileType}`,
      });
    });

      try {
        const res = await fetch('https://8b1c-202-12-94-240.ngrok-free.app/uploads', {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          
        });

        const data = await res.json();
        console.log('Upload response:', data);
      } catch (err) {
        console.error('Upload failed:', err.message);
        Alert.alert('Error', err.message || 'Upload failed.');
      }finally {
      setUploading(false);
    }
    
    Alert.alert(`Uploaded ${images.length} image(s)`)
    setMessage(`Uploaded ${images.length} image(s)`);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('keystore');
    Alert.alert('Logged out')
    setMessage('Logged out');
    onLogout();
  };

  return (
    <View style={styles.container}>
       <Text style={styles.welcomeText}>Welcome, {userId}!</Text>
      <View style={styles.buttonGroup}>
        <IconButton title="Pick Images" icon="images" onPress={pickImages} />
        <IconButton title="Take Photo" icon="camera" onPress={takePhoto} />
        <IconButton title="Logout" icon="log-out-outline" onPress={handleLogout}/>
    </View>

      {images.length > 0 && (
        <>
          <ScrollView horizontal style={{ marginVertical: 20 }}>
            {images.map((img, index) => (
              <Image
                key={index}
                source={{ uri: img.uri }}
                style={{ width: 100, height: 100, marginRight: 10 }}
              />
            ))}
          </ScrollView>

  <View style={styles.checkboxRow}>
  <View style={styles.checkboxContainer}>
    <Checkbox
      value={row1Selection === 'infected'}
      onValueChange={() => setRow1Selection('infected')}
    />
    <Text style={styles.label}>Infected</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <Checkbox
      value={row1Selection === 'noninfected'}
      onValueChange={() => setRow1Selection('noninfected')}
    />
    <Text style={styles.label}>non Infected</Text>
  </View>
</View>
<View style={styles.checkboxRow}>
  <View style={styles.checkboxContainer}>
    <Checkbox
      value={row2Selection === 'infrared'}
      onValueChange={() => setRow2Selection('infrared')}
    />
    <Text style={styles.label}>Infrared</Text>
  </View>
  <View style={styles.checkboxContainer}>
    <Checkbox
      value={row2Selection === 'nonInfrared'}
      onValueChange={() => setRow2Selection('nonInfrared')}
    />
    <Text style={styles.label}>non Infrared</Text>
  </View>
</View>
          <View style={styles.buttonRow}>           
            <UploadButton title="Upload" onPress={uploadImages}/>
            <UploadButton title="Clear Photos" onPress={clearImages}/>
          </View>
      {uploading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.spinner} />
      )}
        </>
      )}
      {message !== '' && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
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
    fontSize: 20,
    marginTop: 20,
    color: '#333',
  },
  buttonGroup: {
    alignItems: 'center',
    marginVertical: 5,
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
  button1: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 10,
    marginVertical: 10,
    width: 150,
    justifyContent: 'center',
    elevation: 3,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 0, 
    marginTop: 20,
  },
  icon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 10,
    marginLeft: 28,
    gap: 35, 
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    marginLeft: 8,
    fontSize: 22,
  },
});