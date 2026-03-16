/**
 * 앱인토스(Granite) 설정 참고용
 *
 * 현재 프로젝트는 Expo 기반이라 이 파일은 빌드에 사용되지 않습니다.
 * 나중에 앱인토스 WebView 미니앱을 별도 Granite 템플릿으로 만들 때,
 * 그 프로젝트 안에서 granite.config.ts 를 두고 아래와 같이 설정합니다.
 *
 * import { appsInToss } from '@apps-in-toss/framework/plugins';
 * import { defineConfig } from '@granite-js/react-native/config';
 *
 * export default defineConfig({
 *   scheme: 'intoss',
 *   appName: 'destiny-app',
 *   plugins: [
 *     appsInToss({
 *       brand: {
 *         displayName: '운명분석소',
 *         primaryColor: '#BB86FC',
 *         icon: 'https://static.toss.im/appsintoss/17423/1fb52fc9-9ca7-4378-86e1-da4c49e49b90.png',
 *       },
 *       navigationBar: { withBackButton: true, withHomeButton: true },
 *       permissions: [],
 *     }),
 *   ],
 * });
 */

export {};
