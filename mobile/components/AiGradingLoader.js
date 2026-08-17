import { useEffect, useState, useRef } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import MrOllaAvatar from './MrOllaAvatar';

const PHRASES = [
  'Mr. Olla analizează codul tău…',
  'Citește variabilele și logica…',
  'Verifică dacă rezultatul e corect…',
  'Caută posibile bug-uri ascunse…',
  'Pregătește explicația pe înțelesul tău…',
];

export default function AiGradingLoader() {
  const [idx, setIdx] = useState(0);
  const spin = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % PHRASES.length), 1800);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 2400,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
  }, [spin]);

  const rotate = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <View className="items-center justify-center py-6 px-4">
      <View className="relative items-center justify-center" style={{ width: 80, height: 80 }}>
        <Animated.View
          style={{
            position: 'absolute',
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 3,
            borderColor: '#a78bfa',
            borderTopColor: 'transparent',
            transform: [{ rotate }],
          }}
        />
        <MrOllaAvatar size={56} glow />
      </View>
      <Text className="text-sm font-bold text-indigo-700 mt-4 text-center">
        {PHRASES[idx]}
      </Text>
      <Text className="text-[11px] text-indigo-400 mt-1">
        Durează 5–15 secunde
      </Text>
    </View>
  );
}
