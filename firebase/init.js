import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from './config';

// Initialize Firebase only on client side and only once
let app = null;

if (typeof window !== 'undefined') {
  // Check if Firebase is already initialized
  const apps = getApps();
  if (apps.length === 0) {
    try {
      app = initializeApp(firebaseConfig);
    } catch (error) {
      console.warn('Firebase initialization error:', error);
    }
  } else {
    app = apps[0];
  }
}

export { app }; 