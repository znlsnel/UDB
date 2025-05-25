// 로그인 UI 관리
class LoginManager {
  constructor() {
    this.currentUser = null;
    this.userData = null;
    this.authManager = null;
    this.init();
  }

  async init() {
    // AuthManager가 로드될 때까지 대기
    await this.waitForAuthManager();
    this.authManager = window.authManager;
    
    this.createLoginModal();
    this.setupEventListeners();
    this.setupAuthStateListener();
  }

  waitForAuthManager() {
    return new Promise((resolve) => {
      const checkAuthManager = () => {
        if (window.authManager) {
          resolve();
        } else {
          setTimeout(checkAuthManager, 100);
        }
      };
      checkAuthManager();
    });
  }

  // 로그인 모달 생성
  createLoginModal() {
    const modalHTML = `
      <div id="loginModal" class="modal">
        <div class="modal-content">
          <div class="modal-header">
            <h2 id="modalTitle">로그인</h2>
            <span class="close">&times;</span>
          </div>
          <div class="modal-body">
            <div class="auth-tabs">
              <button class="tab-btn active" data-tab="login">로그인</button>
              <button class="tab-btn" data-tab="signup">회원가입</button>
            </div>
            
            <form id="authForm">
              <div class="form-group">
                <label for="email">이메일</label>
                <input type="email" id="email" required>
              </div>
              
              <div class="form-group">
                <label for="password">비밀번호</label>
                <input type="password" id="password" required>
              </div>
              
              <div class="form-group" id="nameGroup" style="display: none;">
                <label for="displayName">이름</label>
                <input type="text" id="displayName">
              </div>
              
              <button type="submit" class="auth-btn" id="authSubmitBtn">로그인</button>
              
              <div class="divider">
                <span>또는</span>
              </div>
              
              <button type="button" class="google-btn" id="googleSignInBtn">
                <i class="fab fa-google"></i>
                Google로 계속하기
              </button>

              <button type="button" class="kakao-btn" id="kakaoSignInBtn">
                <i class="fas fa-comment"></i>
                카카오톡으로 계속하기
              </button>
            </form>
            
            <div id="authError" class="error-message"></div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);
  }

  // 이벤트 리스너 설정
  setupEventListeners() {
    // 로그인 버튼 클릭
    document.addEventListener('click', (e) => {
      if (e.target.matches('#loginBtn, .login-btn')) {
        this.showModal();
      }
    });

    // 모달 닫기
    document.addEventListener('click', (e) => {
      if (e.target.matches('.close') || (e.target.matches('.modal') && e.target.id === 'loginModal')) {
        this.hideModal();
      }
    });

    // 탭 전환
    document.addEventListener('click', (e) => {
      if (e.target.matches('.tab-btn')) {
        this.switchTab(e.target.dataset.tab);
      }
    });

    // 폼 제출
    document.getElementById('authForm').addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit();
    });

    // 구글 로그인
    document.getElementById('googleSignInBtn').addEventListener('click', () => {
      this.handleGoogleSignIn();
    });

    // 카카오톡 로그인
    document.getElementById('kakaoSignInBtn').addEventListener('click', () => {
      this.handleKakaoSignIn();
    });

    // 로그아웃 버튼
    document.addEventListener('click', (e) => {
      if (e.target.matches('#logoutBtn, .logout-btn')) {
        this.handleLogout();
      }
    });
  }

  // 인증 상태 리스너
  setupAuthStateListener() {
    this.authManager.onAuthChange(async (user) => {
      this.currentUser = user;
      
      if (user) {
        // 사용자 데이터 로드
        const result = await this.authManager.getUserData(user.uid);
        if (result.success) {
          this.userData = result.data;
        }
        this.updateUIForLoggedInUser();
      } else {
        this.userData = null;
        this.updateUIForLoggedOutUser();
      }
    });
  }

  // 탭 전환
  switchTab(tab) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const nameGroup = document.getElementById('nameGroup');
    const submitBtn = document.getElementById('authSubmitBtn');
    const modalTitle = document.getElementById('modalTitle');

    tabBtns.forEach(btn => btn.classList.remove('active'));
    document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

    if (tab === 'signup') {
      nameGroup.style.display = 'block';
      submitBtn.textContent = '회원가입';
      modalTitle.textContent = '회원가입';
    } else {
      nameGroup.style.display = 'none';
      submitBtn.textContent = '로그인';
      modalTitle.textContent = '로그인';
    }

    this.clearError();
  }

  // 폼 제출 처리
  async handleFormSubmit() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const displayName = document.getElementById('displayName').value;
    const isSignUp = document.querySelector('.tab-btn.active').dataset.tab === 'signup';

    this.showLoading(true);
    this.clearError();

    let result;
    if (isSignUp) {
      if (!displayName.trim()) {
        this.showError('이름을 입력해주세요.');
        this.showLoading(false);
        return;
      }
      result = await this.authManager.signUp(email, password, displayName);
    } else {
      result = await this.authManager.signIn(email, password);
    }

    this.showLoading(false);

    if (result.success) {
      this.hideModal();
      this.clearForm();
    } else {
      this.showError(result.error);
    }
  }

  // 구글 로그인 처리
  async handleGoogleSignIn() {
    this.showLoading(true);
    this.clearError();

    const result = await this.authManager.signInWithGoogle();
    
    this.showLoading(false);

    if (result.success) {
      this.hideModal();
    } else {
      this.showError(result.error);
    }
  }

  // 카카오톡 로그인 처리
  async handleKakaoSignIn() {
    this.showLoading(true, 'kakao');
    this.clearError();

    const result = await this.authManager.signInWithKakao();
    
    this.showLoading(false, 'kakao');

    if (result.success) {
      this.hideModal();
      // 카카오 사용자의 경우 수동으로 UI 업데이트
      this.currentUser = result.user;
      this.updateUIForLoggedInUser();
    } else {
      this.showError(result.error);
    }
  }

  // 로그아웃 처리
  async handleLogout() {
    const result = await this.authManager.logOut();
    if (result.success) {
      console.log('로그아웃 완료');
    }
  }

  // 로그인된 사용자 UI 업데이트
  updateUIForLoggedInUser() {
    // 네비게이션 바 업데이트
    this.updateNavigation(true);
    
    // 진도 표시 업데이트
    this.updateProgressDisplay();
    
    // 북마크 기능 활성화
    this.enableBookmarkFeatures();
  }

  // 로그아웃된 사용자 UI 업데이트
  updateUIForLoggedOutUser() {
    this.updateNavigation(false);
    this.disableBookmarkFeatures();
  }

  // 네비게이션 업데이트
  updateNavigation(isLoggedIn) {
    const navMenu = document.querySelector('.nav-menu');
    
    // 기존 로그인 링크 또는 사용자 메뉴 찾기
    const loginNavLink = navMenu.querySelector('.login-nav-link');
    const existingAuthBtn = navMenu.querySelector('.auth-nav-item');
    
    if (isLoggedIn) {
      // 로그인 링크 숨기기
      if (loginNavLink) {
        loginNavLink.parentElement.style.display = 'none';
      }
      
      // 기존 사용자 메뉴 제거
      if (existingAuthBtn) {
        existingAuthBtn.remove();
      }
      
      // 사용자 메뉴 추가
      const userInfo = `
        <li class="nav-item auth-nav-item">
          <div class="user-menu">
            <span class="user-name">${this.currentUser.displayName || this.currentUser.email}</span>
            <button id="logoutBtn" class="logout-btn">로그아웃</button>
          </div>
        </li>
      `;
      navMenu.insertAdjacentHTML('beforeend', userInfo);
    } else {
      // 로그인 링크 보이기
      if (loginNavLink) {
        loginNavLink.parentElement.style.display = 'block';
      }
      
      // 기존 사용자 메뉴 제거
      if (existingAuthBtn) {
        existingAuthBtn.remove();
      }
      
      // 로그인 링크가 이미 네비게이션에 있으므로 추가 버튼 생성하지 않음
    }
  }

  // 진도 표시 업데이트
  updateProgressDisplay() {
    if (!this.userData || !this.userData.progress) return;

    const tocItems = document.querySelectorAll('.toc-item');
    tocItems.forEach(item => {
      const href = item.getAttribute('href');
      const pageId = href.replace('pages/', '').replace('.html', '');
      
      if (this.userData.progress[pageId]?.completed) {
        item.classList.add('completed');
        if (!item.querySelector('.completed-icon')) {
          item.querySelector('.item-content').insertAdjacentHTML('afterbegin', 
            '<i class="fas fa-check-circle completed-icon"></i>'
          );
        }
      }
    });
  }

  // 북마크 기능 활성화
  enableBookmarkFeatures() {
    // 북마크 버튼들을 활성화하는 로직
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.style.display = 'inline-block';
    });
  }

  // 북마크 기능 비활성화
  disableBookmarkFeatures() {
    document.querySelectorAll('.bookmark-btn').forEach(btn => {
      btn.style.display = 'none';
    });
  }

  // 모달 표시
  showModal() {
    document.getElementById('loginModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  // 모달 숨기기
  hideModal() {
    document.getElementById('loginModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    this.clearForm();
    this.clearError();
  }

  // 폼 초기화
  clearForm() {
    document.getElementById('authForm').reset();
  }

  // 에러 표시
  showError(message) {
    const errorDiv = document.getElementById('authError');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
  }

  // 에러 제거
  clearError() {
    const errorDiv = document.getElementById('authError');
    errorDiv.style.display = 'none';
  }

  // 로딩 상태 표시
  showLoading(isLoading, type = 'form') {
    const submitBtn = document.getElementById('authSubmitBtn');
    const googleBtn = document.getElementById('googleSignInBtn');
    const kakaoBtn = document.getElementById('kakaoSignInBtn');
    
    if (type === 'form') {
      if (isLoading) {
        submitBtn.disabled = true;
        googleBtn.disabled = true;
        kakaoBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 처리중...';
      } else {
        submitBtn.disabled = false;
        googleBtn.disabled = false;
        kakaoBtn.disabled = false;
        const isSignUp = document.querySelector('.tab-btn.active').dataset.tab === 'signup';
        submitBtn.textContent = isSignUp ? '회원가입' : '로그인';
      }
    } else if (type === 'kakao') {
      if (isLoading) {
        kakaoBtn.disabled = true;
        submitBtn.disabled = true;
        googleBtn.disabled = true;
        kakaoBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 카카오톡 로그인 중...';
      } else {
        kakaoBtn.disabled = false;
        submitBtn.disabled = false;
        googleBtn.disabled = false;
        kakaoBtn.innerHTML = '<i class="fas fa-comment"></i> 카카오톡으로 계속하기';
      }
    }
  }

  // 현재 사용자 정보 반환
  getCurrentUser() {
    return this.currentUser;
  }

  // 사용자 데이터 반환
  getUserData() {
    return this.userData;
  }
}

// 전역 인스턴스 생성
window.loginManager = new LoginManager(); 