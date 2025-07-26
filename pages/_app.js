import '../styles/globals.css';
import { useEffect, useState } from 'react';
import Head from 'next/head';

// Initialize Firebase only on client side
let firebaseApp = null;

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Initialize Firebase only on client side
    if (typeof window !== 'undefined') {
      // Dynamic import to avoid SSR issues
      import('firebase/app').then(({ initializeApp }) => {
        import('../firebase/config').then(({ firebaseConfig }) => {
          try {
            // Check if Firebase is already initialized
            const { getApps } = require('firebase/app');
            const apps = getApps();
            if (apps.length === 0) {
              firebaseApp = initializeApp(firebaseConfig);
            } else {
              firebaseApp = apps[0];
            }
          } catch (error) {
            console.warn('Firebase already initialized or config error:', error);
          }
        }).catch(error => {
          console.warn('Error loading Firebase config:', error);
        });
      }).catch(error => {
        console.warn('Error loading Firebase app:', error);
      });
    }
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <>
        <Head>
          <title>Jivverr - AI Medical Diagnosis Tool</title>
          <meta name="description" content="AI-powered medical diagnosis explanation tool" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Jivverr - AI Medical Diagnosis Tool</title>
        <meta name="description" content="AI-powered medical diagnosis explanation tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </>
  );
} 