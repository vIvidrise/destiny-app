/**
 * 앱인토스 업로드 시 사용할 Granite 설정 템플릿
 *
 * 사용 방법:
 * 1. npm create granite-app 로 새 프로젝트 생성
 * 2. 이 파일을 granite.config.ts로 복사
 * 3. @granite-js/react-native, @apps-in-toss/framework 설치 후 사용
 * 4. AppConfig 값이 granite.config에 반영됨
 *
 * @see https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/Config.html
 * @see https://developers-apps-in-toss.toss.im/bedrock/reference/framework/UI/NavigationBar.html
 */
/*
import { appsInToss } from '@apps-in-toss/framework/plugins';
import { defineConfig } from '@granite-js/react-native/config';
import { AppConfig } from './constants/appConfig';

export default defineConfig({
  scheme: AppConfig.scheme,
  appName: AppConfig.appName,
  plugins: [
    appsInToss({
      brand: {
        displayName: AppConfig.displayName,
        primaryColor: AppConfig.primaryColor,
        icon: 'https://...', // 앱인토스 콘솔에 업로드한 이미지 URL
      },
      navigationBar: {
        withBackButton: AppConfig.navigationBar.withBackButton,
        withHomeButton: AppConfig.navigationBar.withHomeButton,
        initialAccessoryButton: AppConfig.navigationBar.initialAccessoryButton,
      },
      permissions: [
        { name: 'camera', access: 'access' },
        { name: 'photos', access: 'read' },
      ],
    }),
  ],
});
*/
