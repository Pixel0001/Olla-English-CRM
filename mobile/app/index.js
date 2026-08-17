import { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { getToken } from '../lib/api';

export default function Index() {
  useEffect(() => {
    (async () => {
      const token = await getToken();
      if (token) router.replace(`/(learn)/${token}`);
      else router.replace('/login');
    })();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-brand-900">
      <ActivityIndicator color="#fbbf24" size="large" />
    </View>
  );
}
