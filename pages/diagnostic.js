import { useState, useEffect } from 'react';
import { getFirebaseApp } from '../firebase/init';
import { getAuth } from 'firebase/auth';

export default function Diagnostic() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toISOString() }]);
  };

  const runDiagnostics = async () => {
    setLoading(true);
    setResults([]);
    
    try {
      addResult('Starting Firebase diagnostics...', 'info');
      
      // Test 1: Check if we're in browser
      if (typeof window === 'undefined') {
        addResult('❌ Not in browser environment', 'error');
        return;
      }
      addResult('✅ Browser environment detected', 'success');
      
      // Test 2: Check Firebase app initialization
      try {
        const app = getFirebaseApp();
        addResult('✅ Firebase app initialized successfully', 'success');
        addResult(`📊 App name: ${app.name}`, 'info');
      } catch (error) {
        addResult(`❌ Firebase app initialization failed: ${error.message}`, 'error');
        return;
      }
      
      // Test 3: Check Firebase Auth
      try {
        const auth = getAuth();
        addResult('✅ Firebase Auth initialized successfully', 'success');
        addResult(`🔐 Auth domain: ${auth.config.authDomain}`, 'info');
      } catch (error) {
        addResult(`❌ Firebase Auth initialization failed: ${error.message}`, 'error');
        return;
      }
      
      // Test 4: Check environment variables
      const envVars = [
        'NEXT_PUBLIC_FIREBASE_API_KEY',
        'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
        'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
        'NEXT_PUBLIC_FIREBASE_APP_ID'
      ];
      
      envVars.forEach(varName => {
        const value = process.env[varName];
        if (value) {
          addResult(`✅ ${varName}: ${value.substring(0, 10)}...`, 'success');
        } else {
          addResult(`❌ ${varName}: Not found`, 'error');
        }
      });
      
      // Test 5: Check network connectivity
      try {
        const response = await fetch('https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys');
        if (response.ok) {
          addResult('✅ Network connectivity to Firebase APIs working', 'success');
        } else {
          addResult(`⚠️ Network connectivity issue: ${response.status}`, 'warning');
        }
      } catch (error) {
        addResult(`❌ Network connectivity failed: ${error.message}`, 'error');
      }
      
      addResult('🎉 Diagnostics completed!', 'success');
      
    } catch (error) {
      addResult(`❌ Diagnostic error: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="card-elevated mb-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-4">Firebase Diagnostic Tool</h1>
          <p className="text-gray-600 mb-4">
            This tool will help diagnose Firebase connectivity and authentication issues.
          </p>
          
          <button
            onClick={runDiagnostics}
            disabled={loading}
            className="btn-primary flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="loading-spinner w-5 h-5"></div>
                Running Diagnostics...
              </>
            ) : (
              'Run Diagnostics'
            )}
          </button>
        </div>

        {results.length > 0 && (
          <div className="card-elevated">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Results</h2>
            <div className="space-y-2">
              {results.map((result, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${
                    result.type === 'success' ? 'bg-success-50 border-success-200 text-success-800' :
                    result.type === 'error' ? 'bg-danger-50 border-danger-200 text-danger-800' :
                    result.type === 'warning' ? 'bg-warning-50 border-warning-200 text-warning-800' :
                    'bg-neutral-50 border-neutral-200 text-neutral-800'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">
                      {new Date(result.timestamp).toLocaleTimeString()}
                    </span>
                    <span className="text-sm">{result.message}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <a href="/" className="text-primary-600 hover:text-primary-700 text-sm">
            ← Back to Main App
          </a>
        </div>
      </div>
    </div>
  );
} 