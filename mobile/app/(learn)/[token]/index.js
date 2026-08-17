import { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, Pressable, ActivityIndicator,
  RefreshControl, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router, useFocusEffect, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { api, clearToken } from '../../../lib/api';
import { getLevel, getNextLevel } from '../../../lib/levels';

const MODULE_THEMES = [
  { from: '#fbbf24', to: '#f97316' },   // amber
  { from: '#facc15', to: '#f59e0b' },   // yellow
  { from: '#fb7185', to: '#ec4899' },   // rose
  { from: '#38bdf8', to: '#3b82f6' },   // sky
  { from: '#34d399', to: '#14b8a6' },   // emerald
  { from: '#a78bfa', to: '#a855f7' },   // violet
];

export default function Dashboard() {
  const { token } = useLocalSearchParams();
  const [data, setData] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [bonusExpanded, setBonusExpanded] = useState(false);

  const load = useCallback(async () => {
    try {
      const [d, s] = await Promise.all([
        api(`/api/public/learn/${token}`),
        api(`/api/public/learn/${token}/leaderboard`).catch(() => null),
      ]);
      setData(d);
      setStats(s);
    } catch (e) {
      Alert.alert('Eroare', e.message);
      if (e.message?.includes('Token invalid')) {
        await clearToken();
        router.replace('/login');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const onRefresh = () => { setRefreshing(true); load(); };

  const handleLogout = () => {
    Alert.alert('Deconectare', 'Ești sigur?', [
      { text: 'Anulează', style: 'cancel' },
      { text: 'Da', style: 'destructive', onPress: async () => {
        await clearToken();
        router.replace('/login');
      } },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-brand-900">
        <ActivityIndicator color="#fbbf24" size="large" />
      </View>
    );
  }

  if (!data) return null;

  const { student, modules, subscription, bonusPoints = [] } = data;
  const totalBonus = bonusPoints.reduce((s, bp) => s + bp.points, 0);
  const recentBonus = bonusPoints.filter(bp => Date.now() - new Date(bp.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000);
  const hasNewBonus = recentBonus.length > 0;
  const visibleBonus = bonusExpanded ? bonusPoints : bonusPoints.slice(0, 3);
  const sub = subscription || {};
  const totalLessons = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = modules.reduce(
    (s, m) => s + m.lessons.filter(l => l.progress?.completedAt).length, 0
  );
  const globalPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const xp = stats?.me?.xp ?? 0;
  const rank = stats?.me?.rank ?? 0;
  const level = getLevel(xp);
  const nextLevel = getNextLevel(level);
  const xpIntoLevel = xp - level.min;
  const xpNeeded = nextLevel ? nextLevel.min - level.min : 1;
  const levelPct = nextLevel ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;

  return (
    <SafeAreaView className="flex-1 bg-slate-100" edges={['top']}>
      {/* Header gradient */}
      <View className="bg-brand-900 px-5 pt-4 pb-6 rounded-b-3xl shadow-lg">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center gap-2">
            <View className="bg-accent-400 w-9 h-9 rounded-xl items-center justify-center">
              <Ionicons name="rocket" size={18} color="#1e3a8a" />
            </View>
            <View>
              <Text className="text-white/60 text-[10px] font-bold uppercase tracking-wider">Spațiul tău</Text>
              <Text className="text-white font-extrabold text-base leading-tight">Olla English</Text>
            </View>
          </View>
          <Pressable onPress={handleLogout} hitSlop={10} className="p-2">
            <Ionicons name="log-out-outline" size={22} color="#fbbf24" />
          </Pressable>
        </View>

        <Text className="text-white text-2xl font-extrabold">
          Salut, <Text className="text-accent-400">{student.fullName.split(' ')[0]}</Text>!
        </Text>

        {/* Stats row */}
        <View className="flex-row gap-3 mt-4">
          {/* Progress card */}
          <View className="flex-1 bg-white/10 rounded-2xl p-3">
            <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Progres</Text>
            <Text className="text-white text-2xl font-extrabold mt-0.5">
              {completedLessons}<Text className="text-white/40 text-sm font-normal">/{totalLessons}</Text>
            </Text>
            <View className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
              <View className="h-full bg-accent-400 rounded-full" style={{ width: `${globalPct}%` }} />
            </View>
            <Text className="text-white/50 text-[10px] mt-1">{globalPct}% completate</Text>
          </View>

          {/* XP card */}
          <View className="flex-1 bg-white/10 rounded-2xl p-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="star" size={11} color="#fde047" />
              <Text className="text-white/50 text-[10px] font-bold uppercase tracking-wider">Nivel {level.num}</Text>
            </View>
            <Text className="text-white text-2xl font-extrabold mt-0.5">
              {xp}<Text className="text-white/40 text-sm font-normal"> XP</Text>
            </Text>
            <View className="h-1.5 bg-white/10 rounded-full overflow-hidden mt-1.5">
              <View className="h-full rounded-full" style={{ width: `${levelPct}%`, backgroundColor: level.bar }} />
            </View>
            <Text className="text-white/50 text-[10px] mt-1" numberOfLines={1}>
              {level.name}{nextLevel ? ` · ${nextLevel.min - xp} XP →` : ''}
            </Text>
          </View>
        </View>

        {/* Leaderboard + AI CTAs */}
        <View className="flex-row gap-2 mt-3">
          <Link href={`/(learn)/${token}/leaderboard`} asChild>
            <Pressable className="flex-1 bg-white/10 rounded-2xl p-3 flex-row items-center gap-2 active:bg-white/20">
              <View className="w-9 h-9 bg-accent-400 rounded-xl items-center justify-center">
                <Ionicons name="trophy" size={18} color="#1e3a8a" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-extrabold text-sm">Clasament</Text>
                <Text className="text-white/60 text-[10px]" numberOfLines={1}>
                  {rank > 0 ? `Locul #${rank}` : 'Vezi top'}
                </Text>
              </View>
            </Pressable>
          </Link>

          <Link href={`/(learn)/${token}/ai-stats`} asChild>
            <Pressable className="flex-1 bg-white/10 rounded-2xl p-3 flex-row items-center gap-2 active:bg-white/20">
              <View className="w-9 h-9 rounded-xl items-center justify-center" style={{ backgroundColor: '#a78bfa' }}>
                <Ionicons name="sparkles" size={18} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-extrabold text-sm">Mr. Olla</Text>
                <Text className="text-white/60 text-[10px]" numberOfLines={1}>
                  Statistici AI
                </Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>

      {/* Modules list */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}
      >
        {/* Subscription status banner */}
        {sub.showPaymentLock && (
          <View className="bg-gradient-to-br rounded-2xl mb-4 p-4 shadow-sm border border-rose-200" style={{ backgroundColor: '#fef2f2' }}>
            <View className="flex-row items-start gap-3">
              <View className="w-10 h-10 bg-rose-500 rounded-xl items-center justify-center shrink-0">
                <Ionicons name="lock-closed" size={20} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="font-extrabold text-rose-900 text-base leading-tight">
                  {sub.expired
                    ? `Abonament expirat${sub.daysLeft != null ? ` de ${Math.abs(sub.daysLeft)} ${Math.abs(sub.daysLeft) === 1 ? 'zi' : 'zile'}` : ''}`
                    : 'Niciun abonament activ'}
                </Text>
                <Text className="text-rose-800 text-xs mt-1">
                  {sub.lockMessage || 'Contactează profesorul pentru a achita abonamentul.'}
                </Text>
                <Text className="text-rose-700/80 text-[11px] mt-2">
                  Poți continua doar lecțiile cu badge <Text className="font-bold">„Gratis”</Text>. Antrenamentul aleator este dezactivat.
                </Text>
              </View>
            </View>
          </View>
        )}

        {!sub.showPaymentLock && sub.active && sub.daysLeft != null && (
          <View className={`rounded-2xl mb-4 p-3 flex-row items-center gap-3 border ${
            sub.expiringSoon ? 'border-amber-200' : 'border-emerald-200'
          }`} style={{ backgroundColor: sub.expiringSoon ? '#fffbeb' : '#ecfdf5' }}>
            <View className={`w-9 h-9 rounded-xl items-center justify-center ${
              sub.expiringSoon ? 'bg-amber-500' : 'bg-emerald-500'
            }`}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className={`font-extrabold text-sm ${sub.expiringSoon ? 'text-amber-900' : 'text-emerald-900'}`}>
                Abonament activ
              </Text>
              <Text className={`text-xs ${sub.expiringSoon ? 'text-amber-700' : 'text-emerald-700'}`}>
                {sub.daysLeft === 0 ? 'Expiră astăzi'
                  : `${sub.daysLeft} ${sub.daysLeft === 1 ? 'zi rămasă' : 'zile rămase'}`}
                {sub.expiresAt ? ` · până la ${new Date(sub.expiresAt).toLocaleDateString('ro-RO')}` : ''}
              </Text>
            </View>
          </View>
        )}

        {/* Bonus points history */}
        {bonusPoints.length > 0 && (
          <View className={`rounded-2xl mb-4 overflow-hidden border shadow-sm ${
            hasNewBonus ? 'border-amber-200 bg-amber-50' : 'border-gray-100 bg-white'
          }`}>
            {/* Header */}
            <View className="px-4 py-3 flex-row items-center gap-3">
              <View className={`w-9 h-9 rounded-xl items-center justify-center ${
                hasNewBonus ? 'bg-amber-400' : 'bg-slate-100'
              }`}>
                <Ionicons name="star" size={16} color={hasNewBonus ? '#78350f' : '#64748b'} />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  <Text className={`font-bold text-sm ${
                    hasNewBonus ? 'text-amber-900' : 'text-gray-800'
                  }`}>Puncte bonus</Text>
                  {hasNewBonus && (
                    <View className="px-1.5 py-0.5 bg-amber-400 rounded-full">
                      <Text className="text-[9px] font-bold text-amber-900 uppercase tracking-wider">Nou</Text>
                    </View>
                  )}
                </View>
                <Text className={`text-xs mt-0.5 ${
                  hasNewBonus ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  Total bonus: <Text className="font-bold">{totalBonus >= 0 ? '+' : ''}{totalBonus} XP</Text> · {bonusPoints.length} {bonusPoints.length === 1 ? 'intrare' : 'intrări'}
                </Text>
              </View>
            </View>

            {/* Entries */}
            {visibleBonus.map((bp, idx) => {
              const isRecent = Date.now() - new Date(bp.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000;
              return (
                <View key={bp.id} className={`px-4 py-3 flex-row items-center gap-3 border-t ${
                  hasNewBonus ? 'border-amber-100' : 'border-gray-50'
                } ${isRecent && idx === 0 ? (bp.points >= 0 ? 'bg-amber-100/60' : 'bg-rose-100/60') : ''}`}>
                  <View className={`w-9 h-9 rounded-xl items-center justify-center ${
                    bp.points >= 0 ? 'bg-amber-400' : 'bg-rose-400'
                  }`}>
                    <Text className={`text-xs font-extrabold ${
                      bp.points >= 0 ? 'text-amber-900' : 'text-white'
                    }`}>{bp.points >= 0 ? '+' : ''}{bp.points}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>{bp.reason}</Text>
                    <Text className="text-[10px] text-gray-400 mt-0.5">
                      {bp.addedBy?.name} · {new Date(bp.createdAt).toLocaleDateString('ro-RO', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </Text>
                  </View>
                  {isRecent && (
                    <View className="px-1.5 py-0.5 bg-amber-200 rounded-full">
                      <Text className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">Nou</Text>
                    </View>
                  )}
                </View>
              );
            })}

            {/* Expand/collapse */}
            {bonusPoints.length > 3 && (
              <Pressable
                onPress={() => setBonusExpanded(v => !v)}
                className={`px-4 py-2.5 flex-row items-center justify-center gap-1.5 border-t ${
                  hasNewBonus ? 'border-amber-100 active:bg-amber-100' : 'border-gray-50 active:bg-gray-50'
                }`}
              >
                <Ionicons
                  name={bonusExpanded ? 'chevron-up' : 'chevron-down'}
                  size={14}
                  color={hasNewBonus ? '#92400e' : '#6b7280'}
                />
                <Text className={`text-xs font-bold ${
                  hasNewBonus ? 'text-amber-700' : 'text-gray-500'
                }`}>
                  {bonusExpanded
                    ? 'Ascunde'
                    : `Vezi tot istoricul (${bonusPoints.length - 3} mai multe)`}
                </Text>
              </Pressable>
            )}
          </View>
        )}

        <Text className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 px-1">
          Modulele tale ({modules.length})
        </Text>

        {modules.map((m, idx) => {
          const theme = MODULE_THEMES[idx % MODULE_THEMES.length];
          const doneL = m.lessons.filter(l => l.progress?.completedAt).length;
          const totalL = m.lessons.length;
          const pct = totalL > 0 ? Math.round((doneL / totalL) * 100) : 0;
          const isLocked = !m.unlocked;

          return (
            <View
              key={m.id}
              className="bg-white rounded-2xl mb-3 overflow-hidden shadow-sm border border-gray-100"
              style={{ opacity: isLocked ? 0.55 : 1 }}
            >
              {/* Module header */}
              <View
                className="px-4 py-3 flex-row items-center gap-3"
                style={{ backgroundColor: theme.from }}
              >
                <View className="w-10 h-10 bg-white/30 rounded-xl items-center justify-center">
                  <Text className="text-white font-extrabold text-base">{idx + 1}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-extrabold text-base" numberOfLines={1}>{m.title}</Text>
                  <View className="flex-row items-center gap-1.5 mt-0.5 flex-wrap">
                    <Text className="text-white/80 text-xs">
                      {totalL} lecții {m.language ? `· ${m.language}` : ''}
                    </Text>
                    {!isLocked && m.hasFullAccess && (
                      <View className="px-1.5 py-0.5 bg-emerald-500 rounded">
                        <Text className="text-[9px] font-bold text-white uppercase tracking-wider">Acces complet</Text>
                      </View>
                    )}
                    {!isLocked && !m.hasFullAccess && (
                      <View className="px-1.5 py-0.5 bg-white/30 rounded">
                        <Text className="text-[9px] font-bold text-white uppercase tracking-wider">Doar Gratis</Text>
                      </View>
                    )}
                  </View>
                </View>
                {isLocked
                  ? <Ionicons name="lock-closed" size={20} color="rgba(255,255,255,0.7)" />
                  : <Text className="text-white font-extrabold text-base">{pct}%</Text>}
              </View>

              {/* Lessons */}
              {!isLocked && (
                <View>
                  {m.lessons.slice(0, 5).map((l, lIdx) => {
                    const done = l.progress?.completedAt;
                    const started = !done && (l.progress?.theoryCompleted || (l.progress?.currentProblemIndex ?? 0) > 0);
                    const accessible = l.accessible;
                    const showLockAlert = () => {
                      Alert.alert(
                        'Lecție blocată',
                        sub.expired
                          ? 'Abonamentul a expirat. Contactează profesorul pentru a-l reînnoi.'
                          : 'Această lecție necesită abonament activ. Contactează profesorul pentru a achita abonamentul.',
                        [{ text: 'Am înțeles' }]
                      );
                    };

                    const Row = (
                      <Pressable
                        className="px-4 py-3 flex-row items-center gap-3 active:bg-gray-50 border-t border-gray-50"
                        onPress={accessible ? undefined : showLockAlert}
                      >
                        <View className={`w-8 h-8 rounded-full items-center justify-center ${
                          done ? 'bg-emerald-100' : started ? 'bg-blue-100' : accessible ? 'bg-gray-100' : 'bg-rose-50'
                        }`}>
                          {done
                            ? <Ionicons name="checkmark" size={16} color="#10b981" />
                            : !accessible
                              ? <Ionicons name="lock-closed" size={12} color="#f43f5e" />
                              : <Text className="text-xs font-bold text-gray-600">{lIdx + 1}</Text>}
                        </View>
                        <View className="flex-1">
                          <Text className={`text-sm font-semibold ${accessible ? 'text-gray-900' : 'text-gray-500'}`} numberOfLines={1}>
                            {l.title}
                          </Text>
                          <View className="flex-row items-center gap-1.5 mt-0.5 flex-wrap">
                            <Text className="text-xs text-gray-500">
                              {l._count?.problems ?? 0} {l._count?.problems === 1 ? 'problemă' : 'probleme'}
                            </Text>
                            {l.isFree && (
                              <View className="px-1.5 py-0.5 bg-emerald-100 rounded">
                                <Text className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider">Gratis</Text>
                              </View>
                            )}
                            {!accessible && (
                              <View className="px-1.5 py-0.5 bg-rose-100 rounded">
                                <Text className="text-[9px] font-bold text-rose-700 uppercase tracking-wider">Blocat</Text>
                              </View>
                            )}
                            {started && !done && accessible && (
                              <View className="px-1.5 py-0.5 bg-indigo-100 rounded">
                                <Text className="text-[9px] font-bold text-indigo-700 uppercase tracking-wider">În curs</Text>
                              </View>
                            )}
                          </View>
                        </View>
                        {accessible
                          ? <Ionicons name="chevron-forward" size={16} color="#9ca3af" />
                          : <Ionicons name="lock-closed" size={14} color="#f43f5e" />}
                      </Pressable>
                    );

                    return accessible ? (
                      <Link key={l.id} href={`/(learn)/${token}/lesson/${l.id}`} asChild>
                        {Row}
                      </Link>
                    ) : (
                      <View key={l.id}>{Row}</View>
                    );
                  })}
                  {m.lessons.length > 5 && (
                    <View className="px-4 py-2 bg-gray-50">
                      <Text className="text-xs text-gray-400 text-center">
                        +{m.lessons.length - 5} alte lecții
                      </Text>
                    </View>
                  )}
                </View>
              )}

              {isLocked && (
                <View className="px-4 py-4 bg-gray-50">
                  <Text className="text-xs text-gray-500 text-center">
                    🔒 Termină modulul anterior pentru a-l debloca
                  </Text>
                </View>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
