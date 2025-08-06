// app/(tabs)/index.tsx
import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { Colors } from '../../constants/Colors';

export default function HomeIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to marketplace since we only have Marketplace and Profile tabs
    router.replace('/marketplace');
  }, []);

  return (
    <View style={{ 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: Colors.background 
    }}>
      <ActivityIndicator size="large" color={Colors.primary} />
    </View>
  );
}