import { initializeApp, getApps } from 'firebase/app';
import { firebaseConfig } from './config';

// Initialize Firebase only on client side and only once
let app = null;

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

if (isClient) {
  try {
    // Check if Firebase is already initialized
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = apps[0];
    }
  } catch (error) {
    console.warn('Firebase initialization error:', error);
  }
}

// Export a function to get the app instance
export const getFirebaseApp = () => {
  if (!isClient) {
    throw new Error('Firebase can only be used on the client side');
  }
  return app;
};

export { app }; 