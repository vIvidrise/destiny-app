import { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { getDailyFortune } from '@/utils/dailyFortune';
import { triggerHaptic } from '@/utils/haptic';
import { TAROT_IMAGE_MAP } from '@/utils/tarotImages';

export default function DailyFortuneScreen() {
  const { card, mantra, fortune } = useMemo(() => getDailyFortune(), []);

  const cardSource = TAROT_IMAGE_MAP[card.filename];

  return (
    <AnalysisScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.dateLabel}>
          {new Date().toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.cardSection}>
          {cardSource ? (
            <Image
              source={cardSource}
              style={[styles.cardImage, card.isReversed && styles.reversedImage]}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.cardPlaceholder}>
              <Text style={styles.cardName}>{card.name}</Text>
            </View>
          )}
          <Text style={styles.cardLabel}>
            {card.name} ({card.isReversed ? '역방향' : '정방향'})
          </Text>
        </View>

        <View style={styles.mantraBox}>
          <Text style={styles.mantraLabel}>✨ 오늘의 멘트</Text>
          <Text style={styles.mantraText}>"{mantra}"</Text>
        </View>

        <View style={styles.fortuneBox}>
          <Text style={styles.fortuneLabel}>📜 오늘의 운세</Text>
          <Text style={styles.fortuneText}>{fortune}</Text>
        </View>

        <TouchableOpacity
          style={styles.tarotButton}
          onPress={() => { triggerHaptic(); router.push('/analysis/tarot'); }}
        >
          <Text style={styles.tarotButtonText}>AI 타로로 질문하기 →</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 40 },
  dateLabel: {
    color: '#8A8C9E',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  cardSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  cardImage: {
    width: 140,
    height: 220,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  reversedImage: { transform: [{ rotate: '180deg' }] },
  cardPlaceholder: {
    width: 140,
    height: 220,
    borderRadius: 12,
    backgroundColor: '#1A1C35',
    borderWidth: 2,
    borderColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardName: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cardLabel: {
    color: '#E0E0E0',
    fontSize: 14,
    marginTop: 12,
  },
  mantraBox: {
    backgroundColor: 'rgba(187, 134, 252, 0.12)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
  },
  mantraLabel: {
    color: '#BB86FC',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  mantraText: {
    color: '#FFFFFF',
    fontSize: 17,
    lineHeight: 26,
    fontStyle: 'italic',
  },
  fortuneBox: {
    backgroundColor: 'rgba(44, 44, 44, 0.7)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.2)',
  },
  fortuneLabel: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  fortuneText: {
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 24,
  },
  tarotButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  tarotButtonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
