import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  confirmPasswordReset,
  verifyPasswordResetCode,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  linkWithCredential,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  deleteUser
} from 'firebase/auth';
import { getFirebaseApp } from './init';

class FirebaseAuthService {
  constructor() {
    this.auth = null;
    this.authStateListeners = new Set();
    this.isInitialized = false;
  }

  // Initialize authentication
  async init() {
    if (this.isInitialized) return this.auth;
    
    try {
      const app = getFirebaseApp();
      this.auth = getAuth(app);
      
      // Set persistence to LOCAL (survives browser restarts)
      await this.auth.setPersistence('local');
      
      this.isInitialized = true;
      return this.auth;
    } catch (error) {
      console.error('Firebase Auth initialization error:', error);
      throw error;
    }
  }

  // Get current auth instance
  getAuth() {
    if (!this.auth) {
      throw new Error('Firebase Auth not initialized. Call init() first.');
    }
    return this.auth;
  }

  // Get current user
  getCurrentUser() {
    return this.getAuth().currentUser;
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getCurrentUser();
  }

  // Email/Password Authentication
  async signInWithEmail(email, password) {
    try {
      await this.init();
      const result = await signInWithEmailAndPassword(this.auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async signUpWithEmail(email, password, displayName = null) {
    try {
      await this.init();
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      
      // Update profile if display name provided
      if (displayName && result.user) {
        await updateProfile(result.user, { displayName });
      }
      
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Phone Authentication
  async setupRecaptcha(containerId) {
    try {
      await this.init();
      
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
      }
      
      window.recaptchaVerifier = new RecaptchaVerifier(containerId, {
        size: 'invisible',
        callback: () => console.log('reCAPTCHA solved'),
        'expired-callback': () => {
          console.log('reCAPTCHA expired');
          if (window.recaptchaVerifier) {
            window.recaptchaVerifier.clear();
            window.recaptchaVerifier = null;
          }
        }
      }, this.auth);
      
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async sendPhoneVerificationCode(phoneNumber) {
    try {
      await this.init();
      
      if (!window.recaptchaVerifier) {
        throw new Error('reCAPTCHA not initialized. Call setupRecaptcha() first.');
      }
      
      const confirmationResult = await signInWithPhoneNumber(
        this.auth, 
        phoneNumber, 
        window.recaptchaVerifier
      );
      
      window.confirmationResult = confirmationResult;
      return { success: true, confirmationResult };
    } catch (error) {
      // Clean up reCAPTCHA on error
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async verifyPhoneCode(verificationCode) {
    try {
      if (!window.confirmationResult) {
        throw new Error('No confirmation result. Call sendPhoneVerificationCode() first.');
      }
      
      const result = await window.confirmationResult.confirm(verificationCode);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Password Reset
  async sendPasswordReset(email) {
    try {
      await this.init();
      await sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async verifyPasswordResetCode(code) {
    try {
      await this.init();
      const email = await verifyPasswordResetCode(this.auth, code);
      return { success: true, email };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async confirmPasswordReset(code, newPassword) {
    try {
      await this.init();
      await confirmPasswordReset(this.auth, code, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Profile Management
  async updateUserProfile(updates) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      
      await updateProfile(user, updates);
      return { success: true, user };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  async updateUserPassword(currentPassword, newPassword) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      
      // Re-authenticate before password change
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      
      // Update password
      await updatePassword(user, newPassword);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Account Management
  async deleteUserAccount(password) {
    try {
      const user = this.getCurrentUser();
      if (!user) throw new Error('No authenticated user');
      
      // Re-authenticate before deletion
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      
      // Delete user
      await deleteUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Sign Out
  async signOut() {
    try {
      await this.init();
      await signOut(this.auth);
      
      // Clean up reCAPTCHA
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
      if (window.confirmationResult) {
        window.confirmationResult = null;
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: this.formatAuthError(error) };
    }
  }

  // Auth State Listener
  onAuthStateChanged(callback) {
    if (!this.isInitialized) {
      this.init().then(() => this.onAuthStateChanged(callback));
      return;
    }
    
    const unsubscribe = onAuthStateChanged(this.auth, (user) => {
      callback(user);
    });
    
    this.authStateListeners.add(unsubscribe);
    return unsubscribe;
  }

  // Clean up listeners
  cleanup() {
    this.authStateListeners.forEach(unsubscribe => unsubscribe());
    this.authStateListeners.clear();
  }

  // Error formatting
  formatAuthError(error) {
    const errorMessages = {
      'auth/user-not-found': 'No account found with this email address.',
      'auth/wrong-password': 'Incorrect password. Please try again.',
      'auth/email-already-in-use': 'An account with this email already exists.',
      'auth/weak-password': 'Password should be at least 6 characters long.',
      'auth/invalid-email': 'Please enter a valid email address.',
      'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
      'auth/network-request-failed': 'Network error. Please check your connection.',
      'auth/invalid-phone-number': 'Please enter a valid phone number.',
      'auth/invalid-verification-code': 'Invalid verification code. Please try again.',
      'auth/quota-exceeded': 'SMS quota exceeded. Please try again later.',
      'auth/operation-not-allowed': 'Phone authentication is not enabled.',
      'auth/requires-recent-login': 'Please sign in again to perform this action.',
      'auth/user-disabled': 'This account has been disabled.',
      'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
      'auth/credential-already-in-use': 'This credential is already associated with a different user account.',
      'auth/invalid-credential': 'Invalid credentials.',
      'auth/operation-not-supported-in-this-environment': 'This operation is not supported in the current environment.',
      'auth/timeout': 'Request timed out. Please try again.',
      'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations.',
      'auth/web-storage-unsupported': 'Web storage is not supported or is disabled.',
    };

    const code = error.code || 'auth/unknown';
    return {
      code,
      message: errorMessages[code] || error.message || 'An unexpected error occurred.',
      originalError: error
    };
  }

  // Utility methods
  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.uid : null;
  }

  getUserEmail() {
    const user = this.getCurrentUser();
    return user ? user.email : null;
  }

  getUserPhone() {
    const user = this.getCurrentUser();
    return user ? user.phoneNumber : null;
  }

  getUserDisplayName() {
    const user = this.getCurrentUser();
    return user ? user.displayName : null;
  }

  isEmailVerified() {
    const user = this.getCurrentUser();
    return user ? user.emailVerified : false;
  }

  isPhoneVerified() {
    const user = this.getCurrentUser();
    return user ? !!user.phoneNumber : false;
  }
}

// Create and export singleton instance
const firebaseAuthService = new FirebaseAuthService();
export default firebaseAuthService; 