import { useState } from 'react';
import {
  View, Text, TextInput, Pressable, KeyboardAvoidingView,
  Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, saveToken } from '../lib/api';

export default function LoginScreen() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!identifier.trim() || !password) {
      Alert.alert('Atenție', 'Completează toate câmpurile');
      return;
    }
    setLoading(true);
    try {
      const data = await api('/api/public/learn/login', {
        method: 'POST',
        body: JSON.stringify({ identifier: identifier.trim(), password }),
      });
      await saveToken(data.token);
      router.replace(`/(learn)/${data.token}`);
    } catch (e) {
      Alert.alert('Eroare', e.message || 'Nu am putut autentifica');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-brand-900" edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / brand */}
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-accent-400 items-center justify-center mb-4 shadow-lg">
              <Ionicons name="rocket" size={36} color="#1e3a8a" />
            </View>
            <Text className="text-white text-3xl font-extrabold">Olla English</Text>
            <Text className="text-white/60 text-sm mt-1">Spațiul tău de învățare</Text>
          </View>

          {/* Form card */}
          <View className="bg-white rounded-3xl p-6 shadow-2xl">
            <Text className="text-xl font-extrabold text-gray-900 mb-1">Bun venit!</Text>
            <Text className="text-sm text-gray-500 mb-5">Autentifică-te pentru a începe</Text>

            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Email, telefon sau nume
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 mb-3 bg-gray-50">
              <Ionicons name="person-outline" size={18} color="#6b7280" />
              <TextInput
                value={identifier}
                onChangeText={setIdentifier}
                placeholder="ex: ion@email.com"
                placeholderTextColor="#9ca3af"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 py-3 px-2 text-gray-900"
              />
            </View>

            <Text className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-1.5">
              Parolă
            </Text>
            <View className="flex-row items-center border border-gray-200 rounded-xl px-3 mb-5 bg-gray-50">
              <Ionicons name="lock-closed-outline" size={18} color="#6b7280" />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                className="flex-1 py-3 px-2 text-gray-900"
              />
              <Pressable onPress={() => setShowPassword(s => !s)} hitSlop={10}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color="#6b7280" />
              </Pressable>
            </View>

            <Pressable
              onPress={handleLogin}
              disabled={loading}
              className="rounded-xl py-3.5 items-center active:opacity-80"
              style={{ backgroundColor: '#1e40af', opacity: loading ? 0.6 : 1 }}
            >
              {loading
                ? <ActivityIndicator color="#fff" />
                : <Text className="text-white font-extrabold text-base">Intră în cont</Text>
              }
            </Pressable>

            <Text className="text-xs text-gray-400 text-center mt-4">
              Nu ai cont? Contactează profesorul tău.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
