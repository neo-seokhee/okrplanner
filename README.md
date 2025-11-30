# 연간 목표 관리 앱 (OKR Planner)

React Native (Expo) + TypeScript로 만든 연간 목표 관리 애플리케이션입니다.

## 주요 기능

- 📅 연도별 목표 관리
- 🎯 카테고리별 목표 설정
- 📊 월별 진행 상황 기록
- 📝 월별 회고 작성
- 📱 웹과 모바일 모두 지원 (React Native Web)

## 기술 스택

- **프레임워크**: Expo (React Native)
- **언어**: TypeScript
- **상태 관리**: Zustand
- **UI 라이브러리**: React Native Paper
- **네비게이션**: React Navigation (Stack + Bottom Tabs)
- **코드 품질**: ESLint, Prettier

## 프로젝트 구조

```
okrplanner/
├── src/
│   ├── screens/          # 화면 컴포넌트
│   │   ├── LoginScreen.tsx
│   │   ├── YearListScreen.tsx
│   │   ├── DashboardScreen.tsx
│   │   ├── GoalDetailScreen.tsx
│   │   └── MonthlyReviewScreen.tsx
│   ├── components/       # 재사용 컴포넌트
│   ├── navigation/       # 네비게이션 설정
│   │   ├── RootNavigator.tsx
│   │   └── MainTabNavigator.tsx
│   ├── store/           # Zustand 스토어
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   ├── types/           # TypeScript 타입 정의
│   │   └── index.ts
│   └── utils/           # 유틸리티 함수
│       └── theme.ts
├── App.tsx
└── package.json
```

## 시작하기

### 필수 요구사항

- Node.js (v18 이상 권장)
- npm 또는 yarn

### 설치

```bash
# 의존성 설치
npm install
```

### 실행

#### 웹에서 실행
```bash
npm run web
```

#### iOS에서 실행 (macOS 필요)
```bash
npm run ios
```

#### Android에서 실행
```bash
npm run android
```

#### 개발 서버 시작
```bash
npm start
```

## 추가 스크립트

```bash
# ESLint 실행
npm run lint

# ESLint 자동 수정
npm run lint:fix

# Prettier 포맷팅
npm run format

# Prettier 검사
npm run format:check
```

## 화면 구성

### 1. LoginScreen
- 임시 mock 인증을 통한 로그인 화면

### 2. YearListScreen
- 연도 선택 및 추가
- Bottom Tab Navigator의 첫 번째 탭

### 3. DashboardScreen
- 선택된 연도의 목표 대시보드
- 목표 진행 상황 확인
- Bottom Tab Navigator의 두 번째 탭

### 4. GoalDetailScreen
- 개별 목표의 상세 정보
- 월별 진행 기록 확인

### 5. MonthlyReviewScreen
- 월별 회고 작성
- 잘한 점, 개선할 점 기록

## 환경 변수

`.env.example` 파일을 `.env`로 복사하여 환경 변수를 설정하세요.

```bash
cp .env.example .env
```

## 개발 현황

- ✅ 프로젝트 초기 설정
- ✅ 기본 네비게이션 구조
- ✅ 5개 화면 기본 레이아웃
- ✅ React Native Paper 테마 설정
- ✅ TypeScript 타입 정의
- ✅ Zustand 스토어 설정
- ✅ ESLint, Prettier 설정

## 향후 계획

- 실제 데이터 영속성 (AsyncStorage, SQLite 등)
- 서버 연동 (API)
- 차트 및 그래프 추가
- 다크 모드 지원
- 푸시 알림
- 데이터 내보내기/가져오기

## 라이선스

MIT
