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

  // 로그아웃
  async logOut() {
    try {
      const { signOut } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      await signOut(this.auth);
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
}

// 전역 인스턴스 생성
window.authManager = new AuthManager(); 