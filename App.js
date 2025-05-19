import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
//import RegisterScreen from './screens/RegisterScreen';
import UploadScreen from './screens/UploadScreen';
import LoginScreen from './screens/LoginScreen';
import * as SecureStore from 'expo-secure-store';

export default function App() {
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const storedUserId = await SecureStore.getItemAsync('userId');
      const storedToken = await SecureStore.getItemAsync('jwt');
      if (storedUserId && storedToken) {
        setUserId(storedUserId);
        setToken(storedToken);
      }
    };

    checkLoginStatus();
  }, []);

  const handleLogin = (userId, token) => {
    setUserId(userId);
    setToken(token);
  };

  const handleRegister = async (userId, token) => {
    setUserId(userId);
    setToken(token);
    // Store userId and token in SecureStore for future use
    await SecureStore.setItemAsync('userId', userId);
    await SecureStore.setItemAsync('jwt', token);
  };

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userId');
    await SecureStore.deleteItemAsync('jwt');
    setUserId(null);
    setToken(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      {userId && token ? (
        <UploadScreen userId={userId} token={token} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9',
  },
  userIdText: {
    textAlign: 'center',
    marginVertical: 60,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
