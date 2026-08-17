import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MrOllaAvatar from './MrOllaAvatar';

/**
 * Card de feedback AI după notare. Reflect web/components/learn/AiFeedback.js.
 *
 * Props:
 *   result: { aiGrade: { finalGrade, reasoning, rubric }, aiDetect, aiPenaltyApplied, usage }
 *   onRetry: () => void  (vizibil doar dacă mai are încercări)
 *   onContinue: () => void
 *   canRetry: bool
 */
export default function AiFeedback({ result, onRetry, onContinue, canRetry }) {
  if (!result) return null;
  const { aiGrade, aiDetect, aiPenaltyApplied, usage } = result;
  const grade = aiGrade?.finalGrade ?? 0;
  const passed = grade >= 60;
  const rubric = aiGrade?.rubric || {};

  // Tone & color
  const tone = passed
    ? { bg: '#ecfdf5', border: '#a7f3d0', text: '#065f46', accent: '#10b981', icon: 'checkmark-circle' }
    : { bg: '#fef2f2', border: '#fecaca', text: '#991b1b', accent: '#ef4444', icon: 'close-circle' };

  return (
    <View
      className="rounded-2xl border mt-4 overflow-hidden"
      style={{ backgroundColor: tone.bg, borderColor: tone.border }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 p-4">
        <MrOllaAvatar size={44} />
        <View className="flex-1">
          <Text className="text-[10px] font-bold uppercase tracking-wider" style={{ color: tone.text, opacity: 0.7 }}>
            Mr. Olla · Verificare AI
          </Text>
          <View className="flex-row items-center gap-2 mt-0.5">
            <Ionicons name={tone.icon} size={20} color={tone.accent} />
            <Text className="font-extrabold text-lg" style={{ color: tone.text }}>
              {passed ? `Corect! +${grade}%` : `Notă: ${grade}%`}
            </Text>
          </View>
        </View>
      </View>

      {/* Reasoning */}
      {aiGrade?.reasoning ? (
        <View className="px-4 pb-3">
          <Text className="text-sm" style={{ color: tone.text }}>
            {aiGrade.reasoning}
          </Text>
        </View>
      ) : null}

      {/* Rubric breakdown */}
      {Object.keys(rubric).length > 0 && (
        <View className="px-4 pb-3">
          <Text className="text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: tone.text, opacity: 0.7 }}>
            Detalii
          </Text>
          {Object.entries(rubric).map(([key, val]) => (
            <View key={key} className="flex-row items-center gap-2 py-1">
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: tone.accent }}
              />
              <Text className="text-xs flex-1" style={{ color: tone.text }}>
                <Text className="font-semibold">{labelFor(key)}: </Text>
                {String(val)}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* AI penalty warning */}
      {aiDetect?.isAi && (
        <View className="mx-4 mb-3 p-3 rounded-xl bg-amber-100 border border-amber-300 flex-row gap-2">
          <Ionicons name="warning" size={16} color="#b45309" />
          <Text className="flex-1 text-xs text-amber-900">
            Codul pare generat de AI. S-a aplicat o penalizare de {aiPenaltyApplied}p.
            {aiDetect.reasoning ? ` ${aiDetect.reasoning}` : ''}
          </Text>
        </View>
      )}

      {/* Quota indicator */}
      {usage && (
        <View className="px-4 pb-3">
          <Text className="text-[10px]" style={{ color: tone.text, opacity: 0.6 }}>
            Verificări AI rămase astăzi: {usage.remaining ?? '—'} / {usage.limit ?? '—'}
          </Text>
        </View>
      )}

      {/* Actions */}
      <View className="flex-row gap-2 p-4 pt-0">
        {canRetry && (
          <Pressable
            onPress={onRetry}
            className="flex-1 bg-white border-2 rounded-xl py-3 items-center active:opacity-70"
            style={{ borderColor: tone.accent }}
          >
            <Text className="font-bold" style={{ color: tone.text }}>
              Reîncearcă
            </Text>
          </Pressable>
        )}
        <Pressable
          onPress={onContinue}
          className="flex-1 rounded-xl py-3 flex-row items-center justify-center gap-1.5 active:opacity-80"
          style={{ backgroundColor: tone.accent }}
        >
          <Text className="text-white font-extrabold">Continuă</Text>
          <Ionicons name="arrow-forward" size={16} color="#fff" />
        </Pressable>
      </View>
    </View>
  );
}

function labelFor(key) {
  const map = {
    correctness: 'Corectitudine',
    clarity: 'Claritate',
    style: 'Stil',
    efficiency: 'Eficiență',
    completeness: 'Completitudine',
    edgeCases: 'Cazuri speciale',
  };
  return map[key] || key;
}
