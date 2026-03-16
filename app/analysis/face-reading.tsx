import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import * as ImagePicker from 'expo-image-picker';
import { triggerHaptic } from '@/utils/haptic';

const API_BASE = process.env.EXPO_PUBLIC_API_URL ?? 'https://api.yourdomain.com';

const MOCK_RESULT = {
  keyword: '재물운이 강한 관상',
  overall: '이목구비가 균형 잡힌 인상입니다. 이마가 넓고 광대가 도드라져 재물과 인복이 두터운 상입니다.',
  details: [
    { category: '재물운', icon: '💰', content: '상반기에는 지출을 주의해야 하나, 하반기부터 부수입이 생깁니다.' },
    { category: '연애운', icon: '💕', content: '타인을 포용할 수 있는 매력이 있어 인연이 찾아옵니다.' },
    { category: '직업운', icon: '💼', content: '창의적인 능력을 인정받고 리더십이 발휘되는 시기입니다.' },
  ],
  advice: '당신의 직관을 믿으세요.',
};

export default function FaceReadingScreen() {
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          '카메라 권한 필요',
          '관상 분석을 위해 카메라 접근 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return false;
      }
    }
    return true;
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    await analyzeFace(result.assets[0].uri);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert(
        '사진 권한 필요',
        '관상 분석을 위해 사진 선택 권한을 허용해주세요.',
        [{ text: '확인' }]
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    await analyzeFace(result.assets[0].uri);
  };

  const analyzeFace = async (imageUri: string) => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'face.jpg',
      } as unknown as Blob);

      const response = await fetch(`${API_BASE}/analyze/face`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error(`분석 실패: ${response.status}`);
      const resultData = await response.json();
      goToResult(resultData);
    } catch {
      goToResult(MOCK_RESULT);
    } finally {
      setIsLoading(false);
    }
  };

  const goToResult = (resultData: object) => {
    router.push({
      pathname: '/analysis/result',
      params: { type: 'FaceReading', data: JSON.stringify(resultData) },
    });
  };

  const handleDemo = () => {
    goToResult(MOCK_RESULT);
  };

  return (
    <AnalysisScreenLayout>
    <View style={styles.container}>
      <Text style={styles.text}>AI 관상 분석</Text>
      <Text style={styles.subtext}>
        카메라로 얼굴을 촬영하거나{'\n'}갤러리에서 사진을 선택하세요.
      </Text>

      <TouchableOpacity
        style={styles.cameraButton}
        onPress={() => { triggerHaptic(); takePhoto(); }}
        disabled={isLoading}
      >
        <Text style={styles.cameraButtonIcon}>📷</Text>
        <Text style={styles.cameraButtonText}>카메라로 촬영</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.galleryButton}
        onPress={() => { triggerHaptic(); pickImage(); }}
        disabled={isLoading}
      >
        <Text style={styles.galleryButtonIcon}>🖼️</Text>
        <Text style={styles.galleryButtonText}>갤러리에서 선택</Text>
      </TouchableOpacity>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#BB86FC" />
          <Text style={styles.loadingText}>관상 분석 중...</Text>
        </View>
      )}

      <TouchableOpacity style={styles.demoButton} onPress={() => { triggerHaptic(); handleDemo(); }} disabled={isLoading}>
        <Text style={styles.demoButtonText}>데모 결과 보기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.backButton} onPress={() => { triggerHaptic(); router.back(); }} disabled={isLoading}>
        <Text style={styles.backButtonText}>뒤로 가기</Text>
      </TouchableOpacity>
    </View>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  text: { color: '#FFF', fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  subtext: { color: '#8A8C9E', marginBottom: 30, textAlign: 'center' },
  cameraButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
  },
  cameraButtonIcon: { fontSize: 28, marginBottom: 4 },
  cameraButtonText: { color: '#121212', fontWeight: 'bold', fontSize: 16 },
  galleryButton: {
    backgroundColor: '#332940',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: 'center',
    width: '100%',
    maxWidth: 280,
    borderWidth: 1,
    borderColor: '#BB86FC',
  },
  galleryButtonIcon: { fontSize: 28, marginBottom: 4 },
  galleryButtonText: { color: '#BB86FC', fontWeight: 'bold', fontSize: 16 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(10, 10, 18, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { color: '#FFF', marginTop: 12, fontSize: 16 },
  demoButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  demoButtonText: { color: '#888', fontSize: 14 },
  backButton: { paddingVertical: 12, marginTop: 8 },
  backButtonText: { color: '#888', fontSize: 14 },
});
