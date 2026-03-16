import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Image } from 'react-native';
import type { DrawnTarotCard } from '@/utils/tarotLogic';
import { TAROT_IMAGE_MAP, CARD_BACK } from '@/utils/tarotImages';

export default function TarotCard({
  cardData,
  onCardRevealed,
}: {
  cardData: DrawnTarotCard;
  onCardRevealed?: () => void;
}) {
  const flipAnim = useRef(new Animated.Value(0)).current;
  const [isFlipped, setIsFlipped] = useState(false);

  const flip = () => {
    if (isFlipped) return;
    Animated.timing(flipAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      setIsFlipped(true);
      onCardRevealed?.();
    });
  };

  const cardSource = TAROT_IMAGE_MAP[cardData.filename];
  const perspective = { perspective: 1000 };
  const frontInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  const backInterpolate = flipAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  return (
    <Pressable onPress={flip} style={styles.wrapper}>
      <View style={styles.cardContainer}>
        <Animated.View
          style={[styles.face, styles.back, { transform: [perspective, { rotateY: frontInterpolate }] }]}
        >
          <Image source={CARD_BACK} style={styles.cardImage} resizeMode="cover" />
        </Animated.View>
        <Animated.View
          style={[styles.face, styles.front, { transform: [perspective, { rotateY: backInterpolate }] }]}
        >
          {cardSource ? (
            <Image
              source={cardSource}
              style={[styles.cardImage, cardData.isReversed && styles.reversedImage]}
              resizeMode="cover"
            />
          ) : (
            <Text style={styles.cardName}>{cardData.name}</Text>
          )}
          <Text style={styles.direction}>
            {cardData.name} ({cardData.isReversed ? '역방향' : '정방향'})
          </Text>
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: { width: 100, height: 160 },
  cardContainer: { flex: 1 },
  face: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backfaceVisibility: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  back: {
    backgroundColor: '#1A1C35',
    borderWidth: 1,
    borderColor: '#4A4E85',
  },
  front: {
    backgroundColor: '#2A2A2A',
    borderWidth: 2,
    borderColor: '#BB86FC',
  },
  cardImage: {
    width: '100%',
    height: '85%',
    borderRadius: 8,
  },
  reversedImage: { transform: [{ rotate: '180deg' }] },
  cardName: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  direction: {
    color: '#E0E0E0',
    fontSize: 9,
    marginTop: 2,
    textAlign: 'center',
  },
});
