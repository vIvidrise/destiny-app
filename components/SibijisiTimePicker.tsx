import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SIBIJISI_LIST, type SibijisiBranch } from '@/utils/sibijisi';
import { triggerHaptic } from '@/utils/haptic';

interface SibijisiTimePickerProps {
  value: SibijisiBranch;
  onSelect: (branch: SibijisiBranch) => void;
}

export function SibijisiTimePicker({ value, onSelect }: SibijisiTimePickerProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.hint}>하루를 2시간 단위 12구간(십이지시)으로 선택하세요</Text>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        keyboardShouldPersistTaps="handled"
      >
        {SIBIJISI_LIST.map((item) => {
          const isSelected = value === item.branch;
          return (
            <TouchableOpacity
              key={item.branch}
              style={[styles.row, isSelected && styles.rowSelected]}
              onPress={() => {
                triggerHaptic();
                onSelect(item.branch);
              }}
              activeOpacity={0.7}
            >
              <Text style={[styles.char, isSelected && styles.charSelected]}>
                {item.char}
              </Text>
              <Text style={[styles.range, isSelected && styles.rangeSelected]}>
                {' '}({item.timeRange})
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginTop: 4 },
  hint: {
    color: '#8A8C9E',
    fontSize: 12,
    marginBottom: 10,
  },
  scroll: { maxHeight: 220 },
  scrollContent: { paddingVertical: 4 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 4,
    backgroundColor: 'rgba(30, 30, 46, 0.8)',
  },
  rowSelected: {
    backgroundColor: 'rgba(187, 134, 252, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(187, 134, 252, 0.5)',
  },
  char: {
    fontSize: 18,
    color: '#B0B0B0',
    fontWeight: '500',
  },
  charSelected: {
    color: '#ECEDEE',
    fontWeight: '700',
  },
  range: {
    fontSize: 14,
    color: '#8A8C9E',
  },
  rangeSelected: {
    color: '#C4B5FD',
  },
});
