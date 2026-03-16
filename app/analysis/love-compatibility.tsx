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
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { getLoveCompatibilityAnalysis } from '@/utils/compatibilityLogic';
import { SibijisiTimePicker } from '@/components/SibijisiTimePicker';
import { getBirthTimeHHMMFromSibijisi, type SibijisiBranch } from '@/utils/sibijisi';
import { triggerHaptic } from '@/utils/haptic';

export default function LoveCompatibilityScreen() {
  const [myName, setMyName] = useState('');
  const [myBirthDate, setMyBirthDate] = useState('19940225');
  const [mySibijisi, setMySibijisi] = useState<SibijisiBranch>('미');
  const [myGender, setMyGender] = useState<'male' | 'female'>('male');

  const [partnerName, setPartnerName] = useState('');
  const [partnerBirthDate, setPartnerBirthDate] = useState('19950815');
  const [partnerSibijisi, setPartnerSibijisi] = useState<SibijisiBranch>('묘');
  const [partnerGender, setPartnerGender] = useState<'male' | 'female'>('female');

  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    const myTime = getBirthTimeHHMMFromSibijisi(mySibijisi);
    const ptTime = getBirthTimeHHMMFromSibijisi(partnerSibijisi);
    const result = getLoveCompatibilityAnalysis(
      myName, myBirthDate, myTime, myGender,
      partnerName, partnerBirthDate, ptTime, partnerGender
    );
    setLoading(false);
    router.push({
      pathname: '/analysis/result',
      params: { type: 'LoveCompatibility', data: JSON.stringify(result) },
    });
  };

  return (
    <AnalysisScreenLayout>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>연애 궁합</Text>
        <Text style={styles.subtitle}>나와 상대방의 이름, 생년월일, 출생시간을 입력하세요</Text>

        <Text style={styles.sectionLabel}>나의 정보</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput style={styles.input} value={myName} onChangeText={setMyName} placeholder="이름" placeholderTextColor="#888" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일 (YYYYMMDD)</Text>
          <TextInput
            style={styles.input}
            value={myBirthDate}
            onChangeText={(t) => setMyBirthDate(t.replace(/\D/g, '').slice(0, 8))}
            placeholder="19940225"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>출생시간 (십이지시)</Text>
          <SibijisiTimePicker value={mySibijisi} onSelect={setMySibijisi} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity style={[styles.radioBtn, myGender === 'male' && styles.radioSelected]} onPress={() => setMyGender('male')}>
              <Text style={styles.radioText}>남성</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.radioBtn, myGender === 'female' && styles.radioSelected]} onPress={() => setMyGender('female')}>
              <Text style={styles.radioText}>여성</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.sectionLabel, { marginTop: 24 }]}>상대방 정보</Text>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>이름</Text>
          <TextInput style={styles.input} value={partnerName} onChangeText={setPartnerName} placeholder="상대방 이름" placeholderTextColor="#888" />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>생년월일 (YYYYMMDD)</Text>
          <TextInput
            style={styles.input}
            value={partnerBirthDate}
            onChangeText={(t) => setPartnerBirthDate(t.replace(/\D/g, '').slice(0, 8))}
            placeholder="19950815"
            placeholderTextColor="#888"
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>출생시간 (십이지시)</Text>
          <SibijisiTimePicker value={partnerSibijisi} onSelect={setPartnerSibijisi} />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>성별</Text>
          <View style={styles.genderRow}>
            <TouchableOpacity style={[styles.radioBtn, partnerGender === 'male' && styles.radioSelected]} onPress={() => setPartnerGender('male')}>
              <Text style={styles.radioText}>남성</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.radioBtn, partnerGender === 'female' && styles.radioSelected]} onPress={() => setPartnerGender('female')}>
              <Text style={styles.radioText}>여성</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.submitBtn} onPress={() => { triggerHaptic(); handleAnalyze(); }} disabled={loading}>
          {loading ? <ActivityIndicator color="#121212" /> : <Text style={styles.submitText}>궁합 확인하기</Text>}
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
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  timeInput: { flex: 1, minWidth: 50 },
  timeSep: { color: '#E0E0E0', fontSize: 14 },
  amPmRow: { flexDirection: 'row', gap: 8 },
  amPmBtn: { paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  amPmSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  amPmText: { color: '#E0E0E0', fontSize: 14 },
  genderRow: { flexDirection: 'row', gap: 12 },
  radioBtn: { flex: 1, paddingVertical: 14, borderRadius: 12, borderWidth: 1, borderColor: '#333', alignItems: 'center' },
  radioSelected: { borderColor: '#BB86FC', backgroundColor: 'rgba(187, 134, 252, 0.15)' },
  radioText: { color: '#E0E0E0', fontSize: 16 },
  submitBtn: { backgroundColor: '#BB86FC', paddingVertical: 18, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitText: { color: '#121212', fontSize: 16, fontWeight: 'bold' },
});
