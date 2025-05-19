import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text, StyleSheet } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export default function RegisterScreen({ onRegister }) {
  const [userId, setUserId] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const storedId = await SecureStore.getItemAsync('userId');
      if (storedId) {
        setUserId(storedId);
        setIsRegistered(true);
        onRegister(storedId);
      }
    };
    checkUser();
  }, []);

  const handleRegister = async () => {
    if (userId.trim() !== '') {
      await SecureStore.setItemAsync('userId', userId);
      onRegister(userId);
    }
  };

  if (isRegistered) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Enter User ID</Text>
      <TextInput
        style={styles.input}
        placeholder="e.g. john123"
        placeholderTextColor="#aaa"
        value={userId}
        onChangeText={setUserId}
      />
      <View style={styles.button}>
        <Button title="Register" onPress={handleRegister} color="#1E90FF" />
      </View>
    </View>
  );
  
}
const styles = StyleSheet.create({
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