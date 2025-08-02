import { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getApps, initializeApp } from 'firebase/app';
import { firebaseConfig } from '../firebase/config';

export default function TestFirebase() {
  const [email, setEmail] = useState('jaydie.dingal@yahoo.ca');
  const [password, setPassword] = useState('Happy123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [firebaseStatus, setFirebaseStatus] = useState('');

  useEffect(() => {
    // Test Firebase initialization on component mount
    testFirebaseInit();
  }, []);

  const testFirebaseInit = () => {
    try {
      console.log('Testing Firebase initialization...');
      
      // Check if we're in browser
      if (typeof window === 'undefined') {
        setFirebaseStatus('❌ Not in browser environment');
        return;
      }
      
      // Check if Firebase is already initialized
      const apps = getApps();
      console.log('Existing Firebase apps:', apps.length);
      
      if (apps.length === 0) {
        console.log('No Firebase apps found, initializing...');
        const app = initializeApp(firebaseConfig);
        console.log('Firebase app initialized:', app.name);
        setFirebaseStatus(`✅ Firebase initialized: ${app.name}`);
      } else {
        console.log('Using existing Firebase app:', apps[0].name);
        setFirebaseStatus(`✅ Using existing Firebase: ${apps[0].name}`);
      }
      
      // Test auth creation
      const auth = getAuth();
      console.log('Firebase Auth created:', auth);
      setFirebaseStatus(prev => prev + ' | Auth: ✅');
      
    } catch (error) {
      console.error('Firebase initialization test failed:', error);
      setFirebaseStatus(`❌ Firebase init failed: ${error.message}`);
    }
  };

  const testSignup = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing Firebase signup...');
      
      // Ensure Firebase is initialized
      const apps = getApps();
      if (apps.length === 0) {
        initializeApp(firebaseConfig);
      }
      
      const auth = getAuth();
      console.log('Firebase auth instance:', auth);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log('Signup successful:', userCredential);
      setResult('✅ Signup successful! User: ' + userCredential.user.email);
    } catch (error) {
      console.error('Signup error:', error);
      setResult('❌ Signup failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const testSignin = async () => {
    setLoading(true);
    setResult('');
    
    try {
      console.log('Testing Firebase signin...');
      
      // Ensure Firebase is initialized
      const apps = getApps();
      if (apps.length === 0) {
        initializeApp(firebaseConfig);
      }
      
      const auth = getAuth();
      console.log('Firebase auth instance:', auth);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log('Signin successful:', userCredential);
      setResult('✅ Signin successful! User: ' + userCredential.user.email);
    } catch (error) {
      console.error('Signin error:', error);
      setResult('❌ Signin failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const clearFirebase = () => {
    try {
      // Clear any existing Firebase instances
      const apps = getApps();
      console.log('Clearing Firebase apps:', apps.length);
      setFirebaseStatus('🔄 Firebase cleared');
      setResult('');
    } catch (error) {
      console.error('Error clearing Firebase:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-elevated">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Firebase Direct Test</h1>
          
          {/* Firebase Status */}
          <div className="mb-6 p-4 bg-neutral-50 rounded-xl">
            <h3 className="font-semibold text-neutral-900 mb-2">Firebase Status</h3>
            <p className="text-sm font-mono">{firebaseStatus || 'Checking...'}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div>
              <label className="form-label">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={clearFirebase}
                className="btn-secondary flex-1"
              >
                Clear Firebase
              </button>
              
              <button
                onClick={testFirebaseInit}
                className="btn-secondary flex-1"
              >
                Test Init
              </button>
            </div>
            
            <div className="flex gap-4">
              <button
                onClick={testSignup}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Testing...' : 'Test Signup'}
              </button>
              
              <button
                onClick={testSignin}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                {loading ? 'Testing...' : 'Test Signin'}
              </button>
            </div>
            
            {result && (
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm font-mono">{result}</p>
              </div>
            )}
          </div>
          
          <div className="mt-6 text-center">
            <a href="/" className="text-primary-600 hover:text-primary-700 text-sm">
              ← Back to Main App
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 