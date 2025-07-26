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
      console.log('Initializing Firebase app...');
      app = initializeApp(firebaseConfig);
      console.log('Firebase app initialized:', app.name);
      
      // Initialize Analytics if supported
      isSupported().then(yes => {
        if (yes) {
          try {
            analytics = getAnalytics(app);
            console.log('Firebase Analytics initialized');
          } catch (error) {
            console.warn('Analytics initialization error:', error);
          }
        } else {
          console.log('Analytics not supported in this environment');
        }
      }).catch(error => {
        console.warn('Analytics support check failed:', error);
      });
    } else {
      console.log('Using existing Firebase app:', apps[0].name);
      app = apps[0];
      // Try to get existing analytics instance
      try {
        analytics = getAnalytics(app);
        console.log('Using existing Firebase Analytics');
      } catch (error) {
        console.warn('Analytics not available:', error);
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    // Don't throw here, let the getFirebaseApp function handle it
  }
}

// Export a function to get the app instance
export const getFirebaseApp = () => {
  if (!isClient) {
    throw new Error('Firebase can only be used on the client side');
  }
  if (!app) {
    throw new Error('Firebase app not initialized. Please check your configuration.');
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