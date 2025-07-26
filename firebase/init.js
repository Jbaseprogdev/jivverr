import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

// Initialize Firebase only on client side and only once
let app = null;
let analytics = null;

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

if (isClient) {
  try {
    // Check if Firebase is already initialized
    const apps = getApps();
    if (apps.length === 0) {
      app = initializeApp(firebaseConfig);
      
      // Initialize Analytics if supported
      isSupported().then(yes => yes ? getAnalytics(app) : null)
        .then(analyticsInstance => {
          analytics = analyticsInstance;
        })
        .catch(error => {
          console.warn('Analytics initialization error:', error);
        });
    } else {
      app = apps[0];
      // Try to get existing analytics instance
      try {
        analytics = getAnalytics(app);
      } catch (error) {
        console.warn('Analytics not available:', error);
      }
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

// Export a function to get the analytics instance
export const getFirebaseAnalytics = () => {
  if (!isClient) {
    throw new Error('Firebase Analytics can only be used on the client side');
  }
  return analytics;
};

export { app, analytics }; 