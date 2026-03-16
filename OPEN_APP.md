# 페이지가 열리지 않을 때

## 1. 이미 실행 중인 경우
다른 터미널/창에서 앱이 켜져 있으면 **브라우저에서 아래 주소로 접속**해 보세요.

- **웹**: http://localhost:8081
- **Expo Go 앱**에서도 같은 서버(8081)로 연결됩니다.

## 2. 완전히 다시 실행하기
페이지가 안 열리면 서버를 끄고 다시 켜 보세요.

### 터미널에서:

```bash
# 1) 8081 포트 사용 중인 프로세스 종료
lsof -ti:8081 | xargs kill -9

# 2) 프로젝트 폴더로 이동
cd /Users/ad/Desktop/destiny-app

# 3) 웹으로 실행
npx expo start --web
```

실행 후 나오는 안내대로 브라우저에서 **http://localhost:8081** 을 엽니다.

## 3. 캐시 오류(EPERM)가 날 때
`~/.expo` 캐시 쓰기 권한 오류가 나면 아래를 시도해 보세요.

```bash
# Expo 캐시 삭제 후 재실행
npx expo start --web --clear
```

또는 수동으로 캐시 삭제:

```bash
rm -rf ~/.expo/native-modules-cache
npx expo start --web
```

## 4. 특정 화면만 안 열릴 때
- **어느 화면**에서 멈추는지(예: AI 사주, 타로, 결과 화면 등) 알려주시면 원인을 더 정확히 짚을 수 있습니다.
- 개발자 도구(F12) → Console 탭에 빨간 에러가 있으면 그 메시지를 복사해 주세요.
