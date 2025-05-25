# Firebase 설정 가이드

Unity Shader Programming 웹사이트에 로그인 기능을 추가하기 위한 Firebase 설정 방법입니다.

## 1. Firebase 프로젝트 생성

### 1.1 Firebase Console 접속
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. Google 계정으로 로그인

### 1.2 새 프로젝트 생성
1. "프로젝트 추가" 클릭
2. 프로젝트 이름 입력: `unity-shader-learning` (또는 원하는 이름)
3. Google Analytics 설정 (선택사항)
4. "프로젝트 만들기" 클릭

## 2. Firebase 서비스 설정

### 2.1 Authentication 설정
1. 좌측 메뉴에서 "Authentication" 클릭
2. "시작하기" 클릭
3. "Sign-in method" 탭 선택
4. 다음 로그인 방법들을 활성화:
   - **이메일/비밀번호**: "사용 설정" 토글 ON
   - **Google**: "사용 설정" 토글 ON, 프로젝트 지원 이메일 설정

### 2.2 Firestore Database 설정
1. 좌측 메뉴에서 "Firestore Database" 클릭
2. "데이터베이스 만들기" 클릭
3. 보안 규칙 선택:
   - **테스트 모드에서 시작** 선택 (개발용)
   - 나중에 프로덕션 규칙으로 변경 필요
4. 위치 선택: **asia-northeast3 (Seoul)** 권장
5. "완료" 클릭

### 2.3 보안 규칙 설정 (중요!)
Firestore Database > 규칙 탭에서 다음 규칙 적용:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 사용자는 자신의 데이터만 읽기/쓰기 가능
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 3. 웹 앱 등록

### 3.1 웹 앱 추가
1. 프로젝트 개요 페이지에서 웹 아이콘 `</>` 클릭
2. 앱 닉네임 입력: `Unity Shader Web`
3. Firebase Hosting 설정 체크 (선택사항)
4. "앱 등록" 클릭

### 3.2 설정 정보 복사
Firebase SDK 설정 정보가 표시됩니다:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef..."
};
```

## 4. 프로젝트에 설정 적용

### 4.1 설정 정보 교체
`index.html` 파일에서 Firebase 설정 부분을 찾아 실제 값으로 교체:

```javascript
// Firebase 설정 (실제 값으로 교체 필요)
const firebaseConfig = {
    apiKey: "your-api-key-here",           // ← 실제 API 키로 교체
    authDomain: "your-project.firebaseapp.com",  // ← 실제 도메인으로 교체
    projectId: "your-project-id",          // ← 실제 프로젝트 ID로 교체
    storageBucket: "your-project.appspot.com",   // ← 실제 스토리지 버킷으로 교체
    messagingSenderId: "123456789",        // ← 실제 메시징 센더 ID로 교체
    appId: "your-app-id-here"             // ← 실제 앱 ID로 교체
};
```

## 5. 테스트

### 5.1 로컬 서버 실행
Firebase는 `file://` 프로토콜을 지원하지 않으므로 로컬 서버가 필요합니다:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Node.js (http-server 설치 필요)
npx http-server

# VS Code Live Server 확장 사용
```

### 5.2 기능 테스트
1. `http://localhost:8000`에서 웹사이트 접속
2. "로그인" 버튼 클릭
3. 회원가입/로그인 테스트
4. Google 로그인 테스트

## 6. 데이터 구조

### 6.1 사용자 데이터 구조
Firestore에 저장되는 사용자 데이터:

```javascript
users/{userId} = {
  email: "user@example.com",
  displayName: "사용자명",
  progress: {
    "introduction": { 
      completed: true, 
      completedAt: timestamp,
      lastVisited: timestamp 
    },
    "shader-basics": { 
      completed: false, 
      lastVisited: timestamp 
    }
  },
  bookmarks: ["lighting-models", "texture-sampling"],
  preferences: {
    theme: "light",
    language: "ko"
  },
  createdAt: timestamp,
  lastLoginAt: timestamp
}
```

## 7. 보안 고려사항

### 7.1 API 키 보안
- Firebase API 키는 공개되어도 상대적으로 안전하지만, 도메인 제한 설정 권장
- Firebase Console > 프로젝트 설정 > 일반 > 웹 API 키에서 HTTP 리퍼러 제한 설정

### 7.2 Firestore 보안 규칙
- 테스트 모드는 30일 후 자동으로 거부 모드로 변경됨
- 프로덕션 배포 전 적절한 보안 규칙 설정 필수

### 7.3 Authentication 설정
- 이메일 인증 활성화 권장
- 비밀번호 정책 설정
- 계정 잠금 정책 설정

## 8. 배포

### 8.1 Firebase Hosting (권장)
```bash
# Firebase CLI 설치
npm install -g firebase-tools

# 로그인
firebase login

# 프로젝트 초기화
firebase init hosting

# 배포
firebase deploy
```

### 8.2 다른 호스팅 서비스
- GitHub Pages
- Netlify
- Vercel
- 일반 웹 호스팅

## 9. 문제 해결

### 9.1 일반적인 오류
- **CORS 오류**: 로컬 서버 사용 필요
- **API 키 오류**: 설정 정보 확인
- **권한 오류**: Firestore 보안 규칙 확인
- **Google 로그인 실패**: 승인된 도메인 설정 확인

### 9.2 디버깅
- 브라우저 개발자 도구 콘솔 확인
- Firebase Console에서 Authentication/Firestore 로그 확인
- 네트워크 탭에서 API 호출 상태 확인

## 10. 추가 기능

### 10.1 이메일 인증
Authentication > Templates에서 이메일 템플릿 커스터마이징 가능

### 10.2 소셜 로그인 추가
- GitHub, Facebook, Twitter 등 추가 가능
- 각 플랫폼에서 OAuth 앱 등록 필요

### 10.3 Analytics
Google Analytics 연동으로 사용자 행동 분석 가능

---

이 가이드를 따라 설정하면 Unity Shader Programming 웹사이트에 완전한 로그인 기능이 추가됩니다! 