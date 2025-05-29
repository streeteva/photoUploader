import React, { useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import RegisterScreen from './screens/RegisterScreen';
import UploadScreen from './screens/UploadScreen';
// comment to test push
export default function App() {
  const [userId, setUserId] = useState(null);

  return (
    <SafeAreaView style={styles.container}>
      {!userId ? (
        <RegisterScreen onRegister={setUserId} />
      ) : (
        <>
          <Text style={styles.userIdText}>Logged in as: {userId}</Text>
          <UploadScreen
            userId={userId}
            onLogout={() => setUserId(null)}
          />
        </>
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
