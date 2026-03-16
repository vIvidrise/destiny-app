import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';
import { AppConfig } from './constants/appConfig';

export default defineConfig({
  /**
   * 앱인토스 콘솔에 등록한 appName / scheme 과 동일해야 합니다.
   */
  scheme: AppConfig.scheme,
  appName: AppConfig.appName,

  plugins: [
    appsInToss({
      brand: {
        /**
         * 내비게이션 바에 노출될 앱 이름
         */
        displayName: AppConfig.displayName,
        /**
         * 토스 디자인 시스템에 적용될 대표 색상
         */
        primaryColor: AppConfig.primaryColor,
        /**
         * 앱 아이콘 이미지 URL
         * - 앱인토스 콘솔에 업로드된 정적 아이콘 URL 사용
         * - 비어 있으면 \"잠시 문제가 생겼어요\" 오류가 날 수 있음
         */
        icon: AppConfig.navBarIconUrl,
      },
      navigationBar: {
        withBackButton: AppConfig.navigationBar.withBackButton,
        withHomeButton: AppConfig.navigationBar.withHomeButton,
        initialAccessoryButton: AppConfig.navigationBar.initialAccessoryButton,
      },
      /**
       * 필요한 권한이 생기면 여기 배열에 추가합니다.
       * 지금은 기본 웹/네이티브 기능만 사용하므로 비워 둡니다.
       */
      permissions: [],
    }),
  ],
});

