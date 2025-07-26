import '../styles/globals.css';
import { useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/config';

// Initialize Firebase
if (typeof window !== 'undefined') {
  initializeApp(firebaseConfig);
}

export default function App({ Component, pageProps }) {
  return <Component {...pageProps} />;
} 