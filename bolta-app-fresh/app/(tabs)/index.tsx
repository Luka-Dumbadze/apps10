// app/(tabs)/index.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../../providers/AuthProvider';
import { Colors } from '../../constants/Colors';

export default function Home() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to BOLTA!</Text>
      <Text style={styles.subtitle}>Hello, {user?.name}!</Text>
      <Text style={styles.balance}>⚡ Bolt Balance: {user?.boltBalance || 0}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: Colors.primary,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    color: Colors.text,
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.bolt,
  },
});