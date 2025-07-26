import { useState, useEffect } from 'react';
import { User, Mail, Lock, LogOut, Heart, Shield, Eye, EyeOff, Phone } from 'lucide-react';

export default function Auth({ user, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMethod, setAuthMethod] = useState('email'); // 'email' or 'phone'
  const [auth, setAuth] = useState(null);

  // Initialize Firebase auth on client side
  useEffect(() => {
    const initAuth = async () => {
      try {
        const { getAuth } = await import('firebase/auth');
        const { app } = await import('../firebase/init');
        if (app) {
          setAuth(getAuth(app));
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      }
    };

    if (typeof window !== 'undefined') {
      initAuth();
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    if (!auth) return;
    
    setLoading(true);
    setError('');

    try {
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');
      
      if (isSignUp) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!auth) return;
    
    try {
      const { signOut } = await import('firebase/auth');
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handlePhoneSuccess = (phoneUser) => {
    setUser(phoneUser);
  };

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-medium">{user.email || user.phoneNumber}</span>
        </div>
        <button
          onClick={handleSignOut}
          className="btn-secondary flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    );
  }

  // If phone auth is selected, show PhoneAuth component
  if (authMethod === 'phone') {
    const PhoneAuth = require('./PhoneAuth').default;
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Welcome to Jivverr</h1>
            <p className="text-gray-600">Your AI-powered medical diagnosis companion</p>
          </div>

          {/* Phone Auth Card */}
          <div className="card-elevated">
            <PhoneAuth 
              onSuccess={handlePhoneSuccess}
              onBack={() => setAuthMethod('email')}
            />
          </div>

          {/* Features */}
          <div className="mt-8 grid grid-cols-1 gap-4">
            <div className="card-medical">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Heart className="w-4 h-4 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">AI-Powered Analysis</h3>
                  <p className="text-sm text-gray-600">Get clear, simple explanations of medical diagnoses</p>
                </div>
              </div>
            </div>
            
            <div className="card-medical">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-4 h-4 text-success-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-1">Secure & Private</h3>
                  <p className="text-sm text-gray-600">Your health information is protected with enterprise-grade security</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-blue-600 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 font-display mb-2">Welcome to Jivverr</h1>
          <p className="text-gray-600">Your AI-powered medical diagnosis companion</p>
        </div>

        {/* Auth Card */}
        <div className="card-elevated">
          <div className="flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              {isSignUp ? 'Create Your Account' : 'Sign In to Your Account'}
            </h2>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-12"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-12 pr-12"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-danger-50 border border-danger-200 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-danger-500 rounded-full"></div>
                  <p className="text-sm text-danger-700">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !auth}
              className="btn-primary w-full flex items-center justify-center gap-2 py-4"
            >
              {loading ? (
                <>
                  <div className="loading-spinner w-5 h-5"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
            >
              {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
            </button>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Phone Auth Option */}
          <button
            onClick={() => setAuthMethod('phone')}
            className="btn-secondary w-full flex items-center justify-center gap-2 py-4"
          >
            <Phone className="w-5 h-5" />
            Sign in with Phone
          </button>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-1 gap-4">
          <div className="card-medical">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Heart className="w-4 h-4 text-primary-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">AI-Powered Analysis</h3>
                <p className="text-sm text-gray-600">Get clear, simple explanations of medical diagnoses</p>
              </div>
            </div>
          </div>
          
          <div className="card-medical">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-success-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-4 h-4 text-success-600" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-sm text-gray-600">Your health information is protected with enterprise-grade security</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 