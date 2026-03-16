import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { SibijisiTimePicker } from '@/components/SibijisiTimePicker';
import { getWorkCompatibilityAnalysis } from '@/utils/compatibilityLogic';
import { triggerHaptic } from '@/utils/haptic';
import { getBirthTimeHHMMFromSibijisi, type SibijisiBranch } from '@/utils/sibijisi';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function WorkCompatibilityScreen() {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('19940225');
  const [birthSibijisi, setBirthSibijisi] = useState<SibijisiBranch>('미');
  const [calendarType, setCalendarType] = useState<'solar' | 'lunar'>('solar');
  const [companyName, setCompanyName] = useState('');
  const [loading, setLoading] = useState(false);

  const getBirthTime = () => getBirthTimeHHMMFromSibijisi(birthSibijisi);

  const handleAnalyze = () => {
    setLoading(true);
    const birthTime = getBirthTime();
    const result = getWorkCompatibilityAnalysis(name, birthDate, birthTime, calendarType, companyName);
    setLoading(false);
    router.push({
      pathname: '/analysis/result',
      params: { type: 'WorkCompatibility', data: JSON.stringify(result) },
    });
  };

  return (
    <AnalysisScreenLayout>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>직장 궁합</Text>
        <Text style={styles.subtitle}>
          나의 사주팔자와 회사명으로 업무 성향·찰떡 지수를 확인하세요
        </Text>

        <Text style={styles.sectionLabel}>나의 사주 정보</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="이름" placeholderTextColor="#888" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일 (YYYYMMDD)</Text>
          <View style={styles.calRow}>
            <TouchableOpacity
              style={[styles.calBtn, calendarType === 'solar' && styles.calSelected]}
              onPress={() => setCalendarType('solar')}
            >
              <Text style={styles.calText}>양력</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.calBtn, calendarType === 'lunar' && styles.calSelected]}
              onPress={() => setCalendarType('lunar')}
            >
              <Text style={styles.calText}>음력</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            value={birthDate}
            onChangeText={(t) => setBirthDate(t.replace(/\D/g, '').slice(0, 8))}
            placeholder="19940225"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>출생시간 (십이지시)</Text>
          <SibijisiTimePicker value={birthSibijisi} onSelect={setBirthSibijisi} />
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>회사 정보</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>회사명</Text>
          <TextInput
            style={styles.input}
            value={companyName}
            onChangeText={setCompanyName}
            placeholder="예: 삼성전자, 카카오, 우리회사"
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => { triggerHaptic(); handleAnalyze(); }} disabled={loading}>
          {loading ? <ActivityIndicator color="#121212" /> : <Text style={styles.submitText}>궁합 분석하기</Text>}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { color: '#BB86FC', fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { color: '#8A8C9E', fontSize: 14, textAlign: 'center', marginBottom: 24 },
  sectionLabel: { color: '#FFD700', fontSize: 16, fontWeight: '600', marginBottom: 12 },
  inputGroup: { marginBottom: 18 },
  label: { color: '#E0E0E0', fontSize: 14, marginBottom: 6 },
  input: {
    backgroundColor: '#1E1E1E',
    color: '#FFF',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16,
  },
  calRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  calBtn: { flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  calSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  calText: { color: '#E0E0E0', fontSize: 14 },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { flex: 1, minWidth: 50 },
  timeSep: { color: '#E0E0E0', fontSize: 14 },
  amPmRow: { flexDirection: 'row', gap: 8 },
  amPmBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  amPmSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  amPmText: { color: '#E0E0E0', fontSize: 14 },
  submitBtn: { backgroundColor: '#BB86FC', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
});
