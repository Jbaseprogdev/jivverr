import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { getFirebaseApp } from '../firebase/init';

export default function ResetAuth() {
  const [email, setEmail] = useState('jaydie.dingal@yahoo.ca');
  const [password, setPassword] = useState('Happy12345');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const clearAuth = async () => {
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      await signOut(auth);
      setResult('✅ Signed out successfully');
    } catch (error) {
      setResult('❌ Sign out error: ' + error.message);
    }
  };

  const trySignIn = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setResult('✅ Sign in successful! User: ' + userCredential.user.email);
    } catch (error) {
      console.error('Sign in error:', error);
      setResult('❌ Sign in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const trySignUp = async () => {
    setLoading(true);
    setResult('');
    
    try {
      const app = getFirebaseApp();
      const auth = getAuth(app);
      
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setResult('✅ Sign up successful! User: ' + userCredential.user.email);
    } catch (error) {
      console.error('Sign up error:', error);
      setResult('❌ Sign up failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="card-elevated">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Authentication Reset</h1>
          
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
            
            <div className="space-y-2">
              <button
                onClick={clearAuth}
                className="btn-secondary w-full"
              >
                Clear Authentication State
              </button>
              
              <button
                onClick={trySignIn}
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? 'Signing In...' : 'Try Sign In'}
              </button>
              
              <button
                onClick={trySignUp}
                disabled={loading}
                className="btn-ghost w-full border-2 border-dashed border-neutral-300"
              >
                {loading ? 'Signing Up...' : 'Try Sign Up'}
              </button>
            </div>
            
            {result && (
              <div className="p-4 bg-neutral-50 rounded-xl">
                <p className="text-sm font-mono">{result}</p>
              </div>
            )}
            
            <div className="text-center">
              <a href="/" className="text-primary-600 hover:text-primary-700 text-sm">
                ← Back to Main App
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 