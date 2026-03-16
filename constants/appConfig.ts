/**
 * 앱인토스 공통 설정 스타일
 * @see https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/Config.html
 * @see https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/NavigationBar.html
 */

export interface InitialAccessoryButton {
  id: string;
  title?: string;
  icon: { name: string };
}

export interface NavigationBarOptions {
  withBackButton?: boolean;
  withHomeButton?: boolean;
  initialAccessoryButton?: InitialAccessoryButton;
}

export const AppConfig = {
  /** 사용자에게 노출될 앱 이름 (내비게이션 바 타이틀) */
  displayName: '운명분석소',
  /** 앱 ID (번들/스킴 식별용) */
  appName: 'destiny-app',
  /** 앱 라우팅 스킴 (앱인토스: intoss) */
  scheme: 'intoss' as const,
  /** 브랜드 기본 색상 (hex) - 버튼, 강조, 탭 등에 적용 */
  primaryColor: '#BB86FC',
  /** 앱 로고 경로 (로컬 이미지 또는 URL, 앱인토스 콘솔 업로드 후 URL 사용) */
  icon: require('@/assets/images/icon.png'),
  /** 내비게이션 바 앱 아이콘 URL (앱인토스 정적 CDN 등, 선택) */
  navBarIconUrl: 'https://static.toss.im/appsintoss/17423/1fb52fc9-9ca7-4378-86e1-da4c49e49b90.png',
  /** 내비게이션 바 설정 - 커스텀 화면처럼 (하트 미노출, 홈 버튼 노출) */
  navigationBar: {
    withBackButton: true,
    withHomeButton: true,
  } satisfies NavigationBarOptions,
  /** 내비게이션·레이아웃 공통 색상 (전체 페이지 배경 통일) */
  ui: {
    /** 네비게이션 바 배경 */
    navBarBackground: '#101223',
    /** 메인·콘텐츠 배경 (네비 바와 동일하게 통일) */
    backgroundColor: '#101223',
    /** 헤더 배경 (네비 바와 동일) */
    headerBackground: '#101223',
    /** 헤더/버튼 텍스트 색상 */
    tintColor: '#FFF',
    /** 보조 텍스트 (레이블, 서브타이틀) */
    secondaryText: '#8A8C9E',
    /** 강조 라벨 (예: 금색 라벨) */
    accentLabel: '#FFD700',
    /** 입력 필드 배경 */
    inputBackground: '#1E1E1E',
    /** 카드/박스 배경 */
    cardBackground: 'rgba(44, 44, 44, 0.7)',
    /** 테두리 색상 */
    borderColor: '#333',
    /** 오류 텍스트 */
    error: '#FF6B6B',
  },
} as const;
