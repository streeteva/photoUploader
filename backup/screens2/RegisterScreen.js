  import React, { useState, useEffect } from 'react';
  import { View, TextInput, Button, Text, Alert ,StyleSheet} from 'react-native';
  import * as SecureStore from 'expo-secure-store';
  import axios from 'axios';
  import { v4 as uuidv4 } from 'uuid'; // install with: npm install uuid

  export default function RegisterScreen({ onRegister }) {
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
      Alert.alert('Success');
      try {
        const response = await axios.post(' https://741c-202-12-94-240.ngrok-free.app:3000/register', {
          userId,
          password,
        });
      
        const keystore = uuidv4(); // or get this from server
        await SecureStore.setItemAsync('userId', userId);
        await SecureStore.setItemAsync('keystore', keystore);
      
        Alert.alert('Success', response.data.message);
        onRegister({ userId, keystore });
      } catch (error) {
        Alert.alert('Error', error.response?.data?.message || 'Registration failed');
      }
    };

    return (
      <View style={styles.container}>
        <Text style={styles.title}>User Registration</Text>
        <Text style={styles.label}>Enter User ID</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g. john123"
          placeholderTextColor="#aaa"
          value={userId}
          onChangeText={setUserId}
        />
        <Text style={styles.label}>Enter Password</Text>
          <TextInput
          style={styles.input}
          placeholder=""
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
        />
        <View style={styles.button}>
          <Button title="Register" onPress={handleRegister} color="#1E90FF" />
        </View>
      </View>
    );
  }
  const styles = StyleSheet.create({
    title: {
      fontSize: 36,
      fontWeight: 'bold',
      marginBottom: 80,
    },
    container: {
      paddingHorizontal: 40,
      paddingTop: 150,
      alignItems: 'center',
    },
    label: {
      fontSize: 20,
      marginBottom: 12,
      fontWeight: '600',
    },
    input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      padding: 10,
      fontSize: 18,
      marginBottom: 20,
      backgroundColor: '#fff',
    },
    button: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
    },
  });