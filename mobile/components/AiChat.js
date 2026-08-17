import { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, TextInput, Pressable, ScrollView,
  ActivityIndicator, KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Markdown from 'react-native-markdown-display';
import MrOllaAvatar from './MrOllaAvatar';
import { getAiChat, postAiChat } from '../lib/ai';

/**
 * Modal-style chat panel cu Mr. Olla. Afișat inline în lecție când utilizatorul cere ajutor.
 * Props:
 *   token, problemId, lessonId, code, onClose
 */
export default function AiChat({ token, problemId, lessonId, code, onClose }) {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [remaining, setRemaining] = useState(5);
  const [limit, setLimit] = useState(5);
  const scrollRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const data = await getAiChat(token, problemId);
      setMessages(data.messages || []);
      setRemaining(data.remaining ?? 5);
      setLimit(data.limit ?? 5);
    } catch (e) {
      Alert.alert('Eroare', e.message);
    } finally { setLoading(false); }
  }, [token, problemId]);

  useEffect(() => { load(); }, [load]);

  const send = async () => {
    const q = question.trim();
    if (!q || sending) return;
    if (remaining <= 0) {
      Alert.alert('Limită atinsă', 'Ai folosit toate întrebările pentru această problemă.');
      return;
    }
    setSending(true);
    // Optimistic UI
    setMessages(prev => [...prev, { id: 'tmp-' + Date.now(), role: 'user', content: q }]);
    setQuestion('');
    try {
      const data = await postAiChat(token, { problemId, lessonId, question: q, code });
      setMessages(prev => {
        const noTmp = prev.filter(m => !String(m.id).startsWith('tmp-'));
        return [...noTmp, data.userMessage, data.assistantMessage];
      });
      setRemaining(data.remaining);
    } catch (e) {
      // rollback
      setMessages(prev => prev.filter(m => !String(m.id).startsWith('tmp-')));
      Alert.alert('Eroare', e.message);
    } finally {
      setSending(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <View className="rounded-2xl overflow-hidden border border-indigo-200 bg-white mt-4" style={{ height: 480 }}>
      {/* Header */}
      <View className="flex-row items-center gap-3 p-3 border-b border-indigo-100" style={{ backgroundColor: '#eef2ff' }}>
        <MrOllaAvatar size={36} />
        <View className="flex-1">
          <Text className="font-extrabold text-indigo-900 text-sm">Mr. Olla</Text>
          <Text className="text-[11px] text-indigo-600">{remaining}/{limit} întrebări rămase</Text>
        </View>
        <Pressable onPress={onClose} hitSlop={10} className="p-1.5">
          <Ionicons name="close" size={20} color="#3730a3" />
        </Pressable>
      </View>

      {/* Messages */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 12 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
          keyboardShouldPersistTaps="handled"
        >
          {loading ? (
            <ActivityIndicator color="#6366f1" />
          ) : messages.length === 0 ? (
            <View className="items-center py-6">
              <MrOllaAvatar size={56} glow />
              <Text className="text-sm font-bold text-indigo-700 mt-3 text-center">
                Salut! Sunt aici să te ajut.
              </Text>
              <Text className="text-xs text-indigo-500 mt-1 text-center px-4">
                Pune-mi o întrebare despre problemă sau cere un indiciu (fără soluția completă).
              </Text>
            </View>
          ) : (
            messages.map(m => (
              <View
                key={m.id}
                className={`mb-2 max-w-[88%] rounded-2xl px-3 py-2 ${
                  m.role === 'user' ? 'bg-indigo-600 self-end' : 'bg-slate-100 self-start'
                }`}
              >
                {m.role === 'user' ? (
                  <Text className="text-white text-sm">{m.content}</Text>
                ) : (
                  <Markdown style={chatMd}>{m.content}</Markdown>
                )}
              </View>
            ))
          )}
          {sending && (
            <View className="bg-slate-100 self-start rounded-2xl px-3 py-2 flex-row items-center gap-2">
              <ActivityIndicator size="small" color="#6366f1" />
              <Text className="text-xs text-slate-500">Mr. Olla gândește…</Text>
            </View>
          )}
        </ScrollView>

        {/* Input */}
        <View className="border-t border-indigo-100 p-2 flex-row items-end gap-2 bg-white">
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={remaining > 0 ? 'Scrie întrebarea ta…' : 'Limită atinsă'}
            placeholderTextColor="#9ca3af"
            multiline
            maxLength={500}
            editable={remaining > 0 && !sending}
            className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-slate-50"
            style={{ maxHeight: 90 }}
          />
          <Pressable
            onPress={send}
            disabled={sending || !question.trim() || remaining <= 0}
            className="rounded-xl px-4 py-2.5 active:opacity-70"
            style={{
              backgroundColor: '#6366f1',
              opacity: sending || !question.trim() || remaining <= 0 ? 0.4 : 1,
            }}
          >
            <Ionicons name="send" size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const chatMd = {
  body: { fontSize: 13, color: '#1f2937', lineHeight: 19 },
  paragraph: { marginVertical: 0, marginBottom: 4 },
  code_inline: {
    backgroundColor: '#e0e7ff', color: '#3730a3', paddingHorizontal: 4,
    borderRadius: 4, fontSize: 12,
  },
  code_block: {
    backgroundColor: '#0f172a', color: '#f1f5f9', padding: 8, borderRadius: 6,
    fontSize: 12, marginVertical: 4,
  },
  fence: {
    backgroundColor: '#0f172a', color: '#f1f5f9', padding: 8, borderRadius: 6,
    fontSize: 12, marginVertical: 4,
  },
  list_item: { marginBottom: 2 },
};
