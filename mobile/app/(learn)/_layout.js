import { Stack } from 'expo-router';

export default function LearnLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
      <Stack.Screen name="[token]/index" />
      <Stack.Screen name="[token]/lesson/[lessonId]" />
      <Stack.Screen name="[token]/leaderboard" />
    </Stack>
  );
}
