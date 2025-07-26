import '../styles/globals.css';
import { useEffect, useState } from 'react';

// Initialize Firebase only on client side
let firebaseApp = null;

if (typeof window !== 'undefined') {
  // Dynamic import to avoid SSR issues
  import('firebase/app').then(({ initializeApp }) => {
    import('../firebase/config').then(({ firebaseConfig }) => {
      try {
        firebaseApp = initializeApp(firebaseConfig);
      } catch (error) {
        console.warn('Firebase already initialized or config error:', error);
      }
    });
  });
}

export default function App({ Component, pageProps }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <Component {...pageProps} />;
} 