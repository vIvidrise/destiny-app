import { TAROT_IMAGE_MAP } from '@/utils/tarotImages';
import { router, useLocalSearchParams } from 'expo-router';
import { AnalysisScreenLayout } from '@/components/analysis-screen-layout';
import { triggerHaptic } from '@/utils/haptic';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SajuQAItem {
  title: string;
  icon: string;
  answer: string;
}

interface TarotCardData {
  name: string;
  filename: string;
  isReversed: boolean;
}

interface SajuTarotSection {
  icon: string;
  title: string;
  content: string;
}

interface SajuInfo {
  displayName: string;
  birthStr: string;
  pillarsText: string;
  ilganDesc: string;
  zodiacDesc: string;
}

interface StructuredResult {
  keyword?: string;
  overall?: string;
  details?: Array<{ category: string; icon: string; content: string }>;
  advice?: string;
  qaItems?: SajuQAItem[];
  isCardStyle?: boolean;
  isSajuTarot?: boolean;
  themeLabel?: string;
  cards?: TarotCardData[];
  interpretation?: string;
  sajuSummary?: string;
  sajuInfo?: SajuInfo;
  sections?: SajuTarotSection[];
}

function SajuTarotHybridResult({ data }: { data: StructuredResult }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <View>
      {data.keyword && (
        <Text style={styles.keyword}>"{data.keyword}"</Text>
      )}
      {data.sajuSummary && (
        <View style={styles.sajuSummaryBox}>
          <Text style={styles.sajuSummaryText}>{data.sajuSummary}</Text>
        </View>
      )}
      {data.sajuInfo && (
        <View style={styles.sajuInfoBox}>
          <Text style={styles.sajuInfoTitle}>사주 정보</Text>
          <Text style={styles.sajuInfoText}>
            {data.sajuInfo.displayName}님은 {data.sajuInfo.birthStr}
          </Text>
          <Text style={styles.sajuInfoPillars}>{data.sajuInfo.pillarsText}</Text>
          <Text style={styles.sajuInfoDesc}>{data.sajuInfo.ilganDesc}</Text>
          <Text style={styles.sajuInfoDesc}>{data.sajuInfo.zodiacDesc}</Text>
        </View>
      )}
      <Text style={styles.tarotCardsTitle}>당신의 타로카드</Text>
      <View style={styles.tarotCardsRow}>
        {data.cards?.map((card, i) => (
          <View key={i} style={styles.tarotCardWrap}>
            {TAROT_IMAGE_MAP[card.filename] ? (
              <Image
                source={TAROT_IMAGE_MAP[card.filename]}
                style={[
                  styles.tarotCardImg,
                  card.isReversed && styles.tarotCardReversed,
                ]}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.tarotCardPlaceholder}>
                <Text style={styles.tarotCardName}>{card.name}</Text>
              </View>
            )}
            <Text style={styles.tarotCardLabel}>
              {card.name} ({card.isReversed ? '역방향' : '정방향'})
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.themeLabelBox}>
        <Text style={styles.themeLabelText}>{data.themeLabel}</Text>
      </View>
      {data.sections?.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.qaItem,
            expandedIndex === i && styles.qaItemExpanded,
          ]}
          onPress={() => setExpandedIndex(expandedIndex === i ? null : i)}
          activeOpacity={0.8}
        >
          <View style={styles.qaHeader}>
            <Text style={styles.qaIcon}>{item.icon}</Text>
            <Text
              style={[styles.qaTitle, expandedIndex === i && styles.qaTitleExpanded]}
              numberOfLines={expandedIndex === i ? undefined : 2}
            >
              {item.title}
            </Text>
            <Text style={styles.qaChevron}>
              {expandedIndex === i ? '▲' : '▼'}
            </Text>
          </View>
          {expandedIndex === i && (
            <Text style={styles.qaAnswer}>{item.content}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

function TarotCardStyleResult({ data }: { data: StructuredResult }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const sections = data.sections;

  return (
    <View>
      <Text style={styles.tarotCardsTitle}>당신의 타로카드</Text>
      <View style={styles.tarotCardsRow}>
        {data.cards?.map((card, i) => (
          <View key={i} style={styles.tarotCardWrap}>
            {TAROT_IMAGE_MAP[card.filename] ? (
              <Image
                source={TAROT_IMAGE_MAP[card.filename]}
                style={[
                  styles.tarotCardImg,
                  card.isReversed && styles.tarotCardReversed,
                ]}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.tarotCardPlaceholder}>
                <Text style={styles.tarotCardName}>{card.name}</Text>
              </View>
            )}
            <Text style={styles.tarotCardLabel}>
              {card.name} ({card.isReversed ? '역방향' : '정방향'})
            </Text>
          </View>
        ))}
      </View>
      <View style={styles.themeLabelBox}>
        <Text style={styles.themeLabelText}>{data.themeLabel}</Text>
      </View>
      {sections && sections.length > 0 ? (
        sections.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.qaItem,
              expandedIndex === i && styles.qaItemExpanded,
            ]}
            onPress={() => setExpandedIndex(expandedIndex === i ? null : i)}
            activeOpacity={0.8}
          >
            <View style={styles.qaHeader}>
              <Text style={styles.qaIcon}>{item.icon}</Text>
              <Text
                style={[styles.qaTitle, expandedIndex === i && styles.qaTitleExpanded]}
                numberOfLines={expandedIndex === i ? undefined : 2}
              >
                {item.title}
              </Text>
              <Text style={styles.qaChevron}>
                {expandedIndex === i ? '▲' : '▼'}
              </Text>
            </View>
            {expandedIndex === i && (
              <Text style={styles.qaAnswer}>{item.content}</Text>
            )}
          </TouchableOpacity>
        ))
      ) : (
        <Text style={styles.interpretationText}>{data.interpretation}</Text>
      )}
    </View>
  );
}

