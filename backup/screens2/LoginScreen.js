import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet, Text, TouchableOpacity } from 'react-native';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export default function LoginScreen({ onLogin, onRegister }) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Track whether we're in registration mode

  const handleLogin = async () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    try {
      const response = await axios.post('https://69d6-202-12-94-240.ngrok-free.app/login', {
        userId,
        password,
      });

      const token = response.data.token;
      await SecureStore.setItemAsync('jwt', token);
      await SecureStore.setItemAsync('userId', userId);

      onLogin(userId, token);
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      Alert.alert('Error', message);
    }
  };

  const handleRegister = async () => {
    if (!userId.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both User ID and Password');
      return;
    }

    try {
      const response = await axios.post('https://69d6-202-12-94-240.ngrok-free.app/register', {
        userId,
        password,
      });

      const token = response.data.token;
      await SecureStore.setItemAsync('jwt', token);
      await SecureStore.setItemAsync('userId', userId);

      onRegister(userId, token);
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{isRegistering ? 'Register' : 'Login'}</Text>
      
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
        placeholder="Enter your password"
        placeholderTextColor="#aaa"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      
      <View style={styles.button}>
        <Button
          title={isRegistering ? 'Register' : 'Login'}
          onPress={isRegistering ? handleRegister : handleLogin}
          color="#1E90FF"
        />
      </View>

      <TouchableOpacity onPress={() => setIsRegistering(!isRegistering)}>
        <Text style={styles.switchText}>
          {isRegistering ? 'Already have an account? Login' : 'Don’t have an account? Register'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 40,
    paddingTop: 150,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 40,
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
  switchText: {
    marginTop: 15,
    color: '#1E90FF',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
