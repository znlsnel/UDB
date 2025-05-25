// Firebase 인증 관리 (CDN 버전)
class AuthManager {
  constructor() {
    this.auth = null;
    this.db = null;
    this.init();
  }

  async init() {
    // Firebase가 로드될 때까지 대기
    await this.waitForFirebase();
    this.auth = window.auth;
    this.db = window.db;
  }

  waitForFirebase() {
    return new Promise((resolve) => {
      const checkFirebase = () => {
        if (window.auth && window.db) {
          resolve();
        } else {
          setTimeout(checkFirebase, 100);
        }
      };
      checkFirebase();
    });
  }

  // 회원가입
  async signUp(email, password, displayName) {
    try {
      const { createUserWithEmailAndPassword, updateProfile } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { doc, setDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
      const user = userCredential.user;
      
      // 프로필 업데이트
      await updateProfile(user, { displayName });
      
      // Firestore에 사용자 데이터 저장
      await setDoc(doc(this.db, 'users', user.uid), {
        email: user.email,
        displayName: displayName,
        progress: {},
        bookmarks: [],
        preferences: {
          theme: 'light',
          language: 'ko'
        },
        createdAt: new Date(),
        lastLoginAt: new Date()
      });
      
      return { success: true, user };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // 이메일 로그인
  async signIn(email, password) {
    try {
      const { signInWithEmailAndPassword } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      
      // 마지막 로그인 시간 업데이트
      await updateDoc(doc(this.db, 'users', userCredential.user.uid), {
        lastLoginAt: new Date()
      });
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // 구글 로그인
  async signInWithGoogle() {
    try {
      const { GoogleAuthProvider, signInWithPopup } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const { doc, setDoc, getDoc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      const user = result.user;
      
      // 사용자 데이터 확인 및 생성
      const userDoc = await getDoc(doc(this.db, 'users', user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(this.db, 'users', user.uid), {
          email: user.email,
          displayName: user.displayName,
          progress: {},
          bookmarks: [],
          preferences: {
            theme: 'light',
            language: 'ko'
          },
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
      } else {
        await updateDoc(doc(this.db, 'users', user.uid), {
          lastLoginAt: new Date()
        });
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('Google sign in error:', error);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // 카카오톡 로그인
  async signInWithKakao() {
    try {
      if (!window.Kakao || !window.Kakao.isInitialized()) {
        throw new Error('Kakao SDK가 초기화되지 않았습니다.');
      }

      // 카카오 로그인
      const kakaoAuth = await new Promise((resolve, reject) => {
        window.Kakao.Auth.login({
          success: resolve,
          fail: reject,
          scope: 'profile_nickname,profile_image,account_email'
        });
      });

      // 사용자 정보 가져오기
      const kakaoUser = await new Promise((resolve, reject) => {
        window.Kakao.API.request({
          url: '/v2/user/me',
          success: resolve,
          fail: reject
        });
      });

      // Firebase Custom Token 생성을 위한 사용자 정보
      const userInfo = {
        id: kakaoUser.id.toString(),
        email: kakaoUser.kakao_account?.email || `kakao_${kakaoUser.id}@kakao.local`,
        displayName: kakaoUser.kakao_account?.profile?.nickname || '카카오 사용자',
        photoURL: kakaoUser.kakao_account?.profile?.profile_image_url || null,
        provider: 'kakao'
      };

      // Firestore에 사용자 데이터 저장 (카카오 ID를 문서 ID로 사용)
      const { doc, setDoc, getDoc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const userId = `kakao_${userInfo.id}`;
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      
      if (!userDoc.exists()) {
        await setDoc(doc(this.db, 'users', userId), {
          email: userInfo.email,
          displayName: userInfo.displayName,
          photoURL: userInfo.photoURL,
          provider: 'kakao',
          kakaoId: userInfo.id,
          progress: {},
          bookmarks: [],
          preferences: {
            theme: 'light',
            language: 'ko'
          },
          createdAt: new Date(),
          lastLoginAt: new Date()
        });
      } else {
        await updateDoc(doc(this.db, 'users', userId), {
          lastLoginAt: new Date()
        });
      }

      // 가상의 사용자 객체 생성 (Firebase User 형태로)
      const virtualUser = {
        uid: userId,
        email: userInfo.email,
        displayName: userInfo.displayName,
        photoURL: userInfo.photoURL,
        provider: 'kakao'
      };

      // 전역 상태에 사용자 정보 저장
      window.currentKakaoUser = virtualUser;

      return { success: true, user: virtualUser };
    } catch (error) {
      console.error('Kakao sign in error:', error);
      return { success: false, error: this.getKakaoErrorMessage(error) };
    }
  }

  // 카카오 로그아웃
  async kakaoLogout() {
    try {
      if (window.Kakao && window.Kakao.isInitialized()) {
        await new Promise((resolve) => {
          window.Kakao.Auth.logout(resolve);
        });
      }
      window.currentKakaoUser = null;
      return { success: true };
    } catch (error) {
      console.error('Kakao logout error:', error);
      return { success: false, error: error.message };
    }
  }

  // 로그아웃
  async logOut() {
    try {
      // Firebase 로그아웃
      const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      await signOut(this.auth);
      
      // 카카오 로그아웃 (카카오 사용자인 경우)
      if (window.currentKakaoUser) {
        await this.kakaoLogout();
      }
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // 인증 상태 감지
  onAuthChange(callback) {
    import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js').then(({ onAuthStateChanged }) => {
      return onAuthStateChanged(this.auth, callback);
    });
  }

  // 사용자 진도 저장
  async saveProgress(userId, pageId, completed = true) {
    try {
      const { doc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const progressData = {
        [`progress.${pageId}`]: {
          completed,
          completedAt: completed ? new Date() : null,
          lastVisited: new Date()
        }
      };
      
      await updateDoc(doc(this.db, 'users', userId), progressData);
      return { success: true };
    } catch (error) {
      console.error('Save progress error:', error);
      return { success: false, error: error.message };
    }
  }

  // 북마크 추가/제거
  async toggleBookmark(userId, pageId) {
    try {
      const { doc, getDoc, updateDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const userDoc = await getDoc(doc(this.db, 'users', userId));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const bookmarks = userData.bookmarks || [];
        
        let newBookmarks;
        if (bookmarks.includes(pageId)) {
          newBookmarks = bookmarks.filter(id => id !== pageId);
        } else {
          newBookmarks = [...bookmarks, pageId];
        }
        
        await updateDoc(doc(this.db, 'users', userId), {
          bookmarks: newBookmarks
        });
        
        return { success: true, bookmarks: newBookmarks };
      }
      return { success: false, error: 'User not found' };
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      return { success: false, error: error.message };
    }
  }

  // 사용자 데이터 가져오기
  async getUserData(userId) {
    try {
      const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');
      
      const docRef = doc(this.db, 'users', userId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { success: true, data: docSnap.data() };
      } else {
        return { success: false, error: 'User data not found' };
      }
    } catch (error) {
      console.error('Get user data error:', error);
      return { success: false, error: error.message };
    }
  }

  // 에러 메시지 한국어 변환
  getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': '등록되지 않은 이메일입니다.',
      'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
      'auth/email-already-in-use': '이미 사용 중인 이메일입니다.',
      'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
      'auth/invalid-email': '유효하지 않은 이메일 형식입니다.',
      'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
      'auth/network-request-failed': '네트워크 연결을 확인해주세요.',
      'auth/popup-closed-by-user': '로그인 창이 닫혔습니다.',
      'auth/cancelled-popup-request': '로그인이 취소되었습니다.'
    };
    
    return errorMessages[errorCode] || '알 수 없는 오류가 발생했습니다.';
  }

  // 카카오 에러 메시지 처리
  getKakaoErrorMessage(error) {
    if (typeof error === 'string') {
      return error;
    }
    
    if (error.error) {
      const kakaoErrors = {
        'access_denied': '사용자가 로그인을 취소했습니다.',
        'invalid_request': '잘못된 요청입니다.',
        'unauthorized_client': '인증되지 않은 클라이언트입니다.',
        'server_error': '카카오 서버 오류가 발생했습니다.',
        'temporarily_unavailable': '카카오 서비스가 일시적으로 사용할 수 없습니다.'
      };
      
      return kakaoErrors[error.error] || error.error_description || '카카오 로그인 중 오류가 발생했습니다.';
    }
    
    return error.message || '카카오 로그인 중 알 수 없는 오류가 발생했습니다.';
  }
}

// 전역 인스턴스 생성
window.authManager = new AuthManager(); 