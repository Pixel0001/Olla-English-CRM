import { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, ActivityIndicator, RefreshControl,
  Pressable, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAiStats } from '../../../lib/ai';
import MrOllaAvatar from '../../../components/MrOllaAvatar';

export default function AiStats() {
  const { token } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const s = await getAiStats(token);
      setData(s);
    } catch (e) {
      Alert.alert('Eroare', e.message);
      if (e.message?.toLowerCase().includes('acces')) router.back();
    } finally { setLoading(false); setRefreshing(false); }
  }, [token]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-900">
        <ActivityIndicator color="#fbbf24" size="large" />
      </View>
    );
  }
  if (!data) return null;

  const { daily, monthly, dailyActivity = [], endpointBreakdown = {}, enabled } = data;
  const cooldown = daily?.resetAt ? formatCooldown(new Date(daily.resetAt)) : null;
  const peak = Math.max(1, ...dailyActivity.map(d => d.count));

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      {/* Header */}
      <View className="bg-brand-900 px-4 pt-2 pb-4">
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => router.back()} hitSlop={10} className="p-2">
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </Pressable>
          <View className="flex-1">
            <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Statistici</Text>
            <Text className="text-white font-extrabold text-base">Mr. Olla · Utilizare AI</Text>
          </View>
          <MrOllaAvatar size={32} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {!enabled && (
          <View className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 flex-row gap-3">
            <Ionicons name="warning" size={20} color="#b45309" />
            <Text className="flex-1 text-sm text-amber-900">
              Mr. Olla este temporar dezactivat de profesor.
            </Text>
          </View>
        )}

        {/* Daily card */}
        <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Astăzi (24h)</Text>
          <Text className="text-3xl font-extrabold text-indigo-700 mt-1">
            {daily.used}<Text className="text-base text-slate-400">/{daily.limit}</Text>
          </Text>
          <View className="h-2 bg-slate-100 rounded-full overflow-hidden mt-2">
            <View
              className="h-full rounded-full"
              style={{
                width: `${daily.pct}%`,
                backgroundColor: daily.pct >= 90 ? '#ef4444' : daily.pct >= 60 ? '#f59e0b' : '#6366f1',
              }}
            />
          </View>
          <Text className="text-xs text-slate-500 mt-2">
            {daily.remaining} cereri rămase {cooldown ? `· se resetează ${cooldown}` : ''}
          </Text>
        </View>

        {/* Monthly card */}
        <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Luna curentă</Text>
          <Text className="text-3xl font-extrabold text-emerald-700 mt-1">
            {monthly.used}<Text className="text-base text-slate-400"> cereri</Text>
          </Text>
          <Text className="text-xs text-slate-500 mt-1">
            Ziua {monthly.dayOfMonth} din {monthly.daysInMonth}
            {monthly.costUsd > 0 ? ` · cost ${monthly.costUsd.toFixed(3)}$` : ''}
          </Text>
        </View>

        {/* Endpoint breakdown */}
        {Object.keys(endpointBreakdown).length > 0 && (
          <View className="bg-white rounded-2xl p-4 mb-3 border border-slate-100 shadow-sm">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Pe tip (azi)
            </Text>
            {Object.entries(endpointBreakdown).map(([k, v]) => (
              <View key={k} className="flex-row items-center justify-between py-1.5">
                <View className="flex-row items-center gap-2">
                  <Ionicons
                    name={k === 'chat' ? 'chatbubble-ellipses' : 'checkmark-done'}
                    size={14}
                    color="#6366f1"
                  />
                  <Text className="text-sm text-slate-700 capitalize">{k.replace('-', ' ')}</Text>
                </View>
                <Text className="text-sm font-bold text-slate-900">{v}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Activity bars */}
        <View className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Activitate zilnică
          </Text>
          <View className="flex-row items-end gap-1" style={{ height: 100 }}>
            {dailyActivity.map(d => {
              const h = Math.max(2, (d.count / peak) * 90);
              const isToday = d.day === monthly.dayOfMonth;
              return (
                <View key={d.day} className="flex-1 items-center gap-1">
                  <View
                    className="w-full rounded-t"
                    style={{
                      height: h,
                      backgroundColor: isToday ? '#6366f1' : d.count > 0 ? '#a5b4fc' : '#e2e8f0',
                    }}
                  />
                </View>
              );
            })}
          </View>
          <View className="flex-row justify-between mt-1">
            <Text className="text-[9px] text-slate-400">1</Text>
            <Text className="text-[9px] text-slate-400">{monthly.daysInMonth}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function formatCooldown(date) {
  const ms = date.getTime() - Date.now();
  if (ms <= 0) return 'imediat';
  const hours = Math.floor(ms / 3600000);
  const mins = Math.floor((ms % 3600000) / 60000);
  if (hours > 0) return `în ${hours}h ${mins}m`;
  return `în ${mins}m`;
}
