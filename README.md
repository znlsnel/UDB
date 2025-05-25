# 🎮 Unity Shader Programming Guide

<div align="center">

![Unity](https://img.shields.io/badge/Unity-2022.3+-000000?style=for-the-badge&logo=unity&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)

**🌐 [Live Demo](https://znlsnel.github.io/UDB/) | 📚 [Documentation](#-학습-목차) | 🚀 [Getting Started](#-시작하기)**

*유니티 셰이더 프로그래밍에 대한 종합적인 학습 가이드 웹사이트*

</div>

---

## 📋 프로젝트 개요

Unity Shader Programming Guide는 게임 개발자와 그래픽 프로그래머를 위한 **완전한 셰이더 학습 플랫폼**입니다. 

🎯 **목표**: 기초부터 고급 기법까지 체계적으로 학습할 수 있는 환경 제공  
🎨 **특징**: 이론과 실습을 병행한 실무 중심 교육  
🚀 **결과**: 실제 게임 개발에 바로 적용 가능한 셰이더 제작 능력 습득  

## ✨ 주요 기능

<table>
<tr>
<td width="50%">

### 🎨 **모던 UI/UX**
- 반응형 디자인 (모바일/태블릿/데스크톱)
- 글래스모피즘 & 그라디언트 디자인
- 3D 큐브 애니메이션
- 부드러운 전환 효과

</td>
<td width="50%">

### 🔐 **사용자 인증**
- Firebase Authentication
- Google 소셜 로그인
- 카카오톡 로그인
- 학습 진도 자동 저장

</td>
</tr>
<tr>
<td width="50%">

### 📊 **학습 관리**
- 개인별 진도 추적
- 북마크 기능
- 완료 상태 표시
- 사용자 맞춤 대시보드

</td>
<td width="50%">

### 🛠️ **실습 중심**
- 실제 셰이더 코드 예제
- 단계별 프로젝트
- 성능 최적화 가이드
- 실무 적용 사례

</td>
</tr>
</table>

## 📚 학습 목차

<details>
<summary><b>🌱 기초 과정</b> - 셰이더의 기본 개념부터</summary>

- **셰이더 프로그래밍 소개** - 렌더링 파이프라인과 셰이더의 역할
- **셰이더 기초 문법** - HLSL 문법과 Unity 셰이더 구조  
- **버텍스 & 프래그먼트 셰이더** - 렌더링 파이프라인의 핵심 단계

</details>

<details>
<summary><b>📊 중급 과정</b> - 실용적인 셰이더 기법들</summary>

- **라이팅 모델** - Lambert, Phong, Blinn-Phong, PBR 구현
- **텍스처와 샘플링** - UV 매핑, 필터링, 애니메이션 기법
- **서피스 셰이더** - Unity의 고급 셰이더 작성법

</details>

<details>
<summary><b>🚀 고급 과정</b> - 전문가 수준의 기법들</summary>

- **컴퓨트 셰이더** - GPU 병렬 처리와 GPGPU 활용
- **포스트 프로세싱** - 화면 효과와 이미지 처리
- **성능 최적화** - 모바일/PC/콘솔 플랫폼별 최적화

</details>

<details>
<summary><b>🛠️ 실전 프로젝트</b> - 실무에 바로 적용 가능한 프로젝트들</summary>

- **물 셰이더 제작** - 실시간 물 표면 시뮬레이션
- **툰 셰이더 제작** - NPR 스타일의 카툰 렌더링  
- **파티클 이펙트** - 고급 파티클 시스템과 셰이더

</details>

## 🔧 기술 스택

### Frontend
- **HTML5** - 시맨틱 마크업
- **CSS3** - 모던 스타일링, Flexbox, Grid, 애니메이션
- **JavaScript (ES6+)** - 모듈 시스템, async/await

### Backend & Services  
- **Firebase Authentication** - 사용자 인증
- **Firestore** - 사용자 데이터 저장
- **Kakao SDK** - 카카오톡 소셜 로그인

### Libraries & Tools
- **Font Awesome 6.0** - 아이콘
- **Google Fonts** - 웹 폰트 (Noto Sans KR)

## 🌐 시작하기

### 🔗 온라인 접속
```
https://znlsnel.github.io/UDB/
```

### 💻 로컬 실행
```bash
# 저장소 클론
git clone https://github.com/znlsnel/UDB.git

# 디렉토리 이동
cd UDB

# 로컬 서버 실행 (Python 3)
python -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

## 📁 프로젝트 구조

```
UDB/
├── 📄 index.html              # 메인 홈페이지
├── 🎨 styles.css              # 전체 스타일시트  
├── ⚙️ script.js               # 메인 JavaScript
├── 🔐 auth.js                 # Firebase 인증 관리
├── 👤 login.js                # 로그인 UI 관리
├── 📖 README.md               # 프로젝트 문서
└── 📁 pages/                  # 학습 페이지들
    ├── 📄 introduction.html        # 셰이더 소개
    ├── 📄 shader-basics.html       # 기초 문법
    ├── 📄 vertex-fragment.html     # 버텍스/프래그먼트
    ├── 📄 lighting-models.html     # 라이팅 모델
    ├── 📄 textures-sampling.html   # 텍스처 샘플링
    ├── 📄 surface-shaders.html     # 서피스 셰이더
    ├── 📄 compute-shaders.html     # 컴퓨트 셰이더
    ├── 📄 post-processing.html     # 포스트 프로세싱
    ├── 📄 optimization.html        # 성능 최적화
    ├── 📄 water-shader.html        # 물 셰이더
    ├── 📄 toon-shader.html         # 툰 셰이더
    ├── 📄 particle-effects.html    # 파티클 이펙트
    └── 📄 login.html               # 로그인 페이지
```

## 🎨 디자인 시스템

### 색상 팔레트
```css
Primary Gradient: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
Background: #f8fafc
Text Primary: #333
Text Secondary: #666
Success: #4caf50
Warning: #ff9800
Error: #f44336
Kakao: #fee500
```

### 반응형 브레이크포인트
- **Desktop**: 1200px+
- **Tablet**: 768px - 1199px  
- **Mobile**: ~767px

## 🔮 로드맵

### ✅ 완료된 기능
- [x] 반응형 웹 디자인
- [x] Firebase 인증 시스템
- [x] Google/카카오톡 소셜 로그인
- [x] 사용자 진도 추적
- [x] 12개 학습 페이지 완성
- [x] 실전 프로젝트 3개

### 🚧 개발 중
- [ ] 인터랙티브 셰이더 에디터
- [ ] 실시간 코드 미리보기
- [ ] 댓글 및 Q&A 시스템

### 📋 향후 계획
- [ ] 다크 모드 지원
- [ ] 검색 및 필터 기능
- [ ] 모바일 앱 버전
- [ ] 다국어 지원 (영어, 일본어)
- [ ] AI 기반 학습 추천

## 🤝 기여하기

프로젝트 개선에 참여해주세요!

1. **Fork** 이 저장소
2. **Feature branch** 생성 (`git checkout -b feature/AmazingFeature`)
3. **Commit** 변경사항 (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to branch (`git push origin feature/AmazingFeature`)
5. **Pull Request** 생성

## 📄 라이선스

이 프로젝트는 **MIT License** 하에 배포됩니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

프로젝트에 대한 문의나 제안사항이 있으시면 언제든 연락주세요!

- **Website**: [https://znlsnel.github.io/UDB/](https://znlsnel.github.io/UDB/)
- **GitHub**: [@znlsnel](https://github.com/znlsnel)

---

<div align="center">

**🎮 Unity Shader Programming Guide**  
*셰이더 프로그래밍의 모든 것을 배워보세요!*

⭐ **이 프로젝트가 도움이 되셨다면 Star를 눌러주세요!** ⭐

</div>
