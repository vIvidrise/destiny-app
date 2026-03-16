/**
 * 앱인토스 스타일 내비게이션 바
 * NavigationBarOptions 시그니처 적용
 * 좌측: 뒤로가기 | 앱 아이콘 | 서비스명 | (홈버튼)
 * 우측: 액세서리(1개) | 더보기 | 닫기
 */
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppConfig, type NavigationBarOptions } from '@/constants/appConfig';
import { triggerHaptic } from '@/utils/haptic';

const ICON_COLOR = '#FDFDFFbf';
const NAV_BAR_BACKGROUND = '#101223';
const ICON_SIZE = 20;

/** 앱인토스 icon name → Ionicons name */
function getAccessoryIconName(iconName: string): keyof typeof Ionicons.glyphMap {
  if (iconName.includes('heart')) return 'heart';
  if (iconName.includes('share')) return 'share-social';
  return 'heart';
}

interface AppInTossHeaderProps {
  canGoBack?: boolean;
}

export function AppInTossHeader({ canGoBack = true }: AppInTossHeaderProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const opts = AppConfig.navigationBar;
  const withBack = opts.withBackButton ?? true;
  const showBack = withBack && canGoBack;
  const showHome = opts.withHomeButton ?? false;
  const accessory = (opts as NavigationBarOptions).initialAccessoryButton;

  const handleBack = () => {
    triggerHaptic();
    router.back();
  };
  const handleHome = () => {
    triggerHaptic();
    router.replace('/(tabs)');
  };
  const handleClose = () => {
    triggerHaptic();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      {/* 좌측: 뒤로가기 | 아이콘 | 타이틀 | (홈) */}
      <View style={styles.left}>
        {showBack && (
          <TouchableOpacity
            onPress={handleBack}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            style={styles.iconBtn}
          >
            <Ionicons
              name={Platform.OS === 'ios' ? 'chevron-back' : 'arrow-back'}
              size={24}
              color={AppConfig.ui.tintColor}
            />
          </TouchableOpacity>
        )}
        <View style={styles.iconWrap}>
          {AppConfig.navBarIconUrl ? (
            <Image
              source={{ uri: AppConfig.navBarIconUrl }}
              style={styles.appIcon}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={AppConfig.icon}
              style={styles.appIcon}
              resizeMode="contain"
            />
          )}
        </View>
        {/* 커스텀 화면처럼: 운명분석소 + 홈 아이콘 (타이틀 옆) */}
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={1}>
            {AppConfig.displayName}
          </Text>
          {showHome && (
            <TouchableOpacity
              style={styles.homeBtn}
              onPress={handleHome}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="home" size={18} color={ICON_COLOR} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* 우측: 액세서리(1개) | 더보기 | 닫기 */}
      <View style={styles.right}>
        {accessory && (
          <TouchableOpacity style={styles.iconBtn} onPress={() => triggerHaptic()}>
            <Ionicons
              name={getAccessoryIconName(accessory.icon.name)}
              size={ICON_SIZE}
              color={ICON_COLOR}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.iconBtn} onPress={() => triggerHaptic()}>
          <Ionicons name="ellipsis-horizontal" size={ICON_SIZE} color={ICON_COLOR} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconBtn} onPress={handleClose}>
          <Ionicons name="close" size={ICON_SIZE} color={ICON_COLOR} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingBottom: 16,
    backgroundColor: AppConfig.ui.navBarBackground,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0,
  },
  iconBtn: {
    padding: 8,
  },
  iconWrap: {
    width: 24,
    height: 24,
    marginLeft: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  appIcon: {
    width: 24,
    height: 24,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 8,
    minWidth: 0,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: AppConfig.ui.tintColor,
    marginRight: 6,
  },
  homeBtn: {
    padding: 4,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