function SajuQAResult({ data }: { data: StructuredResult }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  return (
    <View>
      {data.keyword && (
        <Text style={styles.keyword}>"{data.keyword}"</Text>
      )}
      {data.overall && (
        <Text style={styles.overall}>{data.overall}</Text>
      )}
      {data.qaItems?.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.qaItem,
            expandedIndex === i && styles.qaItemExpanded,
          ]}
          onPress={() => setExpandedIndex(expandedIndex === i ? null : i)}
          activeOpacity={0.8}
        >
          <View style={styles.qaHeader}>
            <Text style={styles.qaIcon}>{item.icon}</Text>
            <Text
              style={[styles.qaTitle, expandedIndex === i && styles.qaTitleExpanded]}
              numberOfLines={expandedIndex === i ? undefined : 2}
            >
              {item.title}
            </Text>
            <Text style={styles.qaChevron}>
              {expandedIndex === i ? '▲' : '▼'}
            </Text>
          </View>
          {expandedIndex === i && (
            <Text style={styles.qaAnswer}>{item.answer}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

export default function ResultScreen() {
  const { type, data } = useLocalSearchParams<{ type: string; data?: string }>();
  let parsedData: StructuredResult | null = null;
  try {
    parsedData = data ? (JSON.parse(data) as StructuredResult) : null;
  } catch {
    parsedData = null;
  }

  const isStructured =
    parsedData &&
    (typeof parsedData.keyword === 'string' || typeof parsedData.overall === 'string');

  const isQAFormat = parsedData && Array.isArray(parsedData.qaItems) && parsedData.qaItems.length > 0;
  const isTarotCardStyle = parsedData?.isCardStyle && parsedData?.themeLabel && parsedData?.cards && parsedData?.interpretation;
  const isSajuTarot = parsedData?.isSajuTarot && parsedData?.themeLabel && parsedData?.cards && parsedData?.sections;

  const getTitle = () => {
    if (type === 'FaceReading') return 'AI 관상 분석 결과';
    if (type === 'Saju') return '내 운명분석소';
    if (type === 'SajuTarot') return '사주×타로 리딩';
    if (type === 'Tarot') return 'AI 신비의 타로 리딩';
    if (type === 'LoveCompatibility') return '연애 궁합 분석';
    if (type === 'WorkCompatibility') return '직장 궁합 분석';
    return '운명 분석 결과';
  };

  return (
    <AnalysisScreenLayout>
      <ScrollView contentContainerStyle={styles.scrollContent} style={styles.container}>
        <Text style={styles.headerTitle}>{getTitle()}</Text>
        <View style={styles.card}>
          {parsedData && isSajuTarot ? (
            <SajuTarotHybridResult data={parsedData} />
          ) : parsedData && isTarotCardStyle ? (
            <TarotCardStyleResult data={parsedData} />
          ) : parsedData && isQAFormat ? (
            <SajuQAResult data={parsedData} />
          ) : parsedData && isStructured ? (
            <View>
              <Text style={styles.keyword}>"{parsedData.keyword}"</Text>
              <Text style={styles.overall}>{parsedData.overall}</Text>
              {parsedData.details?.map((d, i) => (
                <View key={i} style={styles.detailItem}>
                  <Text style={styles.detailTitle}>
                    {d.icon} {d.category}
                  </Text>
                  <Text style={styles.detailContent}>{d.content}</Text>
                </View>
              ))}
              {parsedData.advice && (
                <View style={styles.adviceBox}>
                  <Text style={styles.adviceLabel}>💡 오늘의 조언</Text>
                  <Text style={styles.adviceText}>{parsedData.advice}</Text>
                </View>
              )}
            </View>
          ) : parsedData ? (
            <Text style={styles.resultText}>
              {JSON.stringify(parsedData, null, 2)}
            </Text>
          ) : (
            <Text style={styles.placeholder}>
              API 연동 후 실제 결과가 표시됩니다.
            </Text>
          )}
        </View>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => { triggerHaptic(); router.replace('/(tabs)'); }}
        >
          <Text style={styles.homeButtonText}>홈으로</Text>
        </TouchableOpacity>
      </ScrollView>
    </AnalysisScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  headerTitle: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
  },
  card: {
    backgroundColor: 'rgba(44, 44, 44, 0.7)',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.3)',
  },
  keyword: { color: '#BB86FC', fontSize: 20, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' },
  overall: { color: '#E0E0E0', fontSize: 16, lineHeight: 24, marginBottom: 20 },
  detailItem: { marginBottom: 16 },
  detailTitle: { color: '#FFD700', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  detailContent: { color: '#CCCCCC', fontSize: 14, lineHeight: 22 },
  adviceBox: { marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(187,134,252,0.3)' },
  adviceLabel: { color: '#BB86FC', fontSize: 14, fontWeight: 'bold', marginBottom: 8 },
  adviceText: { color: '#FFF', fontSize: 15, lineHeight: 24 },
  qaItem: {
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  qaItemExpanded: {
    borderColor: 'rgba(187, 134, 252, 0.5)',
    backgroundColor: 'rgba(187, 134, 252, 0.08)',
  },
  qaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  qaIcon: { fontSize: 20, marginRight: 12 },
  qaTitle: {
    flex: 1,
    color: '#E0E0E0',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '600',
  },
  qaTitleExpanded: { color: '#FFF' },
  qaChevron: {
    color: '#8A8C9E',
    fontSize: 12,
  },
  qaAnswer: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 22,
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 0,
  },
  resultText: { color: '#E0E0E0', fontSize: 14, lineHeight: 22 },
  placeholder: { color: '#888', fontSize: 14 },
  tarotCardsTitle: {
    color: '#BB86FC',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  tarotCardsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 20,
  },
  tarotCardWrap: { alignItems: 'center', flex: 1, maxWidth: 100 },
  tarotCardImg: {
    width: 90,
    height: 140,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  tarotCardReversed: { transform: [{ rotate: '180deg' }] },
  tarotCardPlaceholder: {
    width: 90,
    height: 140,
    borderRadius: 12,
    backgroundColor: '#1A1C35',
    borderWidth: 2,
    borderColor: '#BB86FC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tarotCardName: { color: '#FFD700', fontSize: 11, textAlign: 'center' },
  tarotCardLabel: {
    color: '#8A8C9E',
    fontSize: 11,
    marginTop: 6,
    textAlign: 'center',
  },
  themeLabelBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.25)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  themeLabelText: {
    color: '#81C784',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  sajuSummaryBox: {
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  sajuSummaryText: {
    color: '#FFD700',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
  },
  sajuInfoBox: {
    backgroundColor: 'rgba(44, 44, 60, 0.8)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.25)',
  },
  sajuInfoTitle: {
    color: '#BB86FC',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sajuInfoText: {
    color: '#E0E0E0',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },
  sajuInfoPillars: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 8,
  },
  sajuInfoDesc: {
    color: '#CCCCCC',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 4,
  },
  interpretationText: {
    color: '#CCCCCC',
    fontSize: 14,
    lineHeight: 24,
  },
  homeButton: {
    backgroundColor: '#BB86FC',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  homeButtonText: { color: '#121212', fontSize: 18, fontWeight: 'bold' },
});
