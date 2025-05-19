import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
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
    <View style={{ padding: 80 }}>
      <Text>Enter User ID:</Text>
      <TextInput
        style={{ borderBottomWidth: 1, marginBottom: 10 }}
        value={userId}
        onChangeText={setUserId}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
}
