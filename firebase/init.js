import { initializeApp, getApps } from 'firebase/app';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { firebaseConfig } from './config';

// Global variables to track initialization
let app = null;
let analytics = null;
let isInitializing = false;
let initPromise = null;

// Check if we're on the client side
const isClient = typeof window !== 'undefined';

// Initialize Firebase with proper error handling
const initializeFirebase = async () => {
  if (!isClient) {
    throw new Error('Firebase can only be used on the client side');
  }

  // If already initialized, return existing app
  if (app) {
    return app;
  }

  // If already initializing, wait for the existing promise
  if (isInitializing && initPromise) {
    return initPromise;
  }

  // Start initialization
  isInitializing = true;
  initPromise = new Promise(async (resolve, reject) => {
    try {
      console.log('Starting Firebase initialization...');
      
      // Check if Firebase is already initialized
      const existingApps = getApps();
      console.log('Existing Firebase apps:', existingApps.length);
      
      if (existingApps.length > 0) {
        console.log('Using existing Firebase app:', existingApps[0].name);
        app = existingApps[0];
      } else {
        console.log('Initializing new Firebase app...');
        app = initializeApp(firebaseConfig);
        console.log('Firebase app initialized:', app.name);
      }
      
      // Initialize Analytics if supported (don't block on this)
      try {
        const analyticsSupported = await isSupported();
        if (analyticsSupported) {
          analytics = getAnalytics(app);
          console.log('Firebase Analytics initialized');
        } else {
          console.log('Analytics not supported in this environment');
        }
      } catch (analyticsError) {
        console.warn('Analytics initialization failed:', analyticsError);
        // Don't fail the whole initialization for analytics
      }
      
      console.log('Firebase initialization completed successfully');
      resolve(app);
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      app = null;
      analytics = null;
      reject(error);
    } finally {
      isInitializing = false;
    }
  });

  return initPromise;
};

// Export a function to get the app instance
export const getFirebaseApp = async () => {
  if (!isClient) {
    throw new Error('Firebase can only be used on the client side');
  }
  
  if (!app) {
    await initializeFirebase();
  }
  
  if (!app) {
    throw new Error('Firebase app failed to initialize. Please check your configuration.');
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

// Initialize Firebase immediately if on client side
if (isClient) {
  // Initialize Firebase in the background
  initializeFirebase().catch(error => {
    console.error('Background Firebase initialization failed:', error);
  });
}

export { app, analytics }; 