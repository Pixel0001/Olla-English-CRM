import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../../lib/api';
import { getLevel, LEVELS } from '../../../lib/levels';

const RANK_COLORS = ['#eab308', '#94a3b8', '#a16207'];

export default function Leaderboard() {
  const { token } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async () => {
    try {
      const d = await api(`/api/public/learn/${token}/leaderboard`);
      setData(d);
    } catch (e) { Alert.alert('Eroare', e.message); }
    finally { setLoading(false); setRefreshing(false); }
  };

  useEffect(() => { load(); }, [token]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-900">
        <ActivityIndicator color="#fbbf24" size="large" />
      </View>
    );
  }
  if (!data) return null;

  const { ranked, me, total } = data;
  const myLevel = getLevel(me.xp);

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      {/* Header */}
      <View className="bg-brand-900 px-4 pt-2 pb-4 flex-row items-center gap-3">
        <Pressable onPress={() => router.back()} hitSlop={10} className="p-2">
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </Pressable>
        <Ionicons name="trophy" size={24} color="#fcd34d" />
        <View>
          <Text className="text-white font-extrabold text-lg leading-tight">Clasament</Text>
          <Text className="text-white/60 text-xs">{total} elevi după XP</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
      >
        {/* My position */}
        <View className="bg-white rounded-2xl p-4 mb-3 border-2 border-brand-700 shadow-sm">
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 bg-brand-900 rounded-full items-center justify-center">
              <Text className="text-white font-extrabold text-base">#{me.rank}</Text>
            </View>
            <View className="flex-1">
              <Text className="font-extrabold text-gray-900">Tu · {me.fullName}</Text>
              <Text className="text-sm font-semibold" style={{ color: myLevel.color }}>
                Nivel {myLevel.num} — {myLevel.name}
              </Text>
            </View>
            <View className="items-end">
              <Text className="text-2xl font-extrabold text-gray-900">{me.xp}</Text>
              <Text className="text-xs text-gray-500">XP</Text>
            </View>
          </View>
        </View>

        {/* Ranking list */}
        <View className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <View className="px-4 py-3 border-b border-gray-100 flex-row items-center gap-2">
            <Ionicons name="star" size={14} color="#f59e0b" />
            <Text className="text-sm font-bold text-gray-700">Top elevi</Text>
          </View>

          {ranked.map((s, idx) => {
            const rank = idx + 1;
            const level = getLevel(s.xp);
            const isMe = s.id === me.id;

            return (
              <View
                key={s.id}
                className={`px-4 py-3 flex-row items-center gap-3 border-t border-gray-50 ${isMe ? 'bg-blue-50' : ''}`}
              >
                <View className="w-8 items-center">
                  {rank <= 3
                    ? <Ionicons name="trophy" size={20} color={RANK_COLORS[idx]} />
                    : <Text className="text-gray-400 font-extrabold text-base">{rank}</Text>}
                </View>

                <View className={`w-9 h-9 rounded-full items-center justify-center ${isMe ? 'bg-brand-900' : 'bg-slate-200'}`}>
                  <Text className={`font-bold ${isMe ? 'text-white' : 'text-slate-600'}`}>
                    {s.fullName.charAt(0).toUpperCase()}
                  </Text>
                </View>

                <View className="flex-1">
                  <Text className={`text-sm font-semibold ${isMe ? 'text-brand-900' : 'text-gray-900'}`} numberOfLines={1}>
                    {isMe ? `${s.fullName} (tu)` : s.fullName}
                  </Text>
                  <Text className="text-[10px] font-bold mt-0.5" style={{ color: level.color }}>
                    Nv.{level.num} {level.name}
                  </Text>
                </View>

                <View className="items-end">
                  <Text className={`text-base font-extrabold ${isMe ? 'text-brand-900' : 'text-gray-900'}`}>
                    {s.xp}
                  </Text>
                  <Text className="text-[10px] text-gray-400">XP</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Levels legend */}
        <View className="bg-white rounded-2xl mt-3 p-4">
          <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Niveluri
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {LEVELS.map(l => (
              <View
                key={l.num}
                className="px-3 py-1.5 rounded-xl border"
                style={{ borderColor: l.color, backgroundColor: `${l.color}15` }}
              >
                <Text className="text-xs font-bold" style={{ color: l.color }}>
                  Nv.{l.num} {l.name}
                </Text>
                <Text className="text-[10px]" style={{ color: l.color, opacity: 0.7 }}>
                  {l.min === 0 ? '0' : l.min.toLocaleString()}+ XP
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
