import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { getSajuAnalysis } from '@/utils/sajuLogic';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { SibijisiTimePicker } from '@/components/SibijisiTimePicker';
import { getBirthTimeHHMMFromSibijisi, type SibijisiBranch } from '@/utils/sibijisi';
import { triggerHaptic } from '@/utils/haptic';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.yourdomain.com';

export default function SajuScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('19940225');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [birthSibijisi, setBirthSibijisi] = useState<SibijisiBranch>('미');
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getBirthTimeHHMM = () => getBirthTimeHHMMFromSibijisi(birthSibijisi);

  const fetchSajuAnalysis = async () => {
    const birthTime = getBirthTimeHHMM();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE}/analyze/saju`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, birthDate, birthTime, gender }),
      });

      if (!response.ok) throw new Error(`분석 실패: ${response.status}`);
      const resultData = await response.json();
      goToResult(resultData);
    } catch {
      // API 미연동 시 이름·생년월시 기반 정확한 사주 계산 및 상세 해석
      const mockData = getSajuAnalysis(name, birthDate, birthTime, gender, calendarType);
      goToResult(mockData);
    } finally {
      setIsLoading(false);
    }
  };

  const goToResult = (resultData: object) => {
    router.push({
      pathname: '/analysis/result',
      params: { type: 'Saju', data: JSON.stringify(resultData) },
    });
  };

  return (
    <AnalysisScreenLayout>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>당신의 사주 정보를 입력해주세요</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="이름을 입력해주세요"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일 (YYYYMMDD)</Text>
          <View style={styles.calendarRow}>
            <TouchableOpacity
              style={[styles.calendarButton, calendarType === 'solar' && styles.calendarSelected]}
              onPress={() => setCalendarType('solar')}
            >
              <Text style={styles.calendarButtonText}>양력</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.calendarButton, calendarType === 'lunar' && styles.calendarSelected]}
              onPress={() => setCalendarType('lunar')}
            >
              <Text style={styles.calendarButtonText}>음력</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, styles.dateInput]}
            value={birthDate}
            onChangeText={(t) => setBirthDate(t.replace(/\D/g, '').slice(0, 8))}
            placeholder={calendarType === 'solar' ? '19940225 (양력)' : '19940214 (음력)'}
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>출생시간 (십이지시)</Text>
          <SibijisiTimePicker value={birthSibijisi} onSelect={setBirthSibijisi} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity
              style={[styles.radioButton, gender === 'male' && styles.radioSelected]}
              onPress={() => setGender('male')}
            >
              <Text style={styles.radioText}>남성</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.radioButton, gender === 'female' && styles.radioSelected]}
              onPress={() => setGender('female')}
            >
              <Text style={styles.radioText}>여성</Text>
            </TouchableOpacity>
          </View>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitDisabled]}
          onPress={() => { triggerHaptic(); fetchSajuAnalysis(); }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#121212" />
          ) : (
            <Text style={styles.submitText}>명운 확인하기</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 40 },
  title: {
    color: '#BB86FC',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  inputGroup: { marginBottom: 20 },
  label: { color: '#E0E0E0', fontSize: 14, marginBottom: 8 },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  calendarRow: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  calendarButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  calendarSelected: {
    borderColor: '#BB86FC',
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
  },
  calendarButtonText: { color: '#E0E0E0', fontSize: 14 },
  dateInput: { marginTop: 0 },
  genderRow: { flexDirection: 'row', gap: 12 },
  radioButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: '#BB86FC',
    backgroundColor: 'rgba(187, 134, 252, 0.15)',
  },
  radioText: { color: '#E0E0E0', fontSize: 16 },
  errorText: { color: '#FF6B6B', fontSize: 14, marginBottom: 12 },
  submitButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  submitDisabled: { opacity: 0.6 },
  submitText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
});
